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
            // Register action for deep link activated.
            Debug.Log("DeepLinkPlugin Awake: Registering deep link event.");
            Application.deepLinkActivated += OnDeepLinkActivated;

            // Handle deep link if app was opened with one already
            if (!string.IsNullOrEmpty(Application.absoluteURL))
            {
                Debug.Log("App opened via deep link: " + Application.absoluteURL);
                OnDeepLinkActivated(Application.absoluteURL);
            }
        }

        private void Start()
        {
            mTestICPAgent = gameObject.GetComponent<TestICPAgent>();
            if (mTestICPAgent == null)
            {
                Debug.LogError("TestICPAgent component not found on GameObject.");
            }
        }

        public void OpenBrowser()
        {
            if (mTestICPAgent == null || mTestICPAgent.TestIdentity == null)
            {
                Debug.LogError("TestICPAgent or TestIdentity is not initialized.");
                return;
            }

            // Determine appropriate route based on platform
            string route = IsRunningOnMobile() ? "app" : "";
            string sessionKeyHex = ByteUtil.ToHexString(mTestICPAgent.TestIdentity.PublicKey.ToDerEncoding());
            string targetUrl = $"{mTestICPAgent.greetFrontend}{route}?sessionkey={sessionKeyHex}";

            Debug.Log($"Opening URL: {targetUrl}");
            Application.OpenURL(targetUrl);
        }

        // Check if running on Android or iOS
        private bool IsRunningOnMobile()
        {
#if UNITY_ANDROID || UNITY_IOS
            return true;
#else
            return false;
#endif
        }

        public void OnDeepLinkActivated(string url)
        {
            if (string.IsNullOrEmpty(url))
            {
                Debug.LogError("Deep link URL is empty.");
                return;
            }

            Debug.Log($"Deep link activated with URL: {url}");

            const string kDelegationParam = "delegation=";
            int indexOfDelegation = url.IndexOf(kDelegationParam, StringComparison.OrdinalIgnoreCase);
            if (indexOfDelegation == -1)
            {
                Debug.LogError("Cannot find delegation parameter in the deep link URL.");
                return;
            }

            string delegationString = HttpUtility.UrlDecode(url.Substring(indexOfDelegation + kDelegationParam.Length));
            Debug.Log($"Extracted Delegation String: {delegationString}");
            mTestICPAgent.DelegationIdentity = ConvertJsonToDelegationIdentity(delegationString);
        }

        internal DelegationIdentity ConvertJsonToDelegationIdentity(string jsonDelegation)
        {
            try
            {
                var delegationChainModel = JsonConvert.DeserializeObject<DelegationChainModel>(jsonDelegation);
                if (delegationChainModel == null || delegationChainModel.delegations.Length == 0)
                {
                    Debug.LogError("Invalid delegation chain JSON.");
                    return null;
                }

                // Initialize DelegationIdentity.
                List<SignedDelegation> delegations = new List<SignedDelegation>();
                foreach (var signedDelegationModel in delegationChainModel.delegations)
                {
                    var pubKey = SubjectPublicKeyInfo.FromDerEncoding(ByteUtil.FromHexString(signedDelegationModel.delegation.pubkey));
                    var expiration = ICTimestamp.FromNanoSeconds(Convert.ToUInt64(signedDelegationModel.delegation.expiration, 16));
                    var delegation = new Delegation(pubKey, expiration);

                    var signature = ByteUtil.FromHexString(signedDelegationModel.signature);
                    var signedDelegation = new SignedDelegation(delegation, signature);
                    delegations.Add(signedDelegation);
                }

                var chainPublicKey = SubjectPublicKeyInfo.FromDerEncoding(ByteUtil.FromHexString(delegationChainModel.publicKey));
                var delegationChain = new DelegationChain(chainPublicKey, delegations);
                var delegationIdentity = new DelegationIdentity(mTestICPAgent.TestIdentity, delegationChain);

                Debug.Log("Delegation identity successfully created.");
                return delegationIdentity;
            }
            catch (Exception e)
            {
                Debug.LogError($"Error processing delegation JSON: {e.Message}");
                return null;
            }
        }
    }
}