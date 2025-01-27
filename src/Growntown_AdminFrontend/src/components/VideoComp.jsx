import React from 'react'
import { VideoURL } from './Utills/VideoURLs'


export const VideoComp = () => {
  return (
    <div className='bg-[#50d2fe] flex justify-center items-center h-screen w-full overflow-hidden'>
       
       
      <a href=" # " target="_blank" >  {/* Video url */}
        <div className='relative'>

          {/* left bird*/}
          <img

            className='absolute -left-5 xl:-left-18 z-20 w-24 md:w-auto  top-16'
            data-aos='fade-right'
            src='images/smilling sparrow left.png' />

          {/* Centered Circle on the Image */}
          <div className='absolute h-16 w-16 md:h-28 md:w-28 bg-[#FFDC99] z-20 rounded-full'
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >

            <img className='bg-[#fff3d9] rounded-full' src='images/Vector.svg' />
          </div>

          {/* right bird*/}
          <img
            data-aos='fade-left'
            className='absolute z-20 w-28 md:w-auto  -right-5 xl:-right-18 top-20'
            src='images/smilling sparrow right.png' />

          <img
            data-aos='fade-up'
            src='images/Generative Fill 1.png'
            alt='Centered Background'
            className='mx-auto p-10'
          />
        </div>
      </a>
    </div>
  )
}
