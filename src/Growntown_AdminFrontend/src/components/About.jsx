import React from 'react'

const About = () => {
  return (
    <div id='About' className='bg-[#50d2fe] relative flex justify-center items-center h-screen w-full '>
      
      {/* left cloud*/}
      <div className='absolute z-10 -left-0 top-0 overflow-hidden'>
            
            
            <img
            data-aos='fade-left'
              src='images/cloud02-l.png'
              alt='leftCloud'
              className=''
            />
      </div>

      {/* right cloud*/}
      <div className='absolute z-10 -right-0 top-0 overflow-hidden '>
     
            <img
            data-aos='fade-right'
              src='/images/cloud04-r.png'
              alt='rightCloud'
              className=' '
            />
      </div>
     

      <div className='md:w-[55%] px-10 absolute z-20 text-center overflow-hidden'>
        <h1 className=' text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-[#4B2519] font-bold'>ABOUT GROW TOWN</h1>
        <p className=' lg:text-xl xl:text-2xl  mt-8 font-semibold '>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Autem maiores dolorem eos nobis rem optio quos aliquid, dolores enim eaque praesentium.
          Eius minus quod ipsa ex repellat, nostrum possimus officiis maxime repellendus perferendis tenetur ducimus. Voluptatibus,
          vero dolores ipsam rem unde ex sed itaque laboriosam vitae ipsum labore ad. Quidem voluptatum dolorem placeat quod inventore autem provident iure. Veritatis, ratione!
          Lorem ipsum dolor sit amet consectetur, adipisicing elit.
        </p>
      </div>

      {/* Cloud Bottom */}
      <img
        src='images/cloudBg01.png'
        alt='Cloud background at the bottom'
        className='absolute -bottom-[18%] sm:-bottom-[25%] lg:-bottom-[45%] z-10  w-full object-cover'
      />
    </div>
  )
}

export default About
