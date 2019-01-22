var express = require('express');
var app = express();
var socket = require('socket.io');

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/page.html');
})

server = app.listen(process.env.port || 3000, console.log('running on port 3000'));
var io = socket(server)
io.on("connection", (socket)=>{
    console.log("user connected")
    socket.on('draw', (data)=>{
        console.log(data)
        io.emit('draw', (data))
    })
})