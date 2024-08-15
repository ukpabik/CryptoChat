import './style.css';
import sendImage from "../assets/sendicon.png"
import { React, useEffect, useRef, useContext, useState } from 'react';
import io from 'socket.io-client'
import { AuthContext } from '../Auth';
import axios from 'axios'
import Ably from 'ably';










function HomepageBody(){


  const { isLoggedIn, username } = useContext(AuthContext)
  const [cryptoData, setCryptoData] = useState([])
  const [messages, setMessages] = useState([])
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const outputRef = useRef(null);
  const outputBoxRef = useRef(null);
  const cryptoRef = useRef(null);
  

  const ably = new Ably.Realtime({ key: import.meta.env.VITE_ABLY_API_KEY });
  const channel = ably.channels.get('chat-channel');

  useEffect( () => {

    




    
    //CONNECT TO SERVER FIRST
    const socket = io(`${import.meta.env.VITE_API_URL}`, {
      auth: {
        username: username || 'Guest',
        serverOffset: 0,
        transports: [ 'websocket'],
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
      if (inputbox.value) {
        const timeSent = new Date().toISOString();
        axios.post(`${import.meta.env.VITE_API_URL}/send-message`, { 
          content: inputbox.value, 
          user: username, 
          timeSent 
        });
        inputbox.value = '';
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
    channel.subscribe('message', (msg) => {
      const { content, user, timeSent } = msg.data;
      printMessage(content, user, timeSent);
    });

    return () => {
      channel.unsubscribe();
      if (sendbutton) {
        sendbutton.removeEventListener('click', sendMessage);
      }
      if (inputRef.current) {
        inputRef.current.removeEventListener('keydown', handleKeyDown);
      }
    };

  }, [username]);

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
    
    const date = new Date(timeSent);
    const localTime = date.toLocaleString(); 
    const [day, time] = localTime.split(',');
    const [space, currentTime, period] = time.split(' ');

    const [hours, minutes, seconds] = currentTime.split(':')
    return `${day} ${hours}:${minutes} ${period}`;
  };


  //PRINTS EACH MESSAGE
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

  
  //GETS ALL OF THE MESSAGES THAT HAVE BEEN SENT
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
  

  //DISPLAYS ALL MESSAGES TO THE OUTPUT BOX
  useEffect(() => {
    
    outputRef.current.innerHTML = '';
  
    messages.forEach((message) => {
      printMessage(message.content, message.username, message.timeSent);
    });
  }, [messages]);

  
  
  
  


  





  
  return(
    <div>
      <div className = "homepage-body">
        <div className = "content-container">

        
      
          <div className = "chatarea">
            {!isLoggedIn ? 
            <div className='blur'><button className='blurtext'><a className='blursignin' href='/signin'>Click here to sign in and join the chat.</a></button></div>
            :
            <></>
            }
            <div ref = {outputBoxRef} id = "output" className = "outputbox">
              
              <ul ref = {outputRef}>
                  
              </ul>
            </div>

            <div className = "input">
              <div className = "inputbox">
                {isLoggedIn ? 
                <textarea  ref = {inputRef} id = "resize-textbox" className = "inputbox-text" placeholder = "Type something..." />
                  :
                  <textarea  ref = {inputRef} id = "resize-textbox" className = "inputbox-text" disabled= {!isLoggedIn} placeholder = "Must be logged in" />
                }
              
                <button ref = {buttonRef} id = "sendbutton" className = "enterbutton">
                  <img src = {sendImage} alt = "send-image" />
                </button>
              </div>
            </div>
            
            
          </div>

          
          <div className="crypto-list-container">
            <div className="scrollable-content">
              <div className="cryptoLabel">
                <span className="cryptoLabelRank">#</span>
                <span className="cryptoLabelName">Name</span>
                <span className="cryptoLabelPrice">Price</span>
                <span className="cryptoLabelChange">24h</span>
              </div>
              <div ref={cryptoRef} className="crypto-list">
                {cryptoData.length > 0 ? cryptoData.map((crypto, count) => (
                  <div key={crypto.id} className="cryptoListElement">
                    <span className="cryptoRank">{`${1 + count++} `}</span>
                    <img src={crypto.logo} alt={`${crypto.name} logo`} class="cryptoIcon" />
                    <li class="cryptoTitle">
                      <span className="nameSpan"><a class="cryptoURL">{crypto.name}</a></span>
                      <span className="priceSpan">${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      {crypto.percent_change_24h > 0 ? 
                        <span className="changeSpan green">{crypto.percent_change_24h.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</span>
                        :
                        <span className="changeSpan red">{crypto.percent_change_24h.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</span>
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