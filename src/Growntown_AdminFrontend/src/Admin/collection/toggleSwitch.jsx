import React, { useState } from "react";

const ToggleSwitch = () => {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => {
    setIsOn(!isOn);
  };

  return (
    <div
      className={`w-12 h-7 mb-2 flex items-center rounded-full p-1 cursor-pointer ${
        isOn ? "bg-gray-800" : "bg-[#424242]"
      }`}
      onClick={toggleSwitch}
    >
      <div
        className={`w-6 h-6  bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          isOn ? "translate-x-6" : ""
        }`}
      ></div>
    </div>
  );
};

export default ToggleSwitch;
