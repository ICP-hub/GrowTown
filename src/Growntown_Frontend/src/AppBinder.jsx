import React from "react";
import WebGLIntegration from "./components/WebglLogin";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./utils/useAuthClient";
import {
  IdentityKitProvider,
  IdentityKitTheme,
  useIsInitializing,
} from "@nfid/identitykit/react";
import {
  IdentityKitAuthType,
  NFIDW,
  Plug,
  InternetIdentity,
} from "@nfid/identitykit";
import "@nfid/identitykit/react/styles.css";

// IdentityKit signers and configuration
const signers = [NFIDW, Plug, InternetIdentity];
const canisterID = process.env.CANISTER_ID_GROWNTOWN_BACKEND;
const signerClientOptions = {
  targets: [canisterID],
  maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 1 week in nanoseconds
  idleOptions: {
    idleTimeout: 4 * 60 * 60 * 1000, // 4 hours
    disableIdle: false,
  },
  keyType: "Ed25519",
};

export function AppBinder() {
  return (
    <IdentityKitProvider
      onConnectSuccess={(res) => console.log("✅ Logged in successfully", res)}
      onConnectFailure={(error) => console.log("❌ Connection failed", error)}
      onDisconnect={(res) => console.log("✅ Logged out successfully", res)}
      signers={signers}
      theme={IdentityKitTheme.SYSTEM}
      authType={IdentityKitAuthType.DELEGATION}
      signerClientOptions={signerClientOptions}
    >
      <IdentityKitLoader />
    </IdentityKitProvider>
  );
}

// ✅ Ensure IdentityKit is fully initialized before rendering AuthProvider
const IdentityKitLoader = () => {
  const isInitializing = useIsInitializing();

  if (isInitializing) {
    return <div>Loading IdentityKit...</div>; // Prevents crash due to uninitialized context
  }

  return (
    <Provider store={store}>

        <AuthProvider>
          <WebGLIntegration />
        </AuthProvider>

    </Provider>
  );
};
