import React, { useEffect, useState } from "react";
import { useAuths } from "../../utils/useAuthClient";
import { toast } from "react-toastify";
import { FaTrashAlt } from "react-icons/fa";

const RemoveNftsType = ({ isFetching }) => {
  const { backendActor } = useAuths();
  const [fetchedNftType, setFetchedNftType] = useState([]);

  const convertNftCost=(nftCost)=>{
     return nftCost 
  }

  const fetchNftType = async () => {
    try {
      const response = await backendActor.getObjects();
      setFetchedNftType(response);
      console.log('fetched nft types',response)
    } catch (error) {
      console.error("Error fetching NFT types:", error);
    }
  };

  useEffect(() => {
    fetchNftType();
  }, [isFetching]);

  const removeNftType = async (nftId) => {
    try {
      await backendActor?.removeObject(nftId);
      toast.success("NFT Type removed successfully!");
      setFetchedNftType((prev) => prev.filter((nft) => nft[0] !== nftId));
    } catch (error) {
      console.error("Error removing NFT Type:", error);
      toast.error("Failed to remove NFT Type.");
    }
  };

  return (
    <div className="w-full  p-4 text-white rounded-xl border border-[#50B248]">
      <h2 className="text-xl font-semibold mb-3">Remove Types</h2>
      <div className="grid grid-cols-12 gap-2 py-2 text-center text-gray-400 border-b border-gray-600">
        <span className="col-span-4">Type</span>
        <span className="col-span-3">Quantity</span>
        <span className="col-span-3">Cost</span>
        <span className="col-span-2 text-center">Action</span>
      </div>
      {fetchedNftType.length > 0 ? (
        fetchedNftType.map((val, ind) => (
          <div
            key={val[0]}
            className="grid grid-cols-12 text-center gap-2 py-2 border-b border-gray-700 items-center"
          >
            <span className="col-span-4">{val[1].nfttype}</span>
            <span className="col-span-3">{Number(val[1].nft_type_quantity)}</span>
            <span className="col-span-3">{ convertNftCost( Number(val[1].nft_type_cost)) } </span>
            <span className="col-span-2 text-center">
              <button onClick={() => removeNftType(val[0])} className="text-red-500 hover:text-red-700">
                <FaTrashAlt size={18} />
              </button>
            </span>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-400 mt-3">No NFT types found.</p>
      )}
    </div>
  );
};

export default RemoveNftsType;