var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var oxygen = require('./midi.controller.js').oxygen;
var cv = require('./midi.controller.js').oxygen;
var musicController = require('./music.controller.js');

oxygen.openPortByName("USB Oxygen 8 v2");
cv.openPortByName("CVpal");

oxygen.on('message', musicController.handleMidiEvent);

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

