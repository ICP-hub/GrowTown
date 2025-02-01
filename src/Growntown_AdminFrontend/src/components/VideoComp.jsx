import React, { useState } from 'react';
import ReactPlayer from 'react-player';

export const VideoComp = () => {
  const [isPlay, setIsPlay] = useState(false);

  return (
    <div className="bg-[#00A6C0] flex justify-center items-center h-screen w-full overflow-hidden">
      <div 
        className="relative z-20 flex justify-center items-center rounded-2xl w-[90%] md:w-[60%] lg:w-[65%] aspect-video" 
        style={{ 
          backgroundImage: "url('/images/Generative Fill 1.png')", 
          backgroundSize: "contain", 
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* Centered Circle on the Image */}
        {!isPlay ? (
          <div 
            className="absolute h-16 w-16 md:h-28 md:w-28 bg-[#FFDC99] z-20 rounded-full flex justify-center items-center cursor-pointer" 
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => setIsPlay(true)}
          >
            <img className="bg-[#fff3d9] rounded-full w-10 md:w-16 hover:border-2 hover:scale-150 transition-all duration-300" src="/images/Vector.svg" alt="Play Button" />
          </div>
        ) : (
          <div 
            className="absolute z-20 w-full rounded-2xl overflow-hidden flex justify-center items-center"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <ReactPlayer 
              width="100%" 
              height="100%" 
              playing={true} 
              controls={false} 
              url="/Videos/Growtown1.mp4" 
              onEnded={() => setIsPlay(false)} // Reset isPlay when the video ends
            />
          </div>
        )}
      </div>
    </div>
  );
};
