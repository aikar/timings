# ordered-merge-stream

Merge multiple node streams into one and control the order of the emitted data.

### Why?

This function is used in the [lingon](http://github.com/jpettersson/lingon) project. There we have a bunch of [vfs.src()](https://github.com/wearefractal/vinyl-fs) streams that we need to concatenate in a specific order.

### API

#### Function: orderedMergeStream(streams)

**Arguments:**

streams: An Array of node stream objects. The input stream objects need to be in the "flowing" mode, so you might have to call `stream.pause()` before sending them in.

**Returns:**

A stream object that will emitt data from all streams. The data will be emitted in the order the streams appeared in the array that was passed in. Each stream has to send the `end` event in order for the next stream to start emitting data.

### Example Usage

```JavaScript
  var through = require('through');
  var orderedMergeStream = require('ordered-merge-stream');
  
  // Create a few stream objects
  var lets = through();
  var go = through();
  var to = through();
  var space = through();
  
  // Order them in an Array
  var streams = [lets,
                 go,
                 to,
                 space];
                 
  // Set the streams in "flowing mode".
  lets.pause();
  go.pause();
  to.pause();
  space.pause();
  
  // Create a single stream out of the Array
  var mergedStream = orderedMergeStream(streams);

  var cache = [];

  mergedStream.on('data', function(data){
    cache.push(data);
  });
   
  // Write data to the streams in any order
  space.write('space!');
  go.write('go');
  to.write('to');
  space.write('Lets');
  
  // The resulting data will be received based on the Array order.
  mergedStream.on('end', function() {
    console.log(cache) // Will output: ["lets", "go", "to", "space!"]
  }


```

### Tests

Run the tests for this project with: `tape test/test.js`
