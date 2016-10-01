var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

require('./midi.controller.js');
var musicController = require('./music.controller.js');

app.use(express.static('public'));
server.listen(8080);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  console.log('connection');
  socket.on('touch', function (data) {
    console.log('touch event');
    musicController.handleTouchEvent();
  });
});

