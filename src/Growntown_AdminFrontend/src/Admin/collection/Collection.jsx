import React, { useEffect, useState } from "react";
import YellowButton from "../../components/button/YellowButton";
import { Link } from "react-router-dom";
import BackButton from "./BackButton";
import { useAuths } from "../../utils/useAuthClient.jsx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { SkeletonTheme } from "react-loading-skeleton";
import { FaTrashAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { BiErrorCircle } from "react-icons/bi"; // Warning icon
import { Principal } from "@dfinity/principal";
import Buttons from "../../Common/Buttons";
import { IoIosAdd } from "react-icons/io";
import CollectionCard from "./CollectionCard";
import CollectionCardSkeleton from "../../Common/CollectionCardSkeleton";
import { CiSearch } from "react-icons/ci";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";

function Collection() {
  const { backendActor } = useAuths();
  const [coll, setColl] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false); // Modal state
  const [collectionToDelete, setCollectionToDelete] = useState(null); // Track the collection to delete
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Number of items to display per page

  const getCollection = async () => {
    setLoading(true);
    if (backendActor) {
      try {
        const result = await backendActor?.getAllCollections();
        const tempArray = [];
        if (result && Array.isArray(result)) {
          console.log("resultCollection=>", result);
          result.forEach((item) => {
            if (item && item.length > 1) {
              item[1].forEach((value) => {
                if (value && value.length > 1) {
                  tempArray.push(value);
                }
              });
            }
          });

          setColl(tempArray);
        }
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setLoading(false); // Make sure to stop loading state
      }
    }
  };

  useEffect(() => {
    getCollection();
  }, [backendActor]);

  const handleDelete = (collectionId) => {
    setCollectionToDelete(collectionId);
    setShowDialog(true); // Open the modal
  };

  const cancelDelete = () => {
    setCollectionToDelete(null);
    setShowDialog(false); // Close the modal
  };

  const confirmDelete = async () => {
    setShowDialog(false);
    setLoading(true);
    const principalString = Principal.fromUint8Array(collectionToDelete._arr);
    if (backendActor) {
      try {
        const result = await backendActor?.removeCollection(principalString);
        console.log(result);
      } catch (error) {
        console.error("Error deleting collection:", error);
      } finally {
        setLoading(false);
        // Refresh collection after deletion
        await getCollection();
      }
    }
  };

  // Filtered collections based on search query
  const filteredCollections = coll.filter((collectiondata) =>
    collectiondata[2].toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage);
  const currentCollections = filteredCollections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#282828">
      <div className="w-full h-screen overscroll-none overflow-scroll pt-8 pb-8 no-scrollbar px-8 mt-4 ">
        {/* Header Section */}
        <div className="flex justify-between items-center w-full mb-8 mt-4">
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <BackButton text="Admin<Collection" />
            </div>
            {/* Search Section */}
            <div className="relative w-[300px]">
              <input
                type="text"
                placeholder="Search collections..."
                className="w-full px-6 py-4 rounded-2xl bg-[#1E1E1E] border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#50B248] transition-all duration-300 text-sm"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute top-1/2 right-4 transform -translate-y-1/2 p-2.5 rounded-xl bg-[#50B248] text-white hover:bg-[#3D9635] transition-all duration-300">
                <CiSearch className="w-5 h-5" />
              </button>
            </div>
          </div>
          <Link to="/Admin/collection/create">
            <Buttons
              buttonName="Create Collection"
              bgColor="white"
              icon={<IoIosAdd size={24} className="text-black" />}
              className="hover:shadow-lg transition-all duration-300"
            />
          </Link>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="grid w-full gap-8 lg:grid-cols-3 sm:grid-cols-1 md:grid-cols-2">
            {Array(6)
              .fill()
              .map((_, index) => (
                <CollectionCardSkeleton key={index} />
              ))}
          </div>
        ) : (
          <div className="w-full flex justify-center items-center">
            {currentCollections.length > 0 ? (
              <div className="grid w-full gap-10 lg:grid-cols-4 sm:grid-cols-1 md:grid-cols-2">
                {currentCollections.map((collectiondata, index) => (
                  <CollectionCard
                    key={index}
                    collectiondata={collectiondata}
                    handleDelete={handleDelete}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center w-full h-[50vh]">
                <p className="text-white text-xl font-medium opacity-80">
                  No collections available
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-16">
          {currentPage > 1 && (
            <button
              onClick={goToPreviousPage}
              className="px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded hover:bg-black"
            >
              <GrPrevious/>
            </button>
          )}
          <span className="mx-4 px-4 transition-all duration-300 py-2 bg-[#50B248] cursor-pointer hover:bg-gray-700 hover:text-white border border-black rounded-lg">
          {currentPage}
          </span> 
         
          {currentPage < totalPages && (
            <button
              onClick={goToNextPage}
              className="px-4 py-2  bg-gray-800 text-white border border-gray-600 rounded hover:bg-black"
            >
              <GrNext/>
            </button>
          )}
        </div>
      </div>
    </SkeletonTheme>
  );
}

export default Collection;