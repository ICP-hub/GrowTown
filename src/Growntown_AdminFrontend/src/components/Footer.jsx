import React from 'react'

const Footer = () => {
    const socialImg = ['prime_twitter.svg', 'ic_baseline-discord.svg', 'lineicons_telegram.svg'];
    return (
        <div className='w-full relative -mt-20 sm:-mt-24 bg-[#D9D9D93D] z-50 overflow-hidden backdrop-blur-lg'>
            <div className="bg-transparent text-white px-6 h-full py-4 shadow-md">


                <img src="images/GrowTownLogo .png" alt="logo" className=" w-20 sm:w-auto absolute left-[50%] transform -translate-x-1/2 my-auto" />
                
                     {/* Social Links */}
               <div className="flex justify-end items-center gap-5  h-12 sm:h-16 mx-auto w-auto ">
                        {socialImg.map((img, index) => (
                            <img
                                key={index}
                                src={`images/${img}`}
                                alt="social icon"
                                className=" h-5 w-5 sm:h-7 sm:w-7 hover:opacity-80 cursor-pointer"
                            />
                        ))}
                        </div>

            </div>

        </div>
    )
}

export default Footer