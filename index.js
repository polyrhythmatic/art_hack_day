var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Session = require('express-session');
var SessionStore = require('session-file-store')(Session);
var session = Session({store: new SessionStore({path: __dirname+'/tmp/sessions'}), secret: 'pass', resave: true, saveUninitialized: true});
var cookieParser = require('cookie-parser');
var ios = require('socket.io-express-session');
var path = require('path');

var oxygen = require('./midi.controller.js').oxygen;
var oxygenOut = require('./midi.controller.js').oxygenOut;
var cv = require('./midi.controller.js').cv;
var musicController = require('./music.controller.js');

var userConnections = [];
var instrumentUsers = [];
var progressionUsers = [];
var mpatternUsers = [];
var tpatternUsers = [];
var notelengthUsers = [];
var densityUsers = [];

oxygen.openPortByName("USB Oxygen 8 v2");
cv.openPortByName("CVpal");
oxygenOut.openPortByName("USB Oxygen 8 v2");

oxygen.on('message', musicController.handleMidiEvent);

app.use(express.static('public'));
app.use(cookieParser());
app.use(session);
io.use(ios(session));

server.listen(8080);

app.get('/', function (req, res) {
  if (!req.session.uid) {
    req.session.uid = Date.now();
  }
  // will have to change this so that when users refresh, they can get redirected to a different page
  if (!req.session.lastPage) {
    req.session.lastPage = '/';
  }

  //look at the number of users doing each thing and redirect them accordingly

  //if there are fewer instrument users than modular controller users
  console.log('instrument users: ', instrumentUsers.length);
  console.log('progression users: ', progressionUsers.length);
  console.log('mpattern users: ', mpatternUsers.length);
  console.log('tpattern users: ', tpatternUsers.length);
  console.log('notelength users: ', notelengthUsers.length);
  if (instrumentUsers.length <= (progressionUsers.length + mpatternUsers.length + tpatternUsers.length + notelengthUsers.length + densityUsers.length)
    && req.session.lastPage !== '/instrument') {
    res.redirect('/instrument');
  } else {
    if (progressionUsers.length <= notelengthUsers.length && req.session.lastPage !== '/progression') {
      res.redirect('/progression');
    } else if (mpatternUsers.length <= notelengthUsers.length && req.session.lastPage !== '/mpattern') {
      res.redirect('/mpattern');
    } else if (tpatternUsers.length <= notelengthUsers.length && req.session.lastPage !== '/tpattern') {
      res.redirect('/tpattern');
    } else if (densityUsers.length <= notelengthUsers.length && req.session.lastPage !== '/density') {
      res.redirect('/density');
    } else if (req.session.lastPage !== '/notelength') {
      res.redirect('/notelength');
    } else {
      res.redirect('/instrument');
    }
  }
  // if (userConnections.length % 2 === 0) {
  //   res.redirect('/instrument');
  // } else {
  //   res.sendFile(path.resolve(__dirname + '/index.html'));
  // }
});

app.get('/instrument', function(req, res) {
  //this is the sound emitting instrument
  if (req.session.lastPage === '/instrument') {
    res.redirect('/');
    return;
  }
  req.session.lastPage = '/instrument';
  res.sendFile(path.resolve(__dirname + '/instrument.html'));
});

app.get('/progression', function(req, res) {
  //this is the single button that progresses the melody
  if (req.session.lastPage === '/progression') {
    res.redirect('/');
    return;
  }
  req.session.lastPage = '/progression';
  res.sendFile(path.resolve(__dirname + '/progression.html'));
});

app.get('/mpattern', function(req, res) {
  //this is the single button with a few options that changes the pattern of the mvoice
  if (req.session.lastPage === '/mpattern') {
    res.redirect('/');
    return;
  }
  req.session.lastPage = '/mpattern';
  res.sendFile(path.resolve(__dirname + '/mpattern.html'));
});

app.get('/tpattern', function(req, res) {
  // this is the single button with a few options that changes how the tvoice
  // relates to the mvoice
  if (req.session.lastPage === '/tpattern') {
    res.redirect('/');
    return;
  }
  req.session.lastPage = '/tpattern';
  res.sendFile(path.resolve(__dirname + '/tpattern.html'));
});

