import React, { useContext, useState } from 'react';
import { FaSearch, FaShoppingCart, FaTimes } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import { userDataContext } from '../contexts/UserContext';

import { useNavigate } from 'react-router';


const Nav = () => {
  const { userData,logout } = useContext(userDataContext);
  
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();


  
  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <h1 
              className="text-2xl font-bold text-indigo-600 cursor-pointer" 
              onClick={() => navigate('/word')}
            >
              Lernit
            </h1>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              onClick={() => navigate('/word')}
            >
              Word
            </button>
            <button 
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              onClick={() => navigate('/Sentence')}
            >
              Sentence
            </button>
            <button 
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              onClick={() => navigate('/paragraph')}
            >
              Paragraph
            </button>
            
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
           

            {/* User Profile */}
            <div className="relative">
              {!userData ? (
                <button 
                  onClick={() => navigate('/login')}
                  className="p-2 rounded-full text-gray-600 hover:text-indigo-600 hover:bg-gray-100 transition-colors"
                  aria-label="User account"
                >
                  <IoPersonCircle className="h-6 w-6" />
                </button>
              ) : (
                <button 
                  onClick={() => setShowProfile(prev => !prev)}
                  className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 font-medium hover:bg-indigo-200 transition-colors"
                  aria-label="User menu"
                >
                  {userData?.name.slice(0, 1).toUpperCase()}
                </button>
              )}

              {/* Profile Dropdown */}
              {showProfile && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{userData.name}</p>
                    <p className="text-sm text-gray-500 truncate">{userData.email}</p>
                  </div>
                  <button 
                    onClick={() => { navigate('/progress'); setShowProfile(false); }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Progress
                  </button>
                  
                  <button 
                    onClick={() => { logout(); setShowProfile(false); }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            

           
          </div>
        </div>

       
        

       
      </div>
    </nav>
  );
}

export default Nav;