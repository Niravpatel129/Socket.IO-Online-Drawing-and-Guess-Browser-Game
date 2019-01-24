var express = require('express');
var socket = require('socket.io');
var app = express();
var connections = []
app.get('/', function(req, res){
  res.sendFile(__dirname + '/page.html');
});
var guessWord = 'dog';

app.use(express.static('public'));

var server = app.listen(process.env.PORT || 3000, console.log("Site is up on port 3000"))
var io = socket(server)
var clients = io.sockets.clients();

io.on('connection', function(socket){
  connections.push(socket.id);
  console.log('somebody connected: ' + socket.id);
  socket.on('chat message', function(msg){
    // CHECK IF GUESSED WORD WAS CORRECT
    if(msg == guessWord){
      io.emit('chat message', '**CORRECT**');
    }else{
      io.emit('chat message', msg);
    }
  });
  socket.on('username', function (name){
    io.emit('username', name)
  })
  socket.on('draw', function(input){
    io.emit('draw', input);
  })
  socket.on('disconnect', function(){
    connections.splice(connections.indexOf(socket.id), 1);
  })

  socket.on('whodraws', function(){
    io.emit('whodraws', connections);
  });


});