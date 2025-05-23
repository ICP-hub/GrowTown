import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import DropzoneWithUrlInput from "../components/DropzoneWithUrlInput";

import { idlFactory } from '../../../../declarations/Growntown_Backend/Growntown_Backend.did.js';
import { Actor, HttpAgent } from "@dfinity/agent";
import { useSelector } from "react-redux";
import Modal from "./NftModal.jsx";
import NftCardItem from "./NftCardItem.jsx";
import LogoImageUploader from "./LogoImageUploader.jsx";
import { GoPlus } from "react-icons/go";
import { BiPlus } from "react-icons/bi";
import BackButton from "./BackButton.jsx";
import YellowButton from "../../components/button/YellowButton.jsx";
import { useAuths } from "../../utils/useAuthClient.jsx";
import { Principal } from "@dfinity/principal";
import { Opt } from "@dfinity/candid/lib/cjs/idl";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { SkeletonTheme } from "react-loading-skeleton";
import WarningModal from "./WarningModal.jsx";
import SuccessModal from "./SuccessModal.jsx";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";
import Createcollectionloader from "./Createcollectionloader.jsx";
import { Growtown_assethandler } from "../../../../declarations/Growtown_assethandler";
import ToggleSwitch from "./toggleSwitch";
import { IoIosAdd } from "react-icons/io";
import Buttons from "../../Common/Buttons";
import PreviewCard from "../../Common/PreviewCard";

