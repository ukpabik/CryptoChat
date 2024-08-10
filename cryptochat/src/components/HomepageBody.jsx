import './style.css';
import sendImage from "../assets/sendicon.png"
import { React, useEffect, useRef } from 'react';
import io from 'socket.io-client'









function HomepageBody(){

  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const outputRef = useRef(null);


  useEffect( () => {
    //CONNECT TO SERVER FIRST
    const socket = io('http://localhost:3000', {
      auth: {
        serverOffset: 0
      },
      
    })
  
    socket.on('connect', () => {
      console.log('Connected to server')
    })

    
    
    const sendMessage = () => {
      const inputbox = inputRef.current;
      if (inputbox.value){
        socket.emit('message', inputbox.value);
        console.log('Message sent')
        inputbox.value = ''
      }
    }

    

    
    const sendbutton = buttonRef.current;
    sendbutton.addEventListener('click', sendMessage)
    

    //HANDLING MESSAGES ON SITE BY MAKING NEW LIST ELEMENTS
    socket.on('message', (msg, serverOffset) => {
      const username = 'CoolGuy123'; //PLACEHOLDER FOR USERNAME LOGIC
      const outputbox = outputRef.current;
      const newMessage = document.createElement('li');
      newMessage.className = "listElement";
      newMessage.textContent = {username} + ': ' + msg;
      outputbox.appendChild(newMessage);

      //FOR RECOVERY OF MESSAGES
      socket.auth.serverOffset = serverOffset;
    })

    return () => {
      socket.disconnect();
      sendbutton.removeEventListener('click', sendMessage)
    }
  }, [])

  


    // ADD EVENT LISTENER FOR INPUT BOX TO RESIZE IT
  document.addEventListener('input', function(event){
    const textarea = event.target;

  if (textarea && textarea.scrollHeight) {
    // RESET THE HEIGHT TO SHRINK THE BOX
    textarea.style.height = 'auto';

    
    const scrollHeight = textarea.scrollHeight;

    
    const computedStyle = getComputedStyle(textarea);
    const maxHeight = parseInt(computedStyle.maxHeight);

    
    textarea.style.height = Math.min(scrollHeight, maxHeight) + 'px';
  }
  })

  
  return(
    
    <body>
      
      <div class = "chatarea">
        <div id = "output" class = "outputbox">
          <ul ref = {outputRef}>

          </ul>
        </div>

        <div class = "input">
          <div class = "inputbox">
            <textarea ref = {inputRef} id = "resize-textbox" class = "inputbox-text" placeholder = "Type something...">

            </textarea>
            <button ref = {buttonRef} id = "sendbutton" class = "enterbutton">
              <img src = {sendImage} alt = "send-image" />
            </button>
          </div>
        </div>
        
        
      </div>


      <div class = "crypto-list">
        
      </div>
      
      
      


    </body>
  )
}


//IN CRYPTO LIST DIV, USE CRYPTO API TO RETURN TOP 100 CRYPTOS AS A LIST

export default HomepageBody;