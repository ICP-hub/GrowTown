import React from 'react';

const Characters = () => {
  return (
    <div id='Characters'  className="bg-[#50d2fe] relative flex justify-center items-center h-screen w-full overflow-hidden">
  
     {/* Background Image */}
      <img src="images/bg00.png" alt="background" className="absolute w-screen h-screen object-cover"  draggable='false'
              loading="lazy"/>

      {/* Content Wrapper */}
     <div className=' container mx-auto max-w-[2000px] '>
      <div
        className="absolute z-20 w-[60%] flex flex-col items-center "
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
     
        {/* Bee Animation */}
        <div className='absolute  top-10'>
          <img
            src="images/beeAnimation.gif"
            className="  w-64 absolute -top-28 -right-36"
            alt="bee animation"
             draggable='false'
              loading="lazy"
          />
          <h1 className=" text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#4B2519] custom-ironman"
            data-aos='fade-up'
          >CHARACTERS</h1>
        </div>
        {/* Character Row */}
        <div className="flex mt-20  justify-center items-center ">
          {/* Female Character */}
          <img
            data-aos='fade-up'
            className=" h-[320px] object-cover relative left-10 lg:left-0  md:h-[550px] xl:h-[650px]" src="images/femaleFarmer.png" alt="Female Farmer" 
            draggable='false'
            loading="lazy"/>
            

          {/* Wooden Board */}
          <div className="absolute mt-8 sm:mt-0 ">
            <div className='relative'>
              <h1 className='absolute top-10 lg:top-20 text-2xl lg:text-3xl left-[50%] transform -translate-x-1/2 font-bold text-[#FFF3C5] custom-fingerpaint-small'>Tom</h1>
              <img src="images/woodenBoard.png" alt="Wooden Board" className="  h-[160px] lg:h-[300px]"
               draggable='false'
               loading="lazy" />
              <h1 className='absolute bottom-12 lg:bottom-24 text-2xl lg:text-3xl left-[50%] transform -translate-x-1/2 font-bold text-[#FFF3C5] custom-fingerpaint-small' >Jerry</h1>
            </div>


            <div className='flex relative justify-center' >
              {/*grass backward of stones*/}
              <img src='images/grass  9.png' className=' h-16 w-16 sm:h-20 sm:w-20 absolute -top-10'
               draggable='false'
               loading="lazy" />

              <img src='images/grass  11.png' className='h-16  w-16 sm:h-20 sm:w-20 absolute left-10 -top-4' />
              {/* stones*/}
              <div className="absolute z-10 flex mt-2 sm:mt-0 ">
                <img src='images/rocks 8.png' className=' h-14 w-14 sm:w-auto sm:h-auto'  draggable='false'
              loading="lazy" />
                <img src='images/rocks 9.png'
                className=' mt-1 sm:mt-0 h-14 w-14 sm:w-auto sm:h-auto' 
                 draggable='false'
                 loading="lazy"/>
              </div>
              {/*grass forward of stones*/}
              <img src='images/grass  9.png' className=' h-8 w-14 sm:h-10 sm:w-16 absolute z-20 top-4'  draggable='false'
              loading="lazy"/>
            </div>
          </div>

          {/* Male Character */}
          <img
            className="  h-[320px] object-cover relative lmd:left-10 md:left-0  md:h-[550px] xl:h-[650px]" src="images/Pose1.png" alt="Male Farmer"
            data-aos='fade-up'
             draggable='false'
              loading="lazy"
          />

<img src='images/pumpkin02.png ' className=' absolute z-50 md:w-32 -bottom-16 left-0 sm:left-20 2xl:left-48 ' />
        </div>
      </div>
      </div>
    </div>
  );
};

export default Characters;