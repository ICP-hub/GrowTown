import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { TbMoneybag } from "react-icons/tb";
import { MdOutlineDashboard, MdLogout } from "react-icons/md";
import { LuCopyPlus } from "react-icons/lu";
import { CiUser } from "react-icons/ci";
import { FiMenu } from "react-icons/fi";
import { MdContentCopy } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUserAndClear } from "../redux/authSlice";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { toast } from "react-hot-toast";


const sideBarData = [
  {
    text: "Dashboard",
    icon: MdOutlineDashboard,
    Link: "/admin/dashboard",
  },
  {
    text: "Collection",
    icon: LuCopyPlus,
    Link: "/admin/collection",
  },
  {
    text: "Users",
    icon: CiUser,
    Link: "/admin/users",
  },
  {
    text: "Activity",
    icon: TbMoneybag,
    Link: "/admin/activity",
  },
];

export default function SimpleSidebar() {

  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="h-full ">

<div className=" hidden lg:block">
      {/* Sidebar for large screens */}
      <SidebarContent
        onClose={() => setIsOpen(false)}
        className=""
      />
</div>
      {/* Drawer for mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm lg:hidden">
          <SidebarContent onClose={() => setIsOpen(false)}
          setIsOpen={setIsOpen} 
          />
        </div>
      )}

      {/* Mobile Nav */}
      <MobileNav onOpen={() => setIsOpen(true)} />
      {/* Content container */}
      <div className="ml-0 lg:ml-60 p-4">{/* Content goes here */}</div>
    </div>
  );
}

function SidebarContent({ onClose, className, setIsOpen }) {
  const loc = useLocation();
  const location = loc.pathname;
  const [hovered, setHovered] = useState(false);
  const [Copied, setCopied] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const logoutHandler = () => {
    dispatch(logoutUserAndClear());
  };

  const handleCopy = () => {
    toast.success("Copied");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`bg-[#29292C]  text-white  h-full fixed px-2  pr-4 flex flex-col justify-between ${className}`}
    >
       
      {/* Sidebar Links */}
      <div
        className="flex flex-col gap-1 mt-10 lg:mt-24 "
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <h1 onClick={()=>setIsOpen(false) }
        className="text-white ml-5 mb-5 -mt-5 block lg:hidden "> <IoMdClose size={25}/>
        </h1>

        {sideBarData.map((link) => (
          <NavItem
            key={link.text}
            icon={link.icon}
            href={link.Link}
            isActive={location.toLowerCase().includes(link.Link.toLowerCase())}
            hovered={hovered}
            onClose={onClose}
          >
            {link.text}
          </NavItem>
        ))}
      </div>

      {/* User Info */}
      <div className="flex items-center justify-start px-8 pt-4 mb-9 border-t border-gray-700 gap-x-4">
        <img
          className="w-14 h-14 rounded-full object-contain"
          src="/images/Admin.svg"
          alt="Admin"
        />
        <div className="space-y-2">
          <div className="flex items-center gap-x-2">
            <p className="lg:text-xl font-bold">Admin</p>
            <button
              onClick={logoutHandler}
              className="rounded-full h-7 w-7 flex items-center justify-center  hover:bg-red-600"
            >
              <MdLogout className="text-white w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center">
            <input
              value={
                user
                  ? `${user.slice(0, 5)}......${user.slice(-6)}`
                  : "No User"
              }
              readOnly
              className="bg-transparent w-36 text-white"
            />
            {user && (
              <CopyToClipboard text={user} onCopy={handleCopy}>
                <button className="ml-3 text-white hover:text-[#50B248]">
                 { !Copied ?  <MdContentCopy />
                 :
                 <FaCheckCircle className="text-[#50B248]" />
                }
                   
                </button>
              </CopyToClipboard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

SidebarContent.propTypes = {
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string,
};

function NavItem({ icon, children, href, isActive, onClose }) {
  return (
    <Link
      to={href}
      onClick={onClose}
      className={`flex items-center px-4 py-3 mx-4 my-2 rounded-lg text-white lg:text-xl font-semibold transition-colors duration-200 ${
        isActive ? "bg-[#50B248] text-red-400" : "hover:bg-gray-700"
      }`}
    >
      {icon && <div className="mr-4 text-xl">{React.createElement(icon)}</div>}
      <span>{children}</span>
    </Link>
  );
}

NavItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

function MobileNav({ onOpen }) {
  return (
    <div className="flex items-center px-4 h-16 bg-gray-900 text-white lg:hidden">
      <button
        onClick={onOpen}
        className="p-2 text-xl rounded-lg hover:bg-gray-600"
      >
        <FiMenu />
      </button>
    </div>
  );
}

MobileNav.propTypes = {
  onOpen: PropTypes.func.isRequired,
};
