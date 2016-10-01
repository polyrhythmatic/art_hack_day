var cv = require('midi.controller.js').cv;

function MusicController() {
  // this.rootNote = -1;
  this.rootNote = 64; //temporarility for testing
  this.lastRoot = -1;
  this.rootDirection = 0; //-1: decreasing, 0: not set, 1: increasing
  this.modes = [1, -1, 0];//increasing, decreasing, alternating
  this.pattern = [2, -1];
  this.patternPosition = 0;
  this.currentNote = -1;
}

MusicController.prototype.handleMidiEvent = function(deltaTime, message) {
  if(message[2] != 0 && message[1] != this.lastRoot){
    this.rootDirection = message[1] > rootNote ? 1 : -1;
    this.lastRoot = this.rootNote;
    this.rootNote = message[1];
    var interval = rootNote - lastRoot;
    this.lastRoot = message[1];
    console.log(interval);
  }
};

MusicController.prototype.handleTouchEvent = function() {
  this.currentNote = this.rootNote + this.pattern[this.patternPosition % 2];
  this.patternPosition += 1;
  cv.sendMessage([147, this.currentNote, 1]);
  setTimeout(function(){
    cv.sendMessage([147, this.currentNote, 0]);
  }, 250);
};

module.exports = new MusicController();