import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdContentCopy } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAuths } from "../utils/useAuthClient.jsx";
import { Principal } from "@dfinity/principal";
import { CopyToClipboard } from "react-copy-to-clipboard";
import toast from "react-hot-toast";

function Allorder() {
  const { backendActor } = useAuths();
  const [loading, setLoading] = useState(false);
  const [allorder, setallorder] = useState([]);
  let [currentpage, setcurrentpage] = useState(1);
  const [totalpage, settotalpage] = useState();

  const getallorder = async () => {
    if (backendActor) {
      try {
        const result = await backendActor?.getallOrders(10, currentpage - 1);
        console.log(result);

        if (result.err === "No orders found") {
          setallorder([]);
        } else {
          setallorder(Array.isArray(result.ok.data) ? result.ok.data : []);
          setcurrentpage(Number(result.ok.current_page));
          settotalpage(Number(result.ok.total_pages));
        }
      } catch (error) {
        console.error("Error fetching allorders:", error);
        setallorder([]);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getallorder();
    };

    fetchData();
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
    await getallorder();
  };

  const rightfunction = async () => {
    if (currentpage >= totalpage) {
      toast.error("You are on the last page");
      return;
    }
    setcurrentpage((prev) => prev + 1);
    await getallorder();
  };

  return (

    <div className="rounded-xl p-6 w-full max-w-6xl shadow-lg m-auto  bg-[#0D0D0D] overflow-y-scroll px-10 pb-8 h-full no-scrollbar ">
      <div className="flex flex-col items-center justify-center text-white">
        {/* Table */}
        <div className="w-[90%] md:w-[85%] mx-auto mt-10 ">
          <div className="overflow-x-auto border border-[#50B248]">
            <table className="table-auto w-full   text-left">
              <thead className="bg-[#50B248]">
                <tr>
                  <th className="p-4 text-center text-black ">Serial No.</th>
                  <th className="p-4 text-center text-black ">Order Id</th>
                  <th className="p-4 text-center text-black ">Principal</th>
                  <th className="p-4 text-center text-black ">Details</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array(5)
                    .fill("")
                    .map((_, index) => (
                      <tr key={index} className="border-b border-gray-700">
                        <td className="p-4 text-center">
                          <Skeleton height={20} width="80%" />
                        </td>
                        <td className="p-4 text-center">
                          <Skeleton height={20} width="80%" />
                        </td>
                        <td className="p-4 text-center">
                          <Skeleton height={20} width="60%" />
                        </td>
                        <td className="p-4 text-center">
                          <Skeleton height={20} width="60%" />
                        </td>
                      </tr>
                    ))
                ) : Array.isArray(allorder) && allorder.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-4 text-center text-gray-400 border-b border-gray-700"
                    >
                      No order found
                    </td>
                  </tr>
                ) : (
                  Array.isArray(allorder) &&
                  allorder.map((orderdata, index) => {
                    const userPrincipalArray = orderdata.collectionCanisterId;
                    const principal = userPrincipalArray
                      ? Principal.fromUint8Array(userPrincipalArray._arr).toText()
                      : null;

                    const userorderArray = orderdata.accountIdentifier;
                    const orderid = userorderArray
                      ? Principal.fromUint8Array(userorderArray._arr).toText()
                      : null;



                    if (!orderid) {
                      return (
                        <tr key={index}>
                          <td
                            colSpan={4}
                            className="p-4 text-center text-gray-400 border-b border-gray-700"
                          >
                            No order found
                          </td>
                        </tr>
                      );
                    }


                    return (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}
                      >
                        <td className="p-4 text-center text-gray-200">{index + 1}</td>
                        <td className="p-4 text-center text-gray-200">
                          {`${orderid.slice(0, 4)}...${orderid.slice(-4)}`}
                          <CopyToClipboard text={orderid} onCopy={handleCopy}>
                            <button className="ml-3">
                              <MdContentCopy />
                            </button>
                          </CopyToClipboard>
                        </td>
                        <td className="p-4 text-center text-gray-200">
                          {`${principal.slice(0, 4)}...${principal.slice(-4)}`}
                          <CopyToClipboard text={principal} onCopy={handleCopy}>
                            <button className="ml-3">
                              <MdContentCopy />
                            </button>
                          </CopyToClipboard>
                        </td>
                        <td className="p-4 text-center">
                          <Link
                            to={`/Admin/activity/allorder/${principal}`}
                            state={{ orderdata }}
                            className="px-3 py-1 text-white bg-gray-900 border border-gray-500 rounded-md hover:bg-yellow-400 hover:text-black"
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
          <div className="mt-10 flex justify-center items-center gap-4">
            {currentpage > 1 && (
              <button
                className="px-4 py-2 bg-gray-900 text-white border border-gray-500 rounded-md hover:bg-black"
                onClick={leftfunction}
              >
                &lt;
              </button>
            )}
            <button className="px-4 py-2 bg-green-500 text-black border border-black rounded-md">
              {currentpage}
            </button>
            {currentpage < totalpage && (
              <button
                className="px-4 py-2 bg-gray-900 text-white border border-gray-500 rounded-md hover:bg-black"
                onClick={rightfunction}
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

export default Allorder;
