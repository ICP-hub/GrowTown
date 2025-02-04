import React, { useState } from 'react'
import { FaTrashAlt, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CollectionCard = ({ handleDelete, collectiondata, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    console.log('collectiondata', collectiondata)
    return (
        <Link
            to={`/Admin/collection/collectionDetails/${collectiondata[0]}`}
            key={index}
            state={{ collectiondata }}
        >
          {  console.log('collectiondata[0]',collectiondata[0]) }
            <div
                className="relative  w-[240px] max-w-[280px] ml-10 h-[380px] group transform transition-transform duration-300 ease-out hover:-translate-y-2"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-b from-[#3D9635] to-[#50B248] rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>

                <div className="relative h-full backdrop-blur-sm bg-gradient-to-b from-[#29292C]/95 via-[#1a1a1a]/95 to-black/95 rounded-xl border border-white/10 shadow-lg shadow-black/20 overflow-hidden transition-all duration-300 group-hover:border-[#50B248]/30 group-hover:shadow-[#50B248]/10">
                    <div className="relative h-[220px] w-full overflow-hidden  rounded-lg border border-white/5">
                        <img
                            className="object-cover p-2 w-full h-full transition-transform duration-500 group-hover:scale-110 rounded-lg"
                            src={
                                JSON.parse(collectiondata[4]).collectionImageURL ||
                                "default-image.jpg"
                            }
                            alt={`collection`}
                        />

                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Centered plus button */}
                        <button
                            className={`absolute left-1/2 -translate-x-1/2 bottom-0 p-3 rounded-full bg-[#50B248] text-white shadow-lg transform transition-all duration-300 ease-out
                                ${isHovered ? 'translate-y-[-200%] opacity-100' : 'translate-y-[100%] opacity-0'}
                                hover:bg-[#3D9635] hover:scale-110`}
                        >
                            <FaPlus className="w-5 h-5" />
                        </button>

                        {/* Delete button */}
                        <button
                            className={`absolute top-3 right-3 p-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 transition-all duration-300
                                ${isHovered ? 'opacity-100 visible' : 'opacity-0 invisible'}
                                hover:bg-red-500/20 hover:border-red-500/30`}
                            onClick={(e) => {
                                e.preventDefault();
                                handleDelete(collectiondata[1]);
                            }}
                        >
                            <FaTrashAlt className="w-4 h-4 text-white" />
                        </button>
                    </div>

                    <div className="p-5">
                        <h3 className="text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                            {collectiondata[2]?.charAt(0).toUpperCase() + collectiondata[2]?.slice(1)} Collection
                        </h3>
                        <p className="text-sm text-gray-400 mb-2">by <span className="text-[#50B248]">{collectiondata[1].toString()}</span></p>
                        <div className="flex items-center gap-2 mt-4">
                            <div className="px-3 py-1.5 rounded-full bg-white/5 border max-h-12   overflow-y-scroll no-scrollbar border-white/10">
                                <p className="text-sm text-gray-300 h-full  ">
                                    {JSON.parse(collectiondata[4])?.description}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Link>
    )
}

export default CollectionCard