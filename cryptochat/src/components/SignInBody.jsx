function SignInBody(){
  return(
    <body>
      <div class = "flexbody">
        <div class = "login-box">

          <form action = "" method = "get" class = "login-form">
            <div class = "login-field">
              <label for= "username">Enter Username: </label>
              <input type = "text" class = "login-username" id = "name" required />
              <label for= "username">Enter Username: </label>
              <input type = "text" class = "login-username" id = "name" required />
              </div>
            <div class = "submit-button">
              <input class = "submit-button" type = "submit" value = "Sign In" />
            </div>
          </form>
          
        </div>

      </div>
    </body>




  )
}

export default SignInBody