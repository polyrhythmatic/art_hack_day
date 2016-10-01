var socket = io();

var topButton = document.getElementById('top');
var bottomButton = document.getElementById('bottom');

// document.body.ontouchstart = document.body.onclick = function(event) {
//   socket.emit("touch");
// }

topButton.ontouchstart = function(event) {
  event.stopPropagation();
  topButton.style.opacity = 0.5;
  setTimeout(function() {
    topButton.style.opacity = 1.0;
  }.bind(this), 200);
  socket.emit("change melody pattern");
}

bottomButton.ontouchstart = function(event) {
  event.stopPropagation();
  bottomButton.style.opacity = 0.5;
  setTimeout(function() {
    bottomButton.style.opacity = 1.0;
  }.bind(this), 200);
  socket.emit("touch");
}