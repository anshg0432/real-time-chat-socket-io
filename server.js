const express = require('express')
const app = express()
const path = require('path')
const http = require('http')
const formatMessage = require('./utilis/messages')
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utilis/users')

const server = http.createServer(app)
const socketio = require('socket.io')
const io = socketio(server) 

// Set static folder
app.use(express.static(path.join(__dirname,'public')))

const botName='ChatCord Bot'

//Run when client connects
io.on('connection',socket =>{


  socket.on('joinRoom',({username, room})=>{
    
    const user = userJoin(socket.id, username, room)
    socket.join(user.room);
    
    // Welcome current user
    console.log('New WS Connection...')
    socket.emit('message',formatMessage(botName,'welcome to Chatcord!'))

    //Boradcast when a user connects
    socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined the chat`))

    //Send users and room info
    io.to(user.room).emit('roomUsers',{
      room: user.room,
      users: getRoomUsers(user.room)
    })

  })



  //Listen for chatMessage
  socket.on('chatMessage',({username,room,msg})=>{
    const user = getCurrentUser(socket.id)
    io.to(user.room).emit('message',formatMessage(user.username,msg))
    console.log(msg)
  })




  // Runs when client disconnects
  socket.on('disconnect',()=>{
    const user = userLeave(socket.id)
    if(user){
      io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`))}
     //Send users and room info
     io.to(user.room).emit('roomUsers',{
      room: user.room,
      users: getRoomUsers(user.room)
    })

      
  
    
  });

  
});

server.listen(3000)
