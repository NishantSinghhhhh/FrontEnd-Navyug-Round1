import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle menu
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Navigation bar visible only when the hamburger menu is closed */}
      {!isOpen && (
      <nav className="bg-white border border-black w-[60%] md:w-[40%] p-[1rem] rounded-lg flex items-center justify-between hidden md:flex">
      {/* Logo or other content can go here */}
      <div className="flex justify-between items-center w-full">
        {/* Navigation Links */}
        <ul className="hidden md:flex w-full justify-around space-x-6 text-[#4494cc]">
          <li>
            <Link to="/Dashboard" className="hover:text-[#035185] transition-colors text-[#4494cc]">
              Home
            </Link>
          </li>
          <li>
            <Link to="/ECertificate" className="hover:text-[#035185] transition-colors text-[#4494cc]">
              E-Certificates
            </Link>
          </li>
          <li>
            <Link to="https://www.myaimate.com/" target="_blank" className="hover:text-[#035185] transition-colors text-[#4494cc]">
              Contact Us
            </Link>
          </li>
          <li>
            <Link to="https://verify.myaimate.com/" target="_blank" className="hover:text-[#035185] transition-colors text-[#4494cc]">
              Verify Certificates
            </Link>
          </li>
        </ul>
      </div>
    </nav>
    
      )}

      {/* Hamburger icon for mobile */}
      <div className="md:hidden border-none ml-[15rem] relative">
        <button onClick={toggleMenu} className="text-black bg-white focus:border-black">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Tooltip for mobile menu */}
        {isOpen && (
          <div className="absolute top-full -ml-[4rem] bg-white border border-black p-4 rounded-lg shadow-md animate-fade-in">
            <ul className="space-y-4">
              <li>
                <Link to="/Dashboard" className="hover:text-gray-300 transition-colors" onClick={() => setIsOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/ECertificate" className="hover:text-gray-300 transition-colors" onClick={() => setIsOpen(false)}>
                  E-Certificates
                </Link>
              </li>
              <li>
                <Link to="https://www.myaimate.com/" target="_blank" className="hover:text-gray-300 transition-colors" onClick={() => setIsOpen(false)}>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;