const CreateCollection = () => {
  const navigate = useNavigate();

  const [limit, setLimit] = useState(0);
  const [logo, setLogo] = useState(null);
  const [nfts, setNfts] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [nftRows, setNftRows] = useState([{ id: "", description: "" }]); // Initial row
  const [modal, setModal] = useState(false);
  const [nftCardsList, setNftCardsList] = useState([]);
  const { backendActor, canisterId } = useAuths();

  const [base64String, setBase64String] = useState("");
  const [nftType, setnfttype] = useState("");
  const [nftname, setnftname] = useState("");
  const [nftquantity, setnftquantity] = useState();
  const [nftprice, setnftprice] = useState(0);
  const [nftimage, setnftimage] = useState("");
  const [nftbase64, setnftbase64] = useState("");
  const [nftdescription, setnftdescription] = useState("");
  const [canId, setcanId] = useState();
  const [TokenId, setTokenId] = useState("");
  const [tokenidentifier, setTokenidentifier] = useState("");
  const [canprincipal, setcanpricipal] = useState();
  const [mintimagebase, setmintimagebase] = useState();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [nftcolor, setnftcolor] = useState("");
  const [Success, setsuccess] = useState(false);
  const [done, setDone] = useState(0);
  const [totalnft, settotalnft] = useState();
  const [collectionImageURL, setcollectionImageURL] = useState("");
  const [collectionBloburl, setcollectionBloburl] = useState("");

  const { user } = useSelector((state) => state.auth);
  const principal_id = user;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    NoOfNFT: "",
    collColor: "Green",
    logo: null,
  });
  console.log(formData);
  const [name, setName] = useState(formData.name || "");
  const [description, setDescription] = useState(formData.description || "");
  const [collColor, setCollColor] = useState(formData.collColor || "Green");
  const [Ufile, setUFile] = useState(formData.Ufile || []);
  console.log(description);
  // backendActor?.CanisterActor?.createExtCollection;
  // console.log(createExtCollection);

  const toggleModal = () => {
    setModal(!modal);
    // callCreateExtCollection();
    // createExtData(name, base64String, nfttype);
  };
  const togglewarning = () => {
    setShowModal(!showModal);
    // setWarningModal(!WarningModal);
  };

  const handleAddRow = () =>
    setNftRows([...nftRows, { id: "", description: "" }]);

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...nftRows];
    updatedRows[index][field] = value;
    setNftRows(updatedRows);
  };

  const handleLogoChange = (file) => setLogo(file);

  const createActor = () => {
    const agent = new HttpAgent();
    return Actor.createActor(idlFactory, { agent, canisterId });
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();

    // Form validation checks
    if (!name  || !description  || !Ufile ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    else {
      togglewarning();
    }
  };

  const extractPrincipals = async (response) => {
    try {
      const principalArray = response.map((principalObj) => {
        return principalObj.toText();
      });
      return principalArray;
    } catch (error) {
      console.error("Error extracting principals:", error);
    }
  };

  const handleFiles = async (files) => {
    console.log("Uploaded files:", files);
    setUFile(files);
    setFormData((prev) => ({ ...prev, logo: files }));

    const file = files[0]; // Get the first uploaded file
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          setBase64String(reader.result);
        };

        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error during file compression:", error);
      }
    }
  };




  const UploadedNftImageusingBase64 = async (base64File) => {
    if (Growtown_assethandler) {
      try {
        // console.log(base64File);

        // Generate a unique ID for the image
        const id = Date.now().toString();

        // Convert Base64 string to ArrayBuffer
        const binaryString = atob(base64File.split(",")[1]); // Remove the metadata prefix if present
        const length = binaryString.length;
        const arrayBuffer = new Uint8Array(length);

        for (let i = 0; i < length; i++) {
          arrayBuffer[i] = binaryString.charCodeAt(i);
        }

        // Upload the image to the canister
        const result1 = await Growtown_assethandler?.uploadImg(id, [
          ...arrayBuffer,
        ]);
        console.log(result1);

        // Determine the URL based on the network environment
        const acd = process.env.DFX_NETWORK;
        console.log(acd);

        if (acd === "local") {
          const url = `http://127.0.0.1:4943/?canisterId=${process.env.CANISTER_ID_GROWTOWN_ASSETHANDLER}&imgid=${id}`;
          console.log("NFT URL (local):", url);
          return url;
          // imageurlchange(url);
        } else if (acd === "ic") {
          const url = `https://${process.env.CANISTER_ID_GROWTOWN_ASSETHANDLER}.raw.icp0.io/?imgid=${id}`;
          console.log("NFT URL (IC):", url);
          // imageurlchange(url);
          return url;
        }
      } catch (error) {
        console.error("Error uploading Base64 file:", error);
      }
    }
  };

  const createExtData = async (name, description, collColor, base64String) => {
    let n = nftCardsList.length;
    settotalnft(n);

    try {
      const collectionImageURL = await UploadedNftImageusingBase64(
        base64String
      );
      console.log(collectionImageURL);
      // Check if collectionImageURL is valid

      const metadata = JSON.stringify({
        description,
        collColor,
        collectionImageURL,
      });
      console.log(name, metadata, "calling collection creation");
      const report = await backendActor?.createExtCollection(
        name,
        "collectionBloburl",
        metadata
      );
      console.log(report);
      if (report && Array.isArray(report)) {
        const data = await extractPrincipals(report);
        console.log(data[1]);
        if (data) {
          setcanId(data[1]);
          return data[1];
        } else {
          throw new Error("Create collection is not working");
          toast.error("Create collection is not working");
        }
      } else {
        throw new Error(
          "Unexpected response structure: " + JSON.stringify(report)
        );
        toast.error("Unexpected response structure: " + JSON.stringify(report));
      }
    } catch (error) {
      console.error("Error in createExtData:", error);
      return error;
    }
  };
  console.log(typeof nftprice);
  const mintNFT = async (
    answ,
    nftname,
    nftdescription,
    // nftimage,
    nftquantity,
    nftcolor,
    nftPrice,
    nftType,
    arstistname,
    newtype,
    nftSeason,
    // nftFullImage,
    nftimageHeadHDblob,
    nftimageFullHDblob,
    nftimageHeadSDblob,
    nftimageFullSDblob
  ) => {
    try {
      const imageurl1 = await UploadedNftImageusingBase64(nftimageHeadHDblob);
      const imageurl2 = await UploadedNftImageusingBase64(nftimageFullHDblob);
      var imageurl3 = "";
      if (nftimageHeadSDblob) {
        imageurl3 = await UploadedNftImageusingBase64(nftimageHeadSDblob);
      }
      var imageurl4 = "";
      if (nftimageFullSDblob) {
        imageurl4 = await UploadedNftImageusingBase64(nftimageFullSDblob);
      }

      console.log("in mint", answ);
      const principalString = answ;
      const principal = Principal.fromText(principalString);
      const date = new Date();
      const formattedDate = date.toISOString();

      const metadata = JSON.stringify({
        nftType,
        standard: "EXT V2",
        chain: "ICP",
        contractAddress: canisterId,
        nftcolor,
        date: formattedDate,
        arstistname,
        newtype,
        nftSeason,
        nftquantity,
        // nftFullImage,
        imageurl1,
        imageurl2,
        imageurl3,
        imageurl4,
      });

      const metadataContainer = {
        json: metadata,
      };
      console.log(principal, nftname, nftdescription, nftimage, nftquantity);

      const es8_price = parseInt(parseFloat(nftPrice) * 100000000);
      setDone((done) => done + 1);
      const result = await backendActor?.mintExtNonFungible3(
        principal,
        nftname,
        nftdescription,
        "thumbnail",
        "imageurl1",
        metadataContainer ? [metadataContainer] : [],
        Number(nftquantity),
        es8_price ? [es8_price] : []
      );
     
      console.log(result, "Collection mint data");
      return result;
  
    } catch (error) {
      console.error("Error minting Collection:", error);
      toast.error("Error minting Collection");
      return error; // Return error
    }
  };



  const getAddedNftDetails = async (nftDetails) => {
    setNftCardsList([...nftCardsList, nftDetails]);

    setnfttype(nftDetails.nftType);
    setnftname(nftDetails.nftName);
    setnftquantity(nftDetails.nftQuantity);
    setnftprice(nftDetails.nftPrice);
    setnftdescription(nftDetails.nftDescription);
    setnftimage(nftDetails.nftImage);
    setnftcolor(nftDetails.nftcolor);
   
  };

  const getUpdatedNftDetails = (nftDetails) => {
    console.log("updated card details", nftDetails);
    const id = nftDetails.nftId;
    const updatedList = nftCardsList.map((eachCard) => {
      if (id === eachCard.nftId) {
        // console.log(id, "  ", eachCard.nftId);
        return nftDetails;
      }
      return eachCard;
    });
    setNftCardsList(updatedList);

    setnfttype(nftDetails.nftType);
    setnftname(nftDetails.nftName);
    setnftquantity(nftDetails.nftQuantity);
    setnftprice(nftDetails.nftPrice);
    setnftdescription(nftDetails.nftDescription);
    setnftimage(nftDetails.nftImage);
    setnftcolor(nftDetails.nftcolor);
  };

  const deleteNft = (nftId) => {
    const updatedNFtList = nftCardsList.filter(
      (eachNft) => eachNft.nftId !== nftId
    );
    setNftCardsList(updatedNFtList);
  };

  const handleUpload = () => {
    console.log("upload clicked");
    togglewarning();
    finalcall();
  };

  const finalcall = async () => {
    setLoading(true);
    let hasError = false;
    let errorShown = false;
    try {
      toast("Creating Collection, Please Wait! ...", {
        icon: "⚠️",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      const answ = await createExtData(
        name,
        description,
        collColor,
        base64String
      );
      console.log(answ);

      if (answ instanceof Error) {
        hasError = true;
        console.log("inside if of haserror");
        if (!errorShown) {
          toast.error("Error in creating collection: " + answ);
          errorShown = true;
          console.log("inside if of errorshown");
        }
        return answ;
      }
      console.log(hasError, errorShown);
      setcanId(answ);

      toast("Collection Minting, Please Wait! ...", {
        icon: "⚠️",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      if (nftCardsList && nftCardsList.length > 0 && !hasError) {
        for (let val of nftCardsList) {
          try {
            const mintResult = await mintNFT(
              answ,
              val.nftName,
              val.nftDescription,

              val.nftQuantity,
              val.nftcolor,
              val.nftPrice,
              val.nftType,
              val.arstistname,
              val.newtype,
              val.nftSeason,

              val.nftImage,
              val.nftFullImage,
              val.nftImageSD,
              val.nftFullImageSD
            );
            console.log(mintResult, "mintResult");
            if (mintResult instanceof Error) {
              hasError = true;
              if (!errorShown) {
                toast.error(
                  "Error in minting Collection inside final call: " +
                  mintResult.message
                );
                errorShown = true;
              }

              throw mintResult;
            } else {
              setsuccess(!Success);
            }
          } catch (mintError) {
            hasError = true;
            if (!errorShown) {
              console.error(
                "Error in minting Collection inside final call: ",
                mintError
              );
              toast.error(
                "Error in minting Collection inside final call: " + mintError.message
              );
              errorShown = true;
            }
            break;
          }
        }
      }
      if (!hasError) {
        setTimeout(() => {
          navigate("/admin/collection");
        }, 1000);
      }
    } catch (error) {
      if (!errorShown) {
        console.error("Error in final call: ", error);
        toast.error("Error in final call: " + error);
        errorShown = true;
      }
    } finally {
      // await getListing(canId);
      setLoading(false);
    }
  };



  const [currentItemCardDetails, updateCurrentItemDetails] = useState({});
  const [type, updateType] = useState("add");

  const onClickEdit = (nftId) => {
    const nftDetails = nftCardsList.filter(
      (eachNft) => eachNft.nftId === nftId
    );
    updateCurrentItemDetails(nftDetails[0]);
    updateType("edit");
    toggleModal();
  };
 
  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <div className=" overflow-y-scroll  h-screen no-scrollbar  no-scroll  md:w-full px-4 sm:px-8 md:px-16 pt-10 ">
        {/* <Createcollectionloader done={done} total={total} /> */}
        {loading ? (
          <Createcollectionloader done={done} total={totalnft} message={' Collection'} />
        ) : (
   
          <div className="w-full">
            <div className="flex items-center">
              <BackButton />
              <h1 className=" text-2xl lg:text-3xl ml-2 lg:ml-5 text-white ">Create Collection</h1>
            </div>

         
              
            <div className="grid grid-flow-col grid-cols-12 ">
              <div className="hidden xl:block my-8  mr-4  rounded-xl col-span-4"> 
                <PreviewCard colName={name} colImage={Ufile} typeColor={collColor} description={description} />
                 </div>
            <div className="my-8 col-span-12 border border-[#50B248] p-4 lg:px-8 rounded-xl  xl:col-span-8 ">
              <div className="flex flex-col md:flex-row gap-x-8 items-center  w-full  px-1 py-2 text-[#FFFFFF] justify-start rounded-md">
                <div className="flex flex-col w-full gap-2 mt-4 space-y-4">
                  {/* Collection Name and Max Limit */}
                  <div className="flex flex-col items-center justify-center w-full sm:flex-row sm:gap-4 md:flex-row md:gap-4">

                    <div className="flex flex-col w-full sm:w-1/2 pr-2">
                      <div className="flex flex-col ">
                        <label className="text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px] mb-2">
                          Collection Name
                        </label>
                        <input
                          value={name}
                          onChange={(e) => {
                            let value = e.target.value;
                            if (/^[a-zA-Z0-9 ]*$/.test(value)) {
                              value = value.trimStart();
                              if (value.trim() !== "") {
                                setName(value);
                                setFormData((prev) => ({ ...prev, name: value }));
                              } else {
                                setName("");
                              }
                            } else {
                              toast.error(
                                "Only letters and numbers are allowed."
                              );
                            }
                          }}
                          type="text"
                          placeholder=""
                          className="pl-4 p-4 sm:p-0 sm:pl-4 rounded-md bg-transparent border  h-[30px] md:h-[45px] w-full"
                        />
                      </div>

                      <div className="flex mt-[25px] flex-col w-full">
                      <label className="w-full flex flex-col text-[#FFFFFF] gap-2 md:gap-2 text-[14px] md:text-[18px] leading-[25px]">
                    Type color:
                    <select
                      className=" h-[38px] bg-[#29292C] text-[16px] p-2 rounded-md border  "
                      // value={collColor}
                      // onChange={(e) => setCollColor(e.target.value)}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCollColor(value);
                        setFormData((prev) => ({ ...prev, collColor: value }));
                      }}
                    >
                      <option
                        value="Green"
                        className="text-[16px] text-[#8a8686]"
                      >
                        Green
                      </option>
                      <option
                        value="Blue"
                        className="text-[16px] text-[#8a8686]"
                      >
                        Blue
                      </option>
                      <option
                        value="Red"
                        className="text-[16px] text-[#8a8686]"
                      >
                        Red
                      </option>
                      <option
                        value="Yellow"
                        className="text-[16px] text-[#8a8686]"
                      >
                        Yellow
                      </option>
                    </select>
                  </label>
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2 flex pl-2 flex-col sm:mt-0">
                      <label className="w-full flex flex-col mt-[20px] sm:mt-0">
                        <span className="text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px] mb-2">
                          Collection Image
                        </span>
                        <LogoImageUploader
                          captureUploadedbloburl={handleFiles}

                        // captureuploadedurl={setcollectionImageURL}
                        />
                      </label>
                    </div>
                  </div>
                  {/* Description */}
                  <label className="mt-[25px] w-[100%] flex flex-col text-[#FFFFFF] gap-2 text-[14px] md:text-[20px] leading-[25px]">
                    Description:
                    <textarea
                      value={description}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Check if the value is not just whitespace
                        if (value.trim() !== "") {
                          setDescription(value);
                          setFormData((prev) => ({
                            ...prev,
                            description: value,
                          }));
                        } else {
                          setDescription(""); // or handle as needed
                        }
                      }}
                      className="pl-4 w-[100%] h-[150px]  bg-transparent  border rounded-md resize-none p-2"
                      rows="8"
                      placeholder=""
                    />
                  </label>

   


                  {/* Form Buttons */}
                  <div className="flex  justify-center md:justify-around gap-[14%] w-[100%] mt-[10px]  pb-8 sm:mb-0 mx-auto">
                    <div
                      type="button"
                      onClick={() => navigate(-1)}
                      className="w-[30%] mt-10 mr-4 sm:w-[25%] md:w-[15%] h-[43px] text-[#FFFFFF] "
                    >
                      <Buttons buttonName={"Cancel"} textColor="white" bgColor="#242426" />
                    </div>

                    <div onClick={handleSubmit} className="mt-10 ml-4">
                      <Buttons bgColor="white" textColor="black" buttonName={"Create"} />
                    </div>

                  </div>

                  {showModal && (
                    <WarningModal
                      togglewarning={togglewarning}
                      onUpload={handleUpload}
                    />
                  )}
                  {!showModal && Success && <SuccessModal />}

                </div>
              </div>
            </div>
            </div>
          </div>
        )}
      </div>
    </SkeletonTheme>
  );
};

export default CreateCollection;
