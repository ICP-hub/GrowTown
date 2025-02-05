import React from 'react'

const Gameplay = () => {
    return (

        <div id='Gameplay' className="bg-[#50d2fe] min-h-screen relative  w-full ">
            <div className='relative h-full w-full '>
                {/* Background Image */}
                <div className='absolute w-full'>
                    <img src="images/bg01.png" alt="background" className="  w-full -mt-[1px]  object-cover" 
                     draggable='false'
                     loading="lazy"/>
                    <img src="images/bg02.png" alt="background" className=" w-full h-screen -mt-[1px]  object-cover" 
                     draggable='false'
                     loading="lazy"/>
                </div>

                {/* well and rocks*/}
                <div className=' absolute right-0 -top-20 sm:-top-10' >
                    <img src='images/well.png' alt='well' className=' w-[140px]  lg:w-[220px] ' draggable='false'
              loading="lazy"/>
                    <img src='images/rocks 2.png' alt='rocks' className='absolute  w-16 sm:w-20 lg:w-auto right-0 lg:right-5 top-[320px] lg:top-[450px]'  draggable='false'
              loading="lazy"/>
                    <img src='images/rocks 3.png' alt='rocks' className='absolute w-16 sm:w-20 lg:w-auto bottom-0 right-28 lg:right-36 top-[250px] lg:top-[370px]'  draggable='false'
              loading="lazy"/>
                </div>

              
                <div className=" absolute w-full text-3xl top-[280px] sm:top-[380px]   md:text-4xl lg:text-5xl xl:text-6xl mb-2 lg:mb-8 text-center   text-[#FFF3C5] font-bold lg:mr-28">
                  
                   <h1 className='w-[50%] relative z-10 mx-auto text-center custom-ironman text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl' > Grow Town: Cultivate, Protect, Thrive.  </h1>
                      
                       {/* hen animation*/}
                    <div className='absolute flex left-0 md:left-[16%] top-10 '>
                        <img src='images/henGif.gif' className='w-20 h-20 lg:w-28 lg:h-28 '
                                style={{
                                    transform: 'scaleX(-1)',
                                  }}
                                   draggable='false'
              loading="lazy"
                        />
                        <img src='images/henGif.gif ' className=' -ml-12 sm:-ml-14 mt-6 sm:mt-10  w-16 h-16 sm:w-24 sm:h-24'      draggable='false'
              loading="lazy"       />
                    </div> 
                   {/* vegetable boxes*/}
                   <div className='absolute flex right-2 md:right-[16%] top-10'>
                   <img src='images/vegtable boxes 4.png' className='w-14 sm:w-20 lg:w-auto'  draggable='false'
              loading="lazy"/> 
                    <img src='images/vegtable boxes 2.png' className='-ml-6 w-16 sm:w-24 :w-auto'  draggable='false'
              loading="lazy"/>
                        
                   </div>
                        </div>

                <div className='absolute z-10 top-[450px] sm:top-[550px] xl:top-[650px] w-full ' 
                data-aos='fade-up' 
                >
                        
                    <div className=' absolute ml-4 xl:ml-0 w-[55%] xl:w-[35%]  z-20 top-0  md:top-16 xl:top-24 xl:left-[50%] transform xl:-translate-x-1/2'
                    
                    >
                        <h1 className=" custom-ironman text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl' mb-2 lg:mb-8 text-center  text-[#FFF3C5] font-bold lg:mr-28">
                            GAMEPLAY
                        </h1>
                        <p className=' text-sm md:text-base lg:text-lg xl:text-2xl text-center  font-semibold custom-fingerpaint-small text-[#4B2519] h-44 sm:h-48 xl:h-auto overflow-y-scroll no-scrollbar'>
                            GrowTown Gameplay combines farming, trading, and adventure in a dynamic Web3 ecosystem. Players cultivate crops, raise animals, and trade assets through an NFT marketplace. Action-packed quests, seasonal events, and eco-friendly challenges add excitement and depth. With opportunities to collaborate or compete, players can shape their farms and strategies. GrowTown offers immersive, creative, and rewarding gameplay, seamlessly integrating blockchain technology into an engaging farming simulation experience.
                        </p>
                    </div>

                    <div className='absolute z-10 flex right-4 xl:right-16  mt-20 2xl:top-28'
                     
                    >
                        <img src='images/tomatoPlant.png' className='h-36 sm:h-44 lg:h-56  ' draggable='false'
              loading="lazy" />

                        <img src='images/Pose3 1.png' className='object-cover relative  z-20  h-36 sm:h-52 lg:h-72 -mt-2 sm:-mt-4 -ml-16 xl:-ml-24 '  draggable='false'
              loading="lazy"/>

                    </div>

                </div>
            </div>


        </div>


    )
}

export default Gameplay