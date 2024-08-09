import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Homepage from './routes/Homepage.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

function App() {


  return(
    
    //ROUTER FOR ROUTES

    <Router>
      <Navbar />
      <Routes>
        <Route path = "/" element = {<Homepage />} />


      </Routes>
      <Footer />
    </Router>
    
  )
}

export default App
