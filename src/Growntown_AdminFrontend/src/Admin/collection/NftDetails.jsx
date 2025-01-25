import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import BackButton from "./BackButton";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAuths } from "../../utils/useAuthClient.jsx";
import { Principal } from "@dfinity/principal";
import toast from "react-hot-toast";

const NftDetails = () => {
  const { collectionId, nftId } = useParams();
  const { backendActor } = useAuths();
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#1a1a1a] to-black pt-8 px-4">
        <div className="2xl:mt-[5vh] w-full sm:w-[95%] md:w-[90%] lg:w-[85%] xl:w-[80%] mx-auto relative">
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
          <div className="flex items-center justify-start w-full mb-6">
            <div className="hidden sm:block">
              {loading ? (
                <Skeleton width={1210} height={35} />
              ) : (
                <BackButton className="hover:scale-105 transition-transform duration-300" />
              )}
            </div>
          </div>

          {/* NFT Details Section */}
          <div className="flex flex-col lg:flex-row gap-6 backdrop-blur-sm bg-[#29292c]/40 p-6 rounded-2xl shadow-2xl">
            {/* NFT Image Section */}
            <div className="flex justify-center lg:justify-start lg:w-1/2">
              {loading ? (
                <div className="w-full h-[500px]"> {/* Added wrapper div for full width */}
                  <Skeleton height="100%" width="100%" className="rounded-xl w-[80%]" />
                </div>
              ) : (
                <div className="relative group w-full">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                  <img
                    src={image}
                    alt="NFT Thumbnail"
                    className="relative rounded-xl w-full h-[500px] object-cover transform transition duration-500 group-hover:scale-[1.02]"
                  />
                </div>
              )}
            </div>

            {/* NFT Details Card */}
            <div className="lg:w-1/2">
              {loading ? (
                <div className="flex flex-col gap-6 w-full">
                  {/* Title and Collection */}
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <Skeleton height={40} width="100%" />
                    <Skeleton height={40} width="100%" />
                  </div>

                  {/* Price and Type Section */}
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <Skeleton height={80} width="100%" />
                    <Skeleton height={80} width="100%" />
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
                    <Skeleton height={60} width="100%" />
                    <Skeleton height={60} width="100%" />
                    <Skeleton height={60} width="100%" />
                    <Skeleton height={60} width="100%" />
                  </div>

                  {/* Owner Section */}
                  <Skeleton height={70} width="100%" />
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {/* NFT Title and Collection Info in same row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 md:col-span-1">
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        {nftdata[2]?.nonfungible?.name ?? "Name not found"}
                      </h1>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <p className="text-gray-400">Collection</p>
                      <p className="text-lg text-white font-medium">{collectiondata[2] || "Not Available"}</p>
                    </div>
                  </div>

                  {/* Price and Type Section - 2 columns */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="px-4 py-2 bg-[#50B248]/10 rounded-xl border border-[#50B248]/20">
                      <p className="text-sm text-gray-400">Price</p>
                      <p className="text-xl font-semibold text-[#50B248]">{price || "Not Listed"} ICP</p>
                    </div>
                    <div className="px-4 py-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
                      <p className="text-sm text-gray-400">Type</p>
                      <p className="text-xl font-semibold text-purple-400">{metadata?.nftType || "Null"}</p>
                    </div>
                  </div>

                  {/* Details Grid - 4 columns */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-white/5 rounded-xl">
                      <p className="text-sm text-gray-400">Season</p>
                      <p className="text-base text-white">{metadata?.nftSeason || "Null"}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl">
                      <p className="text-sm text-gray-400">Rarity</p>
                      <p className="text-base text-white">{metadata?.newtype || "Null"}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl">
                      <p className="text-sm text-gray-400">NFT ID</p>
                      <p className="text-base text-yellow-500 font-mono truncate">{nftId || identifier}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl">
                      <p className="text-sm text-gray-400">Status</p>
                      <span className={`px-2 py-0.5 rounded-full text-sm ${
                        isOwned ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {isOwned ? "Listed" : "Not Listed"}
                      </span>
                    </div>
                  </div>

                  {/* Owner Section */}
                  <div className="p-3 bg-white/5 rounded-xl">
                    <p className="text-sm text-gray-400">Owner</p>
                    <p className="text-base text-white font-mono truncate">{owner || "Unknown"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default NftDetails;
