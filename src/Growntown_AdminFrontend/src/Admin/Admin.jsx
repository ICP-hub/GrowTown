import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import NftTypeSetting from "./NftTypeSettings/NftTypeSetting.jsx";
import { useSearch } from "../context/SearchContext";
import SearchResults from "./SearchResults.jsx";
import { useSelector } from "react-redux";

function Admin() {
  const [isOpen, setIsOpen] = useState(false);
  const [toggleProfile, setToggleProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const { backendActor, principal, isAuthenticated } = useAuths();
  const navigate = useNavigate();
  const [searchVisible, setSearchVisible] = useState(false);
  const { handleSearch, searchResults, setSearchResults } = useSearch();
  const location = useLocation();
  const pathWithoutId = location.pathname.split("/").slice(0, -1).join("/");
  const nftSearchData = useSelector((state)=>state.universalSearch.nftSearchData)
  const userSearchData = useSelector((state)=>state.universalSearch.userSearchData)
    
  console.log('userSearchData',userSearchData)
  useEffect(()=>{
    console.log('pathWithoutId=>',location?.pathname)
    console.log('pathWithoutId=>',pathWithoutId)

  },[location])


  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else if (backendActor) {
      checkingAdminId();
    }
  }, [backendActor, isAuthenticated]);

  useEffect(() =>{
    const Collection = backendActor?.getAllCollections();
    console.log(Collection);
  },[])

  useEffect(() => {
    const handleClickOutside = (event) => {
      const profileDropdown = document.getElementById('profile-dropdown');
      const profileButton = document.getElementById('profile-button');
      
      if (toggleProfile && profileDropdown && !profileDropdown.contains(event.target) && 
          profileButton && !profileButton.contains(event.target)) {
        setToggleProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [toggleProfile]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const searchContainer = document.getElementById('search-container');
      if (searchVisible && searchContainer && !searchContainer.contains(event.target)) {
        setSearchVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchVisible]);

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

  const fetchAndProcessCollections = async () => {
    try {
      const collections = await backendActor?.getAllCollections();
      console.log("Raw collections data:", collections);
      return collections || [];
    } catch (error) {
      console.error("Error fetching collections:", error);
      return [];
    }
  };

  const handleSearchInput = async (e) => {
    const query = e.target.value.trim();
    
    if (!query) {
      setSearchResults([]);
      setSearchVisible(false);
      return;
    }

    const searchLower  = query.toLowerCase();

    try {

      if(pathWithoutId === "/Admin/collection/collectionDetails" && nftSearchData ){
        const filteredNft= nftSearchData?.NFTList.filter((nft)=>nft[0][2].nonfungible.name?.toLowerCase().includes(searchLower))
        setSearchResults({nfts:{collectiondata:nftSearchData?.collectiondata,NFTList:filteredNft}});
        setSearchVisible(nftSearchData.NFTList.length > 0);
        console.log(' =>', nftSearchData)
      }else if(location?.pathname === "/admin/users" && userSearchData ){
        const filteredUsers =  userSearchData?.alluser.filter((user) =>user[3].toLowerCase().includes(searchLower));
        setSearchResults({users:filteredUsers});
        setSearchVisible(userSearchData.alluser.length > 0);    
      }
      else{
      const collections = await fetchAndProcessCollections();
      const filteredResults = [];
      
      // Process collections and NFTs
      collections.forEach(item => {
        if (!item || !Array.isArray(item) || item.length < 2) return;
        
        item[1].forEach(collection => {
          if (!collection || !Array.isArray(collection) || collection.length < 3) return;
          
          const collNameMatch = collection[2]?.toLowerCase().includes(searchLower);
          
          // Process NFTs with more complete data
          const matchingNfts = [];
          if (Array.isArray(collection[1])) {
            collection[1].forEach(nft => {
              if (Array.isArray(nft) && nft[2]?.toLowerCase().includes(searchLower)) {
                matchingNfts.push({
                  id: nft[0],
                  name: nft[2],
                  metadata: nft[4],
                  collectionId: collection[0]
                });
              }
            });
          }

          if (collNameMatch || matchingNfts.length > 0) {
            filteredResults.push({
              id: collection[0],
              name: collection[2],
              type: 'collection',
              nfts: matchingNfts,
              collectionData: collection
            });
          }
        });
      });

      setSearchResults({collections:filteredResults});
      setSearchVisible(filteredResults.length > 0);
    }
      
    } catch (error) {
      console.error("Error processing search:", error);
      setSearchResults([]);
      setSearchVisible(false);
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
    <div className="min-h-screen w-full bg-[#0D0D0D] flex flex-col lg:grid lg:grid-cols-[auto_1fr]">
      {/* Sidebar */}
      <aside className="fixed lg:sticky top-0 left-0 h-screen z-40">
        <SideBar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      </aside>

      {/* Main Content Section */}
      <div className="flex-1 flex flex-col min-h-screen w-full">
        {/* Top Navbar */}
        <nav className="sticky top-0 z-30 flex items-center justify-between bg-[#1a1a1a]/90 backdrop-blur-md text-white px-4 sm:px-6 py-3 ">
          {/* Search Bar */}
          <div className="relative hidden sm:block sm:w-[50%] lg:w-full max-w-2xl mx-auto xl:mx-0" id="search-container">
            <input
              type="text"
              placeholder={`Search ${pathWithoutId === "/Admin/collection/collectionDetails" ? 'NFT' :
                location?.pathname === "/admin/users" ? 'User' : 'Collection'
               }...`}
              className="w-full p-2 pl-10 rounded-lg bg-[#2b2b2b] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
              onChange={handleSearchInput}
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-5.2-5.2M15 10a5 5 0 10-10 0 5 5 0 0010 0z" />
            </svg>
            {/* Position search results directly below search input */}
            {searchVisible && (
              <div className="absolute left-0 right-0 mt-1 z-50">
                <SearchResults 
                  collections={searchResults?.collections} 
                  nfts={searchResults?.nfts}
                  users={searchResults?.users}

                  onClose={() => setSearchVisible(false)}
                />
              </div>
            )}
          </div>

          {/* Profile Button */}
          <button 
            id="profile-button"
            className="ml-auto" 
            onClick={() => setToggleProfile(!toggleProfile)}
          >
            <img className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-500" src="/images/Admin.png" alt="Admin" />
          </button>

          {/* Profile Dropdown */}
          {toggleProfile && (
            <div id="profile-dropdown" className="absolute right-4 top-full mt-2 z-50">
              <AdminModal />
            </div>
          )}
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 bg-[#1a1a1a]/90">
          <div className="w-full max-w-[1800px] mx-auto bg-[#0D0D0D] rounded-2xl h-full">
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
            <Route path="/NftTypeSetting" element={<NftTypeSetting />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Admin;
