using UnityEngine;
using UnityEngine.UI;
using EdjCase.ICP.Agent.Agents;
using EdjCase.ICP.Agent.Identities;
using EdjCase.ICP.Candid.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using UnityMainThreadDispatcher;

namespace IC.GameKit
{
    public class TestICPAgent : MonoBehaviour
    {
        public string greetFrontend = "https://7ynkd-kiaaa-aaaac-ahmfq-cai.icp0.io/";
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
            }
        }

        void Start()
        {
            mMyPrincipalText = GameObject.Find("My Princinpal")?.GetComponent<Text>();
            mGreetButton = GameObject.Find("Button_Greet")?.GetComponent<Button>();
            mCollectionButton = GameObject.Find("Button_Collection")?.GetComponent<Button>();

            mEd25519Identity = Ed25519Identity.Generate();
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

    Debug.Log("✅ Fetching all collections...");

    var agent = new HttpAgent(DelegationIdentity);
    var canisterId = Principal.FromText(greetBackendCanister);
    var client = new GreetingClient.GreetingClient(agent, canisterId);

    try
    {
        Debug.Log("🔄 Sending getAllCollections request...");
        List<(Principal, List<(ulong, Principal, string, string, string)>)> collections = await client.GetAllCollections();

        Debug.Log($"✅ Received {collections.Count} collections.");

        if (collections.Count == 0)
        {
            Debug.LogWarning("⚠ No collections found.");
        }

        var collectionDataText = GameObject.Find("CollectionData")?.GetComponent<Text>();

        if (collectionDataText == null)
        {
            Debug.LogError("❌ CollectionData UI not found.");
            return;
        }

        string displayText = "User Collections:\n";

        foreach (var collection in collections)
        {
            Debug.Log($"📌 User: {collection.Item1}");
            displayText += $"User: {collection.Item1}\n";

            foreach (var item in collection.Item2)
            {
                Debug.Log($"  📦 Time: {item.Item1}, CanisterId: {item.Item2}, Name: {item.Item3}, Symbol: {item.Item4}, Metadata: {item.Item5}");
                displayText += $"Time: {item.Item1}, CanisterId: {item.Item2}, Name: {item.Item3}, Symbol: {item.Item4}, Metadata: {item.Item5}\n";
            }
        }

        Debug.Log($"✅ Final Display Text:\n{displayText}");

        PimDeWitte.UnityMainThreadDispatcher.Instance().Enqueue(() =>
{
    collectionDataText.text = displayText;
});


    }
    catch (Exception e)
    {
        Debug.LogError($"❌ API call failed: {e.Message}");
    }
}


    }
}
