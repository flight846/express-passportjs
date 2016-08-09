// dependencies
var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var expressSession = require('express-session')

var app = express()

var passport = require('passport')
var passportLocal = require('passport-local')
var passportHttp = require('passport-http')
// var localapi = require('passport-localapikey')

// middlewares
app.set('view engine', 'ejs')

// configure middlewares
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(expressSession({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false
}))

// passport middlewares
app.use(passport.initialize())
app.use(passport.session())

passport.use(new passportLocal.Strategy(verifyAuthentication))

passport.use(new passportHttp.BasicStrategy(verifyAuthentication))

function verifyAuthentication (username, password, done) {
  // Use mongo here
  // User.findOne({ username: username }, function (err, user) {
  //     if (err) { return done(err) }
  //     if (!user) {
  //       return done(null, false, { message: 'Incorrect username.' })
  //     }
  //     if (!user.validPassword(password)) {
  //       return done(null, false, { message: 'Incorrect password.' })
  //     }
  //     return done(null, user)
  //   })
  if (username === password) {
    done(null, {id: username, name: username})
  } else {
    done(null, null)
  }
}

// Serialize user
passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  // query db or cache here
  // User.findById(id, function (err, user) {
  //   done(err, user)
  // })
  done(null, {id: id, name: id})
})

// create our own authentication
function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.send(403)
  }
}

// routes
app.get('/', function (req, res) {
  res.render('index', {
    isAuthenticated: req.isAuthenticated(),
    user: req.user
  })
})

app.get('/login', function (req, res) {
  res.render('login')
})

app.post('/login', passport.authenticate('local'), function (req, res) {
  res.redirect('/')
})

app.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})

// tell express to use passport BasicStrategy when calling api
app.use('/api', passport.authenticate('basic'))

// Authenticating api requests
app.get('/api/data', ensureAuthenticated, function (req, res) {
  res.json({message: 'Hello'})
})

var port = process.env.PORT || 3000

app.listen(port, function () {
  console.log(`You are listening to port: ${port}`)
})
