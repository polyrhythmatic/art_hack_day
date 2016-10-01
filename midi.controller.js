//output.sendMessage([145,64,1]);
//[status code, note, on/off]
//Dual monophic mode for CV pal
//http://computermusicresource.com/MIDI.Commands.html
//http://mutable-instruments.net/modules/cvpal/manual
//146 for osc 1
//147 for osc 2

var midi = require("midi");
var oxygen = new midi.input();
var cv = new midi.output();

var musicController = require('./music.controller.js');

midi.input.prototype.openPortByName = function(name){
  for(var i = 0; i < this.getPortCount(); i ++){
    if(this.getPortName(i) == name){
      this.openPort(i);
      return;
    }
  }
  console.error("No midi port named " + name);
};

midi.output.prototype.openPortByName = function(name){
  for(var i = 0; i < this.getPortCount(); i ++){
    if(this.getPortName(i) == name){
      this.openPort(i);
      return;
    }
  }
  console.error("No midi port named " + name);
};

// var index = 0
// var tVoice = [];
// var mVoice = [];
// function getNote(note){
//   var zNote = note % 12;
//   var octave = note / 12;

// }

oxygen.on('message', musicController.handleMidiEvent);

oxygen.openPortByName("USB Oxygen 8 v2");
cv.openPortByName("CVpal");

module.exports = {
  cv: cv
};