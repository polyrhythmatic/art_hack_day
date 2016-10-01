var socket = io();

document.body.ontouchstart = document.body.onclick = function(event) {
  socket.emit("touch");
}