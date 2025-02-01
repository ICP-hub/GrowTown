import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaApple } from "react-icons/fa";
import { FaGooglePlay } from "react-icons/fa";

const HeroComp = () => {
  // Initialize AOS when the component mounts
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: false,    // Trigger animation every time the element enters the viewport
      mirror: true,   // Reverse animation when scrolling up
    });
  }, []);


  return (
    <div id='heroPage' className='bg-[#00A6C0] h-screen w-screen overflow-hidden'>
      {/* Hero Content Wrapper */}
      
      <div className='flex justify-between items-center h-full'>
        {/* Left Hero Content */}
        <div className='relative'>
          {/* Cloud Animations */}
          <div className='absolute w-[200%] left-0 -top-40'>

            <img
              data-aos='fade-right'
              src='images/cloud02-l.png'
              alt='leftCloud'
              className='w-full'
            />
          </div>



          {/* Land and Lower Clouds */}

          <div className='-ml-28 sm:-ml-0 mt-[20%] sm:mt-[60%]  lg:mt-0' data-aos='fade-up' data-aos-delay='500'>

            {/* Ship */}
            <img src='images/sheep.png' alt='sheep' data-aos='fade-up' data-aos-delay='1000'
             className='absolute w-24 sm:w-auto z-30 left-0 sm:left-[30%]' />
            <img
              src='images/land01.png'
              alt='land'
              className=' w-72 sm:w-auto  relative top-10 z-20'
            />
            <div className='hidden sm:block'>
            <img
              src='images/cloud02-l.png'
              alt='leftCloud'
              className='absolute h-[100%] z-20 top-[50%] left-[0%]'
            />

            <img
              src='images/cloud03-l.png'
              alt='leftCloud'
              className='absolute h-[100%] z-20 top-[50%] left-[20%]'
            />

            <img
              src='images/cloud02-l.png'
              alt='leftCloud'
              className='absolute z-20 top-[60%] left-[20%]'
            />
            </div>
          </div>

        </div>

        {/* Center Hero Content */}
        <div
          className='absolute z-40 top-[16%]   sm:top-[10%] left-[52%] xl:left-[50%] transform -translate-x-1/2'

        >
          <img src='/images/LogoGif (1).gif' alt='logo' data-aos='zoom-in' 
          className=' min-w-96 sm:w-auto' />

          <div data-aos='fade-down' className=' mt-[50%]  sm:mt-0' data-aos-delay='1000'>
            <div className=' mx-auto w-[60%]  sm:w-auto  mb-10 -mt-2 '>
            {/* <h1 className='  text-4xl lg:text-4xl xl:text-5xl mr-6 text-center text-[#4B2519] font-IRONMAN font-bold'
           >COMING SOON!
           </h1> */}
            </div>
           
            <div className='flex mx-auto w-[60%] sm:w-auto flex-col sm:flex-row justify-center sm:gap-[5%] gap-5 mt-[15%] sm:mt-0 text-white'>
              <div className='p-1 w-[90%] sm:w-auto px-2 bg-black flex justify-center items-center rounded-lg'>
              <img src='images/appleIcon.svg' className='my-auto mx-1' />
                <div className='mx-1 ml-2'>
                  <h2 className=' text-sm '>Available on</h2>
                  <h1 className=' text-lg'>App Store</h1>
                </div>
              </div>
              <div className=' bg-black w-[90%] sm:w-auto flex  items-center p-1 px-2 justify-center rounded-lg'>
                <img src='images/andIcon.svg' className='my-auto mx-1' />
                <div className='mx-1 ml-2'>
                  <h2 className=' text-sm'>Available on</h2>
                  <h1 className=' text-lg'>Play Store</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Hero Content */}
        <div className='relative'>

          {/* top Cloud Animations */}
          <div className='absolute w-[200%] right-0 z-0 -top-40'>

            <img
              data-aos='fade-left'
              src='/images/cloud04-r.png'
              alt='rightCloud'
              className=' '
            />
          </div>


          {/* Land and Lower Clouds */}
          <div data-aos='fade-up' className=' mt-[150%] sm:mt-[90%]  lg:mt-0 -mr-24 sm:-mr-0 ' data-aos-delay='500'>
            {/* Cow */}
            <div
              className='absolute z-30 -mr-16 sm:-mr-0  bottom-28   lg:top-[-40%] sm:left-[-5%]'
              data-aos='fade-up'
              data-aos-delay='1000'
            >
              <img
                src='images/Cow.gif'
                alt='cow'
                style={{
                  transform: 'scaleX(-1)',
                }}
                className='w-64 sm:w-auto'
              />
            </div>


            <img
              src='/images/land01 (1).png'
              alt='land'
              className='w-72 sm:w-auto relative z-20'
            />
            <img
              src='/images/cloud06-r.png'
              alt='rightCloud'
              className='absolute hidden sm:block z-20 top-[70%] lg:top-[40%]'

            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroComp;
