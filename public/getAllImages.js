const fs = require('fs');
let data = []
function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
console.log(err)
    }

    filenames.forEach(function(filename) {
		
		data.push(filename) 
    });
	console.log(JSON.stringify({data: data}))
  });
}

readFiles("./images")
