var fs = require("fs");
var url = require("url");
var labelsReader = require("./labelsReader.js");
var creator = require("./imageCreator.js")
var path = require("path");

// var absPath = "/Users/pierpaolo/Desktop/tesi/server/"

/* __parentDir take the dirname of the app is running */
var __parentDir = path.dirname(process.mainModule.filename);
var gifDir = __parentDir + "/gif/";

exports.dispatch = function(req, res) {

	//private methods
	var renderHTML = function (content) {
		res.setHeader('Content-Type', 'text/html');
		res.end(content);
	}

	//console.log(req.url);
	var url = req.url;

	if (url == "/brain" || url == "/") {
		fs.readFile("pages/brain_atlas/index.html", function(err, data) {
			if (err) {
				res.end("Error during loading page.");
			}
			else {
				console.log("Rendering html page...");
				renderHTML(data);
			}
		});
	} else if (url == "/test") {
		fs.readFile("pages/querytesting.html", function(err, data) {
			if (err !== "null") {
				console.log("Rendering html page...");
				renderHTML(data);
			}
		});

	} else if (url == "/niftiList") {
		var files = fs.readdirSync(__parentDir + "/images/");
		console.log(files);
		var content = "";
		for (var i = 0; i < files.length; i++) {
			if (!files[i].match("DS") && !files[i].match("Segmentation"))
				content += files[i] + "!";
		};
		res.json({"list" : content});

	} else if (url.match("gif") && !url.match("min.gif")) {
		var parts = url.split("/");
		var l = parts.length;
		var folder = parts[l-2];
		var path = folder + "/" + url;
		fs.readFile(folder + "/" + parts[l-1], function(err, data) {
			if (err !== "null")
				res.end(data);
		});

	} else if (url.match("min.gif")) {
		console.log(url);
		fs.readFile("images/Miniature/" + url, function(err, data) {
			if (err !== "null")
				res.end(data);
			else 
				console.log(err);
		});

	} else if (url.match("vtk") || url.match("png")) {
		//console.log("You are searching for images.");
		fs.readFile("pages/brain_atlas/" + url, function(err, data) {
			res.end(data);
		});
	} else if (url.match("show")) {
		var color = req.query['color']; 
		var filename = req.query['filename'];
		console.log(color + " " + filename);
		var label = labelsReader.finder(color);
		var savingDir = creator.createGifFolder(label, filename);
		var files = creator.createFromFilename(label, filename, savingDir);
		var content = "<html><head></head><body>";
		//renderHTML(color + " -> " + label);

		// TODO handle the asynchronous execution of jar before execute the things below
		setTimeout(function() {
			fs.readdir(savingDir, function (err, files) {
				if (err !== "null") {
					console.log("Reading list of files...");
					for (var i = 0; i < files.length; i++) {
						if (!files[i].match("DS")) {
							//console.log(files[i]);
							content += "<img src='" + savingDir + files[i] + "' />";

						}
					};
					content += "</body></html>";
					renderHTML(content);
				} else 
					console.log("Error -> " + err);
			});	
		}, 7000);

		setTimeout(function() {
			creator.removeFolder(savingDir);
		}, 18000);		

	} else if (url.match("labeledSearch")) {
		var filename = req.query['filename'];
		var label = req.query['label'];
		console.log(label + " " + filename);
		var savingDir = creator.createGifFolder(label, filename);
		var files = creator.createFromFilename(label, filename, savingDir);
		var content = "<html><head></head><body>";
		//renderHTML(color + " -> " + label);

		// TODO handle the asynchronous execution of jar before execute the things below
		setTimeout(function() {
			fs.readdir(savingDir, function (err, files) {
				if (err !== "null") {
					console.log("Reading list of files...");
					for (var i = 0; i < files.length; i++) {
						if (!files[i].match("DS")) {
							//console.log(files[i]);
							content += "<img src='" + savingDir + files[i] + "' />";

						}
					};
					content += "</body></html>";
					renderHTML(content);
				} else 
					console.log("Error -> " + err);
			});	
		}, 7000);

		setTimeout(function() {
			creator.removeFolder(savingDir);
		}, 18000);		
	} else {
		res.end("Page not found!");
	}
}