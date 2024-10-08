import axios from "axios";
import { React, useRef, useState, useContext } from "react";
import { AuthContext } from "../Auth";
import { useNavigate } from "react-router-dom";

function SignInBody() {
  const { isLoggedIn, login } = useContext(AuthContext);
  const errorMessageRef = useRef(null);
  const successMessageRef = useRef(null);

  //FOR REDIRECTING USERS
  const navigate = useNavigate();

  // ASYNC FUNCTION FOR HANDLING LOGIN
  const handleLogin = async (e) => {
    // PREVENTS DEFAULT FORM SUBMISSION
    e.preventDefault();

    // RETRIEVE VALUES OF USERNAME AND PASSWORD
    const username = e.target.username.value;
    const password = e.target.password.value;

    const action = e.nativeEvent.submitter.name;
    const errorMessage = errorMessageRef.current;
    const successMessage = successMessageRef.current;
    try {
      //MAKE POST REQUEST
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/${action}`,
        {
          username,
          password,
        },
      );

      if (response.status === 200) {
        errorMessage.style.display = "none";
        successMessage.style.display = "block";
        const data = response.data;
        if (action === "register") {
          successMessage.textContent = "Successfully Registered";
        } else {
          successMessage.textContent = "Successfully Logged In";
        }

        login(username, data.token);
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("token", data.token);

        navigate("/");
      }
    } catch (error) {
      errorMessage.style.display = "block";
      successMessage.style.display = "none";
      if (error.response) {
        errorMessage.textContent = error.response.data.message;
        console.error(error.response.data);
      } else {
        errorMessage.textContent = error.message;
        console.error("Error Message:", error.message);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-flexbody">
        <div className="login-box">
          <form onSubmit={handleLogin} className="login-form">
            <div className="login-field">
              <label htmlFor="username">Enter Username: </label>
              <input
                name="username"
                type="text"
                className="text-for-form"
                required
              />
              <label htmlFor="password">Enter Password: </label>
              <input
                name="password"
                type="password"
                className="text-for-form"
                required
              />
            </div>
            <div className="submit-button-div">
              <div className="button-container">
                <input
                  title="Register"
                  name="register"
                  className="submit-button"
                  type="submit"
                  value="Register"
                />
                <input
                  title="Sign In"
                  name="signin"
                  className="submit-button"
                  type="submit"
                  value="Sign In"
                />
              </div>
            </div>
            <p className="error-text" ref={errorMessageRef}></p>
            <p className="success-text" ref={successMessageRef}></p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignInBody;
