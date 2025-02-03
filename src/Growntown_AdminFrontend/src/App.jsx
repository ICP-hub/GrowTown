import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./Admin/Admin";
import PageNotFound from "./Admin/PageNotFound";
import UnauthorizedPage from "./Admin/collection/UnauthorizedPage";
import LandingPage from "./pages/LandingPage";
import CollectionDetails from "./Admin/collection/CollectionDetails";
import NftDetails from "./Admin/collection/NftDetails";
import { SearchProvider } from './context/SearchContext';

// Introduce a manual delay for testing
const simulateNetworkDelay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Lazy load the FullpageLoader with a simulated delay
const FullpageLoader = lazy(() =>
  simulateNetworkDelay(2000).then(() => import("./Loader/FullpageLoader"))
);

function App() {
  return (
    <SearchProvider>
      <div>
        <Suspense fallback={<FullpageLoader />}>
          <Routes>
            <Route path="/" element={<LandingPage />}></Route>
            <Route path="/admin/*" element={<Admin />} />
            <Route path="*" element={<PageNotFound />} />


            <Route
              path="/collection/:collectionName"
              element={<CollectionDetails />}
            />
            <Route path="/Nft/:Nftname" element={<NftDetails />} />


            <Route path="/unauth/*" element={<UnauthorizedPage />} />
            <Route path="/unauth" element={<UnauthorizedPage />} />
            
          </Routes>
        </Suspense>
      </div>
    </SearchProvider>
  );
}

export default App;
