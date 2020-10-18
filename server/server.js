const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

var {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation')
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
var badWords = ["anus", "arse", "assfucker", "asshole", "assshole", "bastard", "bitch", "boong", "cock", "cockfucker", "cocksuck", "cocksucker", "coon", "coonnass", "cunt", "cyberfuck", "damn", "dick", "erect", "erection", "erotic", "escort", "fag", "faggot", "fuck", "Fuck off", "fuck you", "fuckass", "fuckhole", "gook", "homoerotic", "hore", "lesbian", "lesbians", "mother fucker", "motherfuck", "motherfucker", "negro", "nigger", "orgasim", "orgasm", "penis", "penisfucker", "piss", "porn", "porno", "pornography", "pussy", "sadist", "sex", "sexy", "shit", "slut", "suck", "tits", "viagra", "whore", "xxx", "nigger"]
app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  // socket.emit('newMessage', {
  //     from: 'abc',
  //     text: 'def',
  //     createdAt: 123
  // });

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Room Name and Display Name are required. Please check to see if you entered the Room Name and your Display Name correctly.');
    }
    if (users.getUserList(params.room).includes(params.name) === true) {
      return callback('Someone in this room already has this name. Please change it.');
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    //socket.leave('The Office Fans');

    // io.emiting - sending to everyone
    // socket.broadcast.emit - sending to everyone except for current user
    // socket.emit - emits specificly to the socket user

    // io.emit -> io.to('The office fans').emit
    // socket.broadcast.emit -> socket.broadcast.to('The office fans').emit
    // socket.emit

    //greeting
    socket.emit('newMessage', generateMessage('SERVER', 'Welcome to the Goolag chatting service! Please remember to hide your'));

    //new user joined
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('SERVER', `${params.name} has joined or opened their Chromebook. You better hide your`));

    callback();
  });


  //server side event acknowledgement sent to client (browser)
  socket.on('createMessage', (message, callback) => {
    //console.log('Created message', message);
    //io.emit emits event to every connection

    var user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      if (badWords.includes(message.text) === true) {
        io.to(user.room).emit('newMessage', generateMessage(user.name, "[CENSORED]"));
      } else
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text))
    }
    }

    callback();
    //broadcasting - emiting an event to everyone exept specific user
    //sockets tells to which user event will not be emitted
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);

    if(user) {
        io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on('disconnect', () => {
    //console.log('User disconnected');
    var user = users.removeUser(socket.id);

    if (user){
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('SERVER', `${user.name} has left or closed their Chromebook. You can now show off your`));
    }
  });
});

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
