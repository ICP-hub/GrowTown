import React, { useState, useEffect } from "react";
import { createActor, Growntown_Backend } from "../../../declarations/Growntown_Backend/index";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";
import { Ed25519PublicKey, ECDSAKeyIdentity, DelegationChain, DelegationIdentity } from "@dfinity/identity";

const NativeAppLogin = () => {
  const [appPublicKey, setAppPublicKey] = useState(null);
  const [actor, setActor] = useState(Growntown_Backend);
  const [delegationChain, setDelegationChain] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [loading, setLoading] = useState(false);

  // Convert hex string to Uint8Array
  const hexToBytes = (hex) => {
    return Uint8Array.from(hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
  };

  // Extract session key on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const publicKeyString = urlParams.get("sessionkey");

    if (publicKeyString) {
      try {
        const publicKeyBytes = hexToBytes(publicKeyString);
        setAppPublicKey(Ed25519PublicKey.fromDer(publicKeyBytes));
        console.log("✅ App Public Key set:", publicKeyBytes);
      } catch (error) {
        console.error("❌ Error converting hex string to bytes:", error);
      }
    } else {
      console.error("❌ sessionkey parameter is missing in the URL.");
    }
  }, []);

  // Redirect to II with delegation
  const redirectToII = () => {
    if (!delegationChain) {
      console.error("❌ Delegation chain is not set. Cannot redirect.");
      return;
    }

    const url = `https://identity.ic0.app/authorize?delegation=${encodeURIComponent(
      JSON.stringify(delegationChain.toJSON())
    )}`;
    console.log("🔗 Redirecting to Internet Identity with URL:", url);
    window.location.href = url; // Use location.href for redirection
  };

  // Login and create delegation chain
  const handleLogin = async () => {
    setLoading(true);
    try {
      console.log("🔄 Starting login process...");
      const middleKeyIdentity = await ECDSAKeyIdentity.generate();
      console.log("✅ Middle Key Identity generated:", middleKeyIdentity);

      const authClient = await AuthClient.create({ identity: middleKeyIdentity });
      console.log("✅ Auth Client created:", authClient);

      await new Promise((resolve) => {
        authClient.login({
          identityProvider: "https://identity.ic0.app/#authorize",
          onSuccess: resolve,
        });
      });

      const middleIdentity = authClient.getIdentity();
      console.log("✅ Middle Identity obtained:", middleIdentity);

      const agent = new HttpAgent({ identity: middleIdentity });

      // Fetch root key when running locally
      if (process.env.DFX_NETWORK === "local") {
        console.log("Fetching root key for local development...");
        await agent.fetchRootKey();
      }

      const canisterId = process.env.CANISTER_ID_GROWNTOWN_BACKEND;
      if (!canisterId) {
        throw new Error("❌ Canister ID is undefined. Ensure it's set in the environment variables.");
      }
      console.log("✅ Canister ID:", canisterId);

      const newActor = createActor(canisterId, { agent });
      setActor(newActor);

      if (appPublicKey  && middleIdentity instanceof DelegationIdentity) {
        const middleToApp = await DelegationChain.create(
          middleKeyIdentity,
          appPublicKey,
          new Date(Date.now() + 15 * 60 * 1000),
          { previous: middleIdentity.getDelegation() }
        );

        setDelegationChain(middleToApp);
        console.log("✅ Delegation chain created:", JSON.stringify(middleToApp.toJSON()));
  const url = `internetidentity://authorize?delegation=${encodeURIComponent(
          JSON.stringify(middleToApp.toJSON())
        )}`;
        window.open(url, "_self");
      } else {
        console.error("❌ App public key is not set. Delegation chain cannot be created.");
      }
    } catch (error) {
      console.error("❌ Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Greet canister method (optional)
  const handleGreet = async () => {
    setLoading(true);
    try {
      const result = await actor.greet();
      setGreeting(result);
    } catch (error) {
      console.error("❌ Error calling greet:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gradient-to-r from-[#4f2cda] to-[#885ae6] min-h-screen text-white justify-center items-center">
      <div className="bg-white shadow-lg mx-5 rounded-lg w-full max-w-md p-10">
        <div className="text-black">
          <h1 className="text-3xl font-bold">Welcome to Your GrowTown</h1>
          <p className="text-xs mt-2">
            GrowTown Gameplay combines farming, trading, and adventure in a dynamic Web3 ecosystem.
          </p>
        </div>
        <div className="mt-8 mb-16">
          <img src="loginBg2.png" className="rounded-lg w-full" alt="Login Background" />
        </div>

        {/* Login Button */}
        <button
          className="py-3 bg-gradient-to-r from-[#4f2cda] to-[#885ae6] w-full hover:bg-[#4f2cda] text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:scale-105"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Connecting..." : "Connect Wallet"}
        </button>

        {/* Redirect Button (Shown only when delegationChain is set)
        {delegationChain && (
          <button
            className="mt-4 py-3 bg-blue-600 w-full hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:scale-105"
            onClick={redirectToII}
          >
            Continue Authorization
          </button>
        )} */}

      </div>
    </div>
  );
};

export default NativeAppLogin;
