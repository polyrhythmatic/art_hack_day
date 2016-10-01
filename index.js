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

var input = new midi.input();

input.on('message', function(deltaTime, message) {
  // The message is an array of numbers corresponding to the MIDI bytes: 
  //   [status, data1, data2] 
  // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful 
  // information interpreting the messages. 
  console.log('m:' + message + ' d:' + deltaTime);
});

for(var i = 0; i < input.getPortCount(); i ++){
  if(input.getPortName(i) == "USB Oxygen 8 v2"){
    input.openPort(i);
    return;
  }
}