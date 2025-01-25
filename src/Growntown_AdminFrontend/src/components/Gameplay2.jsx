import React from 'react'
import Footer from './Footer'

const Gameplay2 = () => {
    return (
        <div className="bg-[#50d2fe]   w-full overflow-hidden  ">

            <div className=' relative w-full    '>
                <img src="images/bg03.png" alt="background" className="  w-full   object-cover" />

                <div>
                    {/* flower left */}
                    <div className='hidden xl:block absolute w-24 lg:w-auto lg:h-auto z-10 top-20 2xl:top-0 left-4 lg:left-32'>
                        <img src='images/Flower 33.svg' className='' />
                        <div className='flex -mt-10 w-16 lg:w-auto lg:h-auto' >
                            <img src='images/grass  2.svg' className='' />
                            <img src='images/grass  3.svg' className='-ml-12' />
                            <img src='images/grass  5.svg' className='-ml-12' />
                        </div>

                    </div>
                    {/* flower right */}
                    <div className='hidden xl:block absolute w-24 lg:w-auto lg:h-auto z-10 top-64 right-[30%] 2xl:right-[25%]'>
                        <div className='flex justify-center w-16 lg:w-auto lg:h-auto'>
                            <img src='images/Flower 34.svg' className=' -mr-5' />
                            <img src='images/Flower 31.svg' className=' -ml-5' />
                        </div>

                        <div className='flex -mt-10'>
                            <img src='images/grass  2.svg' className='' />
                            <img src='images/grass  3.svg' className='-ml-12' />
                            <img src='images/grass  5.svg' className='-ml-12' />
                        </div>

                    </div>

                    {/* WooddTrailer */}
                    <img src='images/woodTrailer.png' className='absolute h-40 md:h-52 lg:h-64 xl:w-auto xl:h-auto top-10 lg:top-auto lg:bottom-96 lg:left-10' 
                    data-aos='fade-right' 
                    />

                    {/* WindMill */}
                    <div className=' absolute -top-8  lg:top-44 z-30 right-0' >
                        <div>
                        <img src='images/windMill.png' className='w-64 md:w-[480px] xl:w-auto xl-h-auto ' 
                        data-aos='fade-left'
                         />
                        <div className='flex -mt-24 w-24 lg:w-auto lg:h-auto lg:justify-end mr-10'>
                            <img src='images/rocks 6.svg' className='mb-24' />
                            <img src='images/rocks 5.svg' className='mt-16 ' />
                            <img src='images/rocks 7.svg' className='mt-16' />
                        </div>
                        </div>
                      
                    </div>

                </div >




            </div>

            <div className=' h-screen  w-screen overflow-hidden'>
                <img src="images/bg04.png" alt="background" className=" w-full  h-full absolute    z-0 object-cover" />
                {/* tree */}
                <div className=' mt-28 sm:mt-20 md:mt-8 lg:-mt-28 xl:-mt-48  absolute  w-40 lg:h-auto lg:w-auto '>
                    <img src='images/tree.png' className=' ' />
                    <div className='flex -ml-10 -mt-24'>
                        <img src='images/grass  2.svg' className='' />
                        <img src='images/grass  3.svg' className='-ml-12 mt-10' />
                        <img src='images/grass  5.svg' className='-ml-12 mt-16' />
                    </div>

                </div>
                 {/* water leaf */}
                <img src='images/leaf01.svg ' className='  z-10 top-[70%]  w-20 lg:w-auto lg:h-auto lg:top-[60%] left-[5%] relative ' />
                <img src='images/leaf01.svg ' className='  z-10 w-28 top-[68%] left-[30%] relative ' />

                {/* pumpkin*/}
                <img src='images/pumpkin02.svg ' className='absolute -mt-40 right-10 lg:-mt-[10%] lg:right-20' />
                
                    
                <div id='Subscribe' className=' lg:-top-32  relative flex justify-center text-[#FFF3C5]'>
                    <div className=' w-[80%] lg:w-[40%]'>
                        <h1 className=' text-3xl md:text-4xl lg:text-5xl xl:text-6xl px-10 text-bold text-center'> Subscribe to Receive our newsletter to follow the news</h1>

                        <div className="flex border backdrop-blur-lg  border-[#FFF3C5]  justify-between h-20 rounded-lg mt-10 shadow-lg">
                            <input
                                type="text"
                                placeholder="Enter Email Address"
                                className="bg-transparent w-full h-full px-4 text-white placeholder-white outline-none rounded-l-lg"
                            />
                            <div className=" h-full md:w-[35%] relative rounded-r-lg flex items-center justify-center cursor-pointer hover:shadow-md hover:scale-95 transition duration-300">
                                <h1 className="text-white text-lg font-bold absolute my-auto"> SUBSCRIBE </h1>
                                    <img src='images/button.svg' className='h-full my-auto mt-1  object-cover'/>
                                
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default Gameplay2