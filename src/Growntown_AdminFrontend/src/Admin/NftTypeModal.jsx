import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import Buttons from "../Common/Buttons";
import { toast } from "react-toastify";
import { useAuths } from "../utils/useAuthClient";

const NftTypeModal = ({ setToggleNftType }) => {
    const {backendActor}=useAuths();
  const [nftTypeDetails, setNftTypeDetails] = useState({
    nfttype: "",
    nft_type_quantity: "",
    nft_type_cost: "",
  });

  const onClickAddButton = async() => {
    const { nfttype, nft_type_quantity, nft_type_cost } = nftTypeDetails;
    console.log("NFT Type Details:", nftTypeDetails);

    if (!nfttype || !nft_type_quantity || !nft_type_cost) {
      toast.error("All fields are required.");
      return;
    }

    if (nft_type_quantity <= 0 || nft_type_cost <= 0) {
      toast.error("Quantity and cost must be greater than zero.");
      return;
    }
    
    const response = await backendActor?.addObject(nftTypeDetails);
    console.log("adding  NFTTypeDetails response:", response);
   
    toast.success("NFT Type added successfully!");
    setToggleNftType(false);
  };

  const handleInputChange = (field, value) => {
    if (field === "nfttype") {
      if (/^[a-zA-Z0-9 ]*$/.test(value)) {
        setNftTypeDetails((prev) => ({
          ...prev,
          [field]: value.trimStart(),
        }));
      } else {
        toast.error("Only letters and numbers are allowed.");
      }
    } else {
      if (/^\d*$/.test(value)) {
        setNftTypeDetails((prev) => ({
          ...prev,
          [field]: value ? parseInt(value, 10) : "",
        }));
      } else {
        toast.error("Only numeric values are allowed.");
      }
    }
  };

  return (
    <div className="w-full sm:w-[70%] shadow-lg lg:w-[50%] mx-4 xl:w-[40%] border p-6 sm:p-10 rounded-xl border-[#50B248]">
      <div className="flex items-center justify-end">
        <button className="text-[#ffffff]" onClick={() => setToggleNftType(false)}>
          <RxCross2 size={25} />
        </button>
      </div>
      <form className="flex flex-col gap-5">
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
          <div onClick={() => setToggleNftType(false)}>
            <Buttons
              bgColor="black"
              hover={{ textColor: "text-red-600", scale: "scale-110" }}
              textColor="white"
              buttonName="Cancel"
            />
          </div>
          <div onClick={onClickAddButton}>
            <Buttons
              bgColor="white"
              hover={{ textColor: "text-green-600", scale: "scale-110" }}
              textColor="black"
              buttonName="Add"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default NftTypeModal;
