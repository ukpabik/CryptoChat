import './style.css';
import sendImage from "../assets/sendicon.png"
import { React, useEffect, useRef, useContext } from 'react';
import io from 'socket.io-client'
import { AuthContext } from '../Auth';









function HomepageBody(){
  const { isLoggedIn, username } = useContext(AuthContext)
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const outputRef = useRef(null);
  const outputBoxRef = useRef(null);
  


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

    
    
    //SENDS MESSAGE GLOBALLY
    const sendMessage = () => {
      const inputbox = inputRef.current;
      if (inputbox.value){
        socket.emit('message', { content: inputbox.value, user: username });
        console.log('Message sent')
        inputbox.value = ''
      }
    }
    
    //RETURNS CURRENT TIME
    const getCurrentTime = (currentTime) => {
      let minutes = ''; 
      if (currentTime.getMinutes() < 10) {
        minutes = '0' + currentTime.getMinutes();
      } 
      else {
        minutes = currentTime.getMinutes(); 
      }
      let hours = '';

      if (currentTime.getHours() > 12){
        hours = currentTime.getHours() - 12;
      }
      else{
        hours = currentTime.getHours();
      }
      return currentTime.getDate() + "/" + (currentTime.getMonth() + 1)
        + "/" + currentTime.getFullYear() + " | " + hours + ":"
          + minutes
    }
    

    
    const sendbutton = buttonRef.current;
    sendbutton.addEventListener('click', sendMessage)
    

    //HANDLING MESSAGES ON SITE BY MAKING NEW LIST ELEMENTS
    socket.on('message', (msg, serverOffset) => {
      const currentTime = new Date();
      const time = getCurrentTime(currentTime);



      //EXTRACTS CONTENT OF MESSAGE AND THE USER FROM THE MSG
      const {content, user} = msg;
      const name = user 
      const outputList = outputRef.current;
      const outputBox = outputBoxRef.current;

      const newMessageBox = document.createElement('div');
      const newMessage = document.createElement('li');
      const messageTitle = document.createElement('li');

      newMessageBox.className = "listDiv";
      newMessage.className = "listElement";
      messageTitle.className = "listElementName"

      newMessage.textContent = content;
      

      
      const nameSpan = document.createElement('span');
      nameSpan.textContent = name || 'unknown';
      nameSpan.style.fontSize = '16px'; 

      
      const timeSpan = document.createElement('span');
      timeSpan.textContent = ` | ${time}`;
      timeSpan.style.fontSize = '12px'; 

      
      messageTitle.appendChild(nameSpan);
      messageTitle.appendChild(timeSpan);

      newMessageBox.appendChild(messageTitle);
      newMessageBox.appendChild(newMessage);
      outputList.appendChild(newMessageBox);

      outputBox.scrollTop = outputBox.scrollHeight;
      
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
      <div class = "homepage-body">

      
        <div class = "chatarea">
          <div ref = {outputBoxRef} id = "output" class = "outputbox">
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
      
      
      

      </div>
    </body>
  )
}


//IN CRYPTO LIST DIV, USE CRYPTO API TO RETURN TOP 100 CRYPTOS AS A LIST

export default HomepageBody;