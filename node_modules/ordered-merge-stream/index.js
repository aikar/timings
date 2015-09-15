var from = require('from');
var es   = require('event-stream');
var path = require('path');

module.exports = function(streams) {
  var isEmptyStream = false;
  return from(function getChunk(count, next) {
    var _this = this;

    var streamQueue = [];
    var currentStream = 0;

    // Emit everything available so far in the queue
    function emitData() {
      for(var i=0;i<streamQueue.length;i++) {
        var dataQueue = streamQueue[i].dataQueue;

        if(streamQueue[i].pending) {
          return;
        }

        for(var j=0;j<dataQueue.length;j++) {
          var data = dataQueue[j];
          if(!!data) {
            _this.emit('data', data);
            dataQueue[j] = null;

            return emitData();
          }
        }
      }

      if(currentStream === streamQueue.length) {
        _this.emit('end');
      }
    }

    function processStream(index, stream) {
      stream.on('data', function(data) {

        streamQueue[index].dataQueue.push(data);
        emitData();
      });
      stream.on('end', function() {
        currentStream++;
        
        streamQueue[index].pending = false;
        // The stream was empty and didn't send any data
        if(streamQueue[index].length === 0) {
          isEmptyStream = true;
          streamQueue[index].dataQueue.push(null);
        }

        //If we have received the last end event, end the whole stream.
        if(currentStream === streamQueue.length) {
          emitData();
        }
      });

      stream.resume();
    }

    for(var i=0;i<streams.length;i++) {
      streamQueue.push({dataQueue: [], pending: true});
    }

    for(var j=0;j<streams.length;j++) {
      processStream(j, streams[j]);
    }

  });
};
