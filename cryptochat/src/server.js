import express from 'express'
import cors from 'cors'
import { createServer } from 'node:http'
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from "socket.io"
import sqlite3 from 'sqlite3'
import { open } from 'sqlite';

// OPEN THE DATABASE

const db = await open({
  filename: 'messages.db',
  driver: sqlite3.Database

})

/**
 * CREATE THE TABLE OF MESSAGES USING SQLITE AS A DATABASE
 * GIVES AN ID TO EACH MESSAGE IN ORDER TO RETRIEVE THESE MESSAGES
 * BY ID NUMBER
 */


await db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT
  );
  
  `)






const app = express()
const server = createServer(app)
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


app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', async (socket) => {
  console.log('a user connected')


  /**
   * An async function to allow for messages to be sent and received, as well as recovered
   * when a user disconnects.
   */
  socket.on('message', async (msg) => {
    let result;
    try{
      result = await db.run('INSERT INTO messages (content) VALUES (?)', msg)
    }
    catch(e){
      return;
    }

    io.emit('message', msg, result.lastID)
  })

  if (!socket.recovered){
    //IF CANT RECOVER THE CONNECTION STATE

    try{
      await db.each('SELECT id, content FROM messages WHERE id > ?', 
        [socket.handshake.auth.serverOffset || 0],
        (_err, row) => {
          socket.emit('message', row.content, row.id)
        }
      )
    }
    catch (e){

    }
  }

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
})



server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})