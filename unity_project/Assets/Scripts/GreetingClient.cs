using EdjCase.ICP.Agent.Agents;
using EdjCase.ICP.Candid.Models;
using EdjCase.ICP.Candid;
using EdjCase.ICP.Agent.Responses;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;        // Required for Exception handling
using UnityEngine; 

namespace GreetingClient
{
    public class GreetingClient
    {
        public IAgent Agent { get; }
        public Principal CanisterId { get; }

#nullable enable
        public EdjCase.ICP.Candid.CandidConverter? Converter { get; }
#nullable disable

        public GreetingClient(IAgent agent, Principal canisterId, CandidConverter? converter = default)
        {
            this.Agent = agent;
            this.CanisterId = canisterId;
            this.Converter = converter;
        }

        public async Task<string> Greet()
        {
            CandidArg arg = CandidArg.FromCandid();
            QueryResponse response = await this.Agent.QueryAsync(this.CanisterId, "greet", arg);
            CandidArg reply = response.ThrowOrGetReply();
            return reply.ToObjects<string>(this.Converter);
        }

       public async Task<List<(Principal, List<(ulong, Principal, string, string, string)>)>> GetAllCollections()
{
    CandidArg arg = CandidArg.FromCandid();
    try
    {
        Debug.Log("🔄 Calling getAllCollections...");
        QueryResponse response = await this.Agent.QueryAsync(this.CanisterId, "getAllCollections", arg);
        CandidArg reply = response.ThrowOrGetReply();

        Debug.Log("✅ Received response from getAllCollections.");

        var collections = reply.ToObjects<List<(Principal, List<(ulong, Principal, string, string, string)>)>>(this.Converter);

        Debug.Log($"✅ Parsed {collections.Count} collections.");
        return collections;
    }
    catch (Exception e)
    {
        Debug.LogError($"❌ Failed to fetch collections: {e.Message}");
        return new List<(Principal, List<(ulong, Principal, string, string, string)>)>();
    }
}

    }
}
