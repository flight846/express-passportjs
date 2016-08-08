var express = require('express')
var app = express()

app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {
    isAuthenticated: false,
    user: req.user
  })
})

app.get('/login', function (req, res) {
  res.render('login')
})

var port = process.env.PORT || 3000

app.listen(port, function () {
  console.log(`You are listening to port: ${port}`)
})
