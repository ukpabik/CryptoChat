import axios from "axios";
import React, { useState, useEffect } from "react";

export const getCryptoNews = () => {
  const [news, setNews] = useState(null);
  useEffect(() => {
    const retrieveNews = async () => {
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_API_URL}/get-news`,
        );
        setNews(result.data);
      } catch (error) {
        console.error("Cannot retrieve news data from backend: ", error);
      }
    };

    retrieveNews();
  }, []);

  return news;
};

export default getCryptoNews;
