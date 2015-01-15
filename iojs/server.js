#!/usr/bin/env nodejs

////////////////////////////////////////////////////////////////////////////////
/// Libraries and database driver
////////////////////////////////////////////////////////////////////////////////

var fs = require("fs");
var Promise = require("promise");
var concat = require("concat-stream");
var Database = require("arangojs");
var db = new Database();                               // configure server
var ep = db.endpoint();
var collectionName = "guesser_questions";              // configure collection
var collPromise = new Promise(function(resolve, reject) {
  db.collection(collectionName, false, function(err, res) {
    if (err) {
      reject(err);
    }
    else {
      resolve(res);
    }
  });
});
collPromise.then(null, function(err) {
  console.log("Cannot contact the database! Terminating...");
  process.exit(1);
});

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
installStatic("/angular.min.js", "bower_components/angularjs/angular.min.js",
              "application/javascript");
installStatic("/guesser_controller.js", "static/guesser_controller.js",
              "application/javascript");

////////////////////////////////////////////////////////////////////////////////
/// AJAX services:
////////////////////////////////////////////////////////////////////////////////

app.get("/get/:key", function (req, res) {
  var key = req.params.key;
  collPromise.then(function(coll) {
                     coll.document(key, function(err, x) {
                       if (err) {
                         res.json(err);
                       }
                       else {
                         res.json(x);
                       }
                     });
                   }, null);  // if this were rejected, we would be out already
});

// This is just a trampoline to the Foxx app:
app.put("/put", function (req, res) {
  req.pipe(concat( function(body) {
    ep.put("/guesser/put", JSON.parse(body.toString()),
      function(err, x) {
        if (err) {
          err.error = true;
          res.send(err);
        }
        else {
          res.send(x);
        }
      });
  } ));
});

////////////////////////////////////////////////////////////////////////////////
/// Now finally make the server:
////////////////////////////////////////////////////////////////////////////////

var server = app.listen(8000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Guesser app server listening at http://%s:%s', host, port)
});
