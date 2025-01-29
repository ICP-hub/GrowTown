using UnityEngine;
using UnityEngine.UI;
using EdjCase.ICP.Agent.Agents;
using EdjCase.ICP.Agent.Identities;
using EdjCase.ICP.Candid.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IC.GameKit
{
    public class TestICPAgent : MonoBehaviour
    {
        public string greetFrontend = "https://7ynkd-kiaaa-aaaac-ahmfq-cai.icp0.io/";
        public string greetBackendCanister = "7nk3o-laaaa-aaaac-ahmga-cai";

        Text mMyPrincipalText = null;
        Button mGreetButton = null;
        Ed25519Identity mEd25519Identity = null;
        DelegationIdentity mDelegationIdentity = null;

        public Ed25519Identity TestIdentity { get { return mEd25519Identity; } }

        internal DelegationIdentity DelegationIdentity
        {
            get { return mDelegationIdentity; }
            set
            {
                mDelegationIdentity = value;

                if (mDelegationIdentity != null && mGreetButton != null)
                {
                    mGreetButton.interactable = true;
                }
            }
        }

        // Start is called before the first frame update
        void Start()
        {
            var go = GameObject.Find("My Princinpal");
            mMyPrincipalText = go?.GetComponent<Text>();

            var buttonGo = GameObject.Find("Button_Greet");
            mGreetButton = buttonGo?.GetComponent<Button>();

            mEd25519Identity = Ed25519Identity.Generate();
        }

        // Update is called once per frame
        void Update()
        {
        }

        public void Greet()
        {
            CallCanisterGreet();
        }

        private async void CallCanisterGreet()
        {
            if (DelegationIdentity == null)
                return;

            // Initialize HttpAgent.
            var agent = new HttpAgent(DelegationIdentity);
            var canisterId = Principal.FromText(greetBackendCanister);

            // Initialize the client and make the call.
            var client = new GreetingClient.GreetingClient(agent, canisterId);
            var content = await client.Greet();

            if (mMyPrincipalText != null)
                mMyPrincipalText.text = content;
        }

        public async void GetAllCollections()
        {
            if (DelegationIdentity == null)
                return;

            // Initialize HttpAgent.
            var agent = new HttpAgent(DelegationIdentity);
            var canisterId = Principal.FromText(greetBackendCanister);

            // Initialize the client and call the getAllCollections function.
            var client = new GreetingClient.GreetingClient(agent, canisterId);
            List<(Principal, List<(ulong, Principal, string, string, string)>)> collections = await client.GetAllCollections();

            // Find the CollectionData GameObject
            var collectionDataGO = GameObject.Find("CollectionData");
            Text collectionDataText = collectionDataGO?.GetComponent<Text>();

            if (collectionDataText != null)
            {
                string displayText = "";
                foreach (var collection in collections)
                {
                    displayText += $"User: {collection.Item1}\n";
                    foreach (var item in collection.Item2)
                    {
                        displayText += $"Time: {item.Item1}, CanisterId: {item.Item2}, Name: {item.Item3}, Symbol: {item.Item4}, Metadata: {item.Item5}\n";
                    }
                }

                // Set the text to UI
                collectionDataText.text = displayText;
            }
            else
            {
                Debug.LogError("CollectionData GameObject or Text component not found!");
            }
        }
    }
}
