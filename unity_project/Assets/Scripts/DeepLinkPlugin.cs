using UnityEngine;
using EdjCase.ICP.Agent;
using EdjCase.ICP.Agent.Identities;
using EdjCase.ICP.Agent.Models;
using EdjCase.ICP.Candid.Models;
using EdjCase.ICP.Candid.Utilities;
using Newtonsoft.Json;
using System;
using System.Web;
using System.Collections.Generic;


namespace IC.GameKit
{
    public class DeepLinkPlugin : MonoBehaviour
    {
        private TestICPAgent mTestICPAgent = null;

        private void Awake()
        {
#if UNITY_WEBGL
            Debug.Log("WebGL Build: Registering deep link event.");
            Application.deepLinkActivated += OnDeepLinkActivated;

            // Handle deep link if app was opened with one already
            if (!string.IsNullOrEmpty(Application.absoluteURL))
            {
                Debug.Log("App opened via deep link: " + Application.absoluteURL);
                OnDeepLinkActivated(Application.absoluteURL);
            }
#elif UNITY_ANDROID || UNITY_IOS
            Debug.Log("Native App Build: Registering deep link event.");
            // Handle any platform-specific deep linking logic if required
#endif
        }

        private void Start()
        {
            mTestICPAgent = gameObject.GetComponent<TestICPAgent>();
            if (mTestICPAgent == null)
            {
                Debug.LogError("TestICPAgent component not found on GameObject.");
            }
        }

        private bool IsRunningOnMobile()
        {
#if UNITY_ANDROID || UNITY_IOS
            return true;
#else
            return false;
#endif
        }

        public void OpenBrowser()
        {
            if (mTestICPAgent == null || mTestICPAgent.TestIdentity == null)
            {
                Debug.LogError("TestICPAgent or TestIdentity is not initialized.");
                return;
            }

            string route = IsRunningOnMobile() ? "app" : "";
            string sessionKeyHex = ByteUtil.ToHexString(mTestICPAgent.TestIdentity.PublicKey.ToDerEncoding());
            string targetUrl = $"{mTestICPAgent.greetFrontend}{route}?sessionkey={sessionKeyHex}";

#if UNITY_WEBGL
            Debug.Log($"Opening URL in WebGL: {targetUrl}");
            Application.OpenURL(targetUrl);
#elif UNITY_ANDROID || UNITY_IOS
            Debug.Log($"Opening URL in Native App: {targetUrl}");
            OpenNativeDeepLink(targetUrl);
#endif
        }

        private void OpenNativeDeepLink(string url)
        {
            Debug.Log($"Native app handling deep link: {url}");
            Application.OpenURL(url);
        }

        public void OnDeepLinkActivated(string url)
        {
            if (string.IsNullOrEmpty(url))
            {
                Debug.LogError("Deep link URL is empty.");
                return;
            }

            Debug.Log($"Deep link activated with URL: {url}");

            ProcessDeepLink(url);
        }

        private void ProcessDeepLink(string url)
        {
            Debug.Log($"Processing deep link URL: {url}");

            // Check for URL fragment and convert to query string
            if (url.Contains("#"))
            {
                string fragment = url.Split('#')[1];
                url = "?" + fragment;
                Debug.Log($"Processed URL fragment: {url}");
            }

            const string kSessionKeyParam = "sessionkey=";
            const string kDelegationParam = "delegation=";

            // Extract sessionkey
            string sessionKey = ExtractParameter(url, kSessionKeyParam);
            if (string.IsNullOrEmpty(sessionKey))
            {
                Debug.LogError("Cannot find sessionkey parameter in the deep link URL.");
                return;
            }

            // Extract delegation
            string delegationString = ExtractParameter(url, kDelegationParam);
            if (string.IsNullOrEmpty(delegationString))
            {
                Debug.LogError("Cannot find delegation parameter in the deep link URL.");
                return;
            }

            Debug.Log($"Extracted Session Key: {sessionKey}");
            Debug.Log($"Extracted Delegation String: {delegationString}");

            // Process delegation
            ProcessDelegation(delegationString);
        }

        // Helper method to extract parameters from the URL
        private string ExtractParameter(string url, string paramName)
        {
            int indexOfParam = url.IndexOf(paramName, StringComparison.OrdinalIgnoreCase);
            if (indexOfParam == -1) return null;

            string paramValue = HttpUtility.UrlDecode(
                url.Substring(indexOfParam + paramName.Length).Split('&')[0]
            );
            return paramValue;
        }

        private void ProcessDelegation(string delegationJson)
        {
            if (string.IsNullOrEmpty(delegationJson))
            {
                Debug.LogError("Delegation JSON is empty.");
                return;
            }

            try
            {
                DelegationIdentity delegationIdentity = ConvertJsonToDelegationIdentity(delegationJson);
                if (delegationIdentity != null)
                {
                    if (mTestICPAgent != null)
                    {
                        mTestICPAgent.DelegationIdentity = delegationIdentity;
                        Debug.Log("Delegation identity successfully set in TestICPAgent.");

                        // Enable greet button
                        if (mTestICPAgent.TestIdentity != null)
                        {
                            Debug.Log("Enabling buttons...");
                            GameObject.Find("Button_Greet").GetComponent<Button>().interactable = true;
                            GameObject.Find("Button_Collection").GetComponent<Button>().interactable = true;
                        }
                    }
                    else
                    {
                        Debug.LogError("TestICPAgent is null; cannot set delegation identity.");
                    }
                }
                else
                {
                    Debug.LogError("Failed to convert delegation JSON into a DelegationIdentity.");
                }
            }
            catch (Exception e)
            {
                Debug.LogError($"Error processing delegation JSON: {e.Message}");
            }
        }

        private DelegationIdentity ConvertJsonToDelegationIdentity(string jsonDelegation)
        {
            try
            {
                var delegationChainModel = JsonConvert.DeserializeObject<DelegationChainModel>(jsonDelegation);
                if (delegationChainModel == null || delegationChainModel.delegations.Length == 0)
                {
                    Debug.LogError("Invalid delegation chain JSON.");
                    return null;
                }

                List<SignedDelegation> delegations = new List<SignedDelegation>();
                foreach (var signedDelegationModel in delegationChainModel.delegations)
                {
                    var pubKey = SubjectPublicKeyInfo.FromDerEncoding(ByteUtil.FromHexString(signedDelegationModel.delegation.pubkey));

                    ulong expirationValue = Convert.ToUInt64(signedDelegationModel.delegation.expiration, 16);
                    var expiration = ICTimestamp.FromNanoSeconds(expirationValue);

                    var expirationDateTime = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc).AddTicks((long)(expiration.NanoSeconds / 100));

                    if (expirationDateTime < DateTime.UtcNow)
                    {
                        Debug.LogError("Delegation has expired.");
                        return null;
                    }

                    var delegation = new Delegation(pubKey, expiration);
                    var signature = ByteUtil.FromHexString(signedDelegationModel.signature);
                    delegations.Add(new SignedDelegation(delegation, signature));
                }

                var chainPublicKey = SubjectPublicKeyInfo.FromDerEncoding(ByteUtil.FromHexString(delegationChainModel.publicKey));
                var delegationChain = new DelegationChain(chainPublicKey, delegations);
                return new DelegationIdentity(mTestICPAgent.TestIdentity, delegationChain);
            }
            catch (Exception e)
            {
                Debug.LogError($"Error converting JSON to DelegationIdentity: {e.Message}");
                return null;
            }
        }
    }
}