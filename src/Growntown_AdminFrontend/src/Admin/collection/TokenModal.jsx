import React, { useState } from 'react'
import { RxCross2 } from 'react-icons/rx';
import Buttons from '../../Common/Buttons';
import ImageUploader from './ImageUploader';
import toast from 'react-hot-toast';
import { useAuth } from '../../utils/useAuthClient';
import WarningModal from './WarningModal';
import SuccessModal from './SuccessModal';
import { Principal } from '@dfinity/principal';

const TokenModal = ({toggleModal, principalString}) => {
  const [tokenName, setTokenName]=useState('')
  const [tokenSymbol, setTokenSymbol]=useState('')
  const [tokenDecimal, setTokenDecimal]=useState('')
  const [tokenAmount,setTokenAmount]=useState('')
  const [tokenImage,setTokenImage]=useState('')
  const [tokenImageUrl, seTokentImageurl]=useState('')
  const [showModal,setShowModal]=useState(false)
   const { backendActor } = useAuth();
   const [Success, setsuccess]=useState(false)

  console.log('tokenDetails=>',tokenName,tokenDecimal,tokenSymbol,'tokenImageUrl',tokenImageUrl, 'tokenImage=',tokenImage)
  async function onClickAddButton(){
    if(!tokenName || !tokenSymbol || !tokenDecimal || !tokenImage)
      { toast.error("Please Fill all token details");
        return;
      }
    togglewarning();
  }

  function togglewarning(){
    setShowModal(!showModal)
  }

  const handleUpload = async () => {
    console.log("upload clicked");
    togglewarning();
  
    const principal = Principal.fromText(principalString);
    console.log('principal=?', principal);
  
    try {
      const metadataContainer = {
        json: "",
      };
  
      const decimalValue = Number(tokenDecimal);
      const amountValue = BigInt(tokenAmount);
  
      const response = await backendActor?.mintExtFungible(
        principal,
        tokenName,
        tokenSymbol,
        decimalValue, // Nat8
        [metadataContainer],
        amountValue // Nat
      );
      
      if(response){}
      console.log('Token upload response->', response);
      toast.success("Token created successfully!");
    } catch (err) {
      console.log('Error while creating token:', err);
      toast.error('Error while creating token');
    }
  };
  

  const captureUploadedNftImageHDFile = async (files) => {
    const file = files[0];
    if (file) {
      try {

        const reader = new FileReader();
        reader.onloadend = () => setTokenImage(reader.result);
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error in NFT file:", error);
      }
    }
  };
  return (
    <div className="add_new_Token_popup_bg_container border border-[#50B248]">
      <div className="flex   items-center justify-end">
        <button className="text-[#ffffff]" onClick={() => toggleModal()}>
          <RxCross2 size={25} />
        </button>
      </div>
      <form className="flex flex-col gap-5">
        <div className="mt-1">
          <label className="mt-4 w-[100%] h-[60px] md:h-[86px] text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[18px] leading-[25px]">
            NFT Name
            <input
              value={tokenName}
              onChange={(e) => {
                let value = e.target.value;
                if (/^[a-zA-Z0-9 ]*$/.test(value)) {
                  value = value.trimStart();
                  if (value.trim() !== "") {
                    setTokenName(value);
                  } else {
                    setTokenName("");
                  }
                } else {
                  toast.error("Only letters and numbers are allowed.");
                }
              }}
              type="text"
              placeholder=""
              className="mt-1 pl-4 w-[100%] h-[38px] border  bg-transparent rounded-md text-[16px] text-[#8a8686]"
            />
          </label>
        </div>
        <div className="mt-1">
          <label className="mt-4 w-[100%] h-[60px] md:h-[86px] text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[18px] leading-[25px]">
          Token Symbol
            <input
              value={tokenSymbol}
              onChange={(e) => {
                let value = e.target.value;
                if (/^[a-zA-Z0-9 ]*$/.test(value)) {
                  value = value.trimStart();
                  if (value.trim() !== "") {
                    setTokenSymbol(value);
                  } else {
                    setTokenSymbol("");
                  }
                } else {
                  toast.error("Only letters and numbers are allowed.");
                }
              }}
              type="text"
              placeholder=""
              className="mt-1 pl-4 w-[100%] h-[38px] border  bg-transparent rounded-md text-[16px] text-[#8a8686]"
            />
          </label>
        </div>
        <div className="mt-1">
          <label className="mt-4 w-[100%] h-[60px] md:h-[86px] text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[18px] leading-[25px]">
           Decimals
            <input
              value={tokenDecimal}
              onChange={(e) => {
                let value = e.target.value;
                if (/^[0-9 ]*$/.test(value)) {
                  value = value.trimStart();
                  if (value.trim() !== "" && value > 0) {
                    setTokenDecimal(value);
                  } else {
                    setTokenDecimal("");
                  }
                } else {
                  toast.error("Only numbers are allowed.");
                }
              }}
              type="text"
              placeholder=""
              className="mt-1 pl-4 w-[100%] h-[38px] border  bg-transparent rounded-md text-[16px] text-[#8a8686]"
            />
          </label>
        </div>
        <div className="mt-1">
          <label className="mt-4 w-[100%] h-[60px] md:h-[86px] text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[18px] leading-[25px]">
           Amount
            <input
              value={tokenAmount}
              onChange={(e) => {
                let value = e.target.value;
                if (/^[0-9 ]*$/.test(value)) {
                  value = value.trimStart();
                  if (value.trim() !== "" && value > 0) {
                    setTokenAmount(value);
                  } else {
                    setTokenAmount("");
                  }
                } else {
                  toast.error("Only numbers are allowed.");
                }
              }}
              type="text"
              placeholder=""
              className="mt-1 pl-4 w-[100%] h-[38px] border  bg-transparent rounded-md text-[16px] text-[#8a8686]"
            />
          </label>
        </div>
        <div className="mt-1">
          <label className="mt-4 w-[100%] h-[60px] md:h-[86px] text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[18px] leading-[25px]">
            Token Image
            <ImageUploader captureUploadedNftImageFile={captureUploadedNftImageHDFile} 
            imageurlchange={seTokentImageurl}
            />
           
          </label>
        </div>

        {/* metaData fields*/}  
        <div className="flex mt-10 justify-between items-center">
            <div onClick={() => toggleModal()}>
              <Buttons bgColor="black" hover={{textColor:'text-red-600', scale:'scale-110'}} textColor="white" buttonName={"Cancel"} />
            </div>
            <div onClick={() => onClickAddButton()}>
            <Buttons bgColor="white" hover={{textColor:'text-green-600', scale:'scale-110'}} textColor="black" buttonName={"Add"} />
            </div>

            </div>
    
      </form>
      {showModal && (
                    <WarningModal
                      togglewarning={togglewarning}
                      onUpload={handleUpload}
                    />
                  )}
                  {!showModal && Success && <SuccessModal />}
    </div>
  )
}

export default TokenModal