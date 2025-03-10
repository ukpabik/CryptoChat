import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config'
import axios from 'axios';
import { createServer } from 'node:http'
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import pkg from 'pg';
import Ably from 'ably';
import nodemailer from 'nodemailer'
import xml2js from 'xml2js'


//CONNECTING TO POSTGRESQL
const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.SUPABASE_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Error connecting to PostgreSQL:', err));


//CREATE TABLES
(async () => {
  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL
      )
    `);


    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        username VARCHAR(100) NOT NULL,
        timesent TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Tables created successfully.");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
})();




const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "You are a comprehensive cryptocurrency expert with unparalleled knowledge in the field." +
    "You offer not only real-time and historical data but also provide in-depth analysis, technical insights," +
    "and strategic advice on all aspects of cryptocurrencies. You can access and interpret the latest market data," +
    " news, trends, and on-chain analytics. You are adept at explaining complex crypto concepts in simple, easy-to-understand" +
    " terms for beginners, while also providing advanced, detailed explanations for experienced traders and investors. You can" +
    " analyze market sentiment, assess potential risks and opportunities, and offer predictions based on current trends and historical patterns. " +
    "You are also able to provide information on emerging technologies in the crypto space, regulatory changes, and the broader impact of cryptocurrencies" +
    " on global markets. You present your responses in a clear, concise, and professional manner, tailored to the specific needs of the user, whether they are" +
    " seeking general information, in-depth analysis, or actionable trading strategies. You remain up-to-date with the rapidly evolving crypto landscape, ensuring" +
    " that all advice and data are current and accurate. Furthermore, you respect the user’s privacy and operate with the highest standards of integrity and trustworthiness. " +
    "Make your message layout readable, as in not using markdown text. I only want text, as what I am using can't deal with markdown code. WHATEVER YOU DO, DO NOT USE MARKDOWN CODE EVER. ONLY EMOJIS ARE ACCEPTABLE. DO NOT USE MARKDOWN CODE, I FORBID YOU."


});



//CACHING THE DATA TO NOT REQUEST FROM API EVERY REFRESH
let cryptoCache = {
  data: null,
  timestamp: null
}

//DATA WITHIN THE CACHE DISAPPEARS AFTER 5 MINUTES
const CACHE_EXPIRATION_TIME = 5 * 60 * 1000;

//CACHE FOR NEWS DATA
let newsCache = {
  data: null,
  timestamp: null
};

//DATA EXPIRES EVERY 5 MINUTES
const NEWS_CACHE_EXPIRATION_TIME = 5 * 60 * 1000;






const app = express()
const server = createServer(app)

const ably = new Ably.Realtime(process.env.ABLY_API_KEY);

const port = process.env.PORT || 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));


//CORS CONFIG
app.use(cors({
  origin: `${process.env.FRONTEND_URL}`,
  methods: ["GET", "POST"],
}));




//FOR LOGIN and REGISTERING
app.use(express.json())


//SERVING STATIC FILES FROM REACT
app.use(express.static(join(__dirname, 'client', 'dist')));


app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));

});


//FETCHING MESSAGES FROM POSTGRESQL

app.get('/messages', async (req, res) => {
  try {
    const result = await pool.query('SELECT content, username, timesent FROM messages ORDER BY id ASC')
    res.status(200).json(result);
  }
  catch (e) {
    console.error('Error retrieving messages: ', e);
    res.status(500).json({ message: 'Internal server error.' })
  }

})



//FOR CRYPTO NEWS
app.get('/get-news', async (req, res) => {
  const currentTime = new Date().getTime();

  // Check if cached data is still valid
  if (newsCache.data && (currentTime - newsCache.timestamp < NEWS_CACHE_EXPIRATION_TIME)) {
    return res.status(200).json(newsCache.data);
  }

  try {
    const result = await axios.get('https://cryptopanic.com/news/rss/');
    // Convert RSS feed to JSON
    const parsedData = await xml2js.parseStringPromise(result.data, { mergeAttrs: true });

    const newsItems = parsedData.rss.channel[0].item.map(item => ({
      title: item.title[0],
      link: item.link[0]
    }));

    // Update cache
    newsCache = {
      data: newsItems,
      timestamp: currentTime
    };

    res.status(200).json(newsItems);
  } catch (e) {
    console.error('Could not get news: ', e);
    res.status(500).json({ message: 'Cannot retrieve news from API' });
  }
})













// FETCHING CRYPTO DATA USING AXIOS
app.get('/cryptodata', async (req, res) => {
  const currentTime = new Date().getTime();

  //CHECK IF THE CACHE IS NOT NULL
  if (cryptoCache.data && (currentTime - cryptoCache.timestamp < CACHE_EXPIRATION_TIME)) {
    return res.json(cryptoCache.data);
  }

  try {
    //FETCH THE LATEST TOP 100 CRYPTOS
    const latestResponse = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
      headers: {
        'X-CMC_PRO_API_KEY': `${process.env.COINMARKET_API_KEY}`
      }
    });

    //EXTRACT THE IDS FROM THE LATEST TOP 100 CRYPTOS
    const cryptoIds = latestResponse.data.data.map(crypto => crypto.id).join(',');

    //FETCH THE ICONS
    const infoResponse = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?id=${cryptoIds}`, {
      headers: {
        'X-CMC_PRO_API_KEY': `${process.env.COINMARKET_API_KEY}`
      }
    });

    //GATHER ALL OF THE DATA INTO ONE VARIABLE
    const combinedData = latestResponse.data.data.map(crypto => {
      return {
        id: crypto.id,
        name: crypto.symbol,
        fullName: crypto.name,
        price: crypto.quote.USD.price,
        logo: infoResponse.data.data[crypto.id].logo,
        percent_change_24h: crypto.quote.USD.percent_change_24h,
        description: infoResponse.data.data[crypto.id].description,
        date_launched: infoResponse.data.data[crypto.id].date_launched,
        websites: infoResponse.data.data[crypto.id].urls.website,
        twitter: infoResponse.data.data[crypto.id].urls.twitter,
        reddit: infoResponse.data.data[crypto.id].urls.reddit

      };
    });

    //UPDATE THE CACHE
    cryptoCache = {
      data: combinedData,
      timestamp: currentTime
    };

    //RESPOND WITH THE NEW DATA
    res.json(combinedData);
  } catch (error) {
    console.error('Error fetching crypto data:', error.message);
  }
});



