// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var fs = require('fs');

// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat
if (!String.prototype.padEnd) {
    String.prototype.padEnd = function padEnd(targetLength,padString) {
        targetLength = targetLength>>0; //floor if number or convert non-number to 0;
        padString = String(padString || ' ');
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength-this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
            }
            return String(this) + padString.slice(0,targetLength);
        }
    };
}

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/dynamic-data.txt", function (request, response) {
  response.set({"Content-Type":"text/plain; charset=UTF-8"});
  response.send(dynamicData());
});

var dynamicData = function() {
  var fruits = fs.readFileSync('fruits.txt', 'utf8');
  fruits = fruits.split('\n');
  fruits = shuffle(fruits);
  var n = Math.floor(Math.random() * (25)) + 8; // arbitrary sizes, nothing special.
  fruits = fruits.slice(0, n);
  fruits = fruits.concat(fruits.slice(0, 3)); //take 3 duplicates.  Yes, another arbitrary number.
  fruits = shuffle(fruits);
  //build inventory rows
  var minNameLength = fruits.reduce(function(maxLength, fruit) {
    return fruit.length > maxLength ? fruit.length : maxLength;
  }, 0) + 2;
  var columns = createColumns(minNameLength);
  var inventory = fruits.map(createRow(columns));
  return columns.header + inventory.join('\n');
}

// From https://bost.ocks.org/mike/shuffle/
var shuffle = function(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

var createColumns = function (minNameLength) {
  // each length has two added onto the end to ensure each column is
  // separated by at least a double column of spaces.
  var nameLength = minNameLength + Math.floor(Math.random() * 11) + 2;
  var amountLength = 6 + 1 + 2 + Math.floor(Math.random() * 11) + 2; // ###### + " " + "kg"
  var priceLength = 1 + 6 + Math.floor(Math.random() * 11) + 2; // "$" + ######
  var header = "Product name".padEnd(nameLength) + "Amount".padEnd(amountLength) + "Price".padEnd(priceLength);
  header = header + "\n" + "=".repeat(nameLength+amountLength+priceLength) + "\n";

  return {
    header: header,
    nameLength: nameLength,
    amountLength: amountLength,
    priceLength: priceLength
  };
}

var createRow = function (columns) {
  var nameLength = columns.nameLength;
  var amountLength = columns.amountLength;
  var priceLength = columns.priceLength;
  return function(fruit) {
    var amount = Math.floor(Math.random() * 100000) / 100;
    var amountUnit = Math.floor(Math.random() * 2) >= 1 ? "kg" : "g";
    var amountUnit = (Math.floor(Math.random() * 2) >= 1 ? " " : "") + amountUnit;
    var price = Math.floor(Math.random() * 100000) / 100;

    return fruit.padEnd(nameLength) + (amount + amountUnit).padEnd(amountLength) + ("$" + price).padEnd(priceLength);
  }
}

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
