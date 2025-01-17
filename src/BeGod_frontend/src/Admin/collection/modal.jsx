import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import ImageUploader from "./ImageUploader";
import toast from "react-hot-toast";
import YellowButton from "../../components/button/YellowButton";
import imageCompression from "browser-image-compression";
import { v4 as uuidv4 } from "uuid";
import { BeGod_assethandler } from "../../../../declarations/BeGod_assethandler";
import Buttons from "../../Common/Buttons";

const Modal = (props) => {
  const {
    getAddedNftDetails,
    getUpdatedNftDetails,
    cardDetails,
    type,
    toggleModal,
  } = props;
  // console.log(cardDetails)
  // console.log("type",type)
  // const [nftId, setNftId] = useState("");
  const [nftName, setNftName] = useState(
    type === "edit" ? cardDetails.nftName : ""
  );
  const [nftType, setNftType] = useState(
    type === "edit" ? cardDetails.nftType : "Common"
  );
  const [nftQuantity, setNftQuantity] = useState(
    type === "edit" ? cardDetails.nftQuantity : ""
  );
  const [nftPrice, setPrice] = useState(
    type === "edit" ? cardDetails.nftPrice : ""
  );
  const [nftDescription, setNftDescription] = useState(
    type === "edit" ? cardDetails.nftDescription : ""
  );
  const [nftImage, setNftImage] = useState(
    type === "edit" ? cardDetails.nftImage : ""
  );
  // const [nftImageURL, setNftImageURL] = useState(
  //   type === "edit" ? cardDetails.nftImageURL : ""
  // );
  const [nftcolor, setnftcolor] = useState(
    type === "edit" ? cardDetails.nftcolor : "Golden"
  );
  const [arstistname, setartistName] = useState(
    type === "edit" ? cardDetails.arstistname : ""
  );
  const [newtype, setnewtype] = useState(
    type === "edit" ? cardDetails.newtype : "Quest"
  );
  const [nftSeason, setnftSeason] = useState(
    type === "edit" ? cardDetails.nftSeason : "Golden Age"
  );

  const [nftFullImage, setNftFullImage] = useState(
    type === "edit" ? cardDetails.nftFullImage : ""
  );
  const [nftFullImageSD, setNftFullImageSD] = useState(
    type === "edit" ? cardDetails.nftFullImageSD : ""
  );
  const [nftImageSD, setNftImageSD] = useState(
    type === "edit" ? cardDetails.nftImageSD : ""
  );

  // const [nftFullImageURL, setNftFullImageURL] = useState("");

  const [hideImageUpload, updateHideImageUploadStatus] = useState(false);

  const [imageurl1, setimageurl1] = useState(
    type === "edit" ? cardDetails.imageurl1 : ""
  );
  const [imageurl2, setimageurl2] = useState(
    type === "edit" ? cardDetails.imageurl2 : ""
  );
  const [imageurl3, setimageurl3] = useState(
    type === "edit" ? cardDetails.imageurl3 : ""
  );
  const [imageurl4, setimageurl4] = useState(
    type === "edit" ? cardDetails.imageurl4 : ""
  );

  const onClickAddButton = () => {
    // event.preventDefault();
    if (nftPrice == 0) {
      toast.error("Enter the price greater than 0");
    } else if (nftQuantity > 150) {
      toast.error("Enter the Quantity less than 150");
    } else if (
      nftName &&
      nftType &&
      nftQuantity &&
      nftPrice != 0 &&
      nftDescription &&
      nftImage &&
      // nftImageURL &&
      nftcolor &&
      // arstistname &&
      newtype &&
      nftSeason &&
      nftFullImage &&
      imageurl1 &&
      imageurl2
    ) {
      const nftDetails = {
        nftId: uuidv4(),
        nftName,
        nftType,
        nftQuantity,
        nftImage,
        // nftImageURL,
        nftPrice,
        nftDescription,
        nftcolor,
        arstistname,
        newtype,
        nftSeason,
        nftFullImage,
        nftFullImageSD,
        nftImageSD,
        imageurl1,
        imageurl2,
        imageurl3,
        imageurl4,
      };
      console.log("nft details", nftDetails);
      getAddedNftDetails(nftDetails);
      toggleModal();
      toast.success("Card updated!");
    } else {
      toast.error("Enter All NFT Card Details");
    }
  };
  const onClickSaveButton = () => {
    // event.preventDefault();
    if (nftPrice == 0) {
      toast.error("Enter the price greater than 0");
    } else if (
      nftName &&
      nftType &&
      nftQuantity &&
      nftPrice &&
      nftDescription &&
      nftImage &&
      // nftImageURL &&
      nftcolor &&
      // arstistname &&
      newtype &&
      nftSeason &&
      nftFullImage &&
      imageurl1 &&
      imageurl2
    ) {
      const nftDetails = {
        nftId: cardDetails.nftId,
        nftName,
        nftType,
        nftQuantity,
        nftImage,
        // nftImageURL,
        nftPrice,
        nftDescription,
        nftcolor,
        arstistname,
        newtype,
        nftSeason,
        nftFullImage,
        nftFullImageSD,
        nftImageSD,
        imageurl1,
        imageurl2,
        imageurl3,
        imageurl4,
      };
      console.log("nft details", nftDetails);
      getUpdatedNftDetails(nftDetails);
      toggleModal();
      toast.success("Card updated!");
    } else {
      toast.error("Enter All NFT Card Details");
    }
  };

  const captureUploadedNftImageHDFile = async (files) => {
    const file = files[0];
    if (file) {
      try {
        // let options = {
        //   maxSizeMB: 0.06,
        //   maxWidthOrHeight: 300,
        //   useWebWorker: true,
        // };
        // let compressedFile = await imageCompression(file, options);

        // while (compressedFile.size > 60 * 1024) {
        //   options.maxSizeMB *= 0.9;
        //   compressedFile = await imageCompression(file, options);
        // }

        // console.log("Compressed file size:", compressedFile.size);

        const reader = new FileReader();
        reader.onloadend = () => setNftImage(reader.result);
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error in NFT file:", error);
      }
    }
  };

  // const captureUploadedNftImage = (pic) => {
  //   setNftImageURL(pic);
  //   // console.log(nftImageURL);
  //   // console.log("img", files);
  // };

  const captureUploadedNftFullImageHDFile = async (files) => {
    const file = files[0];
    if (file) {
      try {
        // let options = {
        //   maxSizeMB: 0.06,
        //   maxWidthOrHeight: 200,
        //   useWebWorker: true,
        // };
        // let compressedFile = await imageCompression(file, options);

        // while (compressedFile.size > 60 * 1024) {
        //   options.maxSizeMB *= 0.9;
        //   compressedFile = await imageCompression(file, options);
        // }

        // console.log("Compressed file size:", compressedFile.size);

        const reader = new FileReader();
        reader.onloadend = () => setNftFullImage(reader.result);
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error in NFT file:", error);
      }
    }
  };

  const captureUploadedNftImageSDFile = async (files) => {
    const file = files[0];
    if (file) {
      try {
        // let options = {
        //   maxSizeMB: 0.06,
        //   maxWidthOrHeight: 300,
        //   useWebWorker: true,
        // };
        // let compressedFile = await imageCompression(file, options);

        // while (compressedFile.size > 60 * 1024) {
        //   options.maxSizeMB *= 0.9;
        //   compressedFile = await imageCompression(file, options);
        // }

        // console.log("Compressed file size:", compressedFile.size);

        const reader = new FileReader();
        reader.onloadend = () => setNftImageSD(reader.result);
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error in NFT file:", error);
      }
    }
  };

  const captureUploadedNftFullImageSDFile = async (files) => {
    const file = files[0];
    if (file) {
      try {
        // let options = {
        //   maxSizeMB: 0.06,
        //   maxWidthOrHeight: 200,
        //   useWebWorker: true,
        // };
        // let compressedFile = await imageCompression(file, options);

        // while (compressedFile.size > 60 * 1024) {
        //   options.maxSizeMB *= 0.9;
        //   compressedFile = await imageCompression(file, options);
        // }

        // console.log("Compressed file size:", compressedFile.size);

        const reader = new FileReader();
        reader.onloadend = () => setNftFullImage(reader.result);
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error in NFT file:", error);
      }
    }
  };

  // const captureUploadedNftFullImage = (pic) => {
  //   setNftFullImageURL(pic);
  //   // console.log(nftFullImageURL);
  //   // console.log("img", files);
  // };
  // const value = () => {
  //   // console.group("image 3 and 4 called");
  // };
  // // console.log(nftFullImage, nftFullImageURL);

  return (
    <div className="add_new_nft_popup_bg_container">
      <div className="flex items-center justify-end">
        <button className="text-[#ffffff]" onClick={() => toggleModal()}>
          <RxCross2 size={25} />
        </button>
      </div>
      <form className="flex flex-col gap-5">
        <div className="mt-1">
          <label className="mt-4 w-[100%] h-[60px] md:h-[86px] text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[18px] leading-[25px]">
            NFT Name
            <input
              value={nftName}
              onChange={(e) => {
                let value = e.target.value;
                if (/^[a-zA-Z0-9 ]*$/.test(value)) {
                  value = value.trimStart();
                  if (value.trim() !== "") {
                    setNftName(value);
                  } else {
                    setNftName("");
                  }
                } else {
                  toast.error("Only letters and numbers are allowed.");
                }
              }}
              type="text"
              placeholder=""
              className="mt-1 pl-4 w-[100%] h-[38px] border-2 border-[#424242] bg-transparent rounded-md text-[16px] text-[#8a8686]"
            />
          </label>
        </div>

        <div className="mt-1 flex flex-col sm:flex-row sm:gap-4 md:flex-row md:gap-4 w-full h-[120px] md:h-[60px] mb-0">
          <label className="w-full sm:w-1/2 flex flex-col text-[#FFFFFF] gap-2 md:gap-2 text-[14px] md:text-[18px] leading-[25px]">
            NFT Rarity
            <select
              className=" h-[38px] border-2 border-[#424242] bg-transparent text-[16px] p-2 rounded-md text-[#8a8686]"
              value={nftType}
              onChange={(e) => setNftType(e.target.value)}
            >
              <option value="Divine" className="text-[16px] text-[#8a8686]">
                Divine
              </option>
              <option value="Mythical" className="text-[16px] text-[#8a8686]">
                Mythical
              </option>
              <option value="Rare" className="text-[16px] text-[#8a8686]">
                Rare
              </option>
              <option value="Uncommon" className="text-[16px] text-[#8a8686]">
                Uncommon
              </option>
              <option value="Common" className="text-[16px] text-[#8a8686]">
                Common
              </option>
              <option value="Promo" className="text-[16px] text-[#8a8686]">
                Promo
              </option>
              <option value="Assets" className="text-[16px] text-[#8a8686]">
                Assets
              </option>
            </select>
          </label>

          <label className="w-full sm:w-1/2 flex flex-col text-[#FFFFFF] gap-2 md:gap-2 text-[14px] md:text-[18px] leading-[25px] ">
            Artist Name (Optional)
            <input
              value={arstistname}
              onChange={(e) => {
                let value = e.target.value;
                if (/^[a-zA-Z0-9 ]*$/.test(value)) {
                  value = value.trimStart();
                  if (value.trim() !== "") {
                    setartistName(value);
                  } else {
                    setartistName("");
                  }
                } else {
                  toast.error("Only letters and numbers are allowed.");
                }
              }}
              type="text"
              placeholder=""
              className="pl-4 rounded-md h-[40px] border-2 border-[#424242] p-2 bg-transparent text-[16px] text-[#8a8686]"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:gap-4 md:flex-row md:gap-4 w-full h-[120px] md:h-[60px] mb-0">
          <label className="w-full sm:w-1/2 flex flex-col text-[#FFFFFF] gap-2 md:gap-2 text-[14px] md:text-[18px] leading-[25px]">
            NFT Type
            <select
              className=" h-[38px] border-2 border-[#424242] bg-transparent text-[16px] p-2 rounded-md text-[#8a8686]"
              value={newtype}
              onChange={(e) => setnewtype(e.target.value)}
            >
              <option value="Quest" className="text-[16px] text-[#8a8686]">
                Quest
              </option>
              <option value="Char" className="text-[16px] text-[#8a8686]">
                Char
              </option>
              <option value="Item" className="text-[16px] text-[#8a8686]">
                Item
              </option>
              <option value="Asset" className="text-[16px] text-[#8a8686]">
                Booster
              </option>
            </select>
          </label>

          <label className="w-full sm:w-1/2 flex flex-col text-[#FFFFFF] gap-2 md:gap-2 text-[14px] md:text-[18px] leading-[25px]">
            Quantity:
            <input
              value={nftQuantity}
              onChange={(e) => {
                const value = e.target.value;
                // Check if value is a positive integer (natural number)
                if (/^[1-9][0-9]*$/.test(value)) {
                  setNftQuantity(value);
                } else {
                  toast.error("Enter a valid natural number greater than 0");
                  setNftQuantity("");
                }
              }}
              type="number"
              min="1"
              pattern="[1-9][0-9]*"
              placeholder=""
              className="pl-4 rounded-md h-[38px] p-2 border-2 border-[#424242] bg-transparent text-[16px] text-[#8a8686]"
            />
          </label>
        </div>

        <div className="mt-3">
          <label className="w-[100%] h-[60px] md:h-[86px] text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[18px] leading-[25px]">
            Head Image
            {type === "add" || hideImageUpload ? (
              <ImageUploader
                // captureUploadedNftImage={captureUploadedNftImage}
                captureUploadedNftImageFile={captureUploadedNftImageHDFile}
                imageurlchange={setimageurl1}
              />
            ) : (
              <div className="relative w-[50px] h-[50px] md:h-[70px] m-0">
                <img
                  src={nftImage}
                  alt="Selected"
                  className="object-cover w-full h-full rounded-lg"
                />
                <button
                  onClick={() => updateHideImageUploadStatus(true)}
                  className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 transform translate-x-1/2 -translate-y-1/2 bg-white rounded-full"
                >
                  <RxCross2 className="text-black" size={15} />
                </button>
              </div>
            )}
          </label>
        </div>

        <div className="mt-2">
          <label className="w-[100%] h-[60px] md:h-[86px] text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[18px] leading-[25px]">
            Full Image
            {type === "add" || hideImageUpload ? (
              <ImageUploader
                // captureUploadedNftImage={captureUploadedNftFullImage}
                captureUploadedNftImageFile={captureUploadedNftFullImageHDFile}
                imageurlchange={setimageurl2}
              />
            ) : (
              <div className="relative w-[50px] h-[50px] md:h-[70px] m-0">
                <img
                  src={nftFullImage}
                  alt="Selected"
                  className="object-cover w-full h-full rounded-lg"
                />
                <button
                  onClick={() => updateHideImageUploadStatus(true)}
                  className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 transform translate-x-1/2 -translate-y-1/2 bg-white rounded-full"
                >
                  <RxCross2 className="text-black" size={15} />
                </button>
              </div>
            )}
          </label>
        </div>

        <div className="mt-1">
          <label className="w-[100%] h-[60px] md:h-[86px] text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[18px] leading-[25px]">
            Head HD Image (Optional)
            {type === "add" || hideImageUpload ? (
              <ImageUploader
                // captureUploadedNftImage={value}
                captureUploadedNftImageFile={captureUploadedNftImageSDFile}
                imageurlchange={setimageurl3}
              />
            ) : nftImageSD ? ( // Check if nftImageSD is available
              <div className="relative w-[50px] h-[50px] md:h-[70px] m-0">
                <img
                  src={nftImageSD}
                  alt="Selected"
                  className="object-cover w-full h-full rounded-lg"
                />
                <button
                  onClick={() => updateHideImageUploadStatus(true)}
                  className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 transform translate-x-1/2 -translate-y-1/2 bg-white rounded-full"
                >
                  <RxCross2 className="text-black" size={15} />
                </button>
              </div>
            ) : (
              <ImageUploader
                // captureUploadedNftImage={value}
                captureUploadedNftImageFile={captureUploadedNftImageSDFile}
                imageurlchange={setimageurl3}
              />
            )}
          </label>
        </div>

        <div className="mt-1">
          <label className="w-[100%] h-[60px] md:h-[86px] text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[18px] leading-[25px]">
            Full HD Image (Optional)
            {type === "add" || hideImageUpload ? (
              <ImageUploader
                // captureUploadedNftImage={value}
                captureUploadedNftImageFile={captureUploadedNftFullImageSDFile}
                imageurlchange={setimageurl4}
              />
            ) : nftFullImageSD ? ( // Check if nftFullImageSD is available
              <div className="relative w-[50px] h-[50px] md:h-[70px] m-0">
                <img
                  src={nftFullImageSD}
                  alt="Selected"
                  className="object-cover w-full h-full rounded-lg"
                />
                <button
                  onClick={() => updateHideImageUploadStatus(true)}
                  className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 transform translate-x-1/2 -translate-y-1/2 bg-white rounded-full"
                >
                  <RxCross2 className="text-black" size={15} />
                </button>
              </div>
            ) : (
              <ImageUploader
                // captureUploadedNftImage={value}
                captureUploadedNftImageFile={captureUploadedNftFullImageSDFile}
                imageurlchange={setimageurl4}
              />
            )}
          </label>
        </div>

        <div className="mt-1 flex flex-col sm:flex-row sm:gap-4 md:flex-row md:gap-4 w-full h-[120px] md:h-[60px] mb-0">
          <label className="w-full sm:w-1/2 flex flex-col text-[#FFFFFF] gap-2 md:gap-2 text-[14px] md:text-[18px] leading-[25px]">
            NFT Season:
            <select
              className=" h-[38px] border-2 border-[#424242] bg-transparent text-[16px] p-2 rounded-md text-[#8a8686]"
              value={nftSeason}
              onChange={(e) => setnftSeason(e.target.value)}
            >
              <option
                value="Origins/Stone Age"
                className="text-[16px] text-[#8a8686]"
              >
                Origins/Stone Age
              </option>
              <option value="Golden Age" className="text-[16px] text-[#8a8686]">
                Golden Age
              </option>
              <option value="Silver Age" className="text-[16px] text-[#8a8686]">
                Silver Age
              </option>
              <option value="Bronze Age" className="text-[16px] text-[#8a8686]">
                Bronze Age
              </option>
            </select>
          </label>

          <label className="w-full sm:w-1/2 flex flex-col text-[#FFFFFF] gap-2 md:gap-2 text-[14px] md:text-[18px] leading-[25px]">
            Border Color:
            <select
              className=" h-[38px] border-2 border-[#424242] bg-transparent text-[16px] p-2 rounded-md text-[#8a8686]"
              value={nftcolor}
              onChange={(e) => setnftcolor(e.target.value)}
            >
              <option value="golden" className="text-[16px] text-[#8a8686]">
                Golden
              </option>
              <option value="silver" className="text-[16px] text-[#8a8686]">
                Silver
              </option>
              <option value="bronze" className="text-[16px] text-[#8a8686]">
                Bronze
              </option>
            </select>
          </label>
        </div>

        <div className="mt-4">
          <label className="mt-[20px] w-[100%] h-[60px] md:h-[86px] text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]">
            Price (in ICP)
            <input
              value={nftPrice}
              onChange={(e) => {
                const value = e.target.value;
                if (value < 0) {
                  toast.error("Enter a valid natural number greater than 0");
                  setPrice("");
                } else {
                  setPrice(value);
                }
              }}
              type="number"
              min="1"
              className="pl-4 w-[100%] mt-2  h-[38px] border-2 border-[#424242] bg-transparent rounded-md text-[16px] text-[#8a8686]"
            />
          </label>
        </div>

        <div className="mt-1">
          <label className="w-[100%] text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]">
            NFT's Description
            <textarea
              value={nftDescription}
              onChange={(e) => {
                const value = e.target.value;

                if (value.trim() !== "") {
                  setNftDescription(value);
                } else {
                  setNftDescription("");
                }
              }}
              rows={5}
              className="pl-2 w-[100%] h-[150px] border-2 border-[#424242] bg-transparent rounded-md mt-2 text-[16px] text-[#8a8686]"
              placeholder=""
            />
          </label>
        </div>
        <div className="flex justify-center mt-2 md:mt-3">
          {type === "add" && (
            <div className="flex  justify-center gap-[10%] md:gap-[20%] items-center">
            <div onClick={() => toggleModal()}>
              <Buttons bgColor="#333333" textColor="white" buttonName={"Cancel"} />
            </div>
            <div onClick={() => onClickAddButton()}>
              <Buttons bgColor="white" textColor="black" buttonName={"Add"} />
            </div>

            </div>
          )}
          {type === "edit" && (
            <div>
            <div methodName={() => onClickSaveButton()}>
              Save
            </div>
            </div>
          )}
          {/* <button

            type="submit"
            className="h-[38px] w-[150px] border-0 bg-[#FCD37B] text-[#000000] rounded-sm"
            onClick={onClickAddButton}
          >
            ADD
          </button> */}
        </div>
      </form>
    </div>
  );
};

export default Modal;
