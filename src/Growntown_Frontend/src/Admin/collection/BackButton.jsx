import React from 'react';
import { IoIosArrowBack } from "react-icons/io";;
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
    const navigate = useNavigate();
    
    return (
        <div>
            <IoIosArrowBack 
                onClick={() => navigate(-1)}  // Pass a function that calls navigate
                className='w-8 h-8 cursor-pointer text-[#f1f1f1] z-1 relative' 
            />
        </div>
    );
}

export default BackButton;
