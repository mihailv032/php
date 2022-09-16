var fs = require('fs');

function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function(filename) {
        onFileContent(filename);
    });
  });
}

var data = {};
readFiles('./images/', function(filename, content) {
  data[filename] = `"${content}"`;
}, function(err) {
  throw err;
});

console.log(data)
