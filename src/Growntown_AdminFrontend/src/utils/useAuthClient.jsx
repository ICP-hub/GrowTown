import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  createActor
} from "../../../declarations/Growntown_Backend/index";
import { useBalance, useIdentity, useAccounts, useDelegationType, useIsInitializing, useAuth ,useAgent} from '@nfid/identitykit/react';

import { Actor, HttpAgent } from "@dfinity/agent";
// import { idlFactory as ledgerIDL } from "./ledger.did.js";
import { idlFactory as ledgerIDL } from "../../../declarations/icrc2_token_canister/index";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
const canisterID = process.env.CANISTER_ID_GROWNTOWN_BACKEND;

export const useAuthClient = () => {
  const dispatch = useDispatch();
  const { connect, disconnect, isConnecting, user } = useAuth();
  const { balance, fetchBalance } = useBalance();
  const identity = useIdentity();
  const accounts = useAccounts();
  const delegationType = useDelegationType();
  const isInitializing = useIsInitializing();
  const agent = useAgent();
  const navigate=useNavigate();
  const [isloggedin, setIsLoggedIn]=useState(false)

  const [backendActor, setBackendActor] = useState(null);

  const LOCAL_HOST = "http://127.0.0.1:4943";
  const MAINNET_HOST = "https://ic0.app";
  const HOST = process.env.DFX_NETWORK === "ic" ? MAINNET_HOST : LOCAL_HOST;

  const initActor = async () => {
    try {
      if (user && identity && agent) {
        // Fetch root key for local development
        if (process.env.DFX_NETWORK !== "ic") {
          await agent.fetchRootKey();
        }

        // Create actor
        const actor = createActor(canisterID, { agent });
        console.log('actor=>',actor)
        setBackendActor(actor);

      }
    } catch (error) {
      console.error("Error initializing actor:", error.message);
    }
  };

  useEffect(() => {
     initActor();
  }, [user, identity, agent]);

  const handleLogin = async () => {
    try {
      const res=await connect();
      console.log('auth resp',res)
      // const principal = identity.getPrincipal().toText();
      await initActor();

       navigate("/admin/dashboard")
    

    } catch (error) {
      console.error("Login Error:", error);
      
    }
  };

  const handleLogout = async () => {
    try {
      await disconnect();
      setBackendActor(null);
     
    } catch (error) {
      console.error("Logout Error:", error);
      
    }
  };

  const createCustomActor = async (canisterId) => {
    try {
      if (!canisterId) {
        throw new Error("Canister ID is required.");
      }
  
      if (!identity || !agent) {
        throw new Error("Agent or Identity is not initialized.");
      }
  
      console.log("Creating actor for canister:", canisterId);
      console.log("Identity Principal:", identity.getPrincipal().toText());
  
      // Fetch root key for local environment
      if (process.env.DFX_NETWORK !== "ic") {
        await agent.fetchRootKey();
      }
  
      const actor = Actor.createActor(ledgerIDL, {
        agent,
        canisterId,
      });
  
      if (!actor) {
        throw new Error("Actor creation failed. Check the IDL and canister ID.");
      }
  
      return actor;
    } catch (err) {
      console.error("Error creating custom actor:", err.message);
      throw err;
    }
  };
  
 
  
 
  

  const signerId = localStorage.getItem("signerId");

  return {
    isInitializing,
    isAuthenticated: !!user,
    isConnecting,
    accounts,
    identity,
    backendActor,
    createCustomActor,
    delegationType,
    login:handleLogin,
    principal: user?.principal?.toText() || null,
    logout: handleLogout,
    fetchBalance,
    signerId,
    balance
  };
};


//   return {
//     adminlogin,
//     adminlogout,
//     isAuthenticated,
//     login,
//     logout,
//     updateClient,
//     authClient,
//     identity,
//     principal,
//     backendActor,
//     accountId,
//     ledgerActor,
//     reloadLogin,
//     accountIdString,
//     showButtonLoading,
//     plugConnectMobile,
//   };


// Authentication provider component

export const AuthProvider = ({ children }) => {
  const auth = useAuthClient();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuths = () => useContext(AuthContext);
