var test = require('tape');
var through = require('through');
var orderedMergeStream = require('../');

test("can merge streams and preserve data order", function(t) {

  var streams = [through(),
                 through(),
                 through(),
                 through(),
                 through()];

  for(var i=0;i<streams.length;i++) {
    streams[i].pause();
  }

  var mergedStream = orderedMergeStream(streams);

  var cache = [];

  mergedStream.on('data', function(data){
    cache.push(data);
  });

  mergedStream.on('end', function() {
    t.ok(1, 'end should be called');
    t.equals(cache.join(''), '01234');
    t.end();
  });

  var runOrder = [1,3,2,0,4];
  var runTimeout = [0, 10, 2, 1000, 300];

  function processStream(i) {
    var current = runOrder[i];
    setTimeout(function() {
      streams[current].write(current.toString());
      streams[current].end();
    }, runTimeout[i]);
  };

  for(var i=0;i<streams.length;i++) {
    processStream(i);
  }

});
