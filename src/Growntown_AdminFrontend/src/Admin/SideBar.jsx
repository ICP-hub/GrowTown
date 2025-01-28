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
import { useAuths } from "../utils/useAuthClient";


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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#1a1a1a] to-black">
      <div className="hidden lg:block">
        <SidebarContent onClose={() => setIsOpen(false)} />
      </div>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden">
          <SidebarContent onClose={() => setIsOpen(false)} setIsOpen={setIsOpen} />
        </div>
      )}

      <MobileNav onOpen={() => setIsOpen(true)} />
      <div className="ml-0 lg:ml-[280px] p-4">{/* Content goes here */}</div>
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
  const {principal,logout}=useAuths()

  const logoutHandler = async() => {
    // dispatch(logoutUserAndClear());
    await logout()
  };

  const handleCopy = () => {
    toast.success("Copied");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`
        backdrop-blur-xl
        bg-gradient-to-b from-[#29292C]/95 via-[#1a1a1a]/95 to-black/95
        border-r border-white/10
        shadow-[0_0_25px_rgba(0,0,0,0.3)]
        w-[310px] h-full fixed 
        flex flex-col
        ${className}
      `}
    >
      {/* Logo Section */}
      <div className="pt-6 px-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <img src="images/Grow town logo 2.png" alt="Logo" className="h-12" />
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:bg-white/5 transition-all duration-300"
          >
            <IoMdClose size={22} />
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 flex flex-col gap-1.5 mt-8 px-3">
        {sideBarData.map((link) => (
          <NavItem
            key={link.text}
            icon={link.icon}
            href={link.Link}
            isActive={location.toLowerCase().includes(link.Link.toLowerCase())}
            onClose={onClose}
          >
            {link.text}
          </NavItem>
        ))}
      </div>

      {/* User Profile Section */}
      {/* <div className="m-4 p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-md border border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#50B248] to-[#3D9635] rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
            <img
              className="relative w-12 h-12 rounded-lg object-cover border-2 border-[#50B248]/20"
              src="/images/Admin.svg"
              alt="Admin"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-medium bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Admin
              </p>
              <button
                onClick={logoutHandler}
                className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 transition-all duration-300 hover:scale-110"
              >
                <MdLogout className="w-[18px] h-[18px]" />
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-1.5">
              <input
                value={principal ? `${principal.slice(0, 5)}......${principal.slice(-6)}` : "No User"}
                readOnly
                className="text-sm bg-transparent text-gray-400 w-[120px] outline-none"
              />
              {principal && (
                <CopyToClipboard text={principal} onCopy={handleCopy}>
                  <button className="p-1.5 rounded-md hover:bg-white/5 transition-all  duration-300 hover:scale-110">
                    {!Copied ? 
                      <MdContentCopy className="w-4 h-4 text-gray-400" /> :
                      <FaCheckCircle className="w-4 h-4 text-[#50B248]" />
                    }
                  </button>
                </CopyToClipboard>
              )}
            </div>
          </div>
        </div>
      </div> */}

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
      className={`
        group flex items-center px-4 py-2.5 rounded-lg
        text-[14px] font-medium transition-all duration-300
        ${isActive ? 
          'bg-gradient-to-r from-[#2c2c2c] to-[#1a1a1a] text-[#50B248] shadow-sm border border-[#50B248]/10' : 
          'text-gray-400 hover:bg-[#2c2c2c]/40 border border-transparent hover:border-white/5'
        }
      `}
    >
      {icon && (
        <div className={`
          mr-3 text-lg transition-all duration-300 
          ${isActive ? 
            'text-[#50B248]' : 
            'text-gray-500 group-hover:text-gray-300'
          }
        `}>
          {React.createElement(icon)}
        </div>
      )}
      <span className={`
        transition-colors duration-300
        ${isActive ? 
          'text-[#50B248]' : 
          'group-hover:text-gray-300'
        }
      `}>
        {children}
      </span>
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
    <div className="flex items-center px-4 h-16 bg-[#29292C]/90 backdrop-blur-md border-b border-white/5 text-white lg:hidden">
      <button
        onClick={onOpen}
        className="p-2 rounded-lg hover:bg-white/5 transition-colors"
      >
        <FiMenu size={22} />
      </button>
    </div>
  );
}

MobileNav.propTypes = {
  onOpen: PropTypes.func.isRequired,
};