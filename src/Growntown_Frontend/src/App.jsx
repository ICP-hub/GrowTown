import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NativeAppLogin from "./components/NativeAppLogin";
import PageNotFound from "./components/PageNotFound";
import { AppBinder } from "./AppBinder";

// Lazy load the FullpageLoader correctly
const FullpageLoader = lazy(() => import("./components/Loader/FullpageLoader"));

function App() {
  return (
    <div>
      {/* Display FullpageLoader while components are loading */}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/app" element={<NativeAppLogin />} />
          <Route path="/" element={<AppBinder />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
