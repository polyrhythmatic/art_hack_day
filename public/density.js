var socket = io();

var slider = document.getElementById('density-slider');

socket.on('set density', function(data) {
  console.log('set density change socket event');
  slider.value = data.density;
});

slider.onchange = function(event) {
  console.log('change density slider');
  socket.emit("change density", event.target.value);
}