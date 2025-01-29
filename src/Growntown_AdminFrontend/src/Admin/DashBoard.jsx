import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuths } from "../utils/useAuthClient.jsx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { SkeletonTheme } from "react-loading-skeleton";

function DashBoard() {
  const { backendActor } = useAuths();
  const [user, setUser] = useState();
  const [nfts, setnfts] = useState();
  const [collections, setcollections] = useState();
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const { isAuthenticated } = useAuths();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else {
      const fetching = async () => {
        setloading(true);
        await Promise.all([getTotalNFT(), getTotalUser(), getallcollection()]);
        setloading(false);
      };
      fetching();
    }
  }, [navigate]);

  const getTotalNFT = async () => {
    setloading(true);
    if (backendActor) {
      try {
        const result = await backendActor?.getTotalNFTs();
        setnfts(Number(result));
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      }
    }
  };

  const getTotalUser = async () => {
    setloading(true);
    if (backendActor) {
      try {
        const result = await backendActor?.getTotalUsers();
        setUser(Number(result));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
  };

  const getallcollection = async () => {
    setloading(true);
    if (backendActor) {
      try {
        const result = await backendActor?.totalcollections();
        setcollections(Number(result));
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    }
  };

  return (
    <SkeletonTheme baseColor="#151515" highlightColor="#222222">
      <div className="bg-[#0D0D0D] min-h-full text-white mx-auto text-center w-full px-4 sm:px-8 md:px-16 pt-10 rounded-2xl">
        {loading ? (
          <div className="grid justify-center grid-cols-1 gap-6 sm:gap-8 mx-auto md:grid-cols-2 lg:grid-cols-3 max-w-screen-xl font-Quicksand sm:font-bold md:text-lg">
            <div className="h-40 sm:h-48 rounded-xl">
              <Skeleton height="100%" />
            </div>
            <div className="h-40 sm:h-48 rounded-xl">
              <Skeleton height="100%" />
            </div>
            <div className="h-40 sm:h-48 rounded-xl">
              <Skeleton height="100%" />
            </div>
          </div>
        ) : (
          <div className="grid justify-center grid-cols-1 gap-6 sm:gap-8 mx-auto md:grid-cols-2 lg:grid-cols-3 max-w-screen-xl font-Quicksand sm:font-bold md:text-lg">
            <div className="bg-gradient-to-r from-[#1C1C1E] to-[#29292C] px-6 py-6 h-40 sm:h-48 flex flex-col justify-center rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-300">Total Collections</h3>
              <p className="font-ironman text-3xl sm:text-4xl lg:text-5xl text-white">{collections}</p>
            </div>
            <div className="bg-gradient-to-r from-[#1A1A1D] to-[#25252B] px-6 py-6 h-40 sm:h-48 flex flex-col justify-center rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-300">Total NFTs</h3>
              <p className="font-ironman text-3xl sm:text-4xl lg:text-5xl text-white">{nfts}</p>
            </div>
            <div className="bg-gradient-to-r from-[#18181B] to-[#2C2C31] px-6 py-6 h-40 sm:h-48 flex flex-col justify-center rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-300">Total Users</h3>
              <p className="font-ironman text-3xl sm:text-4xl lg:text-5xl text-white">{user}</p>
            </div>
          </div>
        )}
      </div>
    </SkeletonTheme>
  );
}

export default DashBoard;
