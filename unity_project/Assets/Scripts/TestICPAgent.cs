using UnityEngine;
using UnityEngine.UI;
using EdjCase.ICP.Agent;
using EdjCase.ICP.Agent.Agents;
using EdjCase.ICP.Agent.Identities;
using EdjCase.ICP.Candid.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using System.Runtime.InteropServices;

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
            }
        }

        void Start()
        {
            WasmtimeLoader.LoadWasmtime();

            mMyPrincipalText = GameObject.Find("My Princinpal")?.GetComponent<Text>();
            mGreetButton = GameObject.Find("Button_Greet")?.GetComponent<Button>();
            mCollectionButton = GameObject.Find("Button_Collection")?.GetComponent<Button>();

            mEd25519Identity = Ed25519Identity.Generate();

            if (mCollectionButton != null)
            {
                Debug.Log("✅ Collection Button Found and Assigned");
                mCollectionButton.onClick.AddListener(() => GetAllCollections());
            }
            else
            {
                Debug.LogError("❌ Collection Button Not Found");
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
            var backendCanisterId = Principal.FromText(greetBackendCanister);
            var client = new GreetingClient.GreetingClient(agent, backendCanisterId);

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
    Debug.Log("📌 Collection Button Clicked!");

    if (DelegationIdentity == null)
    {
        Debug.LogError("❌ DelegationIdentity is NULL, cannot fetch collections!");
        return;
    }

    Debug.Log("✅ Fetching all collections...");

    var agent = new HttpAgent(DelegationIdentity);
    var backendCanisterId = Principal.FromText(greetBackendCanister);
    var client = new GreetingClient.GreetingClient(agent, backendCanisterId);

    try
    {
        Debug.Log("🔄 Sending getAllCollections request...");
        List<(Principal, List<(ulong, Principal, string, string, string)>)> collections = await client.GetAllCollections();
        Debug.Log($"✅ Received {collections.Count} user collections.");

        foreach (var (userPrincipal, collectionList) in collections)
        {
            Debug.Log($"👤 User Principal: {userPrincipal}");
            foreach (var (timestamp, canisterId, name, symbol, metadata) in collectionList)
            {
                Debug.Log($"📦 Collection: {name} ({symbol}) - {metadata} (Canister: {canisterId}, Timestamp: {timestamp})");
            }
        }
    }
    catch (Exception e)
    {
        Debug.LogError($"❌ API call failed: {e.Message}");
    }
}



    public static class WasmtimeLoader
    {
        public static void LoadWasmtime()
        {
            try
            {
                string pluginPath = Application.dataPath + "/Plugins/libwasmtime.dylib";
                IntPtr handle = dlopen(pluginPath, RTLD_NOW);

                if (handle == IntPtr.Zero)
                {
                    Debug.LogError($"❌ Failed to load Wasmtime from {pluginPath} - " + Marshal.PtrToStringAnsi(dlerror()));
                    return;
                }

                Debug.Log("✅ Wasmtime successfully loaded!");
            }
            catch (Exception e)
            {
                Debug.LogError($"❌ Failed to load Wasmtime: {e.Message}");
            }
        }

        private const int RTLD_NOW = 2;

        [DllImport("libdl")]
        private static extern IntPtr dlopen(string path, int flag);

        [DllImport("libdl")]
        private static extern IntPtr dlerror();
    }
}
}
