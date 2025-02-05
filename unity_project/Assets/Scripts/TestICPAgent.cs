using UnityEngine;
using UnityEngine.UI;
using EdjCase.ICP.Agent.Agents;
using EdjCase.ICP.Agent.Identities;
using EdjCase.ICP.Candid.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;


namespace IC.GameKit
{
    public class TestICPAgent : MonoBehaviour
    {
        public string greetFrontend = "https://7kl52-gyaaa-aaaac-ahmgq-cai.icp0.io/";
        public string greetBackendCanister = "7nk3o-laaaa-aaaac-ahmga-cai";

        Text mMyPrincipalText = null;
        Button mGreetButton = null;
        Button mCollectionButton = null;
        Ed25519Identity mEd25519Identity = null;
        DelegationIdentity mDelegationIdentity = null;

        public Ed25519Identity TestIdentity => mEd25519Identity;

        internal DelegationIdentity DelegationIdentity
        {
            get => mDelegationIdentity;
            set
            {
                mDelegationIdentity = value;
                EnableButtons();

                // ✅ Call AutoCreateUser when DelegationIdentity is set
                if (mDelegationIdentity != null)
                {
                    Debug.Log("✅ Delegation Identity is set. Calling AutoCreateUser...");
                    AutoCreateUser();
                }
            }
        }

        void Start()
        {
            mMyPrincipalText = GameObject.Find("My Princinpal")?.GetComponent<Text>();
            mGreetButton = GameObject.Find("Button_Greet")?.GetComponent<Button>();
            mCollectionButton = GameObject.Find("Button_Collection")?.GetComponent<Button>();

            mEd25519Identity = Ed25519Identity.Generate();
            if (mEd25519Identity != null)
            {
                AutoCreateUser();
            }
        }

        public void EnableButtons()
        {
            if (mGreetButton != null) mGreetButton.interactable = true;
            if (mCollectionButton != null) mCollectionButton.interactable = true;
        }

        public void Greet() => CallCanisterGreet();

        private async void CallCanisterGreet()
        {
            if (DelegationIdentity == null)
            {
                Debug.LogError("❌ DelegationIdentity is NULL, API call cannot proceed!");
                return;
            }

            var agent = new HttpAgent(DelegationIdentity);
            var canisterId = Principal.FromText(greetBackendCanister);
            var client = new GreetingClient.GreetingClient(agent, canisterId);

            try
            {
                var content = await client.Greet();
                if (mMyPrincipalText != null) mMyPrincipalText.text = content;
            }
            catch (Exception e)
            {
                Debug.LogError($"❌ API call failed: {e.Message}");
            }
        }

        public async void GetAllCollections()
        {
            if (DelegationIdentity == null)
            {
                Debug.LogError("❌ DelegationIdentity is NULL, cannot fetch collections!");
                return;
            }

            Debug.Log("✅ Fetching total collections count...");

            var agent = new HttpAgent(DelegationIdentity);
            var canisterId = Principal.FromText(greetBackendCanister);
            var client = new GreetingClient.GreetingClient(agent, canisterId);

            try
            {
                Debug.Log("🔄 Sending getAllCollections request...");
                int totalCollections = await client.GetAllCollections(); // Expecting an integer now

                Debug.Log($"✅ Total collections retrieved: {totalCollections}");

                // Find the UI Text object
                var collectionDataText = GameObject.Find("CollectionData")?.GetComponent<Text>();
                if (collectionDataText == null)
                {
                    Debug.LogError("❌ CollectionData UI not found.");
                    return;
                }
                collectionDataText.text = $"Total Collections: {totalCollections}";
            }
            catch (Exception e)
            {
                Debug.LogError($"❌ API call failed: {e.Message}");
            }
        }

        private async void AutoCreateUser()
        {
            if (DelegationIdentity == null)
            {
                Debug.LogError("❌ DelegationIdentity is NULL, API call cannot proceed!");
                return;
            }

            var agent = new HttpAgent(DelegationIdentity);
            var canisterId = Principal.FromText(greetBackendCanister);
            var client = new GreetingClient.GreetingClient(agent, canisterId);

            try
            {
                Debug.Log("🔄 Fetching user principal from Greet()...");
                string userPrincipalString = await client.GetPrinicpal();

                Principal userPrincipal;
                try
                {
                    // ✅ Ensure proper Principal conversion
                    userPrincipal = Principal.FromText(userPrincipalString);
                }
                catch (Exception ex)
                {
                    Debug.LogError($"❌ Invalid Principal format: {userPrincipalString}. Error: {ex.Message}");
                    return;
                }

                // Generate a UUID
                string uuid = GenerateUUID();

                Debug.Log($"✅ Principal response: {userPrincipal}");
                Debug.Log($"✅ Generated UUID: {uuid}");

                // ✅ Properly pass Principal and UUID as Candid arguments
                CandidArg arg = CandidArg.FromCandid(
                    CandidTypedValue.Principal(userPrincipal), // Valid Principal
                    CandidTypedValue.Text(uuid) // UUID as Text
                );

                // Call create_user function on the canister
                CandidArg reply = await agent.CallAsynchronousAndWaitAsync(canisterId, "create_user", arg);
                Debug.Log($"✅ create_user response: {reply}");
            }
            catch (Exception e)
            {
                Debug.LogError($"❌ Failed to create user: {e.Message}");
            }
        }


        /// <summary>
        /// Generates a UUID for user registration.
        /// </summary>
        private string GenerateUUID()
        {
            return Guid.NewGuid().ToString();
        }

    }
}
