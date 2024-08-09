import './style.css'

function Footer(){
  return (
    <footer>

      <div class = "flexbox">
        <div class = "flex-item">&copy; {new Date().getFullYear()} - CryptoChat </div>
        <div class = "flex-item"><a href = "">What is CryptoChat?</a></div>
        <div class = "flex-item"><a href = "">Contact Us</a></div>
      </div>
      
    </footer>

  )
}


export default Footer