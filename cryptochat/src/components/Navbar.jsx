import React, { useState } from 'react';
import dropdownIcon from '../assets/menuicon.png'
import './style.css'


function Navbar(){

  //FOR DROPDOWN MENU USE USESTATE
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };



  return(
    
    <header>
      
      <nav class = "flexbox header-div">
        <div class = "flex-item"><a class = "header" href = "/">CryptoChat</a></div>
        <form className="flex-item search-container">
          <input type="text" className="search-bar" placeholder="Search..." />
        </form>

        <div class = "flex-item">
          <div class = "dropdown">
            <button class = "dropbutton" onClick = {toggleDropdown}>
              <img class = "dropdown-icon" src = {dropdownIcon} alt = "dropdown-icon" />
            </button>
            {dropdownOpen && (
              <div class = "dropdown-content">
                <input id = "dropdown-search" type="text" placeholder="Search..." />
                <a href = "#">Talk To CryptoGPT</a>
                <a href = "/signin">Sign In</a>
                <a href = "#">About</a>
                <a href = "#">Contact Us</a>
              </div>
            )}  
          </div>
        </div>
      </nav>
      
    </header>
    
  )

}










export default Navbar