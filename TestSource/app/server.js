// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const fs = require('fs');
const tools = require('./tools');

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/vary-fruits.txt", function (request, response) {
  response.set({"Content-Type":"text/plain; charset=UTF-8"});
  getFruitsTable(response, constWidths, constOrder);
});

app.get("/vary-fruits-and-widths.txt", function (request, response) {
  response.set({"Content-Type":"text/plain; charset=UTF-8"});
  getFruitsTable(response, variableWidths, constOrder);
});

app.get("/vary-everything.txt", function (request, response) {
  response.set({"Content-Type":"text/plain; charset=UTF-8"});
  getFruitsTable(response, variableWidths, variableOrder);
});

const getFruitsTable = function(response, columnSizer, columnOrderer) {
  fs.readFile('fruits.txt', 'utf8', function(err, fruits) {
    if (err) throw err;
    // Get fruit selection
    fruits = fruits.split('\n');
    fruits = tools.shuffle(fruits);
    const n = Math.floor(Math.random() * (25)) + 8; // Arbitrary sizes, nothing special.
    fruits = fruits.slice(0, n);
    fruits = fruits.concat(fruits.slice(0, 3)); // Take 3 duplicates.  Yes, another arbitrary number.
    fruits = tools.shuffle(fruits);
    // Build inventory table
    const table = tableMaker(fruits, columnSizer, columnOrderer);

    response.send(table);
  });
}

// Table Makers
const tableMaker = function(fruits, columnSizer, columnOrderer) {
  const widths = columnSizer(fruits);
  const columns = createColumns(widths, columnOrderer);
  const inventory = fruits.map(createRow(columns.columns));

  return columns.header + '\n' + inventory.join('\n');
}

const createColumns = function (widths, columnOrderer) {
  // Each length has two added onto the end to ensure each column is
  // separated by at least a double column of spaces.
  const columns = [
    {
      id: "name",
      name: "Product name",
      length: widths.name + 2
    },
    {
      id: "amount",
      name: "Amount",
      length: widths.amount + 2 // ###.## + " " + "kg"
    },
    {
      id: "price",
      name: "Unit price",
      length: widths.price + 2
    }
  ];
  columnOrderer(columns);
  const header = columns.reduce((acc, column) => acc + tools.padEnd(column.name, column.length), "");
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
    values.set("name", tools.padEnd(fruit, lengths.get("name")));
    const amount = Math.floor(tools.gammaDistribution(2.2) * 200000) / 100;
    const space = Math.random() >= 0.5 ? " " : "";
    const amountUnit = Math.random() >= 0.5 ? "kg" : "g";
    values.set("amount", tools.padEnd((amount + space + amountUnit), lengths.get("amount")));
    const price = Math.floor(tools.gammaDistribution(2.2) * 10000) / 100;
    values.set("price", tools.padEnd(("$" + price), lengths.get("price")));
    return columns.reduce((row, column) => row + values.get(column.id), "");
  }
}

// Column Sizers
const constWidths = function() {
  // Widths are taken from static-data.txt and reduced by 2.
  // Smaller size is to account for the space added by `createColumns`.
  const nameWidth = 24-2;
  const amountWidth = 16-2;
  const priceWidth = 17-2;

  return {
    name: nameWidth,
    amount: amountWidth,
    price: priceWidth
  };
}

const variableWidths = function(fruits) {
  const widths = constWidths();
  widths.name = fruits.reduce(function(maxLength, fruit) {
    return fruit.length > maxLength ? fruit.length : maxLength;
  }, 0) + 2;
  widths.amount = 7 + 1 + 2; // ####.## + " " + "kg"
  widths.price = "Unit Price".length;

  return {
    name: widths.name + Math.floor(Math.random() * 11),
    amount: widths.amount + Math.floor(Math.random() * 11),
    price: widths.price + Math.floor(Math.random() * 11)
  };
}

// Column Orderers
const constOrder = function(columns) {
  return columns;
}

const variableOrder = function(columns) {
  return tools.shuffle(columns);
}

// listen for requests :)
const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
