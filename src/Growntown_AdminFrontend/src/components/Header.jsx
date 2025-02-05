import React, { useEffect, useState } from 'react';
import { ConnectWallet, useBalance, useIdentityKit } from "@nfid/identitykit/react";
import { useAuths } from '../utils/useAuthClient';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';




const ConnectBtn = ({ onClick }) => {
    const { login, isAuthenticated } = useAuths();

    return (
        <button
            onClick={login}
            className="w-[120px] md:w-[150px] lg:w-[190px] h-[25px] lg:h-[32px] 
          dxl:h-[35px] text-[10px] md:text-[15px] dlg:text-[19px] font-[400] items-center justify-center  rounded-full  bg-gradient-to-r from-[#f09787]  to-[#CACCF5]"
        >
            <div className=" relative w-full h-full hover:scale-105 transition-all duration-300  rounded-full flex items-center justify-center ">
                <h1 className="text-white sm:text-lg font-bold absolute my-auto"> Connect Wallet </h1>
                <img src='images/ButtonCustom.png' className='h-full w-full   rounded-full  object-cover' draggable='false'
                    loading="lazy" />

            </div>


        </button>
    );
}



const Header = () => {
    const { isAuthenticated, logout } = useAuths();
    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/admin/dashboard")
        }
    }, [isAuthenticated])

    const navText = ['Characters', 'About', 'Gameplay', 'Subscribe'];

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className='w-full top-0 bg-[#D9D9D93D] z-50 fixed backdrop-blur-lg'>
            <nav className="bg-transparent text-white px-6 py-4 shadow-md">
                <div className="container mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <a href='#heroPage'>
                            <img src="images/GrowTownLogo .png" alt="logo" className="h-10 sm:h-16 w-auto" draggable='false'
                                loading="lazy" />
                        </a>
                    </div>

                    {/* Desktop Menu */}
                    <ul className="hidden md:flex  md:text-xl font-bold text-[#4B2519] space-x-6">
                        {navText.map((text, index) => (
                            <a href={`#${text}`} key={index}>
                                <li className="hover:text-[#FFF3C5] cursor-pointer text-2xl">
                                    {text}
                                </li>
                            </a>
                        ))}
                    </ul>

                    {/* Connect Wallet */}
                    <div className="hidden md:flex space-x-5">

                        <div className="hidden font-posterama md:block">
                            <ConnectWallet
                                connectButtonComponent={ConnectBtn}
                                className="rounded-full bg-black"
                            />
                        </div>





                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden flex items-center focus:outline-none"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    </button>
                </div>

                {/* Mobile Dropdown Menu */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <ul className="flex flex-col space-y-2 text-black font-bold mt-4">
                        {navText.map((text, index) => (
                            <a href={`#${text}`} key={index}>
                                <li
                                    className="hover:text-[#FFF3C5] cursor-pointer text-center py-2 border-b border-gray-700"
                                >
                                    {text}
                                </li>
                            </a>
                        ))}
                    </ul>
                    <div className="flex justify-center mt-4 space-x-4">

                        <ConnectWallet
                            connectButtonComponent={ConnectBtn}
                            className="rounded-full bg-black"
                        />
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Header;
