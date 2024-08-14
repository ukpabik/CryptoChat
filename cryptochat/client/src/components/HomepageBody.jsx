import './style.css';
import sendImage from "../assets/sendicon.png"
import { React, useEffect, useRef, useContext, useState } from 'react';
import io from 'socket.io-client'
import { AuthContext } from '../Auth';
import axios from 'axios'










function HomepageBody(){


  const { isLoggedIn, username } = useContext(AuthContext)
  const [cryptoData, setCryptoData] = useState([])
  const [messages, setMessages] = useState([])
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const outputRef = useRef(null);
  const outputBoxRef = useRef(null);
  const cryptoRef = useRef(null);
  


  useEffect( () => {

    




    
    //CONNECT TO SERVER FIRST
    const socket = io(`${import.meta.env.VITE_API_URL}`, {
      auth: {
        username: username || 'Guest',
        serverOffset: 0
      },
      
    })
  
    socket.on('connect', () => {
      console.log('Connected to server')
    })

    //RETURNS CURRENT TIME
    const getCurrentTime = () => {
      const currentTime = new Date();
    
      
      const year = currentTime.getFullYear();
      const month = String(currentTime.getMonth() + 1).padStart(2, '0'); 
      const day = String(currentTime.getDate()).padStart(2, '0');
    
      
      const hours = String(currentTime.getHours()).padStart(2, '0');
      const minutes = String(currentTime.getMinutes()).padStart(2, '0');
      const seconds = String(currentTime.getSeconds()).padStart(2, '0');
    
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };
    






    
    //SENDS MESSAGE GLOBALLY
    const sendMessage = () => {
      const inputbox = inputRef.current;
      if (inputbox.value){
        socket.emit('message', { content: inputbox.value, user: username, timeSent: getCurrentTime()});
        console.log('Message sent')

        inputbox.value = ''
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { 
        e.preventDefault();
        sendMessage();
      }
    }
    
  
    

    
    const sendbutton = buttonRef.current;
    sendbutton.addEventListener('click', sendMessage)
    inputRef.current.addEventListener('keydown', handleKeyDown);

    //HANDLING MESSAGES ON SITE BY MAKING NEW LIST ELEMENTS
    socket.on('message', (msg, serverOffset) => {

      

      //EXTRACTS CONTENT OF MESSAGE AND THE USER FROM THE MSG
      const { content, user, timeSent } = msg;
      printMessage(content, user, timeSent)
      socket.auth.serverOffset = serverOffset;
    })

    return () => {
      socket.disconnect();
      if (sendbutton) {
        sendbutton.removeEventListener('click', sendMessage);
      }
      if (inputRef.current) {
        inputRef.current.removeEventListener('keydown', handleKeyDown);
      }
    }



    
  }, [username])

  useEffect(() => {
    //FETCH CRYPTO DATA
    const fetchCryptoData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/cryptodata`);
        
        setCryptoData(response.data); 
      } 
      catch (error) {
        console.error('Error fetching crypto data:', error);
      }
    };

    fetchCryptoData();
  }, []);


  //FORMAT THE TIME CORRECTLY
  const formatTimeForDisplay = (timeSent) => {
  
    const [datePart, timePart, period, dayOrNight] = timeSent.split(' ');
  
    const [day, month, year] = datePart.split('/');
  
    return `${month}/${day}/${year} ${timePart} ${period} ${dayOrNight}`;
  };



  const printMessage = (content, username, timeSent) => {
    if (username || timeSent){
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
      nameSpan.textContent = username || 'Guest';
      nameSpan.style.fontSize = '16px'; 
  
      
      const formattedTime = formatTimeForDisplay(timeSent);
      const timeSpan = document.createElement('span');
      timeSpan.textContent = `  ${formattedTime}`;
      timeSpan.style.fontSize = '12px';
      
  
      
      messageTitle.appendChild(nameSpan);
      messageTitle.appendChild(timeSpan);
  
      newMessageBox.appendChild(messageTitle);
      newMessageBox.appendChild(newMessage);
      outputList.appendChild(newMessageBox);
  
      outputBox.scrollTop = outputBox.scrollHeight;
    }
    
    
  }

  
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/messages`);
        const fetchedMessages = response.data.rows;
  
        
        const formattedMessages = fetchedMessages.map(message => ({
          content: message.content || 'No content',
          username: message.username || 'Guest',
          timeSent: message.timesent || 'No time'
        }));
  
        
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
  
    fetchMessages();
  }, []);
  
  useEffect(() => {
    
    outputRef.current.innerHTML = '';
  
    messages.forEach((message) => {
      printMessage(message.content, message.username, message.timeSent);
    });
  }, [messages]);

  
  
  
  


  





  
  return(
    <div>
      <div class = "homepage-body">
        <div class = "content-container">

        
      
          <div class = "chatarea">
            <div ref = {outputBoxRef} id = "output" class = "outputbox">
              <ul ref = {outputRef}>

              </ul>
            </div>

            <div class = "input">
              <div class = "inputbox">
                {isLoggedIn ? 
                <textarea  ref = {inputRef} id = "resize-textbox" class = "inputbox-text" placeholder = "Type something..." />
                  :
                  <textarea  ref = {inputRef} id = "resize-textbox" class = "inputbox-text" disabled= {!isLoggedIn} placeholder = "Must be logged in" />
                }
              
                <button ref = {buttonRef} id = "sendbutton" class = "enterbutton">
                  <img src = {sendImage} alt = "send-image" />
                </button>
              </div>
            </div>
            
            
          </div>

          
          <div class="crypto-list-container">
            <div class="scrollable-content">
              <div class="cryptoLabel">
                <span class="cryptoLabelRank">#</span>
                <span class="cryptoLabelName">Name</span>
                <span class="cryptoLabelPrice">Price</span>
                <span class="cryptoLabelChange">24h</span>
              </div>
              <div ref={cryptoRef} class="crypto-list">
                {cryptoData.length > 0 ? cryptoData.map((crypto, count) => (
                  <div key={crypto.id} class="cryptoListElement">
                    <span class="cryptoRank">{`${1 + count++} `}</span>
                    <img src={crypto.logo} alt={`${crypto.name} logo`} class="cryptoIcon" />
                    <li class="cryptoTitle">
                      <span class="nameSpan"><a class="cryptoURL">{crypto.name}</a></span>
                      <span class="priceSpan">${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      {crypto.percent_change_24h > 0 ? 
                        <span class="changeSpan green">{crypto.percent_change_24h.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</span>
                        :
                        <span class="changeSpan red">{crypto.percent_change_24h.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</span>
                      }
                    </li>
                  </div>
                )) : <p>Loading...</p>}
              </div>
            </div>
          </div>
        </div>
      
      

      </div>
    </div>
  )
}


//IN CRYPTO LIST DIV, USE CRYPTO API TO RETURN TOP 100 CRYPTOS AS A LIST

export default HomepageBody;