const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const port = process.env.PORT || 3000
const {Chats} = require('./models/chatmodel')
require('dotenv').config({path:'./config.env'})
const connectDb = require('./utilsServer/connectDB')
connectDb();

io.on("connection", (socket) => {
  console.log('connected')
  socket.on('join-room', (room)=>{
    console.log('joined room')
    socket.join(room)
  })
  socket.on('send-message', async(messageForm, room)=>{
    if(room){
      io.in(room).emit('receive-message', messageForm)
    }
    console.log(messageForm)
    const response = await Chats.findOneAndUpdate({chatID:room},{ $push: { "messages": messageForm } })
    console.log(response)
  })
})

nextApp.prepare().then(() => {
  
  app.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})