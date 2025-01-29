import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdContentCopy } from "react-icons/md";
import { CopyToClipboard } from "react-copy-to-clipboard";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAuths } from "../utils/useAuthClient.jsx";
import BackButton from "./collection/BackButton.jsx";
import Buttons from "../Common/Buttons.jsx";

function Users() {
  const { backendActor } = useAuths();
  const [loading, setLoading] = useState(false);
  const [alldata, setalldata] = useState([]);
  const [currentpage, setcurrentpage] = useState(1);
  const [totalpage, settotalpage] = useState();

  const gettransactions = async () => {
    if (backendActor) {
      try {
        const result = await backendActor?.alltransactions(10, currentpage - 1);
        if (result.err === "No transactions found") {
          setalldata([]);
        } else {
          setalldata(result.ok.data);
          setcurrentpage(Number(result.ok.current_page));
          settotalpage(Number(result.ok.total_pages));
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchCollection = async () => {
      setLoading(true);
      await gettransactions();
    };
    fetchCollection();
  }, []);

  const handleCopy = () => {
    toast.success("Copied");
  };

  const leftfunction = async () => {
    if (currentpage === 1) {
      toast.error("You are on the first page");
      return;
    }
    setcurrentpage((prev) => prev - 1);
    await gettransactions();
  };

  const rightfunction = async () => {
    if (currentpage >= totalpage) {
      toast.error("You are on the last page");
      return;
    }
    setcurrentpage((prev) => prev + 1);
    await gettransactions();
  };

  return (
    <div className="w-full mx-2 h-full  px-10 text-white flex flex-col items-center rounded-xl">
      <div className="flex justify-between items-center w-full mb-6 mt-5">
        <BackButton />
        <div className="flex space-x-4">
          <Link to="/Admin/activity/allorder">
            <Buttons buttonName="All Orders" bgColor="white" textColor="black" />
          </Link>
        </div>
      </div>

      <div className="flex flex-col justify-center text-white w-full mx-auto mt-10">
        <div className="overflow-x-auto border border-[#50B248]">
          <table className="table-auto w-full text-left">
            <thead className="bg-[#50B248] whitespace-nowrap">
              <tr>
                <th className="p-4 text-center text-black w-1/5">Serial No.</th>
                <th className="p-4 text-center text-black w-1/5">Token Identifier</th>
                <th className="p-4 text-center text-black w-1/5">Buyer</th>
                <th className="p-4 text-center text-black w-1/5">Price</th>
                <th className="p-4 text-center text-black w-1/5">Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill("").map((_, index) => (
                  <tr key={index} className="border-b border-gray-700">
                        <td className="p-4 text-center">
                          <Skeleton height={20} width="80%" baseColor="#202020" highlightColor="#282828" />
                        </td>
                        <td className="p-4 text-center">
                          <Skeleton height={20} width="150px" baseColor="#202020" highlightColor="#282828"  />
                        </td>
                        <td className="p-4 text-center">
                          <Skeleton height={20} width="80%" baseColor="#202020" highlightColor="#282828" />
                        </td>
                        <td className="p-4 text-center">
                          <Skeleton height={20} width="60%" baseColor="#202020" highlightColor="#282828"  />
                        </td>
                        <td className="p-4 text-center">
                          <Skeleton height={20} width="40%" baseColor="#202020" highlightColor="#282828"  />
                        </td>
                      </tr>
                ))
              ) : alldata.length > 0 ? (
                alldata.map((user, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}>
                    <td className="p-4 text-center text-white">{index + 1}</td>
                    <td className="p-4 text-center">{user[1]}</td>
                    <td className="p-4 text-center text-white">{user[2]?.buyer}</td>
                    <td className="p-4 text-center text-white">{Number(user[2].price) / 100000000} ICP</td>
                    <td className="p-4 text-center text-white">Just now</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-400 border-b border-gray-700">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-10 flex justify-center items-center gap-4">
          {currentpage > 1 && (
            <button className="px-4 py-2 bg-gray-900 text-white border border-gray-500 rounded-md hover:bg-black" onClick={leftfunction}>
              &lt;
            </button>
          )}
          <button className="px-4 py-2 bg-[#50B248] text-black border border-black rounded-md">
            {currentpage}
          </button>
          {currentpage < totalpage && (
            <button className="px-4 py-2 bg-gray-900 text-white border border-gray-500 rounded-md hover:bg-black" onClick={rightfunction}>
              &gt;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Users;