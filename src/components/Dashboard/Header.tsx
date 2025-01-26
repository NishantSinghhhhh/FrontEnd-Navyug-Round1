import React from "react";
import logo4 from "../../assets/Ait.svg";
import logo5 from "../../assets/eb893b9cebc30693faeb8fbe5ee81cf9.png";

const Header: React.FC = () => (
  <nav className="bg-white shadow-lg">
    <div className="container mx-auto px-4 sm:px-6">
      <div className="flex justify-between items-center h-16 sm:h-20">
        {/* Clickable Logo 1 */}
        <a href="https://www.myaimate.com/" target="_blank" rel="noopener noreferrer">
          <img 
            src={logo5} 
            alt="Logo" 
            className="h-6 sm:h-12 md:h-12 w-auto cursor-pointer"
          />
        </a>

        
        <a 
            href="https://www.myaimate.com/navyug" 
            className="text-decoration-none text-black font-bold text-[1rem] hover:underline"
            target="_blank" 
            rel="noopener noreferrer"
          >
            NAVYUG 2024-2025
          </a>

        {/* Clickable Logo 2 */}
        <a href="https://www.aitpune.in/" target="_blank" rel="noopener noreferrer">
          <img 
            src={logo4} 
            alt="AWES Logo" 
            className="h-6 md:h-12 sm:h-12 cursor-pointer"
          />
        </a>
      </div>
    </div>
  </nav>
);

export default Header;
