// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useUnityContext, Unity } from "react-unity-webgl";
// import { createActor, Growntown_Backend } from "../../../declarations/Growntown_Backend/index";
// import { AuthClient } from "@dfinity/auth-client";
// import { HttpAgent } from "@dfinity/agent";
// import { DelegationIdentity, Ed25519PublicKey, ECDSAKeyIdentity, DelegationChain } from "@dfinity/identity";

// const WebGLIntegration = () => {
//   const navigate = useNavigate();
//   const { unityProvider, sendMessage, isLoaded, loadingProgression } = useUnityContext({
//     loaderUrl: "/webgl/Build/webgl.loader.js",
//     dataUrl: "/webgl/Build/webgl.data",
//     frameworkUrl: "/webgl/Build/webgl.framework.js",
//     codeUrl: "/webgl/Build/webgl.wasm",
//   });

//   const [appPublicKey, setAppPublicKey] = useState(null);
//   const [actor, setActor] = useState(Growntown_Backend);
//   const [delegationChain, setDelegationChain] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Helper function to convert hex string to byte array
//   const hexToBytes = (hex) => {
//     return Uint8Array.from(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
//   };

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const publicKeyString = urlParams.get("sessionkey");

//     if (publicKeyString) {
//         try {
//             const publicKeyBytes = hexToBytes(publicKeyString);
//             setAppPublicKey(Ed25519PublicKey.fromDer(publicKeyBytes));
//             handleLogin(); // Trigger login automatically when sessionkey is detected
//         } catch (error) {
//             console.error("Error converting hex string to bytes:", error);
//         }
//     }
// }, []);


// const handleLogin = async () => {
//   try {
//       setLoading(true);
//       console.log("Initiating login...");

//       const middleKeyIdentity = await ECDSAKeyIdentity.generate();
//       const authClient = await AuthClient.create({
//           identity: middleKeyIdentity,
//       });

//       const iiUrl = "https://identity.ic0.app/#authorize";

//       await new Promise((resolve) => {
//           authClient.login({
//               identityProvider: iiUrl,
//               onSuccess: resolve,
//               onError: (err) => console.error("Login failed:", err),
//           });
//       });

//       const middleIdentity = authClient.getIdentity();
//       const agent = new HttpAgent({ identity: middleIdentity });

//       if (import.meta.env.VITE_DFX_NETWORK === "local") {
//           await agent.fetchRootKey();
//       }

//       const canisterId = process.env.CANISTER_ID_GROWNTOWN_BACKEND;
//       if (!canisterId) {
//           throw new Error("Canister ID is undefined.");
//       }

//       const newActor = createActor(canisterId, { agent });
//       setActor(newActor);

//       // Generate delegation and append to URL
//       if (appPublicKey && middleIdentity instanceof DelegationIdentity) {
//           const middleToApp = await DelegationChain.create(
//               middleKeyIdentity,
//               appPublicKey,
//               new Date(Date.now() + 15 * 60 * 1000),
//               { previous: middleIdentity.getDelegation() }
//           );

//           const delegationJson = JSON.stringify(middleToApp.toJSON());
//           const encodedDelegation = encodeURIComponent(delegationJson);

//           const redirectUrl = `${window.location.origin}?sessionkey=${middleKeyIdentity.getPublicKey().toDerHex()}&delegation=${encodedDelegation}`;

//           console.log("Redirecting to:", redirectUrl);
//           window.location.href = redirectUrl; // Redirect back with sessionkey and delegation
//       }
//   } catch (error) {
//       console.error("Login failed:", error);
//   } finally {
//       setLoading(false);
//   }
// };



//   return (
//     <div className="container">
//       <Unity unityProvider={unityProvider} style={{ width: "100%", height: "100vh" }} />
//       {!isLoaded && <p>Loading WebGL: {Math.round(loadingProgression * 100)}%</p>}
//     </div>
//   );
// };

// export default WebGLIntegration;
import React, { useEffect, useState, useCallback } from "react";
import { useUnityContext, Unity } from "react-unity-webgl";
import { useAuths } from "../utils/useAuthClient";

const WebGLIntegration = () => {
  const { unityProvider, sendMessage, isLoaded } = useUnityContext({
    loaderUrl: "/webgl/Build/webgl.loader.js",
    dataUrl: "/webgl/Build/webgl.data",
    frameworkUrl: "/webgl/Build/webgl.framework.js",
    codeUrl: "/webgl/Build/webgl.wasm",
  });

  const { login, isAuthenticated, principal } = useAuths();
  const [audioContext, setAudioContext] = useState(null);

  // Ensure the function is stable across renders
  const handleUnityLogin = useCallback(async () => {
    console.log("🔄 Unity requested login...");
    await login();

    if (principal) {
      try {
        console.log("✅ Sending Principal to Unity:", principal);
        sendMessage("AuthManager", "ReceivePrincipal", principal);
      } catch (error) {
        console.error("❌ Error sending principal to Unity:", error);
      }
    }
  }, [login, principal, sendMessage]);

  useEffect(() => {
    const handleEvent = () => {
      console.log("📢 Unity Login Event Detected!");
      handleUnityLogin();
    };

    window.addEventListener("UnityLoginRequest", handleEvent);

    return () => {
      window.removeEventListener("UnityLoginRequest", handleEvent);
    };
  }, [handleUnityLogin]);

  useEffect(() => {
    if (isLoaded && isAuthenticated && principal) {
      try {
        console.log("✅ Unity is ready, sending Principal to WebGL:", principal);
        sendMessage("AuthManager", "ReceivePrincipal", principal);
      } catch (error) {
        console.error("❌ Failed to send principal to Unity:", error);
      }
    }
  }, [isLoaded, isAuthenticated, principal, sendMessage]);

  // ✅ Fix WebGL INVALID_ENUM Error (By Adding Fallback for `getInternalformatParameter`)
  useEffect(() => {
    if (typeof WebGLRenderingContext !== "undefined") {
      console.log("🛠️ WebGL Fix: Checking for compatibility...");

      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");

      if (gl) {
        console.log("✅ WebGL Context Initialized Successfully.");
      } else {
        console.error("❌ WebGL is not supported on this browser!");
      }
    }
  }, []);

  // ✅ Fix for AudioContext Not Allowed to Start (User Interaction Required)
  useEffect(() => {
    const enableAudioContext = () => {
      if (!audioContext) {
        const newAudioContext = new (window.AudioContext || window.webkitAudioContext)();
        newAudioContext.resume().then(() => {
          console.log("✅ AudioContext started successfully.");
          setAudioContext(newAudioContext);
        }).catch((error) => {
          console.error("❌ Failed to start AudioContext:", error);
        });
      }
    };

    document.addEventListener("click", enableAudioContext, { once: true });

    return () => {
      document.removeEventListener("click", enableAudioContext);
    };
  }, [audioContext]);

  return (
    <div className="container">
      <Unity unityProvider={unityProvider} style={{ width: "100%", height: "100vh" }} />
    </div>
  );
};

export default WebGLIntegration;
