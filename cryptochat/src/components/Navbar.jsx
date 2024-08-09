import React, { useState } from 'react';
import './style.css'


function Navbar(){

  //FOR DROPDOWN MENU USE USESTATE
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };



  return(
    
    <header>
      
      <nav class = "flexbox">
        <div class = "flex-item"><a class = "header" href = "/">CryptoChat</a></div>
        <div className="flex-item search-container">
          <input type="text" className="search-bar" placeholder="Search..." />
        </div>

        <div class = "flex-item">
          <div class = "dropdown">
            <button class = "dropbutton" onClick = {toggleDropdown}>
              Menu
            </button>
            {dropdownOpen && (
              <div class = "dropdown-content">
                <a href = "">f</a>
                <a href = "">f</a>
                <a href = "">f</a>
                <a href = ""></a>
              </div>
            )}  
          </div>
        </div>
      </nav>
      
    </header>
    
  )

}










export default Navbar