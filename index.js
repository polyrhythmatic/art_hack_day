var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('public'));
server.listen(8080);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  console.log('connection');
  socket.on('touch', function (data) {
    console.log('touch event');
    cv.sendMessage([147, 64, 1]);
    setTimeout(function(){
      cv.sendMessage([147, 64, 0]);
    }, 250);
  });
});

//output.sendMessage([145,64,1]);
//[status code, note, on/off]
//Dual monophic mode for CV pal
//http://computermusicresource.com/MIDI.Commands.html
//http://mutable-instruments.net/modules/cvpal/manual
//146 for osc 1
//147 for osc 2

var midi = require("midi");

var oxygen = new midi.input();
var cv = new midi.output();
var rootNote = -1;
var lastRoot = -1;
var rootDirection = 0; //-1: decreasing, 0: not set, 1: increasing
var modes = [1, -1, 0];//increasing, decreasing, alternating

midi.input.prototype.openPortByName = function(name){
  for(var i = 0; i < this.getPortCount(); i ++){
    if(this.getPortName(i) == name){
      this.openPort(i);
      return;
    }
  }
  console.error("No midi port named " + name);
};

midi.output.prototype.openPortByName = function(name){
  for(var i = 0; i < this.getPortCount(); i ++){
    if(this.getPortName(i) == name){
      this.openPort(i);
      return;
    }
  }
  console.error("No midi port named " + name);
};

// var index = 0
// var tVoice = [];
// var mVoice = [];
// function getNote(note){
//   var zNote = note % 12;
//   var octave = note / 12;

// }

oxygen.on('message', function(deltaTime, message) {
  if(message[2] != 0 && message[1] != lastRoot){
    rootDirection = message[1] > rootNote ? 1 : -1;
    lastRoot = rootNote;
    rootNote = message[1];
    var interval = rootNote - lastRoot;
    lastRoot = message[1];
    console.log(interval);
  }
});

oxygen.openPortByName("USB Oxygen 8 v2");
cv.openPortByName("CVpal");

