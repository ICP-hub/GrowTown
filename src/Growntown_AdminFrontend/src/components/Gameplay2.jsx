import React from 'react'
import Footer from './Footer'

const Gameplay2 = () => {
    return (
        <div className="bg-[#50d2fe]   w-full overflow-hidden  ">

            <div className=' relative w-full    '>
                <img src="images/Generative Fill 2.png" alt="background" className="  w-full   object-cover" />


                <div>

                    {/* Farmhouse */}
                    <div  className='absolute z-10 xl:h-auto top-0 md:top-10 lg:top-16  '
                        data-aos='fade-right'
                        >
                    <img src='images/farm barn  3.png' className=' w-[180px] sm:w-[250px] md:w-[300px] xl:w-auto xl-h-auto '
                      
                    />

                    {/*vegetable boxes*/}
                    <div className='flex relative left-20 sm:left-44 xl:left-64  -top-10'>
                        <img src='images/vegtable boxes 1.png' className='absolute z-10 h-12 sm:h-16 xl:h-auto xl:w-auto'/>
                        <img src='images/vegtable boxes 4.png' className='absolute -top-4 sm:-top-8 left-8 h-12 sm:h-16 xl:h-auto xl:w-auto'/>
                        <img src='images/vegtable boxes 3.png' className='absolute z-10 left-16 top-5 h-12 sm:h-16 xl:h-auto xl:w-auto'/>

                    </div>

                    {/*  Fireflyfence */}
                    <div className='flex -ml-2 h-14 sm:h-20 md:h-24 xl:h-auto xl:w-auto'>
                        <img src='images/Fireflyfencecartoon.png'/>
                        <img src='images/Fireflyfencecartoon.png' className='-ml-5'/>
                    </div>
                    </div>

                    {/* <div className=' absolute -bottom-28 ml-2 md:ml-0 sm:-bottom-10 md:-bottom-14 lg:bottom-44 xl:bottom-64 rounded-3xl  flex justify-center items-center h-[150px] sm:h-[250px] md:h-[300px] xl:h-[450px] lg:left-[50%] transform lg:-translate-x-1/2 w-[60%] bg-[#FFF1C852]  z-30 ' 
                    
                    >
                        <h1 className='  text-xl sm:text-4xl xl:text-5xl p-2 text-center'
                        data-aos="zoom-in"
                        > Crops to be added </h1>
                    </div> */}

                    {/* WindMill */}
                    <div className=' absolute top-20 lg:top-auto  lg:bottom-0 z-30 right-0' >
                        <div>
                            <img src='images/windMill.png' className='w-[200px] sm:w-[250px] md:w-[480px] xl:w-auto xl-h-auto '
                                data-aos='fade-left'
                            />
                            <div className='flex absolute   md:right-12 xl:right-36 -mt-24 w-24 lg:w-auto lg:h-auto lg:justify-end '>
                                <img src='images/rocks 6.png' className='mb-24 w-16 sm:w-auto ' />
                                <img src='images/rocks 5.png' className='mt-16 w-16 sm:w-auto ' />
                                <img src='images/rocks 7.png' className='mt-16 w-16 sm:w-auto ' />
                            </div>
                        </div>

                    </div>

                </div >




            </div>

            <div className=' relative h-screen  w-full '>
                <img src="images/bg04.png" alt="background" className=" w-full  h-full absolute    z-0 object-cover" />
                {/* tree */}
                <div className=' mt-28 sm:mt-20 md:mt-8 lg:-mt-28 xl:-mt-48  absolute  w-40 lg:h-auto lg:w-auto '>
                    <img src='images/tree.png' className=' ' />
                    <div className='flex -ml-8 -mt-28'>
                        <img src='images/grass  2.png' className='  w-20 h-20 sm:w-auto sm:h-auto mt-10' />
                        <img src='images/grass 3.png' className='-ml-12 w-20 h-20 sm:w-auto sm:h-auto mt-10' />
                        <img src='images/grass  5.png' className='-ml-12 mt-16   w-20 h-20 sm:w-auto sm:h-auto '  />
                    </div>

                </div>
                {/* water leaf */}
                <img src='images/leaf01.png ' className='  z-10 top-[70%]  w-20 lg:w-auto lg:h-auto lg:top-[60%] left-[5%] relative ' />
                <img src='images/leaf01.png ' className='  z-10 w-28 top-[68%] left-[30%] relative ' />


                <div id='Subscribe' className=' z-10 -bottom-32 lg:-top-32  relative flex justify-center text-[#FFF3C5]'>
                    <div className=' w-[80%] md:w-[50%] lg:w-[40%]'>
                        <h1 className=' text-3xl md:text-4xl lg:text-5xl xl:text-6xl px-10 text-bold text-center'> Subscribe to Receive our newsletter to follow the news</h1>

                        <div className="flex border backdrop-blur-lg  border-[#FFF3C5]  justify-between h-20 rounded-lg mt-10 shadow-lg">
                            <input
                                type="text"
                                placeholder="Enter Email Address"
                                className="bg-transparent w-full h-full px-4 text-white placeholder-white outline-none rounded-l-lg"
                            />
                            <div className=" h-full md:w-[35%] lg:w-[40%] relative rounded-r-lg flex items-center justify-center cursor-pointer hover:shadow-md hover:scale-95 transition duration-300">
                                <h1 className="text-white text-lg lg:text-xl -mt-2 font-bold absolute my-auto"> SUBSCRIBE </h1>
                                <img src='images/ButtonCustom.png' className='h-full my-auto w-full mt-[1px]   object-cover' />

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
                   className='absolute right-0 top-44 lg:bottom-48  '>
                 
                 <img src='images/Pose4.png' className='absolute sm:w-40 sm:mt-10 md:mt-28 w-32 md:w-56  lg:w-auto'/>
                  <img src='images/haystack 2.png' className=' w-36 sm:w-48 md:w-64 lg:w-auto'/>

                 <img src='images/pumpkin02.png ' className=' absolute mt-20 lg:w-36 right-0' />
                 </div>
            </div>
        </div>
    )
}

export default Gameplay2