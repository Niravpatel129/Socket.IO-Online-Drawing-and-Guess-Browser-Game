var express = require('express');
var socket = require('socket.io');
var app = express();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/page.html');
});

app.use(express.static('public'));

var server = app.listen(process.env.PORT || 3000, console.log("Site is up on port 3000"))
var io = socket(server)

io.on('connection', function(socket){
  console.log('somebody connected: ' + socket.id);
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('username', function (name){
    io.emit('username', name)
  })
  socket.on('draw', function(input){
    io.emit('draw', input);
    // socket.to('draw').emit('draw', input);
    console.log(input)
  })
});