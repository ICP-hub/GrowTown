import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import YellowButton from "../../components/button/YellowButton";
import BackButton from "./BackButton";
import NftCard from "./NftCard.jsx";
import { Principal } from "@dfinity/principal";
import { useAuths } from "../../utils/useAuthClient.jsx";
import Modal from "./NftModal.jsx";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { SkeletonTheme } from "react-loading-skeleton";
import { BiCategory } from "react-icons/bi";
import { CiDollar } from "react-icons/ci";
import { RiArrowUpDownFill } from "react-icons/ri";
import { LuFilter } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import { IoCheckmarkOutline } from "react-icons/io5";
import { Growtown_assethandler } from "../../../../declarations/Growtown_assethandler";
import { useNavigate } from "react-router-dom";
import TokenModal from "./TokenModal";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";


const cardTypeList = [
  {
    cardId: "ALL",
    displayText: "All",
  },
  {
    cardId: "DIVINE",
    displayText: "Divine",
  },
  {
    cardId: "MYTHICAL",
    displayText: "Mythical",
  },
  {
    cardId: "RARE",
    displayText: "Rare",
  },
  {
    cardId: "UNCOMMON",
    displayText: "Uncommon",
  },
  {
    cardId: "COMMON",
    displayText: "Common",
  },
  {
    cardId: "PROMO",
    displayText: "Promo",
  },
  {
    cardId: "Assets",
    displayText: "Assets",
  },
];

const dropdownItems = {
  none: "NONE",
  type: "TYPE",
  price: "PRICE",
  filter: "FILTER",
};

const filterListOptions = [
  {
    optionId: "Default",
    displayText: "Default",
  },
  {
    optionId: "Recently Added",
    displayText: "Recently Added",
  },
  {
    optionId: "Low to High",
    displayText: "Price : Low to High",
  },
  {
    optionId: "Hight to Low",
    displayText: "Price : Hight to Low",
  },
];

