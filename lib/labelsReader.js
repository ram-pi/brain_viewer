var fs = require('fs');
var path = require("path");

/* If you' re launching this js alone you don' t need to use path and parerntDir */
var __parentDir = path.dirname(process.mainModule.filename);
var lines = fs.readFileSync(__parentDir + '/utils/labels.html', 'utf8').split("\n");

/* Uncomment this if you are launching this app alone */
// var lines = fs.readFileSync('./utils/labels.html', 'utf8').split("\n");

// for (var l in lines) {
// 	var line = lines[l];
// 	if (line.match("rgb")) {
// 		console.log(lines[l]);
// 		var n = lines[l-6];
// 		var splitted = n.split("> ");
// 		console.log(splitted[1]);
// 	}
// }

exports.finder = function(color) {
	console.log("You are searching for " + color);
	for (var l in lines) {
		var line = lines[l];
		if (line.indexOf(color) > -1) {
			var n = lines[l-6];	
			var splitted = n.split("> ");
			console.log(splitted[1]);
			return splitted[1];
		}
	}
}

// var label =  this.finder("245,245,245");
// console.log(label);