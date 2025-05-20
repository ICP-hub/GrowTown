import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createActor } from "../../../declarations/Growntown_Backend/index";
import {
  useAuth,
  useAgent,
  useIdentity,
  useAccounts,
  useBalance,
  useDelegationType,
  useIsInitializing,
} from "@nfid/identitykit/react";
import { Actor } from "@dfinity/agent";
import { idlFactory as ledgerIDL } from "../../../declarations/icrc2_token_canister/index";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
const canisterID = process.env.CANISTER_ID_GROWNTOWN_BACKEND;

export const useAuthClient = () => {
  console.log("useAuthClient is running...");

  const { connect, disconnect, isConnecting, user } = useAuth();
  const isInitializing = useIsInitializing();
  const identity = useIdentity();
  const agent = useAgent();
  const accounts = useAccounts();
  const { balance, fetchBalance } = useBalance();
  const delegationType = useDelegationType();
  const navigate = useNavigate();
  const [backendActor, setBackendActor] = useState(null);

  const LOCAL_HOST = "http://127.0.0.1:4943";
  const MAINNET_HOST = "https://ic0.app";
  const HOST = process.env.DFX_NETWORK === "ic" ? MAINNET_HOST : LOCAL_HOST;

  useEffect(() => {
    const initActor = async () => {
      if (user && identity && agent) {
        try {
          if (process.env.DFX_NETWORK !== "ic") {
            await agent.fetchRootKey();
          }
          const actor = createActor(canisterID, { agent });
          console.log("✅ Actor initialized:", actor);
          setBackendActor(actor);
        } catch (error) {
          console.error("❌ Actor initialization failed:", error.message);
        }
      }
    };

    if (!isInitializing && user) {
      initActor();
    }
  }, [user, identity, agent, isInitializing]);

  const handleLogin = async () => {
    console.log("🔄 Logging in...");
    try {
      await connect();
      console.log("✅ Login successful");
    } catch (error) {
      console.error("❌ Login failed:", error.message);
      throw error; // Re-throw to allow caller to handle
    }
  };

  const handleLogout = async () => {
    console.log("🔄 Logging out...");
    await disconnect();
    setBackendActor(null);
    console.log("✅ Logout successful");
  };

  const createCustomActor = async (canisterId) => {
    if (!canisterId) throw new Error("Canister ID is required.");
    if (!identity || !agent) throw new Error("Agent or Identity is not initialized.");

    console.log("🔄 Creating actor for:", canisterId);
    try {
      if (process.env.DFX_NETWORK !== "ic") {
        await agent.fetchRootKey();
      }
      return Actor.createActor(ledgerIDL, { agent, canisterId });
    } catch (error) {
      console.error("❌ Error creating actor:", error.message);
      throw error;
    }
  };

  return {
    isInitializing,
    isAuthenticated: !!user,
    isConnecting,
    accounts,
    identity,
    backendActor,
    createCustomActor,
    delegationType,
    login: handleLogin, // Returns a promise
    principal: user?.principal?.toText() || null,
    logout: handleLogout,
    fetchBalance,
    signerId: localStorage.getItem("signerId"),
  };
};

export const AuthProvider = ({ children }) => {
  console.log("AuthProvider initialized!");
  const auth = useAuthClient();

  return (
    <AuthContext.Provider value={auth}>
      {auth.isInitializing ? <div>Loading IdentityKit...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuths = () => useContext(AuthContext);