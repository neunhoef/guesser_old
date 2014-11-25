#!/usr/bin/env nodejs

////////////////////////////////////////////////////////////////////////////////
/// Libraries and database driver
////////////////////////////////////////////////////////////////////////////////

var fs = require("fs");
var concat = require("concat-stream");

////////////////////////////////////////////////////////////////////////////////
/// An express app:
////////////////////////////////////////////////////////////////////////////////

var express = require('express');
var app = express();

////////////////////////////////////////////////////////////////////////////////
/// Static content:
////////////////////////////////////////////////////////////////////////////////

function installStatic (route, filename, contenttype) {
  app.get(route, function (req, res) {
    res.type(contenttype);
    res.sendFile(filename, {root: "."});
  });
}

installStatic("/", "static/index.html", "text/html");
installStatic("/index.html", "static/index.html", "text/html");
installStatic("/base.css", "static/base.css", "text/css");
installStatic("/angular.min.js", "static/angular.min.js", 
              "application/javascript");
installStatic("/guesser_controller.js", "static/guesser_controller.js", 
              "application/javascript");

////////////////////////////////////////////////////////////////////////////////
/// Now finally make the server:
////////////////////////////////////////////////////////////////////////////////

var server = app.listen(8000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Guesser app server listening at http://%s:%s', host, port)
});
