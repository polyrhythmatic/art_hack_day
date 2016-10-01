// var WebSocketServer = require("websocket").server;
// var http = require("http");

// var server = http.createServer(function(request, response) {
//   console.log(new Date() + " Received request for " + request.url);
//   response.writeHead(404);
//   response.end();
// });

// server.listen(8080, function() {
//   console.log((new Date()) + ' Server is listening on port 8080');
// });

// wsServer = new WebSocketServer({
//   httpServer: server,
//   autoAcceptConnections: false
// });

// function originIsAllowed(origin) {
//   return true;
// }

// wsServer.on("request", function(request) {
//   if(!originIsAllowed(request.origin)) {
//     request.reject();
//     console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
//     return;
//   }

//   var connection = request.accept("echo-protocol", request.origin);
//   console.log((new Date()) + ' Connection accepted.');
//   connection.on("message", function(message) {
//     if(message.type === "utf8") {

      
//     }
//   })
// })

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
};

midi.output.prototype.openPortByName = function(name){
  for(var i = 0; i < this.getPortCount(); i ++){
    if(this.getPortName(i) == name){
      this.openPort(i);
      return;
    }
  }
};

function getNote(){
  
}

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

