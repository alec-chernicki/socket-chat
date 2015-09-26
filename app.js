var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var usernameList = [];

var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.on('username', function (data, callback) {
    var lowercaseUsernames = [];
    for (var i = 0; i < usernameList.length; i++) {
      lowercaseUsernames.push(usernameList[i].toLowerCase());
    }

    if (lowercaseUsernames.indexOf(data.toLowerCase()) != -1 || !data) {
      callback(false);
    }
    else {
      callback(true);
      usernameList.push(data);
      socket.username = data;
      io.emit('usernames', usernameList);
    }
  });

  socket.on('user message', function(data) {
    if(data.length > 300) {
      socket.emit('user message' , {
        username: 'Socket Chat',
        message: 'Uh oh, message too long, try again.'
      });
    }
    else {
      io.emit('user message', {
        username: socket.username,
        message: data
      });
    }
  });

  socket.on('disconnect', function () {
    if (!socket.username) return;
    else if (usernameList.indexOf(socket.username) > -1) {
      usernameList.splice(usernameList.indexOf(socket.username), 1);
    }
    console.log('Current users: ' + usernameList);
    io.emit('usernames', usernameList);
  });
});

server.listen(port);
