import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import ImageUploader from "./ImageUploader";
import toast from "react-hot-toast";
import YellowButton from "../../components/button/YellowButton";
import imageCompression from "browser-image-compression";
import { v4 as uuidv4 } from "uuid";
import { Growtown_assethandler } from "../../../../declarations/Growtown_assethandler";
import Buttons from "../../Common/Buttons";
import { useAuths } from "../../utils/useAuthClient";

const Modal = (props) => {
  const {
    getAddedNftDetails,
    getUpdatedNftDetails,
    cardDetails,
    type,
    toggleModal,
  } = props;

  const { backendActor } = useAuths();
  const [fetchedNftType, setfetchedNftType] = useState();

  const [nftPrice, setPrice] = useState(0);
  const [nftPrices, setNFTPrices] = useState({})
  // const [totalPrice,setTotalPrice]=useState(0)
  const [nftQuantity, setNftQuantity] = useState('');
  const [nftQuantities, setNftQuantities] = useState({});
  const [newtype, setnewtype] = useState('');

  const convertNftCost = (nftCost) => {
    return nftCost / 100000000
  }

  {/* fetching nft type*/ }
  const fetchNftType = async () => {
    const response = await backendActor.getObjects();
    setfetchedNftType(response)
    console.log('nft Type', response);
  }
  useEffect(() => {
    fetchNftType();
  }, [])




  {/* Handle Quantity */ }
  const handleQuantity = (type, value) => {

    console.log("nftQuantity", value);

    // Update state using functional update to ensure correctness
    setNftQuantities((prevQuantities) => ({
      ...prevQuantities,
      [newtype.type]: value
    }));

    // Ensure `newtype.index` is used correctly for fetching the cost
    const nftCost = convertNftCost(
      Number(fetchedNftType[newtype.index]?.[1]?.nft_type_cost || 0)
    );

    const newPrice = nftCost * value;
    console.log("price=>", newPrice);
    setPrice(newPrice)
    setNFTPrices({ ...nftPrices, [newtype.type]: newPrice })
    console.log('nftPrices', nftPrices)
  };

  const [nftName, setNftName] = useState(
    type === "edit" ? cardDetails.nftName : ""
  );
  const [nftType, setNftType] = useState(
    type === "edit" ? cardDetails.nftType : "Common"
  );

  const [nftDescription, setNftDescription] = useState(
    type === "edit" ? cardDetails.nftDescription : ""
  );
  const [nftImage, setNftImage] = useState(
    type === "edit" ? cardDetails.nftImage : ""
  );

  const [nftcolor, setnftcolor] = useState(
    type === "edit" ? cardDetails.nftcolor : "Golden"
  );
  const [arstistname, setartistName] = useState(
    type === "edit" ? cardDetails.arstistname : ""
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
      nftPrices &&
      nftQuantities &&
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
        nftQuantities,
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

        const reader = new FileReader();
        reader.onloadend = () => setNftImage(reader.result);
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error in NFT file:", error);
      }
    }
  };



  const captureUploadedNftFullImageHDFile = async (files) => {
    const file = files[0];
    if (file) {
      try {
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

        const reader = new FileReader();
        reader.onloadend = () => setNftFullImage(reader.result);
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error in NFT file:", error);
      }
    }
  };


  return (
    <div className="add_new_nft_popup_bg_container w-full sm:w-[70%] shadow-lg lg:w-[50%] mx-4 xl:w-[40%] h-[90%] rounded-xl overflow-y-scroll no-scrollbar p-10 border border-[#50B248]">
      <div className="flex   items-center justify-end">
        <button className="text-[#ffffff] cursor-pointer" onClick={() => toggleModal()}>
          <RxCross2 size={25} />
        </button>
      </div>
      <form className="flex flex-col gap-5">
        <div className="mt-1">
          <label className="mt-4 w-[100%]  sm:h-[86px] text-[#FFFFFF] gap-2 md:gap-4 text-[14px] sm:text-[16px] lg:text-[18px] leading-[25px]">
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
              className="mt-1 pl-4 w-[100%] h-[38px] border  bg-transparent rounded-md text-[16px] text-[#8a8686]"
            />
          </label>
        </div>

        <div className="sm:mt-1 flex flex-col sm:flex-row gap-2 sm:gap-4 md:flex-row md:gap-4 w-full  mb-0">
          <label className="w-full sm:w-1/2 flex flex-col text-[#FFFFFF]  sm:gap-2 text-[14px] sm:text-[16px] lg:text-[18px] leading-[25px]">
            NFT Rarity
            <select
              className=" h-[38px] border  bg-transparent text-[16px] p-2 rounded-md text-[#8a8686]"
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

          <label className=" mt-2 sm:mt-0 w-full sm:w-1/2 flex flex-col text-[#FFFFFF] gap-2 md:gap-2 text-[14px] sm:text-[16px] lg:text-[18px] leading-[25px] ">
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
              className="pl-4 rounded-md h-[38px] border  p-2 bg-transparent text-[16px] text-[#8a8686]"
            />
          </label>
        </div>

        <div className="sm:mt-1 flex flex-col sm:flex-row sm:gap-4 md:flex-row md:gap-4 w-full  mb-0">
          {/* NFT Type Selection */}
          <label className="w-full sm:w-1/2 flex flex-col text-white gap-2 text-[14px] sm:text-[16px] lg:text-[18px] leading-[25px]">
            NFT Type
            <select
              className="h-[38px] border bg-transparent text-[16px] p-2 rounded-md text-[#8a8686]"
              value={newtype?.type || ""}
              onChange={(e) => {
                const selectedIndex = e.target.selectedIndex - 1;
                if (selectedIndex >= 0) {
                  setnewtype({ type: e.target.value, index: selectedIndex });
                  setNftQuantity('')
                  setPrice(0)
                } else {
                  setnewtype(null);
                }
              }}
            >
              <option value="">Select NFT Type</option>
              {fetchedNftType?.map((val, ind) => (
                <option key={ind} value={val[1].nfttype} className="text-[16px] text-[#8a8686]">
                  {val[1].nfttype}
                </option>
              ))}
            </select>
          </label>

          {/* NFT Type Quantity Selection */}
          <label className="w-full sm:w-1/2 flex flex-col text-white gap-2 text-[14px] sm:text-[16px] lg:text-[18px] leading-[25px]">
            NFT Type Quantity
            <select
              className="h-[38px] border bg-transparent text-[16px] p-2 rounded-md text-[#8a8686]"
              value={newtype?.type || ""}
              onChange={(e) => {
                const selectedIndex = e.target.selectedIndex - 1;
                if (selectedIndex >= 0) {
                  setnewtype({ type: e.target.value, index: selectedIndex });
                  setNftQuantity('')
                  setPrice(0)
                } else {
                  setnewtype(null);
                }
              }}
            >
              <option value="">Select NFT Type Quantity</option>
              {fetchedNftType?.map((val, ind) => (
                <option key={ind} value={val[1].nfttype} className="text-[16px] text-[#8a8686]">
                  {val[1].nfttype}
                </option>
              ))}
            </select>
          </label>
        </div>

          {/* price calculation*/}




        <div className="mt-1">
          <label className="w-[100%] h-[60px] md:h-[86px] text-[#FFFFFF] gap-2 md:gap-4 text-[14px] sm:text-[16px] lg:text-[18px] leading-[25px]">
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

        <div className="mt-1">
          <label className="w-[100%] h-[60px] md:h-[86px] text-[#FFFFFF] gap-2 md:gap-4 text-[14px] sm:text-[16px] lg:text-[18px] leading-[25px]">
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
          <label className="w-[100%] h-[60px] md:h-[86px] text-[#FFFFFF] gap-2 md:gap-4 text-[14px] sm:text-[16px] lg:text-[18px] leading-[25px]">
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
          <label className="w-[100%] h-[60px] md:h-[86px] text-[#FFFFFF] gap-2 md:gap-4 text-[14px] sm:text-[16px] lg:text-[18px] leading-[25px]">
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


        <div className="mt-1 flex flex-col sm:flex-row sm:gap-4 md:flex-row md:gap-4 w-full  mb-0">
          <label className="mt-4 sm:mt-0 w-full sm:w-1/2 flex flex-col text-[#FFFFFF] gap-2 md:gap-2 text-[14px] sm:text-[16px] lg:text-[18px] leading-[25px]">
            Quantity:
            <input
              value={nftQuantity}
              onChange={(e) => {
                let value = e.target.value.trim().replace(/^0+/, ""); // Remove leading zeros

                if (!newtype) {
                  toast.error("Please select NFT type");
                  return;
                }

                // Ensure the value is a valid natural number
                if (/^[1-9]\d*$/.test(value)) {
                  setNftQuantity(value);
                  handleQuantity(newtype, value);
                } else {
                  toast.error("Enter a valid natural number greater than 0");
                  setNftQuantity(""); // Reset on invalid input
                }
              }}
              type="number"
              min="1"
              inputMode="numeric"
              placeholder={newtype ? `Enter Quantity of ${newtype.type}` : "Enter Quantity"}
              className="pl-4 rounded-md h-[38px] p-2 border bg-transparent text-[16px] text-[#8a8686]"
            />
          </label>

          <label className="w-full sm:w-1/2 flex flex-col text-[#FFFFFF] gap-2 md:gap-2 text-[14px] sm:text-[16px] lg:text-[18px] leading-[25px]">
            Border Color:
            <select
              className=" h-[38px] border  bg-transparent text-[16px] p-2 rounded-md text-[#8a8686]"
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
         

        <div className="mt-1">
          <label className="mt-[20px] w-[100%] h-[60px] md:h-[86px] text-[#FFFFFF] gap-2 md:gap-4  text-[14px] sm:text-[16px] lg:text-[18px] leading-[25px]">
            Price (in GRC)
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
              className="pl-4 w-[100%] mt-2  h-[38px] border  bg-transparent rounded-md text-[16px] text-[#8a8686]"
            />
          </label>
        </div>
        
        <div className="mt-1">
          <label className="w-[100%] text-[#FFFFFF] gap-2 md:gap-4 text-[14px] sm:text-[16px] lg:text-[18px] leading-[25px]">
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
              className="pl-2 w-[100%] h-[150px] border  bg-transparent rounded-md mt-2 text-[16px] text-[#8a8686]"
              placeholder=""
            />
          </label>
        </div>
        <div className="flex justify-center mt-2 md:mt-3">
          {type === "add" && (
            <div className="flex  justify-center gap-[10%] items-center">
              <div onClick={() => toggleModal()}>
                <Buttons bgColor="black" hover={{ textColor: 'text-red-600', scale: 'scale-110' }} textColor="white" buttonName={"Cancel"} />
              </div>
              <div onClick={() => onClickAddButton()}>
                <Buttons bgColor="white" hover={{ textColor: 'text-green-600', scale: 'scale-110' }} textColor="black" buttonName={"Add"} />
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
