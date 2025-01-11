import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import BackButton from "./BackButton";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAuth } from "../../utils/useAuthClient.jsx";
import { Principal } from "@dfinity/principal";
import toast from "react-hot-toast";

const NftDetails = () => {
  const { collectionId, nftId } = useParams();
  const { backendActor } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true); // To handle loading state
  const [tokenid, settokenid] = useState();
  const [singletokendata, setsingletokendata] = useState();
  const nftdata = location.state?.list;
  const { collectiondata } = location.state || {};
  console.log(nftdata); //
  console.log(collectiondata);
  console.log(nftId);

  // const quantity = Number(nftdata?.[4]);
  // console.log(quantity);
  const tokenindex = nftdata?.[0];
  const userid = nftdata?.[1];

  const priceBigInt = nftdata[3]?.[0]?.toString() ?? "Price not found";
  const price = Number(priceBigInt) / 100000000;

  const metadataJson = nftdata[2]?.nonfungible?.metadata?.[0]?.json;
  const metadata = metadataJson ? JSON.parse(metadataJson) : null;
  console.log(metadata);
  const image = metadata?.imageurl1 ?? "image not found";
  // const quantity = Number(metadata?.nftquantity) ?? Number(nftdata?.[4]);
  // console.log(quantityy);

  const collid = collectiondata[1];
  console.log(collid);

  const getdata = async (collid, tokenindex, userid) => {
    setLoading(true);
    try {
      const userPrincipalArray = collid;

      const principalString = Principal.fromUint8Array(userPrincipalArray._arr);

      const result = await backendActor?.getSingleNonFungibleTokens(
        principalString,
        tokenindex,
        userid
      );
      console.log("in single token", result);
      setsingletokendata(result);
    } catch (error) {
      console.error("Error fetching listing:", error);

      return error; // Return error
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getdata(collid, tokenindex, userid);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // If there's no NFT data, return a message or redirect back
  if (!nftdata && !loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-white">No NFT data found</p>
      </div>
    );
  }

  const owner = singletokendata?.[0]?.[1];
  const isOwned = singletokendata?.[0]?.[4];
  // console.log(nftId);

  // const callingbutton = async () => {
  //   console.log("callingbutton called");
  //   setLoading(true);
  //   // Calculate the first NFT index
  //   const nftFirstindex = tokenindex - quantity + 1;
  //   console.log("NFT Range:", nftFirstindex, "to", tokenindex - 1);
  //   const principal = Principal.fromText(nftId);

  //   // const res = await backendActor?.getNftTokenId(principal, tokenindex);
  //   // console.log(res);

  //   const promises = [];

  //   // Loop through the range of token indices
  //   for (let index = nftFirstindex; index < tokenindex; index++) {
  //     console.log("Processing index:", index);
  //     promises.push(getNftTokenIdd(principal, index)); // Collect promises
  //   }

  //   // Wait for all calls to complete
  //   try {
  //     await Promise.all(promises);
  //     console.log("All NFTs processed successfully");
  //     setLoading(false);
  //     toast.success("All NFTs price processed successfully");
  //   } catch (error) {
  //     console.error("Error processing NFTs:", error);
  //   }
  // };

  // const getNftTokenIdd = async (collectionId, nftIdentifier) => {
  //   console.log("getNftTokenId called with:", collectionId, nftIdentifier);

  //   try {
  //     // Simulate API call to fetch NFT token ID
  //     const res = await backendActor?.getNftTokenId(
  //       collectionId,
  //       nftIdentifier
  //     ); // Replace with your actual API call
  //     console.log("NFT Token ID Response:", res);

  //     // If a valid response is received, call listPrice
  //     if (res) {
  //       await listPrice(collectionId, res, price);
  //     } else {
  //       console.warn("Invalid response for NFT Identifier:", nftIdentifier);
  //     }
  //   } catch (error) {
  //     console.error(
  //       "Error in getNftTokenId for NFT Identifier:",
  //       nftIdentifier,
  //       error
  //     );
  //     toast.error("Error fetching NFT Token ID");
  //   }
  // };

  // const listPrice = async (principal, tokenidentifier, price) => {
  //   console.log("listPrice called with:", principal, tokenidentifier, price);

  //   try {
  //     const finalPrice = price || null;
  //     const priceE8s = finalPrice ? finalPrice : null;

  //     const request = {
  //       token: tokenidentifier,
  //       from_subaccount: [],
  //       price: priceE8s ? [priceE8s] : [],
  //     };

  //     const result = await backendActor?.listprice(principal, request);
  //     if (result) {
  //       console.log("List Price Result:", result);
  //     } else {
  //       throw new Error("listprice is not working");
  //     }
  //   } catch (error) {
  //     console.error("Error listing price for token:", tokenidentifier, error);
  //     toast.error("Error listing price");
  //   }
  // };

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#282828">
      <div className="2xl:mt-[10vh] w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] mx-auto relative">
        {/* Top Corner Button */}
        {/* <div className="absolute top-4 right-4">
          <button
            onClick={callingbutton}
            className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-md shadow-md hover:bg-yellow-500"
          >
            for calling listprice
          </button>
        </div> */}

        {/* Back Button */}
        <div className="flex items-center justify-start w-full mb-5 pt-9 hover:cursor-pointer">
          <div className="hidden sm:block">
            {loading ? <Skeleton width={100} height={35} /> : <BackButton />}
          </div>
        </div>

        {/* NFT Details Section */}
        <div className="flex flex-col mt-12 md:flex-row sm:mt-0 ">
          {/* NFT Image */}
          <div className="flex justify-center md:justify-start mb-6 md:mb-0 w-full sm:w-[60%] md:w-[50%]">
            {loading ? (
              <Skeleton
                height="100%"
                width="100%"
                className="rounded-md w-full max-w-[85%] sm:max-w-[90%] md:max-w-[95%] aspect-square"
              />
            ) : (
              <img
                src={image}
                alt="NFT Thumbnail"
                className="object-full rounded-md w-full max-w-[85%] sm:max-w-[90%] md:max-w-[95%] aspect-square"
              />
            )}
          </div>

          {/* NFT Details Card */}
          <div className="flex flex-col justify-center w-[95%] md:w-[60%] lg:w-[60%] bg-[#29292c] mb-4 md:mb-0 rounded-md p-6 gap-4 mx-4 sm:mx-auto">
            {loading ? (
              <div className="flex flex-col gap-1">
                <Skeleton className="h-[25px] w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%]" />
                <Skeleton className="h-[25px] w-[85%] sm:w-[70%] md:w-[60%] lg:w-[50%]" />
                <Skeleton className="h-[25px] w-[70%] sm:w-[60%] md:w-[50%] lg:w-[40%]" />
                <Skeleton className="h-[25px] w-[75%] sm:w-[60%] md:w-[50%] lg:w-[40%]" />
                <Skeleton className="h-[25px] w-[60%] sm:w-[50%] md:w-[40%] lg:w-[30%]" />
                <Skeleton className="h-[25px] w-[55%] sm:w-[50%] md:w-[40%] lg:w-[30%]" />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-lg text-white">
                  <span className="font-semibold">NFT Name: </span>
                  <span>
                    {nftdata[2]?.nonfungible?.name ?? "Name not found"}
                  </span>
                </p>
                <p className="text-lg text-white">
                  <span className="font-semibold">Collection: </span>
                  <span>{collectiondata[2] || "Not Available"}</span>
                </p>
                <p className="text-lg text-white">
                  <span className="font-semibold">NFT ID: </span>
                  <span className="text-yellow-500">{nftId || identifier}</span>
                </p>
                <p className="text-lg text-white">
                  <span className="font-semibold">Owner: </span>
                  <span className="text-green-800">{owner || "Unknown"}</span>
                </p>
                <p className="text-lg text-white">
                  <span className="font-semibold">Price: </span>
                  <span>{price || "Not Listed"} ICP</span>
                  <span className="ml-12 font-semibold ">Nft Type: </span>
                  <span className="mr-1">{metadata?.nftType || "Null"}</span>
                </p>
                <p className="text-lg text-white">
                  <span className="font-semibold">Nft Season: </span>
                  <span>{metadata?.nftSeason || "Null"}</span>
                </p>
                <p className="text-lg text-white">
                  <span className="font-semibold ">Nft Rarity: </span>
                  <span>{metadata?.newtype || "Null"}</span>
                  <span className="ml-12 font-semibold">Listed: </span>
                  <span className="mr-1">{isOwned ? "Yes" : "No"}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default NftDetails;
