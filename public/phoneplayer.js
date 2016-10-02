

// function start(){
//   Tone.Transport.start((Date.now()%100) / 100);
//   mSynth.triggerAttackRelease("8n", time, 1);
// }

window.addEventListener('touchstart', function() {
  var mSynth = new Tone.MetalSynth().toMaster();

  var loop = new Tone.Loop(function(time){
    mSynth.triggerAttackRelease("8n", time, 1);
  }, "8n").start(0);

  Tone.Transport.start((Date.now()%500) / 100);
  mSynth.triggerAttackRelease("8n", time, 1);

}, false);


var date = new Date(2016, 0, 0, 0, 0, 0, 0)

var refTime = date.getTime();

var time;
var transport = document.getElementById("transport");
function draw(){
  setTimeout(draw, 17);
  var diff = Date.now() - refTime;
  time = new Tone.Time(diff/1000)
  transport.innerHTML = time.toBarsBeatsSixteenths();
}

draw();
