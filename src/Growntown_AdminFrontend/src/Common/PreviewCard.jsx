import React, { useEffect, useState } from "react";

const PreviewCard = ({ colName, colImage, maxLimit, typeColor, description }) => {
  console.log("previewDetails=>", colName, colImage, maxLimit, typeColor, description);
  const [imgUrl, setImgUrl] = useState(null);

  useEffect(() => {
    const objectUrls = Array.from(colImage).map((img) => URL.createObjectURL(img));
    setImgUrl(objectUrls[0]); // Display the first image
  }, [colImage]);

  return (
    <div
    className="relative w-full p-3 text-white flex flex-col gap-y-4 rounded-xl border"
    style={{ borderColor: `${typeColor.toLowerCase()}` }}
  >
      {/* Image */}
       
          <img
            className="object-cover rounded-xl w-full h-48   hover:scale-105 transition-transform duration-300 ease-in-out"
            src={imgUrl || 'images/questionMark.jpg'}
            alt="Collection"
          />

      {/* Details */}
      <div className="flex flex-col mt-4 mx-4 gap-y-2">
        {/* Collection Name */}
        <h2 className="text-2xl font-bold text-white tracking-wide">
          {colName?.charAt(0).toUpperCase() + colName?.slice(1)} Collection
        </h2>

        {/* Type Color */}
        {/* <div className="flex items-center gap-2">
          <p className="text-sm font-medium ">Color Type:</p>
          <span
            className={`text-sm font-semibold px-2 py-1 rounded-lg  text-${typeColor.toLowerCase()}-500`}
          >
            {typeColor}
          </span>
        </div> */}

        {/* Max Limit */}
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium ">Max Limit:</p>
          <span className="text-lg font-semibold text-[#50B248]">
            {maxLimit || 0}
          </span>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm font-medium  mb-1">Description:</p>
          <p
            className="text-sm  border min-h-16 border-[#50B248] p-2  rounded-lg max-h-24 overflow-y-auto hide-scrollbar"
          >
            {description || "No description provided."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PreviewCard;
