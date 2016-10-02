var socket = io();

var tpatternButton = document.getElementById('tpattern');
var tpatternOptions = document.getElementById('tpattern-options');

socket.on('set tpattern', function(data) {
  tpatternOptions.className = "tpattern-options pattern-" + data.patternIndex;
});

tpattern.ontouchstart = function(event) {
  event.stopPropagation();
  tpatternButton.style.opacity = 0.5;
  setTimeout(function() {
    tpatternButton.style.opacity = 1.0;
  }.bind(this), 200);
  socket.emit("change t-voice mode");
}