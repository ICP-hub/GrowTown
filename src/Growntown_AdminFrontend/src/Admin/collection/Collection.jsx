import React, { useEffect, useState } from "react";
import YellowButton from "../../components/button/YellowButton";
import { Link } from "react-router-dom";
import BackButton from "./BackButton";
import { useAuth } from "../../utils/useAuthClient.jsx";
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

function Collection() {
  const { backendActor } = useAuth();
  const [coll, setColl] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false); // Modal state
  const [collectionToDelete, setCollectionToDelete] = useState(null); // Track the collection to delete

  const getCollection = async () => {
    setLoading(true);
    if (backendActor) {
      try {
        const result = await backendActor?.getAllCollections();

        const tempArray = [];
        if (result && Array.isArray(result)) {
          console.log('resultCollection=>',result)
          result.forEach((item) => {
            if (item && item.length > 1) {
              item[1].forEach((value) => {
                if (value && value.length > 1) {
                  tempArray.push(value);
                }
              });
            }
          });

          console.log(tempArray);
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
    const fetchCollection = async () => {
      await getCollection();
      setLoading(false);
    };

    fetchCollection();
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
        // Close the modal after deletion
        await getCollection();
      }
    }
  };

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#282828">
      <div className="w-[90%] h-screen overscroll-none overflow-scroll pt-10 px-10 pb-8 no-scrollbar 2xl:ml-[7%] md:w-full lg:w-[90%] lg:pt-20">
        {/* Flex container for back button and collection buttons */}
        <div className="flex justify-between items-center w-full mb-6 mt-5">
          {/* Back button (hidden on small screens) */}
          <div className="hidden sm:block">
            <BackButton />
          </div>
          {/* Create collection button */}
          <div className="flex space-x-4">
            <Link to="/Admin/collection/create">
               <Buttons buttonName="Create Collection" bgColor="white" icon={<IoIosAdd size={30}/>}/>
            </Link>
          </div>
        </div>

        {/* Loader skeleton when loading */}
        {loading ? (
          <div className="grid w-full gap-6 lg:grid-cols-3 sm:grid-cols-1 md:grid-cols-2">
            {Array(6)
              .fill()
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-[#29292C] w-full h-full px-10 py-6 flex flex-col justify-center items-center gap-y-4 rounded-md border-transparent border"
                >
                  <Skeleton circle width={160} height={160} />
                  <Skeleton width={140} height={30} />
                  <Skeleton width={140} height={30} />
                </div>
              ))}
          </div>
        ) : (
          <div className="w-full flex justify-center mt-10 items-center">
            {/* Grid of collections */}
            {coll.length > 0 ? (
              <div className="grid w-full gap-6 lg:grid-cols-3 sm:grid-cols-1 md:grid-cols-2">
                {coll.map((collectiondata, index) => (
                  <CollectionCard collectiondata={collectiondata} handleDelete={handleDelete} index={index} />
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center w-full h-full">
                <p className="text-white text-2xl text-center">
                  No collections available
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="relative bg-[#29292C] p-8 px-10 rounded-md text-center text-white w-full sm:w-[90%] md:w-[500px] shadow-lg">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-400 text-2xl"
              onClick={cancelDelete}
            >
              <IoClose />
            </button>
            {/* Warning Icon and Text */}
            <div className="flex flex-col items-center">
              <BiErrorCircle className="text-yellow-500 text-6xl mb-4" />
              <p className="text-lg font-semibold mb-4">
                Warning! This action cannot be undone.
              </p>
              <p className="mb-6">
                Are you sure you want to delete this collection?
              </p>
            </div>
            {/* Buttons */}
            <div className="flex justify-between space-x-2">
              <button
                className="w-full px-6 py-3 bg-gray-600 rounded-md text-white text-lg hover:bg-gray-700"
                onClick={(e) => {
                  cancelDelete();
                }}
              >
                Cancel
              </button>
              <button
                className="w-full px-6 py-3 bg-[#FCD37B] rounded-md text-black text-lg hover:bg-yellow-500"
                onClick={(e) => {
                  confirmDelete();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </SkeletonTheme>
  );
}

export default Collection;
