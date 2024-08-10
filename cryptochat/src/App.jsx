import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Homepage from './routes/Homepage.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import SignIn from './routes/SignIn.jsx'
import './index.css'

function App() {
  

  return(
    //FOR ROUTES
    <Router>
      <div id="root">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/signin" element={<SignIn />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    
  )
}

export default App
