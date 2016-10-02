var socket = io();

var mpatternButton = document.getElementById('mpattern');
var mpatternOptions = document.getElementById('mpattern-options');

socket.on('set mpattern', function(data) {
  mpatternOptions.className = "mpattern-options pattern-" + data.patternIndex;
});

mpattern.ontouchstart = function(event) {
  event.stopPropagation();
  mpatternButton.style.opacity = 0.5;
  setTimeout(function() {
    mpatternButton.style.opacity = 1.0;
  }.bind(this), 200);
  socket.emit("change melody pattern");
}