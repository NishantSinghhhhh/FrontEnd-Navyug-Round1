import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { creds } from "../data/creds.ts";
import { useAuth } from "../context/AuthContext.tsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo4 from "../assets/Ait.svg";
import logo5 from "../assets/eb893b9cebc30693faeb8fbe5ee81cf9.png"
interface FormState {
  username: string;
  password: string;
  showPassword: boolean;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormState>({
    username: "",
    password: "",
    showPassword: false,
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const togglePassword = () => {
    setFormData((prevState) => ({
      ...prevState,
      showPassword: !prevState.showPassword,
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = creds.find(
      (cred) => cred.username === formData.username && cred.password === formData.password
    );

    if (user) {
      localStorage.setItem("username", formData.username);
      localStorage.setItem("password", formData.password);
      login(formData.username, formData.password);
      navigate("/dashboard");
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <a href="https://www.myaimate.com/" target="_blank" rel="noopener noreferrer">
            <img src={logo5} alt="Logo" className="h-8 sm:h-10 md:h-12" />
          </a>
          <a 
            href="https://www.myaimate.com/navyug" 
            className="text-decoration-none text-black font-bold text-[1rem] hover:underline"
            target="_blank" 
            rel="noopener noreferrer"
          >
            NAVYUG 2024-2025
          </a>

          <a href="https://www.aitpune.in/" target="_blank" rel="noopener noreferrer">
            <img src={logo4} alt="AWES Logo" className="h-8 sm:h-10 md:h-12" />
          </a>
        </div>
      </nav>


      <div className="flex-grow flex items-center justify-center px-4 py-6">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md sm:max-w-lg md:max-w-xl">
          <img 
            src={logo5} 
            alt="Logo" 
            className="w-1/2 sm:w-1/3 mx-auto mb-4 sm:mb-6"
          />
          <h1 className="text-xl sm:text-2xl font-bold text-black mb-2 text-center">
            Navyug Result Portal
          </h1>
          <p className="text-gray-600 mb-4 sm:mb-6 text-center text-xs sm:text-sm">
            Fill Up Your Details to View Detailed Report For <br /> (Round 1)
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                type="text"
                required
                className="block bg-white w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-black border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="relative">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type={formData.showPassword ? "text" : "password"}
                placeholder="Password"
                required
                className="block bg-white w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-black border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 pr-10"
              />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute bg-transparent inset-y-0 right-0 px-3 flex items-center text-gray-500"
                >
                  {formData.showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-[#4494cc] text-white text-sm sm:text-base font-semibold py-2 sm:py-3 rounded-md hover:bg-[#1c4868] transition"
            >
              Login
            </button>
            
            <p className="text-gray-400 text-xs text-center mt-4">
              In case of any technical difficulty mail us at: navyug@myaimate.com
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;