import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCryptoData } from './useCryptoData';

function CryptoDetails() {
  const [cryptoBoxOpen, setCryptoBoxOpen] = useState(false);
  const params = useParams();
  const cryptoIdentifier = params.name || params.fullName;
  const cryptoData = useCryptoData(); 

  //FINDS THE CRYPTO IF THE USER USES THE SYMBOL OR FULL NAME
  const crypto = cryptoData.find(
    (crypto) => crypto.name === cryptoIdentifier || crypto.fullName === cryptoIdentifier
  );

  const openContent = () => {
    console.log('OPEN')
    setCryptoBoxOpen(true);
  }
  const closeContent = () => {
    console.log('CLOSE')
    setCryptoBoxOpen(false);
  }

  //IF NOT FOUND, PUT A CRYPTO NOT FOUND PAGE
  if (!crypto) {
    return <p>Oops! We couldn't find that cryptocurrency.</p>;
  }

  const formatDescription = (description) => {
    const regex = /(\b\d{1,3}(?:,\d{3})*(?:\.\d+)?\b)/g;
    const splitDesc = description.split(regex);
  
    return splitDesc.map((part, index) => {
      if (regex.test(part)) {
        const cleanedPart = part.replace(/,/g, ''); // Remove commas
        return <strong key={index}>{Number(Number(cleanedPart).toFixed(2)).toLocaleString()}</strong>;
      }
      return part;
    });
  };

  return (
    <div 
      className='crypto-info-container'
      style={
        {
          justifyContent: cryptoBoxOpen ? 'flex-start' : 'center',
          
        }
      }
      >
      <div 
        onMouseOver={openContent} 
        onMouseOut={closeContent} 
        className='crypto-info-box'
        
      >
        {
          cryptoBoxOpen ? 
          <div className='crypto-info-content'>
            <div className='crypto-info-header'>
              
            <img className='crypto-logo' src={crypto.logo} alt={`${crypto.name} logo`} />
              <h1>{`${crypto.fullName}`}</h1>
              <p className='crypto-mini-label'>{`(${crypto.name})`}</p>
              
              <p style={{ fontWeight: 'bold' }}>24h Change: <span style={{ fontWeight: 'normal' }} className={crypto.percent_change_24h > 0 ? 'green' : 'red'}>
                {crypto.percent_change_24h > 0 ? `+${crypto.percent_change_24h.toFixed(2)}%` : `${crypto.percent_change_24h.toFixed(2)}%`}
              </span>  </p>
              
            </div>
            
            
            
            <div className='crypto-desc'>
              <p className='crypto-desc-text'><span style={{fontWeight: 'bold'}}>Description: </span> {formatDescription(crypto.description)}</p>
              <div className='centered'
                style={
                  {
                    gap: '10px',
                  }
                }
              >
                <p style={{ fontWeight: 'bold' }}>Learn more at: </p>
                <a className='crypto-website' href={crypto.websites[0]}><img className='crypto-logo small' src={crypto.logo} alt={`${crypto.name} logo`} /></a>
              
              </div>
              
            </div>
          </div>
          :
          <div className='crypto-info-content'>
            <div className='crypto-info-header'>
              <img className='crypto-logo' src={crypto.logo} alt={`${crypto.name} logo`} />
              <h1>{`${crypto.fullName}`}</h1>
              <p className='crypto-mini-label'>{`(${crypto.name})`}</p>
              <p>Hover over me!</p>
            </div>
            
          </div>

        }
        
        
        
      </div>
      
      
      
    </div>
  );
}

export default CryptoDetails;