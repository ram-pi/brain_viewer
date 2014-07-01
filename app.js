var express = require('express');
var fs = require("fs");
var http = require("http");
var sys = require("sys");
var url = require("url");
var dispatcher = require("./lib/dispatcher.js"); 

var app = express();
var defaults = {"ipadress": process.env.OPENSHIFT_NODEJS_IP,
		"port": process.env.OPENSHIFT_NODEJS_PORT
};

function start() {
	if (typeof defaults.ipadress === "undefined") {
		defaults.ipadress = "127.0.0.1";
		defaults.port = 3000;
	}
	app.listen(defaults.port, defaults.ipadress, function() {
		console.log("Node server is running on " + defaults.ipadress + ":" + defaults.port + "...");
	});

	app.get("/*", function (req, res) {
		dispatcher.dispatch(req, res);
	});
}
start();
