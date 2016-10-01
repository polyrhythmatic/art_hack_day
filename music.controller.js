var cv = require('./midi.controller.js').cv;
var oxygen = require('./midi.controller.js').oxygen;

function MusicController() {
  // this.rootNote = -1;
  this.rootNote = 64; //temporarility for testing
  this.lastRoot = -1;
  this.rootDirection = 0; //-1: decreasing, 0: not set, 1: increasing
  this.modes = [1, -1, 0];//increasing, decreasing, alternating
  this.pattern = [2, -1];
  this.patternPosition = 0;
  this.mVoice = -1;
  this.tVoice = -1;
  this.tVoicePattern = [3, 4, 5];
  this.tVoicePatternPosition = 0;
}

MusicController.prototype.handleMidiEvent = function(deltaTime, message) {
  if(message[2] != 0 && message[1] != this.lastRoot){
    this.rootDirection = message[1] > rootNote ? 1 : -1;
    this.lastRoot = this.rootNote;
    this.rootNote = message[1];
    var interval = rootNote - lastRoot;
    this.lastRoot = message[1];
    console.log(interval);

    this.mVoice = -1;
    this.tVoice = -1;
    this.patternPosition = 0;
    this.tVoicePatternPosition = 0;
  }
};

MusicController.prototype.handleTouchEvent = function() {
  if (this.mVoice === -1) {
    this.mVoice = this.rootNote;
  } else {
    this.mVoice = this.mVoice + this.pattern[this.patternPosition % 2];
  }
  this.patternPosition += 1;
  cv.sendMessage([147, this.mVoice, 1]);
  setTimeout(function(){
    cv.sendMessage([147, this.mVoice, 0]);
  }.bind(this), 250);
  console.log(this.mVoice);

  //tVoice
  if (this.tVoice === -1) {
    this.tVoice = this.rootNote + this.tVoicePattern[this.tVoicePatternPosition % 3];
    this.tVoicePatternPosition += 1;
  }
  if (this.mVoice % 12 === this.tVoice % 12) {
    this.tVoice = this.tVoice + this.tVoicePattern[this.tVoicePatternPosition % 3];
    this.tVoicePatternPosition += 1;
  }
  cv.sendMessage([146, this.tVoice, 1]);
  setTimeout(function(){
    cv.sendMessage([146, this.tVoice, 0]);
  }.bind(this), 250);
  console.log(this.tVoice);
};

module.exports = new MusicController();