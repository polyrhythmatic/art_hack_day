var socket = io();

var slider = document.getElementById('slider');

socket.on('set notelength', function(data) {
  console.log('set notelength change socket event');
  slider.value = data.notelength;
});

slider.onchange = function(event) {
  console.log('change slider');
  socket.emit("change note length", event.target.value);
}