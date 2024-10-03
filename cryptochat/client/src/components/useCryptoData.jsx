import { useState, useEffect } from "react";
import axios from "axios";

export const useCryptoData = () => {
  const [cryptoData, setCryptoData] = useState([]);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/cryptodata`,
        );
        setCryptoData(response.data);
      } catch (error) {
        console.error("Error fetching crypto data:", error);
      }
    };

    fetchCryptoData();
  }, []);

  return cryptoData;
};
