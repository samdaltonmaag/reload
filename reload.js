(function () {
  'use strict';

  var fs = require('fs'),
      http = require('http'),
      express = require('express'),

      app = express(),
      server = http.createServer(app),
      io = require('socket.io')(server),

      filename = __dirname + '/static/VandA.otf',
      prevChange = -Infinity;

  function now () {
    return process.hrtime()[0];
  }

  fs.watch(filename, function (event, filename) {
    var currChange = now();

    /**
     * ensure 3 seconds between each change
     */
    if (currChange - prevChange > 3) {
      io.emit('file::change', currChange);
      prevChange = currChange;
    }
  });

  app.use(express.static(__dirname + '/static'));

  app.get('/', function (req, res) {
    res.sendfile(__dirname + '/static/index.html');
  });

  server.listen(8080, function () {
    var address = server.address();
    console.log('running on http://127.0.0.1:%j', address.port);
  });
})();