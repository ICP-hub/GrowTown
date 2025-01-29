import React from 'react'

const Buttons = ({ buttonName, hover, bgColor, textColor, icon }) => {
  return (
    <div className={`flex cursor-pointer flex-col relative  w-[140px]  md:w-44 xl:w-56 2xl:60`} >
      <div
        className="mr-[1px] px-4 py-3 rounded-l-lg font-medium text-center"
        style={{
          clipPath: 'polygon(5% 0%, 100% 0, 100% 100%, 0 80%)',
          backgroundColor: bgColor,
          color: textColor, // Dynamically set text color
          fontWeight: '500',
          display: 'inline-block',
        }}
      ></div>
      <div
        className="ml-[1px]  -mt-[6px] rounded-r-lg px-4 py-3 font-medium text-center"
        style={{
          clipPath: 'polygon(0% 0, 100% 20%, 95% 100%, 0 100%)',
          backgroundColor: bgColor,
          color: textColor, // Dynamically set text color
          fontWeight: '500',
          display: 'inline-block',
        }}
      ></div>
      <div
        className="absolute  flex items-center z-0 font-semibold whitespace-nowrap left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]"
       
      >
       <h1 className={` text-${textColor} ml-2 md:ml-0 hover:${hover?.textColor} transition-all ease-in-out hover:${hover?.scale}`}> {buttonName}  </h1>
        {icon && <span className='sm:ml-1 '> {icon} </span>}
      </div>
    </div>
  )
}

export default Buttons
