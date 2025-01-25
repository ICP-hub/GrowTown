import React from 'react'
import { FaTrashAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CollectionCard = ({ handleDelete, collectiondata, index }) => {
    return (
        <Link
            to={`/Admin/collection/collectionDetails/${collectiondata[0]}`}
            key={index}
            state={{ collectiondata }}
        >
            <div
                key={index}
                className="relative bg-[#29292C] w-[95%] h-full px-6 py-6 shadow-lg text-white flex flex-col gap-y-4 rounded-xl border transition-transform duration-300 ease-in-out border-[#50B248] hover:scale-105"

            >
                <div className="absolute top-2 right-2">
                    <button
                        className="text-white hover:text-red-600 transition-colors duration-300"
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete(collectiondata[1]);
                        }}
                    >
                        <FaTrashAlt className="w-5 h-5" />
                    </button>
                </div>

                {console.log('imgUrl',JSON.parse(collectiondata[4]).collectionImageURL )}

                {/* Updated Image Rendering */}
                <img
                    className="object-cover rounded-xl h-[300px] w-full"
                    src={
                        JSON.parse(collectiondata[4]).collectionImageURL ||
                        "default-image.jpg"
                    }
                    alt={`collection`}
                />
                <div className="mt-2 ml-6 text-sm sm:font-bold">
                    <p className="text-2xl font-semibold">
                        {collectiondata[2]?.charAt(0).toUpperCase() + collectiondata[2]?.slice(1)} Collection
                    </p>
                    <p className='my-1'> by <span className='text-[#50B248]'>@vimlesh</span></p>
                    <p> 30 Items</p>
                </div>


            </div>
        </Link>

    )
}

export default CollectionCard