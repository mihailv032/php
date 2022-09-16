var fs = require('fs');
let data = []
function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function(filename) {
		data.push(`"${filename}"`) 
    });

console.log(data)
  });
}

readFiles('./images/', function(filename, content) {
	 
}, function(err) {
  throw err;
});

