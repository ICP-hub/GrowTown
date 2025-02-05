using EdjCase.ICP.Agent.Agents;
using EdjCase.ICP.Candid.Models;
using EdjCase.ICP.Candid;
using EdjCase.ICP.Agent.Responses;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;        // Required for Exception handling
using System.Numerics; // Required for BigInteger (handling large numbers)
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

        public async Task<int> GetAllCollections()
        {
            CandidArg arg = CandidArg.FromCandid();
            try
            {
                Debug.Log("🔄 Calling getAllCollections...");
                CandidArg reply = await this.Agent.CallAsynchronousAndWaitAsync(this.CanisterId, "totalcollections", arg);

                Debug.Log($"✅ Received response from getAllCollections: {reply}");

                // Convert Nat (ICP's unbounded integer) to C# BigInteger
                UnboundedUInt totalCollectionsNat = reply.ToObjects<UnboundedUInt>(this.Converter);
                BigInteger bigIntValue = totalCollectionsNat.ToBigInteger();

                // Convert safely to int, ensuring it doesn't exceed Int32.MaxValue
                int totalCollections = bigIntValue > int.MaxValue ? int.MaxValue : (int)bigIntValue;

                Debug.Log($"✅ Parsed total collections: {totalCollections}");
                return totalCollections;
            }
            catch (Exception e)
            {
                Debug.LogError($"❌ Failed to fetch collections: {e.Message}");
                return 0; // Return 0 on failure
            }
        }
    }
}
