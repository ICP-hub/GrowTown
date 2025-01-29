import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuths } from "../utils/useAuthClient.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Principal } from "@dfinity/principal";
import { canisterId } from "../../../declarations/Growntown_Backend/index.js";
import SideBar from "./SideBar";
import AdminModal from "./AdminModal";
import DashBoard from "./DashBoard";
import Collection from "./collection/Collection";
import CollectionDetails from "./collection/CollectionDetails";
import NftDetails from "./collection/NftDetails";
import CreateCollection from "./collection/CreateCollection";
import Users from "./Users";
import UserDetails from "./UserDetails";
import PageNotFound from "./PageNotFound";
import Useractivity from "./Useractivity";
import Allorder from "./Allorder";
import AllorderDetails from "./AllorderDetails";
import UnauthorizedPage from "./collection/UnauthorizedPage";

function Admin() {
  const [isOpen, setIsOpen] = useState(false);
  const [toggleProfile, setToggleProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const { backendActor, principal, isAuthenticated } = useAuths();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else if (backendActor) {
      checkingAdminId();
    }
  }, [backendActor, isAuthenticated]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const checkingAdminId = async () => {
    setLoading(true);
    if (backendActor) {
      try {
        const canister = Principal.fromText(canisterId);
        const principalid = Principal.fromText(principal);
        const result = await backendActor.isController(canister, principalid);
        if (result === true) {
          toast.success("Admin login successful");
          navigate("/admin/dashboard");
        } else {
          toast.error("Only admin can access");
          navigate("/");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error checking admin ID:", error);
        toast.error("Error checking admin ID:", error);
        navigate("/");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-gray-600 border-t-gray-300 rounded-full animate-spin"></div>
          <p className="mt-2 text-lg text-white">Verifying Admin ID...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full  grid grid-cols-[250px_1fr]">
      {/* Sidebar */}
      <aside className="bg-gradient-to-b from-gray-900 via-[#1a1a1a] to-black shadow-lg p-4">
        <SideBar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      </aside>

      {/* Main Content Section */}
      <div className="flex flex-col  w-full">
        {/* Top Navbar with Search and Profile */}
        <nav className="flex items-center justify-between  text-white px-6 py-3 shadow-md">
          {/* Search Bar */}
          <div className="relative w-full max-w-2xl">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 pl-10 rounded-lg bg-[#2b2b2b] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.2-5.2M15 10a5 5 0 10-10 0 5 5 0 0010 0z" />
            </svg>
          </div>

          {/* Profile Button */}
          <button className="ml-4" onClick={() => setToggleProfile(!toggleProfile)}>
            <img className="w-10 h-10 rounded-full border border-gray-500" src="/images/Admin.svg" alt="Admin" />
          </button>

          {toggleProfile && 
          <div className="absolute bg-red-600 right-5 z-50 top-[3.75rem]">
            <AdminModal />
            </div>}
        </nav>

        {/* Dashboard Content */}
        <main className="flex-1  w-full p-6">
         <div className="w-[97%] bg-[#0D0D0D] h-[97%] rounded-2xl m-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/collection/create" element={<CreateCollection />} />
            <Route path="/collection/collectionDetails/:id" element={<CollectionDetails />} />
            <Route path="/collection/collectionDetails/:collectionId/nft/:nftId" element={<NftDetails />} />
            <Route path="/users/" element={<Users />} />
            <Route path="/users/:id" element={<UserDetails />} />
            <Route path="/activity" element={<Useractivity />} />
            <Route path="/activity/allorder/" element={<Allorder />} />
            <Route path="/activity/allorder/:id" element={<AllorderDetails />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
         </div>
        </main>
      </div>
    </div>
  );
}

export default Admin;
