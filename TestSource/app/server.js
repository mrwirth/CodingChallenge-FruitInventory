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
  dynamicData(response);
});

const dynamicData = function(response) {
  fs.readFile('fruits.txt', 'utf8', function(err, fruits) {
    if (err) throw err;
    // Get fruit selection
    fruits = fruits.split('\n');
    fruits = shuffle(fruits);
    const n = Math.floor(Math.random() * (25)) + 8; // Arbitrary sizes, nothing special.
    fruits = fruits.slice(0, n);
    fruits = fruits.concat(fruits.slice(0, 3)); // Take 3 duplicates.  Yes, another arbitrary number.
    fruits = shuffle(fruits);
    // Build inventory table
    const minNameLength = fruits.reduce(function(maxLength, fruit) {
      return fruit.length > maxLength ? fruit.length : maxLength;
    }, 0) + 2;
    const columns = createColumns(minNameLength);
    const inventory = fruits.map(createRow(columns.columns));

    response.send(columns.header + '\n' + inventory.join('\n'));
  });
}

// From https://bost.ocks.org/mike/shuffle/
const shuffle = function(array) {
  let m = array.length, t, i;
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

const createColumns = function (minNameLength) {
  // Each length has two added onto the end to ensure each column is
  // separated by at least a double column of spaces.
  const columns = [
    {
      id: "name",
      name: "Product name",
      length: minNameLength + Math.floor(Math.random() * 11) + 2
    },
    {
      id: "amount",
      name: "Amount",
      length: 6 + 1 + 2 + Math.floor(Math.random() * 11) + 2 // ###.## + " " + "kg"
    },
    {
      id: "price",
      name: "Unit price",
      length: "Unit Price".length + Math.floor(Math.random() * 11) + 2
    }
  ];
  shuffle(columns);
  const header = columns.reduce((acc, column) => acc + (column.name).padEnd(column.length), "");
  const divider = "=".repeat(columns.reduce((acc, column) => acc + column.length, 0));

  return {
    header: header + '\n' + divider,
    columns: columns
  };
}

const createRow = function (columns) {
  const lengths = columns.reduce((map, column) => map.set(column.id, column.length), new Map());
  return function(fruit) {
    const values = new Map();
    values.set("name", fruit.padEnd(lengths.get("name")));
    const amount = Math.floor(gammaDistribution(2.2) * 200000) / 100;
    const space = Math.floor(Math.random() * 2) >= 1 ? " " : "";
    const amountUnit = Math.floor(Math.random() * 2) >= 1 ? "kg" : "g";
    values.set("amount", (amount + space + amountUnit).padEnd(lengths.get("amount")));
    const price = Math.floor(gammaDistribution(2.2) * 10000) / 100;
    values.set("price", ("$" + price).padEnd(lengths.get("price")));
    return columns.reduce((row, column) => row + values.get(column.id), "");
  }
}

// From https://stackoverflow.com/a/11383334
// Gamma values > 1 will bias leftward, < 1 rightward.
const gammaDistribution = function (gamma) {
    return Math.pow(Math.random(), gamma);    // mix full range and bias
}

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
