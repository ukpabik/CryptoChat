import './style.css'
import React, { useEffect } from 'react';

function Header(){
  //OVERLAY
  function overlayOn(){
    document.getElementById("overlay").style.display = "block";
  }
  

  useEffect(() => {
    const signin = document.getElementById("signin");
    const handleClick = () => {
      overlayOn();
    }
    if (signin){
      signin.addEventListener('click', handleClick)
    }

    return () => {
      if (signin){
        signin.removeEventListener('click', handleClick)
      }
    }

  })



  return(
    
    <header>
      <div id = "overlay">


      </div>
      <nav class = "flexbox">
        <div class = "flex-item"><a class = "header" href = "">CryptoChat</a></div>
        <div class = "flex-item"><a class = "text" href = "">Talk to CryptoGPT</a></div>
        <div class = "flex-item"><a class = "text" href = "">About</a></div>
        <div class = "flex-item"><a class = "text" href = "">Help</a></div>
        <div class = "flex-item"><a id = "signin" class = "text" href = "">Sign In</a></div>
      </nav>
      
    </header>
    
  )

}










export default Header