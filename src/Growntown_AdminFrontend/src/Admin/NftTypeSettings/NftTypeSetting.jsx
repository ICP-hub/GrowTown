import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SkeletonTheme } from "react-loading-skeleton";
import { useAuths } from "../../utils/useAuthClient";
import Buttons from "../../Common/Buttons";
import Createcollectionloader from "../collection/Createcollectionloader";
import BackButton from "../collection/BackButton";
import RemoveNftsType from "./RemoveNftsType";

const NftTypeSetting = () => {
  const [loading, setLoading] = useState(false);
  const [isFetching, setFetching] = useState(false);
  const { backendActor } = useAuths();
  const navigate = useNavigate();

  const [nftTypeDetails, setNftTypeDetails] = useState({
    nfttype: "",
    nft_type_quantity: "",
    nft_type_cost: "",
  });

  const onCancelButton = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const onClickAddButton = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple clicks

    setLoading(true);
    const { nfttype, nft_type_quantity, nft_type_cost } = nftTypeDetails;
    console.log("NFT Type Details:", nftTypeDetails);

    if (!nfttype || !nft_type_quantity || !nft_type_cost) {
      toast.error("All fields are required.");
      setLoading(false);
      return;
    }

    if (nft_type_quantity <= 0 || nft_type_cost <= 0) {
      toast.error("Quantity and cost must be greater than zero.");
      setLoading(false);
      return;
    }

    try {
      const response = await backendActor?.addObject(nftTypeDetails);
      console.log("Adding NFT Type Details response:", response);
      toast.success("NFT Type added successfully!");
      setFetching(true);

      setNftTypeDetails({ nfttype: "", nft_type_quantity: "", nft_type_cost: "" });
    } catch (error) {
      console.error("Error adding NFT Type:", error);
      toast.error("Failed to add NFT Type.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === "nfttype") {
      if (/^[a-zA-Z0-9 ]*$/.test(value)) {
        setNftTypeDetails((prev) => ({ ...prev, [field]: value.trimStart() }));
      } else {
        toast.error("Only letters and numbers are allowed.");
      }
    } else {
      if (/^\d*$/.test(value)) {
        setNftTypeDetails((prev) => ({ ...prev, [field]: value ? parseInt(value, 10) : "" }));
      } else {
        toast.error("Only numeric values are allowed.");
      }
    }
  };

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <div className="w-[90%] mx-auto overflow-y-scroll pt-10 md:px-10 pb-8 h-screen no-scrollbar bg-gradient-to-b from-[#29292C]/95 via-[#1a1a1a]/95 to-black/95">
        <div className="w-full">
          <div className="flex items-center">
            <BackButton />
            <h1 className="text-2xl lg:text-3xl ml-2 lg:ml-5 text-white">Type Settings</h1>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="hidden xl:block my-8 mr-4 xl:h-[50%] rounded-xl col-span-4">
              <RemoveNftsType
                isFetching={isFetching}
              />
            </div>
            <div className="my-8 col-span-12 border border-[#50B248] p-4 lg:px-8 rounded-xl xl:col-span-8">
              <h2 className="text-xl font-semibold mb-3 text-white">Add Types</h2>
              <form className="flex flex-col my-10 gap-5">
                <div>
                  <label className="block text-[#FFFFFF] text-[14px] md:text-[18px] leading-[25px]">
                    NFT Type
                    <input
                      value={nftTypeDetails.nfttype}
                      onChange={(e) => handleInputChange("nfttype", e.target.value)}
                      type="text"
                      placeholder="Enter type of NFT"
                      className="mt-1 pl-4 w-full h-[38px] border bg-transparent rounded-md text-[16px] text-[#8a8686]"
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-[#FFFFFF] text-[14px] md:text-[18px] leading-[25px]">
                    NFT Quantity
                    <input
                      value={nftTypeDetails.nft_type_quantity}
                      onChange={(e) => handleInputChange("nft_type_quantity", e.target.value)}
                      type="text"
                      placeholder="Enter Quantity"
                      className="mt-1 pl-4 w-full h-[38px] border bg-transparent rounded-md text-[16px] text-[#8a8686]"
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-[#FFFFFF] text-[14px] md:text-[18px] leading-[25px]">
                    NFT Price
                    <input
                      value={nftTypeDetails.nft_type_cost}
                      onChange={(e) => handleInputChange("nft_type_cost", e.target.value)}
                      type="text"
                      placeholder="Enter Price per NFT in GRC"
                      className="mt-1 pl-4 w-full h-[38px] border bg-transparent rounded-md text-[16px] text-[#8a8686]"
                    />
                  </label>
                </div>
                <div className="flex mt-10 justify-center gap-5 items-center">
                  <button onClick={onCancelButton} disabled={loading}>
                    <Buttons
                      bgColor="#242426"
                      hover={{ textColor: "text-red-600", scale: "scale-110" }}
                      textColor="white"
                      buttonName="Cancel"
                    />
                  </button>
                  <button onClick={onClickAddButton} disabled={loading}>
                    <Buttons
                      bgColor="white"
                      hover={{ textColor: "text-green-600", scale: "scale-110" }}
                      textColor="black"
                      buttonName="Add"
                    />

                  </button>
                </div>
              </form>
            </div>

            <div className="xl:hidden col-span-12 my-8">
              <RemoveNftsType isFetching={isFetching} />
            </div>

          </div>

        </div>

      </div>
      {loading && (
        <div className="absolute backdrop-blur-lg w-full top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-[30%]  flex mx-auto my-auto ">
            <Createcollectionloader />
          </div>

        </div>
      )}
    </SkeletonTheme>
  );
};

export default NftTypeSetting;
