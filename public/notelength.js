var socket = io();

var slider = document.getElementById('slider');

slider.onchange = function(event) {
  console.log('change slider');
  socket.emit("change note length", event.target.value);
}