app.get('/notelength', function(req, res) {
  // this is a slider that changes the note length
  if (req.session.lastPage === '/notelength') {
    res.redirect('/');
    return;
  }
  req.session.lastPage = '/notelength';
  res.sendFile(path.resolve(__dirname + '/notelength.html'));
});

app.get('/density', function(req, res) {
  // this is a slider that changes the note length
  if (req.session.lastPage === '/density') {
    res.redirect('/');
    return;
  }
  req.session.lastPage = '/density';
  res.sendFile(path.resolve(__dirname + '/density.html'));
});

app.get('/phoneplayer', function (req, res) {
  res.sendfile(__dirname + '/phoneplayer.html');
});

io.on('connection', function (socket) {
  console.log('connection', socket.id);
  userConnections.push(socket.id);

  if (socket.handshake.session.lastPage === '/instrument') {
    instrumentUsers.push(socket.id);
  } else if (socket.handshake.session.lastPage === '/progression') {
    progressionUsers.push(socket.id);
  } else if (socket.handshake.session.lastPage === '/mpattern') {
    io.sockets.emit('set mpattern', { patternIndex: musicController.getSelectedMPattern() });
    mpatternUsers.push(socket.id);
  } else if (socket.handshake.session.lastPage === '/tpattern') {
    console.log('emitting set tpattern');
    io.sockets.emit('set tpattern', { patternIndex: musicController.getSelectedTPattern() });
    tpatternUsers.push(socket.id);
  } else if (socket.handshake.session.lastPage === '/notelength') {
    io.sockets.emit('set notelength', { notelength: musicController.getNoteLength() });
    notelengthUsers.push(socket.id);
  } else if (socket.handshake.session.lastPage === '/density') {
    io.sockets.emit('set density', { density: musicController.getDensity() });
    densityUsers.push(socket.id);
  }

  //emit event based on number of users
  socket.on('touch', function (data) {
    console.log('touch event');
    musicController.handleTouchEvent();
  });

  socket.on('change melody pattern', function() {
    musicController.changeMelodyPattern();
    io.sockets.emit('set mpattern', {patternIndex: musicController.getSelectedMPattern()});
  });

  socket.on('change t-voice mode', function() {
    musicController.changeTVoicePattern();
    io.sockets.emit('set tpattern', {patternIndex: musicController.getSelectedTPattern()});
  });

  socket.on('change note length', function(value) {
    musicController.setNoteLength(value);
    io.sockets.emit('set notelength', { notelength: value });
  });

  socket.on('change density', function(value) {
    musicController.setDensity(value);
    io.sockets.emit('set density', {density: musicController.getDensity()});
  });

  socket.on('get time', function(){
    socket.emit('current time', {
      time: getTime()
    });
  });

  socket.on('disconnect', function() {
    console.log('disconnected', socket.id);
    userConnections = userConnections.filter(function(id) {
      return id !== socket.id;
    });

    //look at the last page and remove them from the connections
    if (socket.handshake.session.lastPage === '/instrument') {
      instrumentUsers = instrumentUsers.filter(function(id) {
        return id !== socket.id;
      });
    } else if (socket.handshake.session.lastPage === '/progression') {
      progressionUsers = progressionUsers.filter(function(id) {
        return id !== socket.id;
      });
    } else if (socket.handshake.session.lastPage === '/mpattern') {
      mpatternUsers = mpatternUsers.filter(function(id) {
        return id !== socket.id;
      });
    } else if (socket.handshake.session.lastPage === '/tpattern') {
      tpatternUsers = tpatternUsers.filter(function(id) {
        return id !== socket.id;
      });
    } else if (socket.handshake.session.lastPage === '/notelength') {
      notelengthUsers = notelengthUsers.filter(function(id) {
        return id !== socket.id;
      });
    } else if (socket.handshake.session.lastPage === '/density') {
      densityUsers = densityUsers.filter(function(id) {
        return id !== socket.id;
      });
    }
  });
});

function getTime(){
  var d = new Date();
  return d.getTime();
}
