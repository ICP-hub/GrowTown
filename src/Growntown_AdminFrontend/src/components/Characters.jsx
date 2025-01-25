import React from 'react';

const Characters = () => {
  return (
    <div id='Characters'  className="bg-[#50d2fe] relative flex justify-center items-center h-screen w-full overflow-hidden">
  
     {/* Background Image */}
      <img src="images/bg00.png" alt="background" className="absolute w-full h-screen object-cover" />

      {/* Content Wrapper */}
  
      <div
        className="absolute z-20 w-[60%] flex flex-col items-center "
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
     
        {/* Bee Animation */}


        {/*  Title */}
        <div className='relative mb-8'>
          <img
            src="images/beeAnimation.gif"
            className="  w-64 absolute -top-32 -right-36"
            alt="bee animation"
          />
          <h1 className=" text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#4B2519]"
            data-aos='fade-up'
          >CHARACTERS</h1>
        </div>
        {/* Character Row */}
        <div className="flex  justify-center items-center ">
          {/* Female Character */}
          <img
            data-aos='fade-up'
            className=" h-[320px] object-cover relative left-10 lg:left-0  md:h-[550px] xl:h-[650px]" src="images/femaleFarmer.png" alt="Female Farmer" />

          {/* Wooden Board */}
          <div className="absolute ">
            <div className='relative'>
              <h1 className='absolute top-10 lg:top-20 text-2xl lg:text-3xl left-[50%] transform -translate-x-1/2 font-bold text-[#FFF3C5]'>Tom</h1>
              <img src="images/woodenBoard.png" alt="Wooden Board" className="  h-[180px] lg:h-[300px]" />
              <h1 className='absolute bottom-12 lg:bottom-24 text-2xl lg:text-3xl left-[50%] transform -translate-x-1/2 font-bold text-[#FFF3C5]' >Jerry</h1>
            </div>


            <div className='flex relative justify-center' >
              {/*grass backward of stones*/}
              <img src='images/grass  9.png' className='h-20 w-20 absolute -top-10' />

              <img src='images/grass  11.png' className='h-20 w-20 absolute left-10 -top-4' />
              {/* stones*/}
              <div className="absolute z-10 flex ">
                <img src='images/rocks 8.png' />
                <img src='images/rocks 9.png' />
              </div>
              {/*grass forward of stones*/}
              <img src='images/grass  9.png' className='h-10 w-16 absolute z-20 top-4' />
            </div>
          </div>

          {/* Male Character */}
          <img
            className="  h-[320px] object-cover relative lmd:left-10 md:left-0  md:h-[550px] xl:h-[650px]" src="images/maleFarmer.png" alt="Male Farmer"
            data-aos='fade-up'
          />
        </div>
      </div>
    </div>
  );
};

export default Characters;
