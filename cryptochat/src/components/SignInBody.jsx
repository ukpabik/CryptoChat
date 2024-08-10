function SignInBody(){

 // ASYNC FUNCTION FOR HANDLING LOGIN
  const handleLogin = async(e) => {

    //PREVENTS DEFAULT FORM SUBMISSION
    e.preventDefault();



    //RETRIEVE VALUES OF USERNAME AND PASSWORD
    const username = e.target.username.value;
    const password = e.target.password.value;
    console.log(username);
      
    const action = e.nativeEvent.submitter.name;

    try{
      const response = await fetch(`http://localhost:3000/${action}`,{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
      })

      if (response.ok){
        const data = await response.json();

        if (action === 'register'){
          console.log('Successfully Registered')
        }
        else{
          console.log('Successfully Logged in')
          console.log("Token: ", data.token);
        }
      }

    }
    catch(e){
      console.error("Cant handle request")
    }


  }


  return(
    <body>
      <div class = "login-flexbody">
        <div class = "login-box">

          <form onSubmit= {handleLogin} class = "login-form">
            <div class = "login-field">
              <label for= "username">Enter Username: </label>
              <input name = "username" type = "text" class = "login-username" required />
              <label for= "username">Enter Password: </label>
              <input name = "password" type = "password" class = "login-username" required />
              </div>
            <div class = "submit-button-div">
              <input name = "register" class = "submit-button" type = "submit" value = "Register" />
              <input name = "signin" class = "submit-button" type = "submit" value = "Sign In" />
            
            </div>

          </form>
          
        </div>

      </div>
    </body>




  )
}

export default SignInBody