#!/usr/bin/env nodejs

////////////////////////////////////////////////////////////////////////////////
/// Libraries and database driver
////////////////////////////////////////////////////////////////////////////////

var server_addr = process.env.ARANGODB_SERVER ? process.env.ARANGODB_SERVER : "http://localhost:8529";

var fs = require("fs");
var concat = require("concat-stream");
var arango = require("arangojs");
var db = new arango.Connection(server_addr); // configure server
db = db.use("/_system");                     // configure database
var collectionName = "guesser_questions";    // configure collection

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
/// AJAX services:
////////////////////////////////////////////////////////////////////////////////

app.get("/get/:key", function (req, res) {
  var key = req.param("key");
  db.document.get(collectionName+"/"+key)
    .done( function(data) {
             res.json(data);
           },
           function(err) {
             res.json(err);
           } );
});

// This is just a trampoline to the Foxx app:
app.put("/put", function (req, res) {
  req.pipe(concat( function(body) {
    db.put("/guesser/put", JSON.parse(body.toString()))
      .done(function(result) {
        res.send(result);
      });
  }));
});

////////////////////////////////////////////////////////////////////////////////
/// Now finally make the server:
////////////////////////////////////////////////////////////////////////////////

var server = app.listen(8000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Guesser app server listening at http://%s:%s', host, port)
});
