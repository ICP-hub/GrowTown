import React, { useState, useEffect } from "react";
import { createActor, Growntown_Backend } from "../../../declarations/Growntown_Backend/index";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";
import { DelegationIdentity, Ed25519PublicKey, ECDSAKeyIdentity, DelegationChain } from "@dfinity/identity";

const NativeAppLogin = () => {
  const [appPublicKey, setAppPublicKey] = useState(null);
  const [actor, setActor] = useState(Growntown_Backend);
  const [delegationChain, setDelegationChain] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [loading, setLoading] = useState(false);

  console.log("actor:", actor);
  console.log("delegationChain:", delegationChain);
  console.log("greeting:", greeting);
  console.log("appPublicKey:", appPublicKey);

  // Function to convert hex string to Uint8Array
  const hexToBytes = (hex) => {
    return Uint8Array.from(hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
  };

  // Extract the session key from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const publicKeyString = urlParams.get("sessionkey");

    if (publicKeyString) {
      try {
        const publicKeyBytes = hexToBytes(publicKeyString);
        setAppPublicKey(Ed25519PublicKey.fromDer(publicKeyBytes));
      } catch (error) {
        console.error("Error converting hex string to bytes:", error);
      }
    }
  }, []);

  // Handle login process
  const handleLogin = async () => {
    try {
      const middleKeyIdentity = await ECDSAKeyIdentity.generate();
      const authClient = await AuthClient.create({
        identity: middleKeyIdentity,
      });

      const iiUrl = "https://identity.ic0.app/#authorize";

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

      const canisterId = process.env.CANISTER_ID_GROWNTOWN_BACKEND;
      console.log("Canister ID:", canisterId);

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

        // Automatically handle authorization logic here
        const url = `internetidentity://authorize?delegation=${encodeURIComponent(
          JSON.stringify(middleToApp.toJSON())
        )}`;
        window.open(url, "_self");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
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
<div className="flex bg-gradient-to-r from-[#4f2cda] to-[#885ae6] min-h-screen bg-gray-900 text-white justify-center items-center">
  {/* Inner */}
  <div className="bg-white sm:hidden shadow-lg  mx-5 rounded-lg w-full max-w-md p-10">
    <div className="text-black">
      <h1 className="text-3xl font-bold">Welcome to Your GrowTown</h1>
      <p className="text-xs mt-2">
        GrowTown Gameplay combines farming, trading, and adventure in a dynamic Web3 ecosystem.
      </p>
    </div>
    <div className="mt-8 mb-16">
      <img src="loginBg2.png" className="rounded-lg w-full" />
    </div>
    <button
      className="py-3 bg-gradient-to-r from-[#4f2cda] to-[#885ae6] w-full hover:bg-[#4f2cda] text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:scale-105"
      onClick={handleLogin}
    >
      Connect Wallet
    </button>
  </div>


{/* UI for Desktop */}
<div className="hidden sm:flex w-full h-full justify-center items-center">
  {/* Center element */}
  <div className="w-[600px] bg-[#885ae6] rounded-3xl h-[350px] p-5 shadow-lg flex justify-center   items-center">
    <div className="h-full flex justify-center items-center bg-white rounded-3xl backdrop-blur-md w-full">
      <h1 className="text-black text-center text-3xl font-bold px-8">
        The Login Experience is Designed for Mobile Only.  
        Please use Mobile for Login.
      </h1>
    </div>
  </div>
</div>
 
    </div>
  );
};

export default NativeAppLogin;
