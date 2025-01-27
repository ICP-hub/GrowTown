import React from 'react'

const Gameplay = () => {
    return (

        <div id='Gameplay' className="bg-[#50d2fe] min-h-screen relative  w-full ">
            <div className='relative h-full w-full '>
            {/* Background Image */}
            <div className='absolute w-full'>
                <img src="images/bg01.png" alt="background" className="  w-full  object-cover" />
                <img src="images/bg02.png" alt="background" className=" w-full h-screen  object-cover" />
            </div>

            {/* well and rocks*/}
            <div className=''>
                <img src='images/well.png' alt='well' className='absolute right-0 lg:w-[220px] -top-10' />
                <img src='images/rocks 2.png' alt='rocks' className='absolute  w-28 sm:w-auto right-0 lg:right-5 top-[310px] lg:top-[410px]' />
                <img src='images/rocks 3.png' alt='rocks' className='absolute w-24 sm:w-auto bottom-0 right-28 lg:right-36 top-[250px] lg:top-[370px]' />
            </div>

             
             <div className='absolute z-10 top-[530px] w-full   '>
             
            <div className="relative flex items-center gap-[15%] ">

                {/* man with tomato*/}
            <div className='-ml-5 sm:ml-[5%] -top-48 lg:-top-0 relative flex'
             data-aos='fade-right'
             >
                <img src='images/tomatoPlant.png' className='h-36 md:h-48 md: lg:h-auto lg::w-auto'/>
                <div className='absolute w-[260px] h-[200px] md:w-[400px] md:h-[240px] lg:w-[600px] lg:h-[320px]  bottom-0'>
                <img src='images/farmerwithtomato.png' className='object-cover h-full w-full  ' />
                </div>
             </div>
                {/* GAMEPLAY Text */}
                <div className='w-full -top-10 p-10 lg:w-[50%] absolute lg:relative z-50 md:top-10 2xl:-top-8 '
                data-aos='fade-up' data-aos-delay='500'
                >
                <h1 className=" text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-2 lg:mb-8 text-center lg:text-start text-[#FFF3C5] font-bold lg:mr-28">
                    GAMEPLAY
                </h1>
                <p className=' text-sm md:text-xl lg:text-2xl  text-center lg:text-start font-semibold'>   Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste illo quam iusto voluptatem  recusandae praesentium, minus deleniti accusantium doloribus repellendus vitae Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim, ullam! inventore alias non deserunt provident error nihil aliquid a at. Quae a unde, debitis at aspernatur adipisci enim tempora.</p>
                </div>
               

            
                 
                {/* Fireflyfence Images */}
                <div className="flex absolute right-0  -top-36 lg:-top-14" 
                data-aos='fade-down'
                >
                    {Array(4)
                        .fill()
                        .map((_, i) => (
                            <img
                                key={i}
                                src="images/Fireflyfencecartoon.png"
                                className=" w-[80px] sm:w-[110px] md:w-[130px] lg:w-[150px] 2xl:w-[180px] -ml-5"
                                alt={`Fireflyfence ${i + 1}`}
                            />
                        ))}
                </div>
              
            </div>

            <div className='absolute z-10 right-0 -bottom-56 2xl:top-28'
             data-aos='fade-up' 
             >
            <img src='images/mushroom.png' className=' w-36 lg:w-auto lg:h-auto'/>
          </div>
          </div>
          </div>
     

            </div>

        
    )
}

export default Gameplay