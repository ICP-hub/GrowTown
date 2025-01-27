
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./utils/useAuthClient";
import {
  IdentityKitProvider,
  IdentityKitTheme,
} from "@nfid/identitykit/react";
import {
  IdentityKitAuthType,
  NFIDW,
  Plug,
  InternetIdentity,
} from "@nfid/identitykit";
import "@nfid/identitykit/react/styles.css";
import React from "react";


export function AppBinder() {
  // Define signers and canister ID
const signers = [NFIDW, Plug];
const canisterID = process.env.CANISTER_ID_GROWNTOWN_BACKEND;
const signerClientOptions = {
  targets: [canisterID],
  maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 1 week in nanoseconds
  idleOptions: {
    idleTimeout: 4 * 60 * 60 * 1000, // 4 hours in milliseconds
    disableIdle: false, // Enable logout on idle timeout
  },
  keyType: 'Ed25519', // Use Ed25519 key type for compatibility
};




  return (
    <BrowserRouter>
    <IdentityKitProvider
    onConnectSuccess={(res) => {
      console.log("logged in successfully", res);
    }}
    onConnectFailure={(Error) => {
       console.log('failed connect',Error)
    }}
    onDisconnect={(res) => {
      console.log("logged out successfully", res);
    }}
    signers={signers}
    theme={IdentityKitTheme.SYSTEM}
    authType={IdentityKitAuthType.DELEGATION}
    signerClientOptions={signerClientOptions}
  >  
  
        <Provider store={store}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </Provider>
     
      </IdentityKitProvider>
      </BrowserRouter>
  );
}