function CollectionDetails() {
  const [nftList, setnftList] = useState([]);
  const [tokenModal, setTokenModal] = useState(false);
  const [modal, setModal] = useState(false);
  const [nftType, setnfttype] = useState("");
  const [nftname, setnftname] = useState("");
  const [nftquantity, setnftquantity] = useState();
  const [nftprice, setnftprice] = useState();
  const [nftimage, setnftimage] = useState("");
  const [nftdescription, setnftdescription] = useState("");
  const [nftcolor, setnftcolor] = useState("");
  let [currentpage, setcurrentpage] = useState(1);
  const [totalpage, settotalpage] = useState(0);
  const [loading, setLoading] = useState(false);
  // const [showLoader, setShowLoader] = useState(false);
  const { backendActor, canisterId } = useAuths();
  const { id } = useParams();
  const location = useLocation();
  const { collectiondata } = location.state || {};

  useEffect(() => {
    let loaderTimer;
    let fetchNFTTimer;

    if (loading) {
      fetchNFTTimer = setTimeout(() => {
        console.log("in use effect fetchnft called");
        fetchNFTs(); // we use here route to open collection jisse refresh ki problem nhi hogi
      }, 41000);
      loaderTimer = setTimeout(() => {
        console.log("in use effect loader called");
        setLoading(false);
      }, 45000);
    }

    return () => {
      clearTimeout(fetchNFTTimer);
      clearTimeout(loaderTimer);
    };
  }, [loading]);

  useEffect(() => {
    // Clear previous state if flag is set
    if (location.state?.clearPrevious) {
      const newState = {
        ...location.state,
        clearPrevious: false
      };
      navigate(location.pathname, { state: newState, replace: true });
    }
  }, [location.state]);

  useEffect(() => {
    // Reset NFT list when collection changes or when resetNFTs flag is true
    if (location.state?.resetNFTs) {
      setnftList([]);
      // Remove the reset flag from state
      const newState = {
        ...location.state,
        resetNFTs: undefined
      };
      navigate(location.pathname, { state: newState, replace: true });
      // Fetch new NFTs
      fetchNFTs();
    }
  }, [location.state?.collectiondata, location.state?.resetNFTs]);

  const navigate = useNavigate();

  const toggleModal = () => {
    setModal(!modal);
  };

  const toggleTokenModal = () => {
    setTokenModal(!tokenModal);
  };
  // console.log(collectiondata);

  if (!collectiondata) {
    return <p>No NFT data available</p>;
  }
  // let currentpage = 2;
  // const totalpage = 5;

  const jsonString = collectiondata[4];
  const parsedData = JSON.parse(jsonString);
  const colldescription = parsedData.description;
  const colcolor = parsedData.collColor;
  // console.log(colcolor, "this is colle");
  // console.log(colldescription);

  // console.log(collectiondata?.[1].toString());

  // // getAllCollectionNFTs
  const principal = collectiondata?.[1];
  const userPrincipalArrayy = principal;
  const principalStringg = Principal.fromUint8Array(
    userPrincipalArrayy._arr
  ).toText();
  // console.log(principalStringg);

  const getAllCollectionNFT = async (principal, currentpage) => {
    // console.log(currentpage);
    try {
      const userPrincipalArray = principal;

      const principalString = Principal.fromUint8Array(userPrincipalArray._arr);
      // console.log("before");
      // console.log(principal);
      const result = await backendActor?.getFilteredCollectionNFTs(
        principalString,
        10,
        currentpage - 1
      );
      // console.log("NFT collection:", result);
      const formatedList = [];

      if (result && result.ok && result.ok.data && result.ok.data.length > 0) {
        let tempIndex = 0;
        for (let i = 0; i < result.ok.data.length; i++) {
          const eachItem = result.ok.data[i];
          const currentCardName =
            eachItem[2]?.nonfungible?.name ?? "Name not found";

          if (tempIndex === 0) {
            formatedList.push([eachItem]);
            tempIndex++;
          } else if (
            formatedList[tempIndex - 1][0][2]?.nonfungible?.name ===
            currentCardName
          ) {
            formatedList[tempIndex - 1].push(eachItem);
          } else {
            formatedList.push([eachItem]);
            tempIndex++;
          }
        }
        console.log("Formatted list:", formatedList);
      } else {
        console.log("No valid data found in result.");
      }

      setnftList(formatedList);
      setcurrentpage(Number(result?.ok?.current_page) || 1);
      settotalpage(Number(result?.ok?.total_pages) || 0);
    } catch (error) {
      console.error("Error fetching get all collection NFT:", error);
    }
  };

  const fetchNFTs = async () => {
    setLoading(true);
    try {
      // Clear existing NFTs first
      setnftList([]);
      await getAllCollectionNFT(principal, currentpage);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      toast.error("Error fetching NFTs");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, [currentpage]);

  const UploadedNftImageusingBase64 = async (base64File) => {
    if (Growtown_assethandler) {
      try {
        console.log(base64File);

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
          console.log(" URL (local):", url);
          return url;
          // imageurlchange(url);
        } else if (acd === "ic") {
          const url = `https://${process.env.CANISTER_ID_GROWTOWN_ASSETHANDLER}.raw.icp0.io/?imgid=${id}`;
          console.log(" URL (IC):", url);
          // imageurlchange(url);
          return url;
        }
      } catch (error) {
        console.error("Error uploading Base64 file:", error);
      }
    }
  };

  const mintToken = async (
    principalStringg,
    tokenName,
    tokenSymbol,
    tokenDecimal,
    tokenAmount,
    tokenImage,
  ) => {
    try {
      const imageurl1 = await UploadedNftImageusingBase64(tokenImage);


      // console.log("in mint", principalStringg);
      const principalString = principalStringg;
      const principal = Principal.fromText(principalString);
      // console.log(principal);
      const date = new Date();
      const formattedDate = date.toISOString();
      const metadata = JSON.stringify({
        chain: "ICP",
        date: formattedDate,
        imageurl1
      });

      const metadataContainer = {
        json: metadata,
      };

      // const es8_price = parseInt(parseFloat(nftprice) * 100000000);

      const result = await backendActor?.mintExtFungible(
        principal,
        tokenName,
        tokenSymbol,
        tokenDecimal,
        metadataContainer ? [metadataContainer] : [],
        tokenAmount,

      );

      console.log(result, "Token mint data");
      // if (result?.status == "Error: Not all tokens were minted successfully.") {
      //   toast.error(result?.status);
      // }

      if (result instanceof Error) {
        toast.error(result);
      } else {
        // await getListing(principal);
        toast.success("Token added");
        toast("Fetching Tokens, Please Wait! ...", {
          icon: "⚠️",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        await fetchNFTs();
      }

      return result;
    } catch (error) {
      console.error("Error Creating Tokens:", error);
      toast.error("Error creating Tokens");
      return error;
    } finally {
      setLoading(false);
    }
  };

  const mintNFT = async (
    principalStringg,
    nftname,
    nftdescription,
    nftimageHeadHDblob,
    nftquantity,
    nftcolor,
    nftprice,
    nftType,
    artistname,
    newtype,
    nftSeason,
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

      // console.log("in mint", principalStringg);
      const principalString = principalStringg;
      const principal = Principal.fromText(principalString);
      // console.log(principal);
      const date = new Date();
      const formattedDate = date.toISOString();
      const metadata = JSON.stringify({
        nftType,
        standard: "EXT V2",
        chain: "ICP",
        contractAddress: canisterId,
        nftcolor,
        date: formattedDate,
        artistname,
        newtype,
        nftSeason,
        imageurl1,
        imageurl2,
        imageurl3,
        imageurl4,
      });

      const metadataContainer = {
        json: metadata,
      };

      const es8_price = parseInt(parseFloat(nftprice) * 100000000);

      const result = await backendActor?.mintExtNonFungible3(
        principal,
        nftname,
        nftdescription,
        "thumbnail",
        "nftimage",
        metadataContainer ? [metadataContainer] : [],
        Number(nftquantity),
        es8_price ? [es8_price] : []
      );
      console.log(result, "nft mint data");
      // if (result?.status == "Error: Not all tokens were minted successfully.") {
      //   toast.error(result?.status);
      // }

      if (result instanceof Error) {
        toast.error(result);
      } else {
        // await getListing(principal);
        toast.success("NFT added");
        toast("Fetching NFTs, Please Wait! ...", {
          icon: "⚠️",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        await fetchNFTs();
        // navigate("/admin/collection");
        // setTimeout(() => {
        //   navigate("/admin/collection");
        // }, 1000);
      }

      // const es8_price = parseInt(parseFloat(nftprice) * 100000000);
      // console.log(es8_price, "price");
      // if (result && result.length > 0) {
      //   result.map((val, key) => {
      //     getNftTokenId(principal, val[1], es8_price);
      //   });
      // }
      // if (result && result.length > 0) {
      //   setTimeout(async () => {
      //     await Promise.all(
      //       result.map((val) => getNftTokenId(principal, val[1], es8_price))
      //     );
      //   },1000)

      // } else {
      //   throw new Error("Minting failed");
      // }
      return result;
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast.error("Error minting NFT");
      return error;
    } finally {
      setLoading(false);
    }
  };

  const getAddedTokenDetails = async (tokenDetails) => {
    // Disable further calls if already loading
    if (loading) return;
    setLoading(true);

    try {
      toast("Token creating, Please Wait! ...", {
        icon: "⚠️",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      const mintResult = await mintToken(
        principalStringg,
        tokenDetails.tokenName,
        tokenDetails.tokenSymbol,
        tokenDetails.tokenDecimal,
        tokenDetails.tokenAmount,
        tokenDetails.tokenImage,


      );
      console.log(mintResult);


    } catch (error) {
      console.error("Error in get added nft: ", error);
      toast.error("Error in get added nft");
    } finally {
      setLoading(false);
    }
  };


  const getAddedNftDetails = async (nftDetails) => {
    // Disable further calls if already loading
    if (loading) return;
    setLoading(true);

    setnfttype(nftDetails.nftType);
    setnftname(nftDetails.nftName);
    setnftquantity(nftDetails.nftQuantity);
    setnftprice(nftDetails.nftPrice);
    setnftdescription(nftDetails.nftDescription);
    // setnftimage(nftDetails.nftImage);
    setnftcolor(nftDetails.nftcolor);
    console.log(nftDetails);

    try {
      toast("NFT Minting, Please Wait! ...", {
        icon: "⚠️",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      const mintResult = await mintNFT(
        principalStringg,
        nftDetails.nftName,
        nftDetails.nftDescription,
        nftDetails.nftImage,
        nftDetails.nftQuantity,
        nftDetails.nftcolor,
        nftDetails.nftPrice,
        nftDetails.nftType,
        nftDetails.artistname,
        nftDetails.newtype,
        nftDetails.nftSeason,
        nftDetails.nftFullImage,
        nftDetails.nftImageSD,
        nftDetails.nftFullImageSD
        // nftDetails.imageurl1,
        // nftDetails.imageurl2,
        // nftDetails.imageurl3,
        // nftDetails.imageurl4
      );
      console.log(mintResult);

      // if (mintResult instanceof Error) {
      //   toast.error(mintResult);
      // } else {
      //   // await getListing(principal);
      //   toast.success("NFT added");
      //   toast("Fetching NFTs, Please Wait! ...", {
      //     icon: "⚠️",
      //     style: {
      //       borderRadius: "10px",
      //       background: "#333",
      //       color: "#fff",
      //     },
      //   });
      //   // await fetchNFTs();
      //   setTimeout(() => {
      //     navigate("/admin/collection");
      //   }, 1000);
      // }
    } catch (error) {
      console.error("Error in get added nft: ", error);
      toast.error("Error in get added nft");
    } finally {
      setLoading(false);
    }
  };

  const [currentCardType, updateCardType] = useState(cardTypeList[0].cardId);
  const [fromPrice, updateFromPrice] = useState(undefined);
  const [toPrice, updateToPrice] = useState(undefined);
  const [currentDropDown, updateDropDown] = useState(dropdownItems.none);
  const [applyPriceRange, updateApplyPriceRange] = useState({
    isApply: false,
    from: NaN,
    to: NaN,
  });
  const [currentFilterOption, updateCurrentFilterOption] = useState(
    filterListOptions[0].optionId
  );

  const onClickAnyFilter = (updatedFilter) => {
    // console.log("updated filter", updatedFilter);
    if (updatedFilter === currentDropDown) {
      updateDropDown(dropdownItems.none);
      return;
    }

    updateDropDown(updatedFilter);
  };

  const [isDisplayFiltersPopup, updateFiltersDisplayStatus] = useState(false);

  const [filteredList, updateFilteredList] = useState(nftList);

  useEffect(() => {
    let updatedList = [...nftList];

    if (currentCardType !== cardTypeList[0].cardId) {
      updatedList = updatedList.filter((eachItem) => {
        // console.log("each item", eachItem[0]);
        const metadataJson = eachItem[0][2]?.nonfungible?.metadata?.[0]?.json;
        const metadata = JSON.parse(metadataJson);
        const nftType = metadata?.nftType;
        return nftType.toLowerCase() === currentCardType.toLowerCase();
      });
    }

    if (applyPriceRange.isApply) {
      updatedList = updatedList.filter((eachItem) => {
        const priceBigInt =
          eachItem[0][3]?.[0]?.toString() ?? "Price not found";
        const price = Number(priceBigInt) / 100000000;
        // console.log(
        //   "From price:",
        //   applyPriceRange.from,
        //   "Card price:",
        //   price,
        //   "To price:",
        //   applyPriceRange.to
        // );
        return applyPriceRange.from <= price && price <= applyPriceRange.to;
      });
    }

    if (currentFilterOption !== filterListOptions[0].optionId) {
      if (currentFilterOption === filterListOptions[1].optionId) {
        updatedList = updatedList.reverse();
      } else if (currentFilterOption === filterListOptions[2].optionId) {
        updatedList = updatedList.sort((a, b) => {
          const priceBigIntA = a[0][3]?.[0]?.toString() ?? "Price not found";
          const priceA = Number(priceBigIntA) / 100000000;
          ``;
          const priceBigIntB = b[0][3]?.[0]?.toString() ?? "Price not found";
          const priceB = Number(priceBigIntB) / 100000000;
          return priceA - priceB;
        });
      } else if (currentFilterOption === filterListOptions[3].optionId) {
        updatedList = updatedList.sort((a, b) => {
          const priceBigIntA = a[0][3]?.[0]?.toString() ?? "Price not found";
          const priceA = Number(priceBigIntA) / 100000000;

          const priceBigIntB = b[0][3]?.[0]?.toString() ?? "Price not found";
          const priceB = Number(priceBigIntB) / 100000000;
          return priceB - priceA;
        });
      }
    }

    // console.log("Updated list after all filters:", updatedList);
    updateFilteredList(updatedList);
  }, [nftList, currentCardType, applyPriceRange, currentFilterOption]);

  // console.log("filtered list after applying filters", filteredList);
  let count = 0;
  if (currentCardType !== cardTypeList[0].cardId) {
    count++;
  }
  if (applyPriceRange.isApply) {
    count++;
  }
  if (currentFilterOption !== "DEFAULT") {
    count++;
  }

  // console.log("formated list", nftList);
  const onClickFilterContainer = () => {
    updateDropDown(dropdownItems.none);
  };
  const leftfunction = async () => {
    if (currentpage == 0) {
      toast.error("You are in first page");
    }
    // currentpage = currentpage - 1;
    setcurrentpage((currentpage) => currentpage - 1);
    // await fetchNFTs();
    // await getAllCollectionNFT(principal, currentpage);
  };
  const rightfunction = async () => {
    if (currentpage > totalpage) {
      toast.error("You are in last page");
    }
    setcurrentpage((currentpage) => currentpage + 1);
    // await fetchNFTs();
    // await getAllCollectionNFT(principal, currentpage);
    // console.log("clicked");
  };
  console.log(collectiondata);

  return (
    <>
      <SkeletonTheme baseColor="#202020" highlightColor="#282828">
        <div
          onClick={onClickFilterContainer}

          className="w-[90%] overflow-y-scroll pt-10 sm:px-10 pb-8 h-screen no-scrollbar no-scroll md:w-full  mx-auto"

        >
          {loading ? (
            <div>

              <div className="flex justify-between items-center mb-6">
                <Skeleton width={100} height={40} />
                <Skeleton width={120} height={40} />
              </div>
              <div className="flex flex-col md:flex-row items-center bg-[#282828] p-10 rounded-md mb-10">
                <Skeleton circle={true} width={128} height={128} />
                <div className="flex flex-col space-y-4 ml-8">
                  <Skeleton width={200} height={30} />
                  <Skeleton width={250} height={20} />
                  <Skeleton width={250} height={20} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3">
                {Array(6)
                  .fill()
                  .map((_, index) => (
                    <div key={index} className="flex flex-col space-y-3">
                      <Skeleton height={200} />
                      <Skeleton width="80%" height={20} />
                      <Skeleton width="60%" height={20} />
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="w-full">
              {/*  Back button and action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8">
                <span className="hidden sm:block">
                  <BackButton />
                </span>
                <div className="flex flex-col sm:flex-row w-full gap-3 sm:gap-4 sm:justify-end">
                  <YellowButton methodName={() => toggleModal()}>
                    Add NFT
                  </YellowButton>
                </div>
              </div>

              {/* Collection details section */}
              <div className="flex flex-col md:flex-row items-start bg-[#29292c] w-full p-4 sm:p-6 md:p-8 text-white rounded-lg my-4 sm:my-6 md:my-8 gap-4 sm:gap-6 md:gap-8">
                <div className="w-full sm:w-auto md:w-48 lg:w-64">
                  <img
                    className="w-full h-48 sm:h-40 md:h-48 rounded-xl object-cover border-2 border-[#FCD378] shadow-lg"
                    src={
                      JSON.parse(collectiondata[4]).collectionImageURL ||
                      "default-image.jpg"
                    }
                    alt={collectiondata[2]}
                  />
                </div>

                <div className="flex-1 space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#FCD378]">
                      {collectiondata[2]}
                    </h1>
                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                      {colldescription}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#1f1f22] p-4 rounded-lg">
                    <div className="flex flex-col space-y-2">
                      <span className="text-xs text-gray-400 uppercase tracking-wider">Collection ID</span>
                      <h3 className="text-sm font-medium font-Quicksand text-[#FCD378] truncate hover:text-clip">
                        {principalStringg}
                      </h3>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <span className="text-xs text-gray-400 uppercase tracking-wider">Collection Color</span>
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-white/20 shadow-md"
                          style={{ backgroundColor: colcolor }}
                        />
                        <h3 className="text-sm font-medium font-Quicksand text-white">
                          {colcolor}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* NFT list section */}
              <div className="hidden sm:flex items-center justify-between text-[12px] md:text-sm lg:text-base ml-2">
                <div className="relative   min-w-[160px] md:min-w-[180px] flex justify-center lg:mr-5">
                  {currentDropDown === dropdownItems.type && (
                    <ul className="absolute no-scrollbar top-10 left-0 mt-2 bg-black text-[#FCD378] rounded shadow-lg  p-0 list-none z-50 w-full h-[160px] overflow-y-auto ">
                      {cardTypeList.map((eachType, index) => (
                        <>
                          <div
                            key={eachType.cardId}
                            className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-purple-900"
                            onClick={() => {
                              if (eachType.cardId != currentCardType) {
                                updateCardType(eachType.cardId);
                                onClickAnyFilter(dropdownItems.type);
                              }
                            }}
                          >
                            <li key={eachType.cardId}>
                              {eachType.displayText}
                            </li>
                            {currentCardType === eachType.cardId && (
                              <IoCheckmarkOutline />
                            )}
                          </div>
                          {index != cardTypeList.length - 1 && (
                            <hr className="my-1 border-t border-[#FCD378]" />
                          )}
                        </>
                      ))}
                    </ul>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClickAnyFilter(dropdownItems.type);
                    }}
                    className={`rounded-full flex justify-center items-center gap-1 
                                     h-full p-2 bg-[#000] text-[#FCD378]  hover:border-[#FCD378] border-2 ${currentDropDown === dropdownItems.type
                        ? "border-[#FCD378]"
                        : " border-gray-800"
                      }`}
                  >
                    <BiCategory />
                    Category ({currentCardType.charAt(0)}
                    {currentCardType.slice(1).toLowerCase()})
                  </button>
                </div>

                <div className="relative   flex justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClickAnyFilter(dropdownItems.price);
                    }}
                    className={`rounded-full flex justify-center items-center gap-1 
                                     p-2 bg-[#000] text-[#FCD378]  hover:border-[#FCD378] border-2 ${currentDropDown === dropdownItems.price
                        ? "border-[#FCD378]"
                        : " border-gray-800"
                      }`}
                  >
                    <CiDollar size={22} />
                    Price (
                    {`${!isNaN(applyPriceRange.from) && !isNaN(applyPriceRange.to)
                      ? `${applyPriceRange.from} - ${applyPriceRange.to} `
                      : ""
                      }`}{" "}
                    ICP)
                  </button>

                  {currentDropDown === dropdownItems.price && (
                    <div
                      className="absolute top-10 border border-[#FCD378] mt-2 bg-black text-[#FCD378] rounded shadow-lg  p-4 z-50 h-[150px] flex flex-col items-center justify-around"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h1>Price in ICP</h1>
                      <div className="flex flex-col items-center md:flex-row">
                        <input
                          value={fromPrice}
                          onChange={(e) => {
                            updateFromPrice(parseInt(e.target.value));
                          }}
                          placeholder="From"
                          type="number"
                          className="w-20 mb:2 md:mb-0 md:mr-3 rounded-sm border text-[#FCD378] border-[#FCD378] bg-transparent outline-none p-1 text-sm"
                        />
                        <input
                          value={toPrice}
                          onChange={(e) => {
                            updateToPrice(parseInt(e.target.value));
                          }}
                          placeholder="to"
                          type="number"
                          className="w-20 rounded-sm border text-[#FCD378] border-[#FCD378] bg-transparent outline-none p-1 text-sm"
                        />
                      </div>
                      <div className="">
                        <button
                          className={`w-20 border-none bg-[#FCD378] text-black h-6 mr-3 rounded-full ${isNaN(applyPriceRange.from) ||
                            isNaN(applyPriceRange.to)
                            ? "opacity-30"
                            : "opacity-100"
                            } `}
                          disabled={
                            isNaN(applyPriceRange.from) ||
                            isNaN(applyPriceRange.to)
                          }
                          onClick={() => {
                            onClickAnyFilter(dropdownItems.none);
                            updateApplyPriceRange({
                              isApply: false,
                              from: NaN,
                              to: NaN,
                            });
                            updateFromPrice(NaN);
                            updateToPrice(NaN);
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className={`w-20 border-none bg-[#FCD378] text-black h-6 rounded-full ${isNaN(fromPrice) || isNaN(toPrice)
                            ? "opacity-30"
                            : "opacity-100"
                            }`}
                          onClick={() => {
                            onClickAnyFilter(dropdownItems.price);
                            updateApplyPriceRange({
                              isApply: true,
                              from: fromPrice,
                              to: toPrice,
                            });
                          }}
                          disabled={isNaN(fromPrice) || isNaN(toPrice)}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className=" relative lg:ml-auto mr-2 lg:mr-20 w-[160px] h-[40px] md:w-[180px] bottom-6">
                  <span className="relative z-10 top-3 text-xs bg-gray-800 text-[#FCD378] rounded-full px-2  left-5 ">
                    Filter & Sort
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClickAnyFilter(dropdownItems.filter);
                    }}
                    className={` absolute  rounded-full flex justify-center items-center gap-1 
                                    w-full h-full p-2 bg-[#000] text-[#FCD378]  hover:border-[#FCD378] border-2 ${currentDropDown === dropdownItems.filter
                        ? "border-[#FCD378]"
                        : " border-gray-800"
                      }`}
                  >
                    <RiArrowUpDownFill />
                    {currentFilterOption}
                  </button>
                  {currentDropDown === dropdownItems.filter && (
                    <ul className="absolute top-[60px] left-0 mt-2 no-scrollbar bg-black text-[#FCD378] rounded shadow-lg  p-0 list-none z-50 w-full h-[160px] overflow-y-auto ">
                      {filterListOptions.map((eachFilter, index) => (
                        <>
                          <div
                            key={eachFilter.optionId}
                            className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-purple-900"
                            onClick={() => {
                              if (eachFilter.optionId != currentFilterOption) {
                                updateCurrentFilterOption(eachFilter.optionId);
                                onClickAnyFilter(dropdownItems.filter);
                              }
                            }}
                          >
                            <li key={eachFilter.optionId}>
                              {eachFilter.displayText}
                            </li>
                            {currentFilterOption === eachFilter.optionId && (
                              <IoCheckmarkOutline />
                            )}
                          </div>
                          {index != filterListOptions.length - 1 && (
                            <hr className="my-1 border-t border-[#FCD378]" />
                          )}
                        </>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <button
                className={`rounded-full flex justify-center items-center w-[120px] h-[35px] mt-5 gap-1 
                  p-2 bg-[#000] text-[#FCD378] border-2 border-gray-800 ml-auto mr-5 sm:hidden`}
                onClick={() => updateFiltersDisplayStatus(true)}
              >
                <LuFilter />
                Filters
                {count > 0 && (
                  <span className="size-5 border-none bg-gray-800 rounded-full flex justify-center items-center pt-0.5 ">
                    {count}
                  </span>
                )}
              </button>
              <div className="w-full pb-12 text-white">
                <h1 className="text-xl my-4">
                  List of all NFT Collection -{" "}
                  <span className="font-bold text-green-500">
                    {principalStringg}
                  </span>
                </h1>
                {/* Update the grid layout with better spacing and responsive columns */}
                {console.log('filteredList',filteredList)}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
                  {filteredList.length > 0 ? (
                    filteredList?.map((list, index) => (
                      <div key={index} className="flex justify-center">
                        <NftCard
                          id={principalStringg}
                          list={list[0]}
                          collectiondata={collectiondata}
                          quantity={list.length}
                          className="w-full max-w-[300px]" // Add max width to prevent cards from getting too wide
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full flex justify-center items-center min-h-[200px]">
                      <h1>No Cards Found</h1>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-8 sm:mt-10 flex justify-center items-center gap-3 sm:gap-4">
                {currentpage > 1 && (
                  <button
                    className="px-3 sm:px-4 py-2 bg-gray-900 text-white border border-gray-500 rounded-md hover:bg-black"
                    onClick={leftfunction}
                  >
                    <GrPrevious />
                  </button>
                )}
                <button
                  className="px-3 sm:px-4 py-2 bg-[#50B248] text-black border border-black rounded-md">
                  {currentpage}
                </button>
                {currentpage < totalpage && (
                  <button
                    className="px-3 sm:px-4 py-2 bg-gray-900 text-white border border-gray-500 rounded-md hover:bg-black"
                    onClick={rightfunction}
                  >
                    <GrNext />
                  </button>
                )}
              </div>

              {/* {tokenModal && (
                <div className="fixed inset-0 z-50">
                  <div className="fixed inset-0 bg-[rgba(37,37,37,0.84)] backdrop-blur-lg">
                    <div className="flex items-center justify-center min-h-screen p-4">
                      <TokenModal
                        toggleModal={toggleTokenModal}
                        getAddedTokenDetails={getAddedTokenDetails}
                      />
                    </div>
                  </div>
                </div>
              )} */}

              {modal && (
                <div className="fixed inset-0 z-50">
                  <div className="fixed inset-0 bg-[rgba(37,37,37,0.84)] backdrop-blur-lg">
                    <div className="flex items-center justify-center h-screen p-4">
                      <Modal
                        toggleModal={toggleModal}
                        getAddedNftDetails={getAddedNftDetails}
                        type="add"
                      />
                    </div>
                  </div>
                </div>
              )}

              {isDisplayFiltersPopup && (
                <div className="fixed  inset-0 z-50 sm:hidden">
                  <div className="fixed -top-20 inset-0 bg-[rgba(49,49,49,0.8)]">
                    <div className="flex items-end sm:items-center justify-center min-h-screen">
                      <div className="w-full m-4 max-w-lg bg-[#111] rounded-t-xl sm:rounded-xl p-4 sm:p-6">
                        <div className="flex items-center justify-end">
                          <button
                            className="text-[#FCD378] bottom-1 mb-1 z-10"
                            onClick={() => updateFiltersDisplayStatus(false)}
                          >
                            <RxCross2 size={20} />
                          </button>
                        </div>
                        <div className="flex flex-col items-center justify-around h-[80%] text-[16px]">
                          <div className="relative w-full flex justify-center">
                            {currentDropDown === dropdownItems.type && (
                              <ul className="absolute top-10 left-0 mt-2 bg-black border border-[#FCD378] text-[#FCD378] rounded shadow-lg  p-0 list-none z-50 w-full h-[130px] overflow-y-auto ">
                                {cardTypeList.map((eachType, index) => (
                                  <>
                                    <div
                                      key={eachType.cardId}
                                      className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-purple-900"
                                      onClick={() => {
                                        if (
                                          eachType.cardId != currentCardType
                                        ) {
                                          updateCardType(eachType.cardId);
                                          onClickAnyFilter(dropdownItems.type);
                                        }
                                      }}
                                    >
                                      <li key={eachType.cardId}>
                                        {eachType.displayText}
                                      </li>
                                      {currentCardType === eachType.cardId && (
                                        <IoCheckmarkOutline />
                                      )}
                                    </div>
                                    {index != cardTypeList.length - 1 && (
                                      <hr className="my-1 border-t border-[#FCD378]" />
                                    )}
                                  </>
                                ))}
                              </ul>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onClickAnyFilter(dropdownItems.type);
                              }}
                              className={`rounded-md flex justify-center items-center gap-1 
                                                w-full h-full p-2 bg-[#000]  text-[#FCD378]  hover:border-[#FCD378] border border-[#FCD378] ${currentDropDown ===
                                dropdownItems.filter &&
                                "opacity-10"
                                } `}
                            >
                              <BiCategory />
                              Category ({currentCardType.charAt(0)}
                              {currentCardType.slice(1).toLowerCase()})
                            </button>
                          </div>
                          <div className="relative w-full  flex justify-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onClickAnyFilter(dropdownItems.price);
                              }}
                              className={`rounded-md flex justify-center items-center gap-1 w-[100%]
                                                p-2 bg-[#000] text-[#FCD378]  border border-[#FCD378]`}
                            >
                              <CiDollar size={20} />
                              Price (
                              {`${!isNaN(applyPriceRange.from) &&
                                !isNaN(applyPriceRange.to)
                                ? `${applyPriceRange.from} - ${applyPriceRange.to} `
                                : ""
                                }`}{" "}
                              ICP)
                            </button>
                            {currentDropDown === dropdownItems.price && (
                              <div
                                className="absolute top-10  mt-2 border border-[#FCD378] bg-black text-[#FCD378] rounded shadow-lg  p-1 z-50 w-[100%] h-[120px] flex flex-col items-center justify-around"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <h1>Price in ICP</h1>
                                <div className="flex items-center">
                                  <input
                                    value={fromPrice}
                                    onChange={(e) => {
                                      updateFromPrice(parseInt(e.target.value));
                                    }}
                                    placeholder="From"
                                    type="number"
                                    className="w-20 mr-2 rounded-sm border text-[#FCD378] border-[#FCD378] bg-transparent outline-none p-1 text-sm"
                                  />
                                  <input
                                    value={toPrice}
                                    onChange={(e) => {
                                      updateToPrice(parseInt(e.target.value));
                                    }}
                                    placeholder="to"
                                    type="number"
                                    className="w-20 rounded-sm border text-[#FCD378] border-[#FCD378] bg-transparent outline-none p-1 text-sm"
                                  />
                                </div>
                                <div className="">
                                  <button
                                    className={`w-[80px] border-none bg-[#FCD378] text-black h-[24px] mr-3 rounded-full ${isNaN(applyPriceRange.from) ||
                                      isNaN(applyPriceRange.to)
                                      ? "opacity-20"
                                      : "opacity-100"
                                      } `}
                                    disabled={
                                      isNaN(applyPriceRange.from) ||
                                      isNaN(applyPriceRange.to)
                                    }
                                    onClick={() => {
                                      onClickAnyFilter(dropdownItems.none);
                                      updateApplyPriceRange({
                                        isApply: false,
                                        from: NaN,
                                        to: NaN,
                                      });
                                      updateFromPrice(NaN);
                                      updateToPrice(NaN);
                                    }}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    className={`w-[80px] border-none bg-[#FCD378] text-black h-[24px] rounded-full ${isNaN(fromPrice) || isNaN(toPrice)
                                      ? "opacity-20"
                                      : "opacity-100"
                                      }`}
                                    onClick={() => {
                                      onClickAnyFilter(dropdownItems.price);
                                      updateApplyPriceRange({
                                        isApply: true,
                                        from: fromPrice,
                                        to: toPrice,
                                      });
                                    }}
                                    disabled={
                                      isNaN(fromPrice) || isNaN(toPrice)
                                    }
                                  >
                                    Apply
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="relative  h-[40px] w-full bottom-5 ">
                            <span className="relative top-3 text-xs bg-gray-800 text-[#FCD378] rounded-full px-2 z-10 left-5 ">
                              Filter & Sort
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onClickAnyFilter(dropdownItems.filter);
                              }}
                              className={` absolute rounded-md flex justify-center items-center gap-1 
                                                w-full h-full p-2 bg-[#000] text-[#FCD378]  border-[#FCD378] border ${currentDropDown ===
                                dropdownItems.type &&
                                "opacity-5"
                                }  `}
                            >
                              <RiArrowUpDownFill />
                              {currentFilterOption}
                            </button>
                            {currentDropDown === dropdownItems.filter && (
                              <ul className="absolute bottom-[30px] left-0 mt-2 border border-[#FCD378]  bg-black text-[#FCD378] rounded shadow-lg  p-0 list-none z-50 w-full h-[130px] overflow-y-auto ">
                                {filterListOptions.map((eachFilter, index) => (
                                  <>
                                    <div
                                      key={eachFilter.optionId}
                                      className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-purple-900"
                                      onClick={() => {
                                        if (
                                          eachFilter.optionId !=
                                          currentFilterOption
                                        ) {
                                          updateCurrentFilterOption(
                                            eachFilter.optionId
                                          );
                                          onClickAnyFilter(
                                            dropdownItems.filter
                                          );
                                        }
                                      }}
                                    >
                                      <li
                                        key={eachFilter.optionId}
                                        className="h-[30px]"
                                      >
                                        {eachFilter.displayText}
                                      </li>
                                      {currentFilterOption ===
                                        eachFilter.optionId && (
                                          <IoCheckmarkOutline />
                                        )}
                                    </div>
                                    {index != filterListOptions.length - 1 && (
                                      <hr className="my-1 border-t border-[#FCD378]" />
                                    )}
                                  </>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </SkeletonTheme>
    </>
  );
}

export default CollectionDetails;
