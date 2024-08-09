import './style.css';
import sendImage from "../assets/sendicon.png"


function Body(){

  document.addEventListener('input', function(event){
    const textarea = document.getElementById("resize-textbox");
    
    textarea.style.height = 'auto';

  // Get the scroll height of the textarea
  const scrollHeight = textarea.scrollHeight;

  // Get the computed max-height and min-height
  const computedStyle = getComputedStyle(textarea);
  const maxHeight = parseInt(computedStyle.maxHeight);

  // Set the height, ensuring it respects max-height
  textarea.style.height = Math.min(scrollHeight, maxHeight) + 'px';

  })
  return(
    <body>
      <div class = "chatarea">
        <div class = "outputbox">
          
        </div>

        <div class = "inputbox">
          <textarea id = "resize-textbox" class = "inputbox-text" placeholder = "Type something...">

          </textarea>
          <button class = "enterbutton">
            <img src = {sendImage} alt = "d" />
          </button>
        </div>
        
      </div>
      


    </body>
  )
}


export default Body