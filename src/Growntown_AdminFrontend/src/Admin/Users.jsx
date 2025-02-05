import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAuths } from "../utils/useAuthClient.jsx";
import { Principal } from "@dfinity/principal";
import toast from "react-hot-toast";
import { addUserSearchData } from "../redux/universalSearchSlice.js";
import { useDispatch } from "react-redux";
import BackButton from "./collection/BackButton.jsx";

function Users() {
  const { backendActor } = useAuths();
  const [loading, setLoading] = useState(false);
  const [alluser, setalluser] = useState([]);
  const [currentpage, setcurrentpage] = useState(1);
  const [totalpage, settotalpage] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch=useDispatch()

  const getallDUser = async () => {
    if (backendActor) {
      try {
        const result = await backendActor?.getAllUsers(10, currentpage - 1);
        if (result.err === "No users found") {
          setalluser([]);
        } else {
          setalluser(result.ok.data);
          settotalpage(Number(result.ok.total_pages));
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }
  };

  useEffect(()=>{
    if(alluser){
      dispatch(addUserSearchData({alluser}));
    }
  },[alluser])

  useEffect(() => {
    setLoading(true);
    getallDUser().then(() => setLoading(false));
  }, [currentpage]);



  const leftfunction =async () => {
    if (currentpage > 1) {
      setcurrentpage((prev) => prev - 1);
    } else {
      toast.error("You are on the first page");
    }
    setcurrentpage(currentpage - 1);
    await getallDUser();
  };

  const rightfunction =async () => {
    if (currentpage < totalpage) {
      setcurrentpage((prev) => prev + 1);
    } else {
      toast.error("You are on the last page");
    }
    setcurrentpage(currentpage + 1);
    await getallDUser();
  };

  return (
    <div className="w-full mx-2 h-full  px-4 sm:px-8 md:px-16 pt-10 text-white flex flex-col items-center rounded-xl">
    <div className="flex justify-between items-center w-full ">
      <BackButton />
    </div>

        <div className="flex flex-col justify-center text-white w-full mx-auto mt-10">
        <div className="overflow-x-auto border w-full border-[#50B248] rounded-2xl">
            <table className="w-full border text-left">
              <thead className="bg-[#50B248]">
                <tr className="text-center custom-poppins">
                  <th className="px-4 py-3 text-black w-1/4">Name</th>
                  <th className="px-4 py-3 text-black w-1/4">Email</th>
                  <th className="px-4 py-3 text-black w-1/4">Principal</th>
                  <th className="px-4 py-3 text-black w-1/4">Details</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array(5).fill("").map((_, index) => (
                    <tr key={index} className="border-t border-gray-600 ">
                      <td className="px-4 py-3 text-center flex items-center gap-2">
                        <Skeleton circle height={30} width={30} baseColor="#202020" highlightColor="#282828" />
                        <Skeleton height={20} width={150} baseColor="#202020" highlightColor="#282828" />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Skeleton height={20} width="80%" baseColor="#202020" highlightColor="#282828" />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Skeleton height={20} width="60%" baseColor="#202020" highlightColor="#282828" />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Skeleton height={20} baseColor="#202020" highlightColor="#282828" />
                      </td>
                    </tr>
                  ))
                ) : alluser.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-center text-gray-400">
                      No users found
                    </td>
                  </tr>
                ) : (
                  alluser.map((user, index) => {
                    const userPrincipalArray = user[0];
                    const principal = userPrincipalArray
                      ? Principal.fromUint8Array(userPrincipalArray._arr).toText()
                      : null;
                    return (
                      <tr key={index} className={` hover:bg-gray-800 whitespace-nowrap text-white `}>
                        <td className="px-4 py-3 text-center">
                          <img src="/image/admin.png" alt="" className="w-8 h-8 rounded-full mr-4 inline-block" />
                          {user[3]}
                        </td>
                        <td className="px-4 py-3 text-center">{user[4]}</td>
                        <td className="px-4 py-3 text-center">
                          {principal ? `${principal.slice(0, 5)}...${principal.slice(principal.length - 6)}` : "No ID available"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Link to={`/Admin/users/${principal}`} state={{ user }} className="inline-block px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded hover:bg-yellow-400 hover:text-black">
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-5">
            {currentpage > 1 && (
              <button onClick={leftfunction} className="px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-full hover:bg-black">&lt;</button>
            )}
            <span className="mx-4 px-4 py-2 bg-[#50B248] cursor-pointer border border-black rounded-full">{currentpage}</span>
            {currentpage < totalpage && (
              <button onClick={rightfunction} className="px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-full hover:bg-black">&gt;</button>
            )}
          </div>
      
      </div>
    </div>
  );
}

export default Users;
