import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuths } from "../../utils/useAuthClient.jsx";
import { Principal } from "@dfinity/principal";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { SkeletonTheme } from "react-loading-skeleton";
import { GrNext, GrPrevious } from "react-icons/gr";
import { IoIosAdd } from "react-icons/io";
import CollectionCard from "./CollectionCard";
import CollectionCardSkeleton from "../../Common/CollectionCardSkeleton";
import Buttons from "../../Common/Buttons";

function Collection() {
  const { backendActor } = useAuths();
  const [coll, setColl] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const getCollection = async () => {
    setLoading(true);
    if (backendActor) {
      try {
        const result = await backendActor?.getAllCollections();
        const tempArray = [];
        if (result && Array.isArray(result)) {
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
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getCollection();
  }, [backendActor]);

  const totalPages = Math.ceil(coll.length / itemsPerPage);
  const currentCollections = coll.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#282828">
      <div className="w-full h-full overscroll-none pt-8 pb-8 px-4 md:px-8 flex flex-col items-center  rounded-2xl">
        {/* Header Section */}
        <div className="flex justify-between items-center w-full max-w-6xl mb-6">
          <h2 className="text-white text-2xl font-semibold"> Collection</h2>
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
        <div className="rounded-xl w-full max-w-6xl shadow-lg ">
          {loading ? (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {Array(6).fill().map((_, index) => (
                    <div className="col-span-1 flex items-center justify-center" key={index}>
                  <CollectionCardSkeleton />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full flex items-center">
              {currentCollections.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                  {currentCollections.map((collectiondata, index) => (
                    <div className="col-span-1 flex items-center justify-center" key={index}>
                      <CollectionCard collectiondata={collectiondata} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center w-full h-[50vh]">
                  <p className="text-white text-xl font-medium opacity-80">No collections available</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 space-x-4">
            {currentPage > 1 && (
              <button
                onClick={goToPreviousPage}
                className="w-10 h-10 flex items-center justify-center bg-gray-800 text-white border border-gray-600 rounded-full hover:bg-black transition-all duration-300"
              >
                <GrPrevious />
              </button>
            )}
            <span className="w-10 h-10 flex items-center justify-center bg-[#50B248] text-white font-medium rounded-full shadow-lg transition-all duration-300">
              {currentPage}
            </span>
            {currentPage < totalPages && (
              <button
                onClick={goToNextPage}
                className="w-10 h-10 flex items-center justify-center bg-gray-800 text-white border border-gray-600 rounded-full hover:bg-black transition-all duration-300"
              >
                <GrNext />
              </button>
            )}
          </div>
        )}
      </div>
    </SkeletonTheme>
  );
}

export default Collection;