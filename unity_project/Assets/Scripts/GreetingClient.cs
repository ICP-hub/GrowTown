using EdjCase.ICP.Agent.Agents;
using EdjCase.ICP.Candid.Models;
using EdjCase.ICP.Candid;
using EdjCase.ICP.Agent.Responses;
using System.Collections.Generic;
using System.Threading.Tasks;

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
            QueryResponse response = await this.Agent.QueryAsync(this.CanisterId, "getAllCollections", arg);
            CandidArg reply = response.ThrowOrGetReply();
            
            // Convert the response into the expected data structure
            var collections = reply.ToObjects<List<(Principal, List<(ulong, Principal, string, string, string)>)>>(this.Converter);
            return collections;
        }
    }
}
