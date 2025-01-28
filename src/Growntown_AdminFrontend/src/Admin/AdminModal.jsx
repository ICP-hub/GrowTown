import React, { useEffect, useState } from 'react';
import { useAuths } from '../utils/useAuthClient';
import { CopyToClipboard } from "react-copy-to-clipboard";
import { MdContentCopy } from 'react-icons/md';
import { FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { IoMdLogOut } from "react-icons/io";

const AdminModal = () => {
    const { principal,fetchBalance, logout } = useAuths();
    const [Copied, setCopied] = useState(false);
    
    const fetchBal=async()=>{
       console.log('balance', await fetchBalance())
    } 

    useEffect(()=>{
        fetchBal();
    },[fetchBalance])

    const handleLogout=async()=>{
        await logout();
    }

    const handleCopy = () => {
        toast.success("Copied");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="rounded-xl text-white bg-[#161618] border shadow-xl border-[#50B248]/30 shadow-[#50B248]/10 transition-all duration-300 ease-in-out transform hover:scale-105">
            <div className="bg-gradient-to-b from-[#3D9635] to-[#50B248] h-12 w-full rounded-t-lg"></div>
            
            <div className="p-4 px-5 -mt-8">
                <div className="flex gap-2 items-center">
                    <img
                        className="relative w-10 h-10 rounded-full object-cover border-2 border-[#50B248]/20 transition-all duration-300 ease-in-out hover:scale-110"
                        src="/images/Admin.svg"
                        alt="Admin"
                    />
                    <h1 className="mt-4 transition-all duration-300 ease-in-out hover:text-[#50B248]"> Admin </h1>
                </div>
                <div className="mt-1.5">
                    <h1 className="transition-all duration-300 ease-in-out hover:text-[#50B248]">Address:</h1>
                    <div className="flex items-center justify-between">
                        <input
                            value={principal ? `${principal.slice(0, 5)}......${principal.slice(-6)}` : "No User"}
                            readOnly
                            className="text-sm bg-transparent hover:text-[#50B248] text-white w-[110px] outline-none transition-all duration-300 ease-in-out"
                        />
                        {principal && (
                            <CopyToClipboard text={principal} onCopy={handleCopy}>
                                <button className="rounded-md hover:bg-white/5 transition-all duration-300 ease-in-out transform hover:scale-110">
                                    {!Copied ?
                                        <MdContentCopy className="w-4 h-4 text-gray-400 transition-all duration-300 ease-in-out" /> :
                                        <FaCheckCircle className="w-4 h-4 text-[#50B248] transition-all duration-300 ease-in-out" />
                                    }
                                </button>
                            </CopyToClipboard>
                        )}
                    </div>
                </div>

                <div className="mt-2 text-sm transition-all duration-300 ease-in-out hover:text-[#50B248]">
                    Balance: 0.004
                </div>

                <div className='flex gap-x-1 mt-5 pt-2 border-t border-gray-700 items-center hover:text-red-500 cursor-pointer' onClick={handleLogout}>
                    <IoMdLogOut/>
                    <h1>Logout</h1>
                </div>
            </div>
        </div>
    );
};

export default AdminModal;


