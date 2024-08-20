import React from 'react';
import { useParams } from 'react-router-dom';
import { useCryptoData } from './useCryptoData';

function CryptoDetails() {
  const { fullName } = useParams(); 
  const cryptoData = useCryptoData(); 

  
  const crypto = cryptoData.find((crypto) => crypto.fullName === fullName);

  if (!crypto) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{crypto.name}</h1>
      <img src={crypto.logo} alt={`${crypto.name} logo`} />
      
      <p>24h Change: {crypto.percent_change_24h.toFixed(2)}%</p>
      
      <p>Description: {crypto.description}</p>
    </div>
  );
}

export default CryptoDetails;