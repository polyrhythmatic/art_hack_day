var socket = io('http://localhost');

body.ontouchstart = body.onclick = function(event) {
  socket.emit("touch");
}