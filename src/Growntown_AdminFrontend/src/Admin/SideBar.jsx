import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MdOutlineDashboard, MdLogout } from "react-icons/md";
import { LuCopyPlus } from "react-icons/lu";
import { CiUser } from "react-icons/ci";
import { TbMoneybag } from "react-icons/tb";
import { FiMenu } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

const sideBarData = [
  { text: "Dashboard", icon: MdOutlineDashboard, Link: "/admin/dashboard" },
  { text: "Collection", icon: LuCopyPlus, Link: "/admin/collection" },
  { text: "Users", icon: CiUser, Link: "/admin/users" },
  { text: "Activity", icon: TbMoneybag, Link: "/admin/activity" },
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
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    
    <div className="relative font-sans z-50">
      {/* ✅ Only one menu button - Opens sidebar */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden p-3 text-white fixed top-4 left-4 z-50 rounded-md hover:bg-black/70 transition-all"
        >
          <FiMenu size={24} />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 shadow-xl transform transition-transform duration-300 ease-in-out 
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} 
          bg-black/30 backdrop-blur-lg border border-white/20 rounded-xl`}
      >
        <SidebarContent onClose={() => setIsOpen(false)} />
      </div>
    </div>
  );
}

function SidebarContent({ onClose }) {
  const location = useLocation().pathname;
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col h-full p-5 text-white relative">
      {/* ✅ Right-aligned close button - No duplication */}
      <button
        onClick={onClose}
        className="lg:hidden absolute top-4 right-4 p-3 text-white rounded-md  hover:bg-black/70 transition-all"
      >
        <IoMdClose size={24} />
      </button>

      {/* Logo */}
      <div className="flex items-center mb-6">
        <img src="/images/Grow town logo 2.png" alt="Logo" className="h-12" />
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-2">
        {sideBarData.map((item) => (
          <NavItem
            key={item.text}
            icon={item.icon}
            href={item.Link}
            isActive={location.toLowerCase().includes(item.Link.toLowerCase())}
            onClose={onClose}
          >
            {item.text}
          </NavItem>
        ))}
      </div>

      {/* Logout Button */}
      <button
        onClick={() => dispatch(logoutUserAndClear())}
        className="mt-auto flex items-center gap-2 text-red-400 p-3 hover:bg-red-600/20 rounded-md transition-all"
      >
        <MdLogout size={20} /> Logout
      </button>
    </div>
  );
}

function NavItem({ icon, children, href, isActive, onClose }) {
  return (
    <Link
      to={href}
      onClick={onClose}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all font-medium
        ${isActive ? "bg-[#2c2c2c] text-green-400" : "text-gray-400 hover:bg-[#2c2c2c] hover:text-white"}`}
    >
      {icon && <span>{React.createElement(icon, { size: 20 })}</span>}
      {children}
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
