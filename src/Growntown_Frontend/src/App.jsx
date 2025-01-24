
import React, { useState, useEffect } from "react";
import { createActor, Growntown_Backend } from "../../declarations/Growntown_Backend";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";
import { DelegationIdentity, Ed25519PublicKey, ECDSAKeyIdentity, DelegationChain } from "@dfinity/identity";
import { fromHexString } from "@dfinity/identity/lib/cjs/buffer";

const App = () => {
  const [appPublicKey, setAppPublicKey] = useState(null);
  const [actor, setActor] = useState(Growntown_Backend);
  const [delegationChain, setDelegationChain] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [loading, setLoading] = useState(false);

  console.log('actor:', actor);
  console.log('delegationChain:', delegationChain);
  console.log('greeting:', greeting);
  console.log('appPublicKey:', appPublicKey);

  // Extract the session key from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const publicKeyString = urlParams.get("sessionkey");

    if (publicKeyString) {
      setAppPublicKey(Ed25519PublicKey.fromDer(fromHexString(publicKeyString)));
    }
  }, []);

  // Handle login process
  const handleLogin = async () => {
    try {
      const middleKeyIdentity = await ECDSAKeyIdentity.generate();
      const authClient = await AuthClient.create({
        identity: middleKeyIdentity,
      });

      const iiUrl ="https://identity.ic0.app/#authorize";

      await new Promise((resolve) => {
        authClient.login({
          identityProvider: iiUrl,
          onSuccess: resolve,
        });
      });

      const middleIdentity = authClient.getIdentity();
      const agent = new HttpAgent({ identity: middleIdentity });

      // Fetch root key when running locally
      if (process.env.DFX_NETWORK === "local") {
        console.log("Fetching root key for local development...");
        await agent.fetchRootKey();
      }

      // Fetch canister ID from environment variable
      const canisterId = process.env.CANISTER_ID_GROWNTOWN_BACKEND;
      console.log('Canister ID:', canisterId);

      if (!canisterId) {
        throw new Error("Canister ID is undefined. Ensure it's set in the environment variables.");
      }

      const newActor = createActor(canisterId, { agent });
      setActor(newActor);

      if (appPublicKey && middleIdentity instanceof DelegationIdentity) {
        const middleToApp = await DelegationChain.create(
          middleKeyIdentity,
          appPublicKey,
          new Date(Date.now() + 15 * 60 * 1000),
          { previous: middleIdentity.getDelegation() }
        );

        setDelegationChain(middleToApp);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Handle authorization using delegation chain
  const handleAuthorize = () => {
    if (!delegationChain) {
      console.error("Invalid delegation chain.");
      return;
    }

    const url = `internetidentity://authorize?delegation=${encodeURIComponent(
      JSON.stringify(delegationChain.toJSON())
    )}`;
    window.open(url, "_self");
  };

  // Handle greeting interaction
  const handleGreet = async () => {
    setLoading(true);
    try {
      const result = await actor.greet();
      setGreeting(result);
    } catch (error) {
      console.error("Error calling greet:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1 className="text-black">DFINITY Greeting App</h1>
      <div className="flex flex-col">
        <button className="text-white bg-black mb-4" onClick={handleLogin}>
          Login
        </button>
        <button
          className="text-white bg-black mb-4"
          onClick={handleAuthorize}
          disabled={!delegationChain}
        >
          Authorize
        </button>
        <button className="text-white bg-black" onClick={handleGreet} disabled={loading}>
          {loading ? "Loading..." : "Greet"}
        </button>
      </div>
      {greeting && <p id="greeting" className="text-black">{greeting}</p>}
    </div>
  );
};

export default App;
