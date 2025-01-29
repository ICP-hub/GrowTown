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

  // Close sidebar when clicking outside on mobile/tablet
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById('sidebar');
      const menuButton = document.getElementById('menu-button');
      
      if (isOpen && sidebar && !sidebar.contains(event.target) && 
          menuButton && !menuButton.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Handle resize
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
    <div className="h-full font-sans">
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu Button */}
      {!isOpen && (
        <button
          id="menu-button"
          onClick={() => setIsOpen(true)}
          className="lg:hidden fixed top-1 left-4 p-3 text-white z-[100] bg-black/30 backdrop-blur-sm rounded-md hover:bg-black/70 transition-all"
        >
          <FiMenu size={24} />
        </button>
      )}

      {/* Sidebar */}
      <div
        id="sidebar"
        className={`h-full w-72 md:w-80 lg:w-64 shadow-2xl z-[90]
                   ${isOpen ? "fixed" : "hidden lg:block"}
                   bg-black/30 backdrop-blur-lg border border-white/20 
                   rounded-r-xl lg:rounded-xl`}
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
      {/* Close button */}
      <button
        onClick={onClose}
        className="lg:hidden absolute top-4 right-4 p-3 text-white rounded-md 
                 hover:bg-black/70 transition-all"
      >
        <IoMdClose size={24} />
      </button>

      {/* Logo */}
      <div className="flex items-center justify-center lg:justify-start mb-8 mt-4 lg:mt-0">
        <img 
          src="/images/Grow town logo 2.png" 
          alt="Logo" 
          className="h-12 md:h-14 lg:h-12"
        />
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-2 mt-4">
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
        className="mt-auto flex items-center gap-2 text-red-400 p-3 
                 hover:bg-red-600/20 rounded-md transition-all text-base md:text-lg lg:text-base"
      >
        <MdLogout size={20} className="md:w-6 md:h-6 lg:w-5 lg:h-5" /> 
        Logout
      </button>
    </div>
  );
}

function NavItem({ icon, children, href, isActive, onClose }) {
  return (
    <Link
      to={href}
      onClick={onClose}
      className={`flex items-center gap-3 px-4 py-3 md:py-4 lg:py-2 rounded-lg 
                 transition-all font-medium text-base md:text-lg lg:text-sm
                 ${isActive 
                   ? "bg-[#2c2c2c] text-green-400" 
                   : "text-gray-400 hover:bg-[#2c2c2c] hover:text-white"
                 }`}
    >
      {icon && (
        <span className="md:scale-110 lg:scale-100">
          {React.createElement(icon, { size: 20 })}
        </span>
      )}
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