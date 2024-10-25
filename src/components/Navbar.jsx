import React, { useState } from 'react';
import { FaDollarSign, FaExchangeAlt, FaHome, FaInfoCircle, FaPhoneAlt, FaWallet } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage mobile menu visibility

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Toggle the menu open/close state
  };

  return (
    <nav className="bg-black text-yellow-500 shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">

        <div className="flex items-center space-x-2 text-yellow-500">
          <FaDollarSign size={24} />
          <span className="font-bold text-xl">MobiCurrency</span>
        </div>

        <div className="hidden md:flex space-x-6">
          <a href="/" className="flex items-center space-x-1 hover:text-yellow-300">
            <FaHome />
            <span>Home</span>
          </a>
          <a href="/exchange" className="flex items-center space-x-1 hover:text-yellow-300">
            <FaExchangeAlt />
            <span>Exchange</span>
          </a>
          <a href="/rates" className="flex items-center space-x-1 hover:text-yellow-300">
            <FaDollarSign />
            <span>Rates</span>
          </a>
          <a href="/wallet" className="flex items-center space-x-1 hover:text-yellow-300">
            <FaWallet />
            <span>Wallet</span>
          </a>
          <a href="/about" className="flex items-center space-x-1 hover:text-yellow-300">
            <FaInfoCircle />
            <span>About</span>
          </a>
          <a href="/contact" className="flex items-center space-x-1 hover:text-yellow-300">
            <FaPhoneAlt />
            <span>Contact</span>
          </a>
        </div>

        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-yellow-500 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-black text-yellow-500 py-4 px-6">
          <a href="/" className="block py-2 hover:text-yellow-300">
            <FaHome className="inline mr-2" />
            Home
          </a>
          <a href="/exchange" className="block py-2 hover:text-yellow-300">
            <FaExchangeAlt className="inline mr-2" />
            Exchange
          </a>
          <a href="/rates" className="block py-2 hover:text-yellow-300">
            <FaDollarSign className="inline mr-2" />
            Rates
          </a>
          <a href="/wallet" className="block py-2 hover:text-yellow-300">
            <FaWallet className="inline mr-2" />
            Wallet
          </a>
          <a href="/about" className="block py-2 hover:text-yellow-300">
            <FaInfoCircle className="inline mr-2" />
            About
          </a>
          <a href="/contact" className="block py-2 hover:text-yellow-300">
            <FaPhoneAlt className="inline mr-2" />
            Contact
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
