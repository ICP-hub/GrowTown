import React from 'react'

const About = () => {
  return (
    <div id='About' className='bg-[#00A6C0] relative flex justify-center items-center h-screen w-full -mt-1'>
      
      {/* left cloud*/}
      <div className='absolute z-10 -left-0 top-0 overflow-hidden'>
            
            
            <img
            data-aos='fade-right'
              src='images/cloud02-l.png'
              alt='leftCloud'
              className=''
              draggable='false'
              loading="lazy"
            />
      </div>

      {/* right cloud*/}
      <div className='absolute z-10 -right-0 top-0 overflow-hidden '>
     
            <img
            data-aos='fade-left'
              src='/images/cloud04-r.png'
              alt='rightCloud'
              className=' '
               draggable='false'
              loading="lazy"
            />
      </div>
     

      <div className='md:w-[55%] px-10 absolute z-20 text-center overflow-hidden'>
        <h1 className=' text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-[#4B2519] font-bold custom-ironman'>ABOUT GROW TOWN</h1>
        <p className="lg:text-xl xl:text-2xl mt-8 font-semibold custom-fingerpaint-small text-[#4B2519] custom-line-clamp">
        GrowTown is a Web3 farming simulation game built on Internet Computer Protocol (ICP), blending NFTs, trading, and action gameplay. Players manage farms, grow crops, and trade assets in a decentralized marketplace. With a focus on global appeal, it targets the US, Brazil, Japan, and South Korea. Accessible via WebGL, GrowTown offers immersive, eco-conscious gameplay, fostering collaboration, competition, and real-world value through blockchain technology and community-driven innovation. 
        </p>
      </div>

      {/* Cloud Bottom */}
      <img
        src='images/cloudBg01.png'
        alt='Cloud background at the bottom'
        className='absolute -bottom-[18%] sm:-bottom-[25%] lg:-bottom-[45%] z-10  w-full object-cover'
         draggable='false'
              loading="lazy"
      />
    </div>
  )
}

export default About