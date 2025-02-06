#nullable enable
using EdjCase.ICP.Agent.Agents;
using EdjCase.ICP.Candid.Models;
using EdjCase.ICP.Candid;
using EdjCase.ICP.Agent.Responses;
using EdjCase.ICP.Agent.Identities;
using UnityEngine;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GreetingClient
{
    public class GreetingClient
    {
        public IAgent Agent { get; }
        public Principal CanisterId { get; }
        public EdjCase.ICP.Candid.CandidConverter? Converter { get; }

        public GreetingClient(IAgent agent, Principal canisterId)
        {
            this.CanisterId = canisterId;
            this.Agent = agent;
            this.Converter = null;
        }

        public async Task<string> Greet()
        {
            try
            {
                Debug.Log("🔄 Sending Greet request...");
                CandidArg arg = CandidArg.FromCandid();
                QueryResponse response = await this.Agent.QueryAsync(this.CanisterId, "greet", arg);
                CandidArg reply = response.ThrowOrGetReply();
                string result = reply.ToObjects<string>(this.Converter);
                Debug.Log($"✅ Greeting received: {result}");
                return result;
            }
            catch (Exception e)
            {
                Debug.LogError($"❌ Failed to fetch greeting: {e.Message}");
                return "Error fetching greeting";
            }
        }

        public async Task<List<(Principal, List<(ulong, Principal, string, string, string)>)>> GetAllCollections()
        {
            CandidArg arg = CandidArg.FromCandid();
            try
            {
                Debug.Log("🔄 Calling getAllCollections...");

                if (this.Agent == null)
                {
                    Debug.LogError("❌ Agent is NULL, cannot proceed!");
                    return new List<(Principal, List<(ulong, Principal, string, string, string)>)>();
                }

                // Call the canister function
                CandidArg reply = await this.Agent.CallAsync(this.CanisterId, "getAllCollections", arg);

                // Log the raw response for debugging
                Debug.Log($"✅ Raw response from canister: {reply}");

                // Deserialize response
                List<(Principal, List<(ulong, Principal, string, string, string)>)>? rawResult =
                    reply.ToObjects<List<(Principal, List<(ulong, Principal, string, string, string)>)>>(this.Converter);

                if (rawResult == null)
                {
                    Debug.LogWarning("⚠️ No collections found. Returning an empty list.");
                    return new List<(Principal, List<(ulong, Principal, string, string, string)>)>();
                }

                Debug.Log($"✅ Successfully retrieved {rawResult.Count} user collections.");
                return rawResult;
            }
            catch (Exception e)
            {
                Debug.LogError($"❌ Failed to fetch collections: {e.Message}");
                return new List<(Principal, List<(ulong, Principal, string, string, string)>)>();
            }
        }
    }
}
