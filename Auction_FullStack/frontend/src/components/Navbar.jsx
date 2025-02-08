import React from 'react'

const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">
          Auction
        </div>
        <ul className="flex space-x-4">
          <li><a href="#" className="text-white hover:text-gray-200">Home</a></li>
          <li><a href="#" className="text-white hover:text-gray-200">About</a></li>
          <li><a href="#" className="text-white hover:text-gray-200">Services</a></li>
          <li><a href="#" className="text-white hover:text-gray-200">Contact</a></li>
        </ul>
        <div className="flex space-x-4">
          <a href="#" className="text-white hover:text-gray-200">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="text-white hover:text-gray-200">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="text-white hover:text-gray-200">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" className="text-white hover:text-gray-200">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar