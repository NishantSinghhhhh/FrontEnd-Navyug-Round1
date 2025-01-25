import React from "react";
import logo3 from "../../assets/logo.svg";
import logo4 from "../../assets/Ait.svg";

const Header: React.FC = () => (
  <nav className="bg-white shadow-lg">
    <div className="container mx-auto px-4 sm:px-6">
      <div className="flex justify-between items-center h-16 sm:h-20">
        <img 
          src={logo3} 
          alt="Logo" 
          className="h-6 sm:h-12 md:h-12 w-auto"
        />
        <div className="flex items-center font-bold md:text-[1.5rem] text-[0.8rem] text-black">
         Navyug 2024-2025
        </div>
        <img 
          src={logo4} 
          alt="AWES Logo" 
          className="h-6  md:h-12 sm:h-12"
        />
      </div>
    </div>
  </nav>
);

export default Header;