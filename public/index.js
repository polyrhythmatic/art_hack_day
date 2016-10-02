var socket = io();

var topButton = document.getElementById('top');
var middleButton = document.getElementById('middle');
var bottomButton = document.getElementById('bottom');
var slider = document.getElementById('slider');

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

middleButton.ontouchstart = function(event) {
  event.stopPropagation();
  middleButton.style.opacity = 0.5;
  setTimeout(function() {
    middleButton.style.opacity = 1.0;
  }.bind(this), 200);
  socket.emit("change t-voice mode");
}

bottomButton.ontouchstart = function(event) {
  event.stopPropagation();
  bottomButton.style.opacity = 0.5;
  setTimeout(function() {
    bottomButton.style.opacity = 1.0;
  }.bind(this), 200);
  socket.emit("touch");
}

slider.oninput = function(event) {
  socket.emit("change note length", event.target.value);
}