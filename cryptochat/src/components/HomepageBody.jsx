import './style.css';
import sendImage from "../assets/sendicon.png"


function Body(){
  


  //RESIZING THE OUTPUT BOX
  const textarea = document.getElementById("resize-textbox");
  


    // ADD EVENT LISTENER FOR INPUT BOX TO RESIZE IT
    document.addEventListener('input', function(event){
      
      

    // Gets the scroll height
    const scrollHeight = textarea.scrollHeight;

    // Gets the max height
    const computedStyle = getComputedStyle(textarea);
    const maxHeight = parseInt(computedStyle.maxHeight);

    // Sets the height based on the maxHeight
    textarea.style.height = Math.min(scrollHeight, maxHeight) + 'px';
  })

  
  return(
    
    <body>
      
      <div class = "chatarea">
        <div id = "output" class = "outputbox">
          
        </div>

        <div class = "input">
          <div class = "inputbox">
            <textarea id = "resize-textbox" class = "inputbox-text" placeholder = "Type something...">

            </textarea>
            <button class = "enterbutton">
              <img src = {sendImage} alt = "d" />
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

export default Body;