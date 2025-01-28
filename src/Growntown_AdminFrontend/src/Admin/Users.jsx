import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAuths } from "../utils/useAuthClient.jsx";
import { Principal } from "@dfinity/principal";
import toast from "react-hot-toast";

function Users() {
  const { backendActor } = useAuths();
  const [loading, setLoading] = useState(false);
  const [alluser, setalluser] = useState([]);
  const [currentpage, setcurrentpage] = useState(1);

  const [totalpage, settotalpage] = useState();
  const [searchTerm, setSearchTerm] = useState("");

  const getallDUser = async () => {
    if (backendActor) {
      try {
        const result = await backendActor?.getAllUsers(10, currentpage - 1);
        if (result.err === "No users found") {
          setalluser([]);
        } else {
          setalluser(result.ok.data);
          setcurrentpage(Number(result.ok.current_page));
          settotalpage(Number(result.ok.total_pages));
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getallDUser();
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredUsers = alluser.filter((user) =>
    user[3].toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearSearch = () => {
    setSearchTerm("");
  };

  const leftfunction = async () => {
    if (currentpage === 1) {
      toast.error("You are on the first page");
    }
    currentpage -= 1;
    await getallDUser();
  };

  const rightfunction = async () => {
    if (currentpage > totalpage) {
      toast.error("You are on the last page");
    }
    currentpage += 1;
    await getallDUser();
  };

  return (
    <div className="w-full px-4 md:px-10  min-h-screen mx-auto pt-4 bg-[#121212] text-white flex flex-col items-center rounded-2xl">
      <h2 className="text-2xl font-semibold text-white mb-4 text-start">Users</h2>
      <div className="w-full flex flex-col items-center">
        {/* Search Box */}
        <div className="flex items-center w-full mb-4">
          <input
            type="text"
            placeholder="Search by Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 px-4 text-white bg-[#1E1E1E] border border-[#50B248] rounded-md focus:outline-none placeholder-gray-400"
          />
          <button
            onClick={clearSearch}
            className="h-10 w-10 ml-2 flex justify-center items-center text-red-500 bg-transparent border border-red-500 rounded-md hover:bg-red-500 hover:text-white"
          >
            <IoMdClose size={20} />
          </button>
        </div>

        {/* Table */}
        <div className="mt-5 w-full">
          <div className="overflow-x-auto">
            <table className="w-full border border-[#50B248] text-left">
              <thead className="bg-[#50B248]">
                <tr className="text-center">
                  <th className="px-4 py-3 text-black w-1/4">Name</th>
                  <th className="px-4 py-3 text-black w-1/4">Email</th>
                  <th className="px-4 py-3 text-black w-1/4">Principal</th>
                  <th className="px-4 py-3 text-black w-1/4">Details</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  Array(5)
                    .fill("")
                    .map((_, index) => (
                      <tr key={index} className="border-t border-gray-600">
                        <td className="px-4 py-3 text-center  flex items-center gap-2">
                          <Skeleton circle height={30} width={30}  baseColor="#202020" highlightColor="#282828"  />
                          <Skeleton height={20} width={150} baseColor="#202020" highlightColor="#282828"  />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Skeleton height={20} width="80%" baseColor="#202020" highlightColor="#282828" />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Skeleton height={20} width="60%" baseColor="#202020" highlightColor="#282828"  />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Skeleton height={20} baseColor="#202020" highlightColor="#282828" />
                        </td>
                      </tr>
                    ))
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-center text-gray-400">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => {
                    const userPrincipalArray = user[0];
                    const principal = userPrincipalArray
                      ? Principal.fromUint8Array(userPrincipalArray._arr).toText()
                      : null;

                    return (
                      <tr
                        key={index}
                        className={`bg-[#29292C]  hover:bg-gray-800 whitespace-nowrap text-white`}
                      >
                        <td className="px-4 py-3 text-center">
                          <img
                            src="/image/admin.png"
                            alt=""
                            className="w-8 h-8 rounded-full mr-4 inline-block"
                          />
                          {user[3]}
                        </td>
                        <td className="px-4 py-3 text-center">{user[4]}</td>
                        <td className="px-4 py-3 text-center">
                          {principal
                            ? `${principal.slice(0, 5)}...${principal.slice(principal.length - 6)}`
                            : "No ID available"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Link
                            to={`/Admin/users/${principal}`}
                            state={{ user }}
                            className="inline-block px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded hover:bg-yellow-400 hover:text-black"
                          >
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

          {/* Pagination */}
          <div className="flex justify-center mt-5">
            {currentpage > 1 && (
              <button
                onClick={leftfunction}
                className="px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded hover:bg-black"
              >
                &lt;
              </button>
            )}
            <span className="mx-4 px-4 py-2 bg-[#50B248] cursor-pointer hover:bg-gray-700 hover:text-white border border-black rounded-lg">
              {currentpage}
            </span>
            {currentpage < totalpage && (
              <button
                onClick={rightfunction}
                className="px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded hover:bg-black"
              >
                &gt;
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
