import React from 'react';
import notfound from "../assets/4042.gif";

const PageNotFound = () => {
  return (
    <div className='flex bg-[#161618] flex-col items-center justify-center w-full h-screen'>
        
    <img src={notfound} alt="404" className=' xl:w-[40%] drop-shadow-lg' />

  </div>
  )
}

export default PageNotFound