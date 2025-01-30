import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createActor } from "../../../declarations/Growntown_Backend/index";
import {
  useBalance,
  useIdentity,
  useAccounts,
  useDelegationType,
  useIsInitializing,
  useAuth,
  useAgent,
} from "@nfid/identitykit/react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as ledgerIDL } from "../../../declarations/icrc2_token_canister/index";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
const canisterID = process.env.CANISTER_ID_GROWNTOWN_BACKEND;

export const useAuthClient = () => {
  console.log("useAuthClient is running...");
  const dispatch = useDispatch();
  const { connect, disconnect, isConnecting, user } = useAuth();
  const isInitializing = useIsInitializing(); // Wait for IdentityKit to be ready

  if (isInitializing) {
    console.warn("⚠️ IdentityKit is still initializing... Waiting...");
    return {
      isAuthenticated: false,
      login: () => {},
      logout: () => {},
    };
  }

  if (!user) {
    console.warn("⚠️ IdentityKit user is not available yet.");
    return {
      isAuthenticated: false,
      login: connect,
      logout: disconnect,
    };
  }

  console.log("✅ IdentityKit user detected:", user);

  const { balance, fetchBalance } = useBalance();
  const identity = useIdentity();
  const accounts = useAccounts();
  const delegationType = useDelegationType();
  const agent = useAgent();
  const navigate = useNavigate();
  const [backendActor, setBackendActor] = useState(null);

  const LOCAL_HOST = "http://127.0.0.1:4943";
  const MAINNET_HOST = "https://ic0.app";
  const HOST = process.env.DFX_NETWORK === "ic" ? MAINNET_HOST : LOCAL_HOST;

  const initActor = async () => {
    try {
      if (user && identity && agent) {
        if (process.env.DFX_NETWORK !== "ic") {
          await agent.fetchRootKey();
        }

        const actor = createActor(canisterID, { agent });
        console.log("Actor initialized:", actor);
        setBackendActor(actor);
      }
    } catch (error) {
      console.error("Error initializing actor:", error.message);
    }
  };

  useEffect(() => {
    if (!isInitializing && user) {
      initActor();
    }
  }, [user, identity, agent, isInitializing]);

  const handleLogin = async () => {
    try {
      console.log("Initiating login...");
      await connect();
      await initActor();
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      await disconnect();
      setBackendActor(null);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const createCustomActor = async (canisterId) => {
    try {
      if (!canisterId) throw new Error("Canister ID is required.");
      if (!identity || !agent) throw new Error("Agent or Identity is not initialized.");

      console.log("Creating actor for canister:", canisterId);
      console.log("Identity Principal:", identity.getPrincipal().toText());

      if (process.env.DFX_NETWORK !== "ic") {
        await agent.fetchRootKey();
      }

      const actor = Actor.createActor(ledgerIDL, {
        agent,
        canisterId,
      });

      if (!actor) throw new Error("Actor creation failed. Check the IDL and canister ID.");

      return actor;
    } catch (err) {
      console.error("Error creating custom actor:", err.message);
      throw err;
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
    login: handleLogin,
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
