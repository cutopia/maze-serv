// app's entry point/main. Sets up the basic stuff for hosting the game.

var playerManager = require('./server/playerManager');
var express = require('express');
var app = express();
var serv = require('http').Server(app);
var PORT = 80;

console.log(__dirname);
app.get('/', function(request, response) {
    response.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

serv.listen(PORT);
console.log("Server started on port: " + PORT);

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket) {
    playerManager.addPlayer(socket);
    playerManager.startUpdateTicker();
});
