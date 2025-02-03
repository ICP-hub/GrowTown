import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { useInView } from "react-intersection-observer";
import AOS from "aos";
import "aos/dist/aos.css";

export const VideoComp = () => {
  const { ref, inView } = useInView({
    triggerOnce: false, // Keeps detecting enter/exit
    threshold: 0.8, // Fires when 80% of the component is visible
  });

  const [isPlay, setIsPlay] = useState(false);
  const [videoKey, setVideoKey] = useState(0); // Unique key for re-render

  // Initialize AOS animations
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  // **Auto Play & Stop using inView**
  useEffect(() => {
    if (inView) {
      setIsPlay(true);
      setVideoKey((prevKey) => prevKey + 1); // Force re-render when entering view
    } else {
      setIsPlay(false);
    }
  }, [inView]);

  return (
    <div ref={ref} className="bg-[#00A6C0] flex justify-center items-center h-screen w-full overflow-hidden -mt-1">
      {/* Video Frame Wrapper */}
      <div className="relative flex justify-center items-center w-[90%] md:w-[60%] lg:w-[65%] aspect-video"
        data-aos='zoom-in'
      >
        
        {/* Wooden Frame Image with AOS Animation */}
        <img
          src="/images/Generative Fill 1.png"
          alt="Frame"
          className="absolute z-10 w-full h-full object-contain"
          // data-aos="fade-up"
           draggable='false'
              lazy='loading'
        />

        {/* Video Background Inside the Frame */}
        <div className="absolute w-[75%] h-[66%] md:w-[92%] md:h-[80%] lg:w-[92.5%] lg:h-[79.5%] rounded-3xl overflow-hidden bg-black bottom-[12%] md:bottom-[8%] lg:bottom-[8.5%]">
          {!isPlay ? (
            // Play Button (Only Shows When Video is Stopped)
            <div
              className="absolute h-16 w-16 md:h-24 md:w-24 z-20 rounded-full flex justify-center items-center cursor-pointer shadow-md hover:scale-110 transition-all duration-300"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => {
                setIsPlay(true);
                setVideoKey((prevKey) => prevKey + 1); // Force video restart
              }}
            >
              <img
                src="/images/Vector.svg"
                alt="Play Button"
                className="w-10 md:w-24"
                 draggable='false'
              lazy='loading'
              />
            </div>
          ) : (
            // Video Player (Auto Plays When In View)
            <ReactPlayer
              key={videoKey} // Forces re-render for fresh start
              url="/Videos/Growtown1.mp4"
              className="absolute top-0 left-0 z-20"
              width="100%"
              height="100%"
              playing={isPlay} // Auto Play When In View
              controls={true}
              loop={false}
              muted={false}
              onEnded={() => setIsPlay(false)} // Reset when video ends
              onPause={() => setIsPlay(false)} // Reset when manually paused
              style={{ objectFit: "cover" }}
              config={{
                file: {
                  attributes: {
                    style: {
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    },
                  },
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
