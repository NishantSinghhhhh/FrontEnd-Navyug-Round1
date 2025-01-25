import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle menu
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white border border-black w-[60%] md:w-[40%] p-[1rem] rounded-lg flex items-center justify-between">
      {/* Logo or other content can go here */}
      <div className="flex flex-col md:flex-row justify-between items-center w-full space-y-4 md:space-y-0 md:space-x-6">
        {/* Hamburger icon for mobile */}
        <div className="md:hidden border-none">
          <button
            onClick={toggleMenu}
            className="text-black bg-white focus:border-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <ul
          className={`${
            isOpen ? 'block' : 'hidden'
          } md:flex w-full justify-around space-y-4 md:space-y-0`}
        >
          <li>
            <Link
              to="/Dashboard"
              className="hover:text-gray-300 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/ECertificate"
              className="hover:text-gray-300 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              E-Certificates
            </Link>
          </li>
          <li>
            <Link
              to="https://www.myaimate.com/"
              target="_blank"
              className="hover:text-gray-300 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contact Us
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
