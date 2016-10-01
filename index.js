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