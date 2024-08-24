import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './routes/Homepage.jsx';  
import Navbar from './components/Navbar.jsx';  
import Footer from './components/Footer.jsx';  
import CryptoDetails from './components/CryptoDetails';
import SignIn from './routes/SignIn.jsx';  
import About from './routes/About.jsx';
import Contact from './routes/Contact.jsx'
import './index.css';

function App() {
  useEffect(() => {

    //KEEPING THE WIDTH OF THE ENTIRE APP 650px MINIMUM
    const handleResize = () => {
      if (window.innerWidth <= 650) {
        
        window.resizeTo(650, window.innerHeight);
      }
    };

    
    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  

  return (
    <Router>
      <div id="root">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/crypto/:name" element={<CryptoDetails />} />
            <Route path="/crypto/:fullName" element={<CryptoDetails />} />
            
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;