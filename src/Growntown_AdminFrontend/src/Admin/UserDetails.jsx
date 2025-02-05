import React, { useEffect, useState } from "react";
import BackButton from "./collection/BackButton";
import { useAuths } from "../utils/useAuthClient.jsx";
import { Principal } from "@dfinity/principal";
import { useLocation } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const UserDetails = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { backendActor } = useAuths();
  const location = useLocation();
  const { user } = location.state || {};

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telegram, setTelegram] = useState("");
  const [image, setImage] = useState("");
  const [principal, setPrincipal] = useState("");
  const [userId, setUserId] = useState("");

  const userPrincipalArray = user?.[0];
  const principalString = Principal.fromUint8Array(userPrincipalArray._arr);

  const getUserDetail = async (principalString) => {
    if (backendActor) {
      try {
        const result = await backendActor?.getUserDetails(principalString);
        setData(result);

        const userPrincipalArray = result.ok[0];
        const principalStringg = Principal.fromUint8Array(userPrincipalArray._arr).toText();

        setPrincipal(principalStringg);
        setUserId(result.ok[1]);
        setName(result.ok[3]);
        setEmail(result.ok[4]);
        setTelegram(result.ok[5]);
        setImage(result.ok[6]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }
  };

  useEffect(() => {
    getUserDetail(principalString);
  }, []);

  return (
    <SkeletonTheme baseColor="#1a1a1d" highlightColor="#333">
      <div className="px-4 sm:px-8 md:px-16 py-10 mx-auto max-w-7xl">
        {/* Back Button */}
        <div className="flex items-center justify-start w-full mb-6">
          {loading ? <Skeleton width={1210} height={35} /> : <BackButton />}
        </div>

        {/* Profile Card */}
        <div className="flex flex-col items-center gap-6 backdrop-blur-md bg-[#29292c]/40 p-6 sm:p-10 rounded-2xl shadow-lg max-w-3xl mx-auto">
          {/* Cover Image */}
          <div className="relative w-full">
            <div className="bg-gradient-to-r from-[#3D9635] to-[#50B248] h-32 sm:h-36 w-full rounded-t-lg"></div>
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
              {loading ? (
                <Skeleton circle width={120} height={120} />
              ) : (
                <img
                  src={
                    image?.length ? image[0] : 
                    "/images/Admin.png"}
                  alt={`Image of ${name}`}
                  className="rounded-full h-24 w-24 sm:h-36 sm:w-36 border-2 text-center border-gray-700 shadow-lg"
                />
              )}
            </div>
          </div>

          {/* User Information */}
          <div className="flex flex-col items-center text-center mt-10 mb-2">
            {loading ? (
              <>
                <Skeleton width={180} height={25} />
                <Skeleton width={250} height={25} />
              </>
            ) : (
              <>
                <h1 className="text-white text-xl sm:text-2xl font-semibold">{name || "Name not available"}</h1>
                <p className="text-gray-400 text-sm sm:text-lg mt-2">{email || "Not provided"}</p>
              </>
            )}
          </div>

          {/* Profile Details */}
          <div className="w-full bg-gray-800/50 p-4 sm:p-6 rounded-lg shadow-md">
            {loading ? (
              <Skeleton count={4} height={20} />
            ) : (
              <ul className="text-gray-300 text-sm sm:text-base space-y-4">
                <li className="flex flex-col sm:flex-row sm:items-center">
                  <span className="font-medium text-gray-400 w-24">Telegram:</span>
                  <span>{telegram || "Not provided"}</span>
                </li>
                <li className="flex flex-col sm:flex-row sm:items-center">
                  <span className="font-medium text-gray-400 w-24">User ID:</span>
                  <span>{userId || "N/A"}</span>
                </li>
                <li className="flex flex-col sm:flex-row sm:items-center">
                  <span className="font-medium text-gray-400 w-24">Principal:</span>
                  <span className="break-all">{principal || "N/A"}</span>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default UserDetails;