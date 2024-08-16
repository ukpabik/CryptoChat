import axios from 'axios'
import { useNavigate } from 'react-router-dom';



function ContactBody(){
  const navigate = useNavigate();


  //HANDLING SENDING EMAILS ON CONTACT PAGE
  const handleEmail = async (e) => {

    e.preventDefault();
    
    const details = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value
    }
    navigate('/');
    alert('Email is being sent...');


    try{
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/send-email`, details)
      console.log('Email sent successfully: ', response)
    }
    catch(error){
      console.error('Error sending email: ', error)
    }
  }


  return (
    <div>
      <div className="email-form-container">
        <div className="email-form-body">
          <div className="email-box">
            <form onSubmit={handleEmail} className="email-form">
              <label htmlFor="name">Full Name:</label>
              <input name='name' className="text-for-email-form" required />
              <label htmlFor="email">Email:</label>
              <input name='email' type='email' className="text-for-email-form" required />
              <label htmlFor="message">Message:</label>
              <textarea name='message' className="message-for-form" required />
              <button type='submit' className="email-button">Submit</button>
            </form>
            
          </div>

          <div className="contact-container">
            <h2 className="contact-header">Contact</h2>
            <div className="center-wrap">
              <p className="center-text">officialcryptochat@gmail.com</p>
              <a className='link' href="https://github.com/ukpabik" target="_blank" rel="noopener noreferrer">
                <img className='icon' src='/github-mark.png' alt='github-icon'/>
              </a>
            </div>
            
          </div>
        </div>
      </div>
    </div>


  )



}

export default ContactBody
