// import React, { Suspense, lazy } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Admin from "./Admin/Admin";
// import Login from "./Admin/Login";
// import Profile from "./pages/Profile";
// import CollectionDetail from "./pages/CollectionDetail";
// import NftDetails from "./components/NftDetails";
// import Hero from "./pages/Hero";
// import BuyNft from "./pages/BuyNft";
// import PageNotFound from "./Admin/PageNotFound";
// import Activity from "./pages/Activity";
// import UnauthorizedPage from "./Admin/collection/UnauthorizedPage";

// // Introduce a manual delay for testing
// const simulateNetworkDelay = (ms) => {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// };

// // Lazy load the FullpageLoader with a simulated delay
// const FullpageLoader = lazy(() =>
//   simulateNetworkDelay(2000).then(() => import("./Loader/FullpageLoader"))
// );

// function App() {
//   return (
//     <div>
//       <Suspense fallback={<FullpageLoader />}>
//         <Routes>
//           <Route path="/" element={<Hero />}></Route>
//           <Route path="/profile" element={<Profile />} />
//           <Route path="/activity" element={<Activity />} />
//           <Route
//             path="/collection/:collectionName"
//             element={<CollectionDetail />}
//           />
//           <Route path="/Nft/:Nftname" element={<NftDetails />} />
//           <Route path="/Nft/:Nftname/buy" element={<BuyNft />} />
//           <Route path="/admin/login" element={<Login />} />
//           <Route path="/admin/*" element={<Admin />} />
//           <Route path="/unauth/*" element={<UnauthorizedPage />} />
//           <Route path="*" element={<PageNotFound />} />
//           <Route path="/unauth" element={<UnauthorizedPage />} />
//         </Routes>
//       </Suspense>
//     </div>
//   );
// }

// export default App;


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

console.log('delegationChain',delegationChain)


  // Extract the session key from URL on component mount
  useEffect(() => {
    const url = window.location.href;
    const publicKeyIndex = url.indexOf("sessionkey=");
    if (publicKeyIndex !== -1) {
      const publicKeyString = url.substring(publicKeyIndex + "sessionkey=".length);
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

      await new Promise((resolve) => {
        authClient.login({
          identityProvider: "https://identity.ic0.app/#authorize",
          onSuccess: resolve,
        });
      });

      const middleIdentity = authClient.getIdentity();
      const agent = new HttpAgent({ identity: middleIdentity });

      const newActor = createActor(process.env.GREET_BACKEND_CANISTER_ID, {
        agent,
      });
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
      <h1 className="text-white"> DFINITY Greeting App</h1>
      <div className="flex flex-col">
      <button  className="text-black bg-white mb-4" onClick={handleLogin}>Login</button>
      <button className="text-black bg-white" onClick={handleAuthorize} disabled={!delegationChain}>
        Authorize 
      </button>
      <button onClick={handleGreet} disabled={loading}>
        {loading ? "Loading..." : "Greet"}
      </button>
      </div>
      {greeting && <p id="greeting" className="text-white">{greeting}</p>}
    </div>
  );
};

export default App;

