import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NativeAppLogin from "./components/NativeAppLogin";
import WebglLogin from "./components/WebglLogin";
import PageNotFound from "./components/PageNotFound";

// Introduce a manual delay for testing
const simulateNetworkDelay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Lazy load the FullpageLoader with a simulated delay
const FullpageLoader = lazy(() =>
  simulateNetworkDelay(2000).then(() => import("./components/Loader/FullpageLoader"))
);

function App() {
  return (
    <div>
      <Suspense fallback={<FullpageLoader />}>
        <Routes>
        <Route path="/app" element={<NativeAppLogin />}></Route>
        <Route path="/" element={<WebglLogin />} />
        <Route path="*" element={<PageNotFound />} />
{/* 
  
          <Route
            path="/collection/:collectionName"
            element={<CollectionDetails />}
          />
          <Route path="/Nft/:Nftname" element={<NftDetails />} />
          
    
          <Route path="/unauth/*" element={<UnauthorizedPage />} />
          <Route path="/unauth" element={<UnauthorizedPage />} /> */}
          
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
