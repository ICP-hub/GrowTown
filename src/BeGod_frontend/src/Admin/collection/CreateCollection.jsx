import React, { useEffect, useState } from "react";
import { AddIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import DropzoneWithUrlInput from "../components/DropzoneWithUrlInput";
import { Switch } from "@chakra-ui/react";
import { idlFactory } from "../../../../declarations/BeGod_backend/BeGod_backend.did.js";
import { canisterId } from "../../../../declarations/BeGod_backend";
import { Actor, HttpAgent } from "@dfinity/agent";
import { useSelector } from "react-redux";
import Modal from "./modal.jsx";
import NftCardItem from "./NftCardItem.jsx";
import LogoImageUploader from "./LogoImageUploader.jsx";
import { GoPlus } from "react-icons/go";
import { BiPlus } from "react-icons/bi";
import BackButton from "./BackButton.jsx";
import YellowButton from "../../components/button/YellowButton.jsx";
import { useAuth } from "../../utils/useAuthClient.jsx";
import { Principal } from "@dfinity/principal";
import { Opt } from "@dfinity/candid/lib/cjs/idl.js";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { SkeletonTheme } from "react-loading-skeleton";
import WarningModal from "./WarningModal.jsx";
import SuccessModal from "./SuccessModal.jsx";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";
import Createcollectionloader from "./Createcollectionloader.jsx";
import { BeGod_assethandler } from "../../../../declarations/BeGod_assethandler";

const CreateCollection = () => {
  const navigate = useNavigate();

  const [limit, setLimit] = useState(0);
  const [logo, setLogo] = useState(null);
  const [nfts, setNfts] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [nftRows, setNftRows] = useState([{ id: "", description: "" }]); // Initial row
  const [modal, setModal] = useState(false);
  const [nftCardsList, setNftCardsList] = useState([]);
  const { backendActor, canisterId } = useAuth();

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
    if (!name || !description || !Ufile || nftCardsList.length === 0) {
      toast.error("Please fill in all required fields.");
      return;
    }
    // // Ensure at least one NFT card is added
    // else if (nftCardsList.length === 0) {
    //   toast.error("Please add at least one NFT card.");
    //   return;
    // }
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
        // let options = {
        //   maxSizeMB: 0.06, // 60KB
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
        reader.onloadend = () => {
          setBase64String(reader.result);
        };

        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error during file compression:", error);
      }
    }
  };
  // const handleFiles = async (bloburl) => {
  //   setcollectionBloburl(bloburl);
  //   console.log(bloburl);
  //   // const url = await UploadedNftImage(bloburl);
  //   // console.log(url);
  // };
  // const UploadedNftImage = async (captureImage) => {
  //   if (!BeGod_assethandler) {
  //     throw new Error("BeGod_assethandler is not initialized.");
  //   }

  //   try {
  //     if (!captureImage) {
  //       throw new Error("captureImage is not provided or invalid.");
  //     }

  //     // Handle URL or Blob
  //     let blob;
  //     if (typeof captureImage === "string") {
  //       const response = await fetch(captureImage);
  //       blob = await response.blob();
  //     } else if (captureImage instanceof Blob) {
  //       blob = captureImage;
  //     } else {
  //       throw new Error("captureImage must be a valid URL or Blob.");
  //     }

  //     // Convert Blob to ArrayBuffer
  //     const arrayBuffer = await blob.arrayBuffer();

  //     // Upload Image
  //     const id = Date.now().toString();
  //     const result1 = await BeGod_assethandler.uploadImg(id, [
  //       ...new Uint8Array(arrayBuffer),
  //     ]);
  //     console.log(result1);

  //     // Environment Variables
  //     const acd = process.env.DFX_NETWORK;
  //     const canisterId = process.env.CANISTER_ID_BEGOD_ASSETHANDLER;

  //     if (!acd || !canisterId) {
  //       throw new Error(
  //         "Environment variables are missing: DFX_NETWORK or CANISTER_ID_BEGOD_ASSETHANDLER."
  //       );
  //     }

  //     // Generate and Return URL
  //     let url;
  //     if (acd === "local") {
  //       url = `http://127.0.0.1:4943/?canisterId=${canisterId}&imgid=${id}`;
  //     } else if (acd === "ic") {
  //       url = `https://${canisterId}.raw.icp0.io/?imgid=${id}`;
  //     } else {
  //       throw new Error("Invalid DFX_NETWORK value.");
  //     }

  //     console.log("NFT URL:", url);
  //     return url;
  //   } catch (error) {
  //     console.error("Error in UploadedNftImage:", error);
  //     return null; // Return null in case of error
  //   }
  // };

  const UploadedNftImageusingBase64 = async (base64File) => {
    if (BeGod_assethandler) {
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
        const result1 = await BeGod_assethandler?.uploadImg(id, [
          ...arrayBuffer,
        ]);
        console.log(result1);

        // Determine the URL based on the network environment
        const acd = process.env.DFX_NETWORK;
        console.log(acd);

        if (acd === "local") {
          const url = `http://127.0.0.1:4943/?canisterId=${process.env.CANISTER_ID_BEGOD_ASSETHANDLER}&imgid=${id}`;
          console.log("NFT URL (local):", url);
          return url;
          // imageurlchange(url);
        } else if (acd === "ic") {
          const url = `https://${process.env.CANISTER_ID_BEGOD_ASSETHANDLER}.raw.icp0.io/?imgid=${id}`;
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
      // if (totalnft != 1) {
      //   setDone((done) => done + 1);
      // } else {
      //   toast.success("please wait NFT is Minting");
      // }

      console.log(result, "nft mint data");
      return result;
      // const es8_price = parseInt(parseFloat(nftPrice) * 100000000);
      // console.log(es8_price, "price");
      // console.log(result, "nft mint data result");
      // if (result && result.length > 0) {
      //   console.log(result, "result of data for minting");
      //   for (const val of result) {
      //     // console.log(key, "in mint");
      //     // console.log(val);
      //     listPrice(answ, val[1], es8_price);
      //     // setTimeout(() => {
      //     //   getNftTokenId(answ, val[1], es8_price);
      //     // }, 1000);
      //   }
      // }

      // if (result && result.length > 0) {
      //   await Promise.all(
      //     result.map((val) => getNftTokenId(answ, val[1], es8_price))
      //   );
      // } else {
      //   throw new Error("Minting failed");
      // }

      // if (result) {
      //   setTokenId(result[0]);
      //   console.log("NFT Minted: ", result[0]);
      //   await getNftTokenId(answ, result[0]);
      // } else {
      //   throw new Error("Error in mintNFT");
      //   toast.error("Error in mintNFT");
      // }
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast.error("Error minting NFT");
      return error; // Return error
    }
  };

  // const getNftTokenId = async (answ, nftIdentifier, nftprice) => {
  //   try {
  //     console.log(answ, nftIdentifier, nftprice);

  //     const principal = Principal.fromText(answ);

  //     setTimeout(async () => {
  //       try {
  //         const res = await listPrice(principal, nftIdentifier, nftprice);
  //         console.log(res, "res data"); // Moved inside the setTimeout function
  //       } catch (error) {
  //         console.error("Error in listPrice:", error);
  //         toast.error("Error in listPrice");
  //       }
  //     }, 1000);
  //   } catch (error) {
  //     console.error("Error fetching NFT token ID:", error);
  //     toast.error("Error in getNftTokenId");
  //     return error;
  //   }
  // };

  // const listPrice = async (answ, tokenidentifier, price) => {
  //   try {
  //     const principal = Principal.fromText(answ);
  //     const finalPrice = price;
  //     console.log("listprice calling");
  //     const priceE8s = finalPrice ? finalPrice : null;

  //     const request = {
  //       token: tokenidentifier,
  //       from_subaccount: [],
  //       price: priceE8s ? [priceE8s] : [],
  //     };
  //     const result = await backendActor?.listprice(principal, request);
  //     // console.log("lisprice called", done);
  //     if (result) {
  //       console.log("List Price Result:", result);
  //     } else {
  //       throw new Error("listprice is not working");
  //       // toast.error("listprice is not working");
  //     }
  //   } catch (error) {
  //     console.error("Error listing price:", error);
  //     toast.error("Error listing price");
  //     return error; // Return error
  //   }
  // };

  const getAddedNftDetails = async (nftDetails) => {
    setNftCardsList([...nftCardsList, nftDetails]);

    setnfttype(nftDetails.nftType);
    setnftname(nftDetails.nftName);
    setnftquantity(nftDetails.nftQuantity);
    setnftprice(nftDetails.nftPrice);
    setnftdescription(nftDetails.nftDescription);
    setnftimage(nftDetails.nftImage);
    setnftcolor(nftDetails.nftcolor);
    // const image1 = await UploadedNftImageusingBase64(nftDetails.nftImage);
    // const image2 = await UploadedNftImageusingBase64(nftDetails.nftFullImage);
    // console.log(image1);
    // console.log(image2);
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

      toast("NFT Minting, Please Wait! ...", {
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
                  "Error in minting NFT inside final call: " +
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
                "Error in minting NFT inside final call: ",
                mintError
              );
              toast.error(
                "Error in minting NFT inside final call: " + mintError.message
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

  // const getListing = async (canId) => {
  //   try {
  //     console.log("called");
  //     const principalString = canId;
  //     const principal = Principal.fromText(principalString);
  //     const result = await backendActor?.listings(principal);
  //     console.log("Listing", result);
  //   } catch (error) {
  //     console.error("Error fetching listing:", error);
  //     toast.error("Error fetching listing");
  //     return error; // Return error
  //   }
  // };

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
  // const total = 27;
  // const [done, setDone] = useState(3);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setDone((prevDone) => {
  //       if (prevDone >= total) {
  //         clearInterval(interval);
  //         return total;
  //       }
  //       return prevDone + 1;
  //     });
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [total]);
  // console.log(collectionBloburl);

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <div className="w-[90%] overflow-y-scroll pt-10 px-10 pb-8 h-screen no-scrollbar  no-scroll 2xl:ml-[7%] md:w-full lg:w-[90%] lg:pt-20">
        {/* <Createcollectionloader done={done} total={total} /> */}
        {loading ? (
          <Createcollectionloader done={done} total={totalnft} />
        ) : (
          // <div className="grid w-full gap-6 lg:grid-cols-3 sm:grid-cols-1 md:grid-cols-2">
          //   {Array(6) // Generate skeleton loaders for each collection card
          //     .fill()
          //     .map((_, index) => (
          //       <div
          //         key={index}
          //         className="bg-[#29292C] w-full h-full px-10 py-6 flex flex-col justify-center items-center gap-y-4 rounded-md border-transparent border"
          //       >
          //         <Skeleton circle width={160} height={160} />
          //         <Skeleton width={140} height={30} />
          //         <Skeleton width={140} height={30} />
          //       </div>
          //     ))}
          // </div>
          <div className="w-full">
            <BackButton />
            <div className="my-8">
              <h1 className="text-3xl text-white ">Create Collection</h1>
              <div className="flex flex-col md:flex-row gap-x-8 items-center  w-full  px-1 py-2 text-[#FFFFFF] justify-start rounded-md">
                <div className="flex flex-col w-full gap-2 mt-4 space-y-4">
                  {/* Collection Name and Max Limit */}
                  <div className="flex flex-col items-center justify-center w-full sm:flex-row sm:gap-4 md:flex-row md:gap-4">
                    <div className="flex flex-col w-full sm:w-1/2">
                      <label className="text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px] mb-2">
                        Collection Name:
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
                        placeholder="Enter your Collection Name"
                        className="pl-4 rounded-md bg-[#29292C] h-[30px] md:h-[45px] w-full"
                      />
                    </div>
                    <div className="w-full sm:w-1/2 flex flex-col mt-[20px] sm:mt-0">
                      <label className="w-full flex flex-col mt-[20px] sm:mt-0">
                        <span className="text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px] mb-2">
                          Logo
                        </span>
                        <LogoImageUploader
                          captureUploadedbloburl={handleFiles}

                          // captureuploadedurl={setcollectionImageURL}
                        />
                      </label>
                    </div>
                  </div>
                  {/* Description */}
                  <label className="mt-[20px] w-[100%] flex flex-col text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px]">
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
                      className="pl-4 w-[100%] h-[100px] bg-[#29292C] rounded-md resize-none p-2"
                      rows="8"
                      placeholder="Enter description here"
                    />
                  </label>

                  <label className="w-full sm:w-1/2 flex flex-col text-[#FFFFFF] gap-2 md:gap-2 text-[14px] md:text-[18px] leading-[25px]">
                    Type color:
                    <select
                      className=" h-[38px] bg-[#29292C] text-[16px] p-2 rounded-md text-[#8a8686]"
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
                  {/* Add new NFT Section */}
                  <div
                    className={`${
                      nftCardsList.length > 0 && "flex justify-end items-center"
                    }`}
                  >
                    <label className="mt-[20px] w-[100%]  md:h-[46px] text-[#FFFFFF] gap-2 md:gap-4 text-[14px] md:text-[20px] leading-[25px] mb-[0px]">
                      NFT Cards
                    </label>
                    <br />
                    <div className="relative inline-block py-2 mt-2">
                      <button
                        type="button"
                        className="add_new_button flex items-center justify-center px-6 py-2 bg-transperent text-white border border-[#d1b471] rounded-l-full rounded-r-none h-[40px] w-[180px] "
                        onClick={() => {
                          updateType("add");
                          toggleModal();
                        }}
                      >
                        Add New
                      </button>
                      <div className="absolute left-[-10px] top-1/2 transform -translate-y-1/2 bg-[#f0c96a] w-[40px] h-[40px] rounded-full flex items-center justify-center border-2 border-gray-900">
                        <span>
                          <BiPlus size={22} />{" "}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-2">
                    {nftCardsList.map((eachNftItem) => (
                      <NftCardItem
                        nftDetails={eachNftItem}
                        key={eachNftItem.nftId}
                        deleteNft={deleteNft}
                        onClickEdit={onClickEdit}
                      />
                    ))}
                  </div>
                  {/* Form Buttons */}
                  <div className="flex justify-start sm:justify-end md:justify-end gap-4 w-[100%] mt-[10px] pb-8 sm:mb-0">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="w-[30%] sm:w-[25%] md:w-[15%] h-[43px] text-[#FFFFFF] rounded-md border-[#FCD37B] border font-semibold"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className="add_new_button flex items-center justify-center px-6 py-2 bg-transperent text-white border rounded-md border-[#d1b471]  h-[40px] w-[180px] "
                      // onClick={finalcall}
                      // onClick={() => setShowModal(true)}
                      onClick={handleSubmit}
                    >
                      Create Collection
                    </button>
                  </div>
                  {showModal && (
                    <WarningModal
                      togglewarning={togglewarning}
                      onUpload={handleUpload}
                    />
                  )}
                  {!showModal && Success && <SuccessModal />}

                  {modal && (
                    <div className="fixed top-0 bottom-0 left-0 right-0 w-screen h-screen">
                      <div className="w-screen h-screen top-0 left-0 right-0 bottom-0 fixed bg-[rgba(49,49,49,0.8)]">
                        <div className="flex items-center justify-center h-screen">
                          <Modal
                            toggleModal={toggleModal}
                            getAddedNftDetails={getAddedNftDetails}
                            getUpdatedNftDetails={getUpdatedNftDetails}
                            cardDetails={currentItemCardDetails}
                            type={type}
                          />
                        </div>
                      </div>
                    </div>
                  )}
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
