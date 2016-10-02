var socket = io();

var globalTime = 0;

var loaded = false;

socket.emit("get time");

socket.on("current time", function(data){
  globalTime = data.time;
});

// function start(){
//   Tone.Transport.start((Date.now()%100) / 100);
//   mSynth.triggerAttackRelease("8n", time, 1);
// }

var filter = new Tone.Filter(1000, "lowpass").toMaster();
var crusher = new Tone.BitCrusher(4).connect(filter);
var mSynth;

window.addEventListener('touchstart', function(event) {
  if(loaded == false){
    loaded = true;
    mSynth = new Tone.MetalSynth({
      frequency:200,
      envelope:{
        attack:0.015,
        decay:0.2,
        release:0.1,
      },
      harmonicity:2,
      modulationIndex:32,
      resonance:4000,
      octaves:1.5
    }).connect(crusher);
    Tone.Transport.start(Tone.context.currentTime, (globalTime%1000) / 1000);
    mSynth.triggerAttackRelease("8n", Tone.context.currentTime + (globalTime%1000) / 1000, 0);
  }

  for(var i = 0; i < 128; i ++){
    if(Math.random() > 0.8){
      var timing = new Tone.Time("16n").mult(i);
      Tone.Transport.schedule(function(time){

        mSynth.modulationIndex = 20 + Math.random() * 10;
        mSynth.frequency = 100 + Math.floor(Math.random()*20.0)*100;
        mSynth.octaves = Math.random() * 3;
        // mSynth.envelope.decay = Math.random() + .2;
        // mSynth.envelope.attack = Math.random();  
        crusher.wet.value = (Math.random() > 0.5) ? 0 : 1;
      }, Tone.context.currentTime + timing.toSeconds());
      mSynth.triggerAttackRelease("8n", Tone.context.currentTime + timing.toSeconds(), 1);
    }
  }



  // var loop = new Tone.Loop(function(time){
  //   mSynth.triggerAttackRelease("8n", time, 1);
  // }, "8n").start(0);

}, false);


// var date = new Date(2016, 0, 0, 0, 0, 0, 0)

// var refTime = date.getTime();

// var time;
// var transport = document.getElementById("transport");
// function draw(){
//   setTimeout(draw, 17);
//   var diff = Date.now() - refTime;
//   time = new Tone.Time(diff/1000)
//   transport.innerHTML = time.toBarsBeatsSixteenths();
// }

// draw();
