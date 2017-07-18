const fs = require('fs');
const tools = require('./tools');

const tableMaker = function(allFruits, columnSizer, columnOrderer) {
  const fruits = selectFruits(allFruits);
  const widths = columnSizer(fruits);
  const columns = createColumns(widths, columnOrderer);
  const inventory = fruits.map(createRow(columns.columns));

  return columns.header + '\n' + inventory.join('\n');
};

const selectFruits = function (fruits) {
  // Generate a limited selection of random fruits in a random order
  // and with some duplicates.
  fruits = tools.shuffle(fruits);
  const n = Math.floor(Math.random() * (25)) + 8; // Arbitrary sizes, nothing special.
  fruits = fruits.slice(0, n);
  fruits = fruits.concat(fruits.slice(0, 3)); // Take 3 duplicates.  Yes, another arbitrary number.
  fruits = tools.shuffle(fruits);

  return fruits;
};

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
};

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
};

exports.getFruitsTable = function(columnSizer, columnOrderer, callback) {
  fs.readFile('fruits.txt', 'utf8', function(err, fruits) {
    if (err) return callback(err);
    fruits = fruits.split('\n');
    const table = tableMaker(fruits, columnSizer, columnOrderer);

    return callback(null, table);
  });
};

// Column Sizers
exports.constWidths = function() {
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
};

exports.variableWidths = function(fruits) {
  const widths = exports.constWidths();
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
};

// Column Orderers
exports.constOrder = function(columns) {
  return columns;
};

exports.variableOrder = function(columns) {
  return tools.shuffle(columns);
};