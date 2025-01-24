import React from "react";
import logo3 from "../../assets/logo.svg";
import logo4 from "../../assets/Ait.svg";
import { Link } from 'react-router-dom';

const Header: React.FC = () => (
  <nav className="bg-white shadow-lg">
    <div className="container mx-auto px-4 sm:px-6">
      <div className="flex justify-between items-center h-16 sm:h-20">
        <img 
          src={logo3} 
          alt="Logo" 
          className="h-8 sm:h-12 w-auto"
        />
        <div className="flex items-center">
          <Link 
            to="/ECertificate" 
            className="text-sm sm:text-base font-bold text-gray-900 hover:text-gray-600 hover:underline"
          >
            E-Certificate
          </Link>
        </div>
        <img 
          src={logo4} 
          alt="AWES Logo" 
          className="h-8 sm:h-12"
        />
      </div>
    </div>
  </nav>
);

export default Header;