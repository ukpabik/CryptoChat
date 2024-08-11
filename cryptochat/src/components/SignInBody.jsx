import axios from 'axios';
import {React, useRef, useState, useContext} from 'react'
import { AuthContext } from '../Auth';
import { useNavigate } from 'react-router-dom';

function SignInBody() {
  const { isLoggedIn, login } = useContext(AuthContext)
  const errorMessageRef = useRef(null)
  const successMessageRef = useRef(null)


  //FOR REDIRECTING USERS
  const navigate = useNavigate();



  // ASYNC FUNCTION FOR HANDLING LOGIN
  const handleLogin = async (e) => {
    // PREVENTS DEFAULT FORM SUBMISSION
    e.preventDefault();

    // RETRIEVE VALUES OF USERNAME AND PASSWORD
    const username = e.target.username.value;
    const password = e.target.password.value;
    console.log(username);

    const action = e.nativeEvent.submitter.name;
    const errorMessage = errorMessageRef.current;
    const successMessage = successMessageRef.current;
    try {
      // Use axios to make the POST request
      const response = await axios.post(`http://localhost:3000/${action}`, {
        username,
        password
      });

      if (response.status === 200) {
        errorMessage.style.display = "none";
        successMessage.style.display = "block";
        const data = response.data;
        if (action === 'register') {
          successMessage.textContent = 'Successfully Registered';
        } 
        else {
          successMessage.textContent = 'Successfully Logged In';
          console.log("Token: ", data.token);
        }

        login(username, data.token)
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('token', data.token);

        navigate('/')
      }
    } 
    catch (error) {
      
      errorMessage.style.display = "block";
      successMessage.style.display = "none";
      if (error.response) {
        errorMessage.textContent = error.response.data.message;
        console.error(error.response.data);
      } 
      else {
        errorMessage.textContent = error.message;
        console.error("Error Message:", error.message);
      }
    }
  }

  return (
    <body>
      <div className="login-flexbody">
        <div className="login-box">

          <form onSubmit={handleLogin} className="login-form">
            <div className="login-field">
              <label htmlFor="username">Enter Username: </label>
              <input name="username" type="text" className="login-username" required />
              <label htmlFor="password">Enter Password: </label>
              <input name="password" type="password" className="login-username" required />
            </div>
            <div className="submit-button-div">
              <div class = "button-container">
                <input name="register" className="submit-button" type="submit" value="Register" />
                <input name="signin" className="submit-button" type="submit" value="Sign In" />
              </div>
              
              
            </div>
            <p class = "error-text" ref = {errorMessageRef}></p>
            <p class = "success-text" ref = {successMessageRef}></p>
          </form>

        </div>
      </div>
    </body>
  )
}

export default SignInBody;