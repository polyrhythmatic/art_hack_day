var cv = require('./midi.controller.js').cv;
var oxygen = require('./midi.controller.js').oxygen;
var oxygenOut = require('./midi.controller.js').oxygenOut;

function MusicController() {
  // this.rootNote = -1;
  this.rootNote = 60; //temporarility for testing
  this.lastRoot = -1;
  this.rootDirection = 0; //-1: decreasing, 0: not set, 1: increasing
  this.modes = [1, -1, 0];//increasing, decreasing, alternating

  this.pattern = [2, -1];
  this.patternPosition = 0;
  this.mVoice = -1;
  this.tVoice = -1;

  this.mOff = 0;
  this.tOff = 0;

  this.currentPattern = 0;
  this.mPatterns = [
    [2, -1],
    [-2, 1]
  ];

  this.tModes = [
    "above",
    "below",
    "alternating"
  ];

  this.tMode = "above";
  this.noteLength = 250;
}

MusicController.scale = function(note) {
  return (note % 36) + 48;
}

MusicController.prototype.handleMidiEvent = function(deltaTime, message) {
  oxygenOut.sendMessage(message);
  if(message[2] != 0 && message[1] != this.lastRoot){
    this.rootDirection = message[1] > this.rootNote ? 1 : -1;
    this.lastRoot = this.rootNote;
    this.rootNote = message[1];
    console.log("new root note: " + this.rootNote);
    var interval = this.rootNote - this.lastRoot;
    this.lastRoot = message[1];
    console.log(interval);

    this.mVoice = -1;
    this.tVoice = -1;
    this.patternPosition = 0;
  }
};

MusicController.prototype.handleTouchEvent = function() {
  cv.sendMessage([147, this.mVoice, 0]);
  cv.sendMessage([146, this.tVoice, 0]);
  //for alternating, need to figure out whether it's above or below here
  var alternatingMode;
  if (this.tMode === "alternating") {
    alternatingMode = this.mVoice > this.tVoice ? "above" : "below";
  }

  if (this.mVoice === -1) {
    this.mVoice = this.rootNote;
  } else {
    this.mVoice = this.mVoice + this.pattern[this.patternPosition % this.pattern.length];
  }
  this.patternPosition += 1;

  this.mVoice = MusicController.scale(this.mVoice) ; //scales it 

  //to calculate tvoice
  var mVoice0 = this.mVoice % 12;
  var octave = Math.floor(this.mVoice / 12);
  var root0 = this.rootNote % 12;

  if (this.tMode === "above" || alternatingMode === "above") {
    if (root0 - 12 > mVoice0) {
      this.tVoice = root0 - 12 + (octave*12);
    } else if (root0 - 9 > mVoice0 ) {
      this.tVoice = root0 - 9 + (octave*12); 
    } else if (root0 - 5 > mVoice0) {
      this.tVoice = root0 - 5 + (octave*12); 
    } else if (root0 > mVoice0) {
      this.tVoice = root0 + (octave*12); 
    } else if (root0 + 3 > mVoice0) {
      this.tVoice = root0 + 3 + (octave*12); 
    } else if (root0 + 7 > mVoice0 ) {
      this.tVoice = root0 + 7 + (octave*12); 
    } else if (root0 + 12 > mVoice0 ) {
      this.tVoice = root0 + 12 + (octave*12); 
    }
  } else {
    if (root0 + 12 < mVoice0) {
      this.tVoice = root0 + 12 + (octave*12); 
    } else if (root0 + 7 < mVoice0) {
      this.tVoice = root0 + 7 + (octave*12); 
    } else if (root0 + 3 < mVoice0) {
      this.tVoice = root0 + 3 + (octave*12); 
    } else if (root0 < mVoice0) {
      this.tVoice = root0 + (octave*12); 
    } else if (root0 - 5 < mVoice0) {
      this.tVoice = root0 - 5 + (octave*12); 
    } else if (root0 - 9 < mVoice0 ) {
      this.tVoice = root0 - 9 + (octave*12); 
    } else if (root0 - 12 < mVoice0 ) {
      this.tVoice = root0 - 12 + (octave*12); 
    }
  }

  // this.tVoice = MusicController.scale(this.tVoice);

  cv.sendMessage([147, this.mVoice, 1]);
  this.mOff = setTimeout(function(note){
    cv.sendMessage([147, note, 0]);
  }.bind(this, this.mVoice), this.noteLength);
  console.log(this.mVoice);

  cv.sendMessage([146, this.tVoice, 1]);
  this.tOff = setTimeout(function(note){
    cv.sendMessage([146, note, 0]);
  }.bind(this, this.tVoice), this.noteLength);
  console.log(this.tVoice);
};

MusicController.prototype.changeMelodyPattern = function() {
  console.log('changing melody pattern');
  this.currentPattern = (this.currentPattern + 1) % this.mPatterns.length;
  this.pattern = this.mPatterns[this.currentPattern];
};

MusicController.prototype.changeTVoicePattern = function() {
  console.log('changing tvoice pattern');
  this.tMode = this.tModes[(this.tModes.indexOf(this.tMode) + 1) % this.tModes.length];
  console.log(this.tMode);
};

MusicController.prototype.setNoteLength = function(value) {
  console.log('setting note length', value);
  this.noteLength = value;
}

MusicController.prototype.getSelectedTPattern = function() {
  return this.tModes.indexOf(this.tMode);
}

MusicController.prototype.getSelectedMPattern = function() {
  return this.currentPattern;
};

MusicController.prototype.getNoteLength = function() {
  return this.noteLength;
}

module.exports = new MusicController();
