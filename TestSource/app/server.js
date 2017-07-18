// server.js
// where your node app starts

// init project
const express = require('express')
const app = express()
const path = require('path')
const fruits = require('./fruits')

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, '/views/index.html'))
})

const getTableHandler = function (columnSizer, columnOrderer) {
  return function (request, response, next) {
    fruits.getFruitsTable(columnSizer, columnOrderer, (err, table) => {
      if (err) {
        return next(err)
      }
      response.set({'Content-Type': 'text/plain; charset=UTF-8'})
      response.send(table)
    })
  }
}

app.get('/vary-fruits.txt', getTableHandler(fruits.constWidths, fruits.constOrder))

app.get('/vary-fruits-and-widths.txt', getTableHandler(fruits.variableWidths, fruits.constOrder))

app.get('/vary-everything.txt', getTableHandler(fruits.variableWidths, fruits.variableOrder))

// listen for requests :)
const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port)
})
