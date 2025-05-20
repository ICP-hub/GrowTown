import React, { useEffect, useState, useCallback } from "react";
import { useUnityContext, Unity } from "react-unity-webgl";
import { useAuths } from "../utils/useAuthClient";
import { DelegationChain, Ed25519PublicKey } from "@dfinity/identity";

const WebGLIntegration = () => {
  const { unityProvider, sendMessage, isLoaded, addEventListener, removeEventListener } = useUnityContext({
    loaderUrl: "/webgl/Build/webgl.loader.js",
    dataUrl: "/webgl/Build/webgl.data",
    frameworkUrl: "/webgl/Build/webgl.framework.js",
    codeUrl: "/webgl/Build/webgl.wasm",
  });

  const { login, isAuthenticated, identity } = useAuths();
  const [sessionPublicKey, setSessionPublicKey] = useState(null);
  const GAME_OBJECT_NAME = "AgentAndPlugin";

  const hexToBytes = (hex) => {
    if (!hex || typeof hex !== "string") {
      console.error("❌ Invalid hex string provided:", hex);
      throw new Error("Invalid hex string");
    }
    return Uint8Array.from(hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
  };

  const handleSessionKey = useCallback((sessionKeyHex) => {
    try {
      const publicKeyBytes = hexToBytes(sessionKeyHex);
      const publicKey = Ed25519PublicKey.fromDer(publicKeyBytes);
      setSessionPublicKey(publicKey);
      console.log("✅ Session Public Key Received from Unity at / route:", sessionKeyHex);
    } catch (error) {
      console.error("❌ Failed to parse session public key:", error);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      console.log("✅ Unity WebGL is loaded, setting up session key listener...");
      addEventListener("SendSessionKey", handleSessionKey);
    }
    return () => {
      if (isLoaded) {
        removeEventListener("SendSessionKey", handleSessionKey);
      }
    };
  }, [isLoaded, addEventListener, removeEventListener, handleSessionKey]);

  const generateDelegationChain = async () => {
    if (!identity || !sessionPublicKey) {
      console.error("❌ Cannot generate delegation. Missing identity or sessionPublicKey:", { identity, sessionPublicKey });
      return;
    }

    try {
      console.log("🔄 Generating WebGL Delegation Chain at / route...");
      const newDelegationChain = await DelegationChain.create(
        identity,
        sessionPublicKey,
        new Date(Date.now() + 15 * 60 * 1000) // 15 min validity
      );
      console.log("✅ Delegation Created Successfully:", newDelegationChain.toJSON());
      sendMessage(GAME_OBJECT_NAME, "ReceiveWebGLDelegationStatic", JSON.stringify(newDelegationChain.toJSON()));
      console.log(`📢 Delegation sent to Unity static method: ReceiveWebGLDelegationStatic`);
    } catch (error) {
      console.error("❌ Delegation generation failed:", error);
    }
  };

  const handleUnityLogin = useCallback(async (sessionKeyHex) => {
    console.log("🔄 Unity requested login with session key from event:", sessionKeyHex);
    if (sessionKeyHex) {
      handleSessionKey(sessionKeyHex);
    } else {
      console.error("❌ No session key provided by Unity event!");
      return;
    }
    if (!isAuthenticated) {
      console.log("🔄 Triggering wallet login...");
      await login();
    } else {
      console.log("✅ Already authenticated, proceeding with existing identity.");
    }
  }, [login, handleSessionKey, isAuthenticated]);

  useEffect(() => {
    const handleEvent = (event) => {
      console.log("📢 Unity Login Event Detected at / route! Event detail:", event.detail);
      const sessionKey = event.detail || "";
      handleUnityLogin(sessionKey);
    };
    window.addEventListener("UnityLoginRequest", handleEvent);
    return () => window.removeEventListener("UnityLoginRequest", handleEvent);
  }, [handleUnityLogin]);

  useEffect(() => {
    if (isLoaded && isAuthenticated && identity && sessionPublicKey) {
      console.log("✅ WebGL conditions met: loaded, authenticated, identity and session key present.");
      generateDelegationChain();
    } else {
      console.log("🔍 WebGL status:", { isLoaded, isAuthenticated, identity, sessionPublicKey });
    }
  }, [isLoaded, isAuthenticated, identity, sessionPublicKey]);

  return (
    <div className="container mx-auto">
      <Unity
        unityProvider={unityProvider}
        style={{ width: "100%", height: "100vh" }}
        devicePixelRatio={window.devicePixelRatio}
      />
    </div>
  );
};

export default WebGLIntegration;