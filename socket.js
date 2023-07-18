const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const socketServer = new Server(server);
const user = require('./UserData/user');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
app.get('/style.css', (req, res) => {
  res.sendFile(__dirname + '/public/style.css');
});
app.get('/script.js', (req, res) => {
  res.sendFile(__dirname + '/public/script.js');
});

socketServer.on('connection', (socket) => {
  console.log('user connected');
  

  socket.on('new-user',(data)=>{
    if(user.getUser(data)!==undefined){
      socket.emit('user-exist',data);
    }
    user.setUser(data,socket);
    socketServer.emit('connected-user',Object.keys(user.getAll()));


    socket.on('disconnect', () => {
      console.log('user disconnected');
      user.deleteUser(data);
      socketServer.emit('connected-user',Object.keys(user.getAll()));
    });
  })
  socket.on('chat message',(obj)=>{
    
    socketServer.emit('everyone chat',obj); });
  socket.on('private message',(obj)=>{
    socket.to(user.getUser(obj.userName)).emit('private message',obj);
    socket.emit('private message',obj);
  });
  
 
});

server.listen(3000, () => {
  console.log('Server listening on port no :3000');
});
