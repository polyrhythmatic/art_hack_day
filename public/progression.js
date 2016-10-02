var socket = io();

var progressionButton = document.getElementById('progression');

progressionButton.ontouchstart = function(event) {
  event.stopPropagation();
  progressionButton.style.opacity = 0.5;
  setTimeout(function() {
    progressionButton.style.opacity = 1.0;
  }.bind(this), 200);
  socket.emit("touch");
}