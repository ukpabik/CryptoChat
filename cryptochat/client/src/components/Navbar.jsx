import React, { useContext, useState, useEffect, useRef} from 'react';
import { AuthContext } from '../Auth';
import dropdownIcon from '../assets/menuicon.png'
import './style.css'
import axios from 'axios'


function Navbar(){

  //FOR TRACKING LOGINS AND LOGOUTS
  const { isLoggedIn, logout } = useContext(AuthContext)


  //FOR DROPDOWN MENU USE USESTATE
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  //FOR AI CHAT MENU
  const [chatMenuOpen, setChatMenuOpen] = useState(false);
  const [currentlyChatting, setCurrentlyChatting] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const aiRef = useRef(null);
  const aiOutputRef = useRef(null);
  const inputRef = useRef(null);
  

  //TRACKS INPUT OF WHAT YOU ASK THE AI
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  }


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setCurrentlyChatting(true);

      // Add the user's input to chat history
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { type: 'You: ', text: inputValue },
      ]);

      axios
        .post(`${import.meta.env.VITE_API_URL}/ai`, {
          body: inputValue,
        })
        .then((response) => {
          setInputValue('');

          //ADD RESPONSE TO HISTORY
          setChatHistory((prevHistory) => [
            ...prevHistory,
            { type: 'CryptoAI: ', text: response.data.data },
          ]);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
    

  useEffect(() => {
    if (chatHistory.length > 0) {
      const aiChatBox = aiRef.current;
      const aiOutputBox = aiOutputRef.current;

      // CLEAR CHATBOX
      aiOutputBox.innerHTML = '';

      chatHistory.forEach((chat) => {
        const newChat = document.createElement('div');
        const newChatText = document.createElement('li');
        const newChatTitle = document.createElement('span');

        newChat.className = 'newChat';
        newChatText.className = 'newChatText';
        newChatTitle.className = 'newChatTitle';

        newChatText.textContent = chat.text;
        newChatTitle.textContent = chat.type;

        newChat.appendChild(newChatTitle);
        newChat.appendChild(newChatText);
        aiOutputBox.appendChild(newChat);
      });

      aiChatBox.scrollTop = aiChatBox.scrollHeight;
    }
  }, [chatHistory]);



  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };


  const openChatMenu = () => {
    setChatMenuOpen(true)
  }

  //CLOSES THE AI CHATBOX IF CLICKED OUTSIDE OF IT
  const handleClickOutsideChat = (event) => {
    if (
      aiRef.current && !aiRef.current.contains(event.target) &&
      inputRef.current && !inputRef.current.contains(event.target)
    ) {
      setChatMenuOpen(false);
      setCurrentlyChatting(false);
    }
  };

  useEffect(() => {
    if (chatMenuOpen) {
      document.addEventListener('mousedown', handleClickOutsideChat);
    } else {
      document.removeEventListener('mousedown', handleClickOutsideChat);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideChat);
    };
  }, [chatMenuOpen]);



  //CLOSES THE DROPDOWN MENU IF YOU CLICK OFF OF IT
  const handleClickOutsideDropdown = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutsideDropdown);
    } else {
      document.removeEventListener('mousedown', handleClickOutsideDropdown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDropdown);
    };
  }, [dropdownOpen]);


  return(
    
    <header>
      
      <nav class = "flexbox header-div">
        <div class = "flex-item headerTitle"><a class = "header" href = "/">CryptoChat</a></div>
        <form onSubmit={(e) => e.preventDefault()} className="flex-item search-container">
          <input 
            value={inputValue}
            ref={inputRef}
            onFocus={openChatMenu} 
            onChange= {handleInputChange}  
            onKeyDown = {handleKeyPress} 
            type="text" 
            className="search-bar" 
            placeholder="Type to CryptoAI..." 
            required 
          />
        </form>
        {chatMenuOpen && currentlyChatting ? 
          <div ref = {aiRef} class="ai-chatbox">
            <div ref = {aiOutputRef} class = "ai-chatbox-output">

            </div>
          </div>
          :
          <div>
            
          </div>
        }


        <div class = "flex-item">
          <div class = "dropdown" ref = {dropdownRef}>
            <button class = "dropbutton" onClick = {toggleDropdown}>
              <img class = "dropdown-icon" src = {dropdownIcon} alt = "dropdown-icon" />
            </button>
            <div className={`dropdown-content ${dropdownOpen ? 'open' : ''}`}>
              {isLoggedIn ? (
                <a onClick={logout} href="/signin">Log Out</a>
              ) : (
                <a href="/signin">Sign In</a>
              )}
              <a href="#">About</a>
              <a href="#">Contact Us</a>
            </div>
          </div>
        </div>
      </nav>
      
    </header>
    
  )

}










export default Navbar