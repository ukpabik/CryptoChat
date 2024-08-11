import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config'
import axios from 'axios';
import { createServer } from 'node:http'
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from "socket.io"
import sqlite3 from 'sqlite3'
import { open } from 'sqlite';



//CACHING THE DATA TO NOT REQUEST FROM API EVERY REFRESH
let cryptoCache = {
  data: null,
  timestamp: null
}

//DATA WITHIN THE CACHE DISAPPEARS AFTER AN HOUR
const CACHE_EXPIRATION_TIME = 60 * 60 * 1000;

// OPEN THE DATABASE

const messagedb = await open({
  filename: 'messages.db',
  driver: sqlite3.Database

})


//DATABASE FOR SAVING USERS
const usersdb = await open({
  filename: 'users.db',
  driver: sqlite3.Database
});


/**
 * CREATE THE TABLE OF MESSAGES USING SQLITE AS A DATABASE
 * GIVES AN ID TO EACH MESSAGE IN ORDER TO RETRIEVE THESE MESSAGES
 * BY ID NUMBER
 */


await messagedb.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    user TEXT,
    timeSent TEXT
  );
`);

/**
 * HOLDS ALL USERNAMES AND PASSWORDS (HASHED) OF ALL USERS ON SITE
 */
await usersdb.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  );
  `);





const app = express()
const server = createServer(app)

//GET AND POST REQUESTS FOR SOCKET IO SERVER
const io = new Server(server, {
  
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  },

  //FOR RECOVERY OF MESSAGES
  connectionStateRecovery: {}

})
const port = 3000
const __dirname = dirname(fileURLToPath(import.meta.url));



app.use(cors())

//FOR LOGIN and REGISTERING
app.use(express.json())


app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
  
});


// FETCHING CRYPTO DATA USING AXIOS
app.get('/cryptodata', async (req, res) => {
  const currentTime = new Date().getTime();
  
  //RETURN THE DATA WITHIN THE CACHE IF IT HASNT EXPIRED
  if (cryptoCache.data && (currentTime - cryptoCache.timestamp < CACHE_EXPIRATION_TIME)) {
    return res.json(cryptoCache.data);
  }


  try {
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
      headers: {
        'X-CMC_PRO_API_KEY': `${process.env.API_KEY}`
      }
    });

    //SETTING THE DATA WITHIN THE CACHE TO THE DATA RETRIEVED FROM API
    cryptoCache = {
      data: response.data,
      timestamp: currentTime
    }
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching crypto data' });
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
    await usersdb.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    res.status(200).json({ message: 'User registered successfully' });
  } 
  catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ message: 'Username already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

//LOGIN POST REQUEST
app.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(402).json({ message: 'Username and password are required' });
  }

  try {
    const user = await usersdb.get('SELECT * FROM users WHERE username = ?', [username]);
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ token });
    } 
    else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } 
  catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});






// SOCKETS FOR CHAT ROOM
io.on('connection', async (socket) => {
  console.log('a user connected')


  /**
   * An async function to allow for messages to be sent and received, as well as recovered
   * when a user disconnects.
   */
  socket.on('message', async (msg) => {
    const {content, user, timeSent } = msg;
    let result;
    try{
      result = await messagedb.run('INSERT INTO messages (content, user, timeSent) VALUES (?, ?, ?)', [content, user, timeSent]);
    }
    catch(e){
      return;
    }

    io.emit('message', {content, user, timeSent}, result.lastID)
  })

  if (!socket.recovered){
    //IF CANT RECOVER THE CONNECTION STATE

    try{
      await messagedb.each('SELECT id, content, user, timeSent FROM messages WHERE id > ?', 
        [socket.handshake.auth.serverOffset || 0],
        (_err, row) => {
          socket.emit('message', { content: row.content, user: row.user, timeSent: row.timeSent}, row.id);
        }
      )
    }
    catch (e){
      console.error(e);
    }
  }

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
})




server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})