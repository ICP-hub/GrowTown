import React from 'react'
import Footer from './Footer'

const Gameplay2 = () => {
    return (
        <div className="bg-[#50d2fe]   w-full overflow-hidden  ">
            
            <div className=' relative  w-full     '>
                <img src="images/Generative Fill 2.png" alt="background" className="  w-full   object-cover"  draggable='false'
              loading="lazy"/>

                <div className='relative max-w-[2000px]  h-full  container mx-auto'>

                    {/* Farmhouse */}
                    <div  className='absolute bottom-20  sm:bottom-48 lg:bottom-64 xl:bottom-[500px]  z-10 xl:h-auto   '
                        data-aos='fade-right'
                        >
                    <img src='images/farm barn  3.png' className=' w-[160px] sm:w-[250px] md:w-[300px] xl:w-auto xl-h-auto '
                       draggable='false'
              loading="lazy"
                    />

                    {/*vegetable boxes*/}
                    <div className='flex relative left-20 sm:left-44 xl:left-64  -top-10'>
                        <img src='images/vegtable boxes 1.png' className='absolute z-10 top-4 sm:top-auto left-5 sm:left-auto h-10 sm:h-16 xl:h-auto xl:w-auto'  draggable='false'
              loading="lazy"/>
                        <img src='images/vegtable boxes 4.png' className='absolute -top-0 sm:-top-8 left-8 h-10 sm:h-16 xl:h-auto xl:w-auto'  draggable='false'
              loading="lazy"/>
                        <img src='images/vegtable boxes 3.png' className='absolute z-10 left-16 top-5 h-10 sm:h-16 xl:h-auto xl:w-auto' draggable='false'
              loading="lazy"/>

                    </div>

                    {/*  Fireflyfence */}
                    <div className='flex -ml-2 h-14 sm:h-20 md:h-24 xl:h-auto xl:w-auto'>
                        <img src='images/Fireflyfencecartoon.png'  draggable='false'
              loading="lazy"/>
                        <img src='images/Fireflyfencecartoon.png' className='-ml-5'  draggable='false'
              loading="lazy"/>
                    </div>
                    </div>

                    {/* <div className=' absolute -bottom-28 ml-2 md:ml-0 sm:-bottom-10 md:-bottom-14 lg:bottom-44 xl:bottom-64 rounded-3xl  flex justify-center items-center h-[150px] sm:h-[250px] md:h-[300px] xl:h-[450px] lg:left-[50%] transform lg:-translate-x-1/2 w-[60%] bg-[#FFF1C852]  z-30 ' 
                    
                    >
                        <h1 className='  text-xl sm:text-4xl xl:text-5xl p-2 text-center'
                        data-aos="zoom-in"
                        > Crops to be added </h1>
                    </div> */}

                    {/* WindMill */}
                    <div className='  absolute -bottom-36 z-30 right-0' >
                        <div>
                            <img src='images/windMill.png' className='w-[200px] sm:w-[250px] md:w-[380px] xl:w-auto xl-h-auto '
                                data-aos='fade-left'
                                 draggable='false'
              loading="lazy"
                            />
                            <div className='flex absolute   xl:right-44 -mt-20 xl:-mt-32 w-24 lg:w-auto lg:h-auto lg:justify-end '>
                                <img src='images/rocks 6.png' className='mb-20 w-14 h-14 sm:w-auto sm:h-auto'  draggable='false'
              loading="lazy"/>
                                <img src='images/rocks 5.png' className='mt-16 w-14 h-14 sm:w-auto sm:h-auto '  draggable='false'
              loading="lazy"/>
                                <img src='images/rocks 7.png' className='mt-16 w-14 h-14 sm:w-auto sm:h-auto ' draggable='false'
              loading="lazy" />
                            </div>
                        </div>

                    </div>

                </div >

            </div>

            <div className='  h-screen -mt-[1px] w-full '>
                <img src="images/bg04.png" alt="background" className=" w-full  h-full absolute    z-0 object-cover" />
                <div className='container mx-auto max-w-[2000px] h-full relative '>
                {/* tree */}
                <div className=' mt-28 sm:mt-20 md:mt-8 lg:-mt-28 xl:-mt-52  absolute  w-40 lg:h-auto lg:w-auto '>
                    <img src='images/tree.png' className=' ' />
                    <div className='flex -ml-8 -mt-28'>
                        <img src='images/grass  2.png' className='w-24 h-24 mt-8 ' />
                        <img src='images/grass 3.png' className='-ml-14 w-24 h-24 mt-10' />
                        <img src='images/grass  5.png' className=' hidden sm:block -ml-14 w-24 h-24  mt-16' />
                    </div>

                </div>
                {/* water leaf */}
                <img src='images/leaf01.png ' className='  z-10   w-24 md:w-36 lg:w-auto lg:h-auto  bottom-20 lg:bottom-40 left-[5%] absolute  ' />
                <img src='images/leaf01.png ' className='  z-10 w-28 left-[30%] bottom-0 absolute' />


                <div id='Subscribe' className=' z-10 bottom-56 xl:bottom-64 w-full absolute left-[50%]  transform -translate-x-1/2 flex justify-center text-[#FFF3C5]'>
                    <div className=' w-[90%] md:w-[50%] lg:w-[40%]'>
                        <h1 className='  sm:text-lg md:text-xl lg:text-2xl xl:text-3xl px-10 text-bold text-center custom-ironman '> Subscribe to Receive our newsletter to follow the news</h1>

                        <div className="flex border backdrop-blur-lg  border-[#FFF3C5]  justify-between h-14 md:h-20 rounded-lg mt-6 sm:mt-10 shadow-lg">
                            <input
                                type="text"
                                placeholder="Enter Email Address"
                                className="bg-transparent w-full h-full px-4 text-white placeholder-white outline-none rounded-l-lg custom-fingerpaint-small placeholder:text-base sm:placeholder:text-lg"
                            />
                            <div className=" h-full w-[70%] sm:w-[65%] 2xl:w-[40%] relative rounded-r-lg flex items-center justify-center cursor-pointer hover:shadow-md hover:scale-95 transition duration-300">
                                <h1 className="text-white text-[12px] sm:text-sm lg:text-md -mt-1 font-bold absolute my-auto custom-ironman"> SUBSCRIBE </h1>
                                <img src='images/ButtonCustom.png' className='h-full my-auto w-full mt-1   object-fill shadow-lg' />

                            </div>
                        </div>

                    </div>

                </div>

                {/* <div className='absolute flex'>
                    <img src='images/grass  6.png' />
                    <img src='images/grass  7.png' className='-ml-20'/>
                    <img src='images/grass  8.png' className='-ml-16'/>
                </div> */}
                  
                  {/* man laying on haystack*/}
                 <div
                 data-aos='fade-left'
                   className='absolute right-0 top-56 lg:bottom-48  '>
                 
                 <img src='images/Pose4.png' className='absolute w-28 top-8  sm:w-40 sm:mt-10 md:mt-28 md:w-44  lg:w-56 xl:w-auto'/>
                  <img src='images/haystack 2.png' className=' w-36 sm:w-48 md:w-60 lg:w-72 xl:w-auto'/>

                 <img src='images/pumpkin02.png ' className=' absolute mt-16 sm:mt-20 lg:w-36 right-0' />
                 </div>
            </div>
            </div>
        </div>
    )
}

export default Gameplay2