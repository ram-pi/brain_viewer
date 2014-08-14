var fs = require('fs');
var path = require("path");

var dir_labels_lh = "/Users/pierpaolo/git/brain_viewer/pages/brainbrowser/models/surfaces/labels/lh";
var dir_labels_rh = "/Users/pierpaolo/git/brain_viewer/pages/brainbrowser/models/surfaces/labels/rh";
var annot_ctab = "/Users/pierpaolo/git/brain_viewer/pages/brainbrowser/models/surfaces/labels/aparc.annot.ctab";

exports.findSurfaceLabel = function(index) {
	console.log("You are searching for " + index);
	var files = fs.readdirSync(dir_labels_lh);
	for (var f in files) 
	{
		//console.log(files[f]);
		var res = findInFile(index, files[f]);
		if (res)
		{
			var label = files[f];
			console.log("You have found the index in the label file " + files[f]);
			//var color = findColorInAnnotation(label);
			return label;
		}
	}
	return null;
}

findInFile = function(index, filename) {
	var path = dir_labels_lh + "/" + filename;
	//console.log("Opening " + path);
	
	var data = fs.readFileSync(path, "utf8");
	var lines = data.split("\n");
	for (var l in lines) {
		//console.log(lines[l]);
		if (lines[l].match(index)) {
			console.log("Found in " + filename);
			return true;
		}
	}

	return false;
}

exports.findColorInAnnotation = function(label) {
	var data = fs.readFileSync(annot_ctab, "utf8");

	var splitted = label.split(".");
	var region = splitted[1];
	console.log(region);
	var lines = data.split("\n");
	for (var l in lines) {
		if (lines[l].match(region)) {
			//console.log(lines[l]);
			var splitted = lines[l].split("_");
			var color = splitted[1];
			console.log(color);
			return color;
		}
	}
}


/* Examples 
var label = this.findSurfaceLabel(47071);
var color = this.findColorInAnnotation(label);
*/

