import React from 'react'

const Footer = () => {
    const socialLinks = [
        { img: 'prime_twitter.svg', link: 'https://x.com/Grow_Town' },
        { img: 'ic_baseline-discord.svg', link: 'https://discord.gg/FXaaZr7T' },
        { img: 'lineicons_telegram.svg', link: 'https://t.me/growtownchat' }
    ];
    return (
        <div className='w-full relative -mt-20 sm:-mt-24 bg-[#D9D9D93D] z-50 overflow-hidden backdrop-blur-lg'>
            <div className="bg-transparent text-white px-6 h-full py-4 shadow-md  container mx-auto max-w-[2000px]  ">


                <img src="images/GrowTownLogo .png" alt="logo" className=" w-16 sm:w-24 xl:w-28 absolute left-[50%] transform -translate-x-1/2 my-auto" 
                 draggable='false'
                 loading="lazy"/>
                
                     {/* Social Links */}
               <div className="flex justify-end items-center gap-2 sm:gap-5  h-12 sm:h-16 mx-auto w-auto lg:mr-4 ">
               {socialLinks.map((item, index) => (
            <a key={index} href={item.link} target="_blank" rel="noopener noreferrer">
                <img
                    src={`images/${item.img}`}
                    alt="social icon"
                    className="h-5 w-5 sm:h-6 sm:w-6 hover:opacity-80 cursor-pointer"
                     draggable='false'
              loading="lazy"
                />
            </a>
        ))}
                        </div>

            </div>

        </div>
    )
}

export default Footer