//REQUESTS FOR GEMINI API
app.post('/ai', async (req, res) => {
  try {
    const { body } = req.body;

    const prompt = body;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    res.status(200).json({ data: text });

  }
  catch (error) {
    res.status(400).json({ message: 'Invalid response.' });
  }
})


//POST REQUEST FOR SENDING EMAILS
app.post('/send-email', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_RECEIVER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_RECEIVER,
      to: process.env.EMAIL_RECEIVER,
      subject: `Message from ${name}`,
      text: `You have a new message from ${name} (${email}):\n\n${message}`,
    };


    //SENDING THE EMAIL
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send(error.toString());
      }
      res.status(200).send('Email sent sucessfully');
    });

  } catch (error) {
    res.status(400).json({ message: 'Could not send email.' });
  }
});







//REGISTER POST REQUEST
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {

    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {

    //HASH THE PASSWORD
    const hashedPassword = bcrypt.hashSync(password, 10);
    await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
    res.status(200).json({ message: 'User registered successfully' });
  }
  catch (error) {

    //VIOLATION OF UNIQUE CONSTRAINT
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Username already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});


//SIGNIN REQUEST
app.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const query = 'SELECT * FROM users WHERE username = $1';
    const values = [username];
    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      const user = result.rows[0];

      if (bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
      }
      else {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
    }
    else {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


// FOR ALL NON API ROUTES
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'client', 'dist', 'index.html'));
});

const channel = ably.channels.get('chat-channel');

/**
 * An async function to allow for messages to be sent and received, as well as recovered
 * when a user disconnects.
 */
app.post('/send-message', async (req, res) => {
  const { content, user, timeSent } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO messages (content, username, timesent) 
        VALUES ($1, $2, $3) 
        RETURNING id`,
      [content, user, timeSent]
    );

    await channel.publish('message', { content, user, timeSent });
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false });
  }
});

app.post('/messages', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, content, username, timesent FROM messages ORDER BY id ASC');
    res.status(200).json(rows);
  } catch (e) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});


server.listen(port, () => {
  console.log(`Server running on port ${port}`);
})
