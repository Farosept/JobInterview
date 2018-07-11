const flash = require('connect-flash');
const os = require( 'os' );
const ifaces = os.networkInterfaces();

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      if(iface.address == "127.0.0.1")
      console.log(ifname + " Local: https://localhost:9002/" );
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + " Local: https://"+iface.address+":9002/" );
    } else {
      // this interface has only one ipv4 adress
      console.log(ifname + " Local: https://"+iface.address+":9002/" );
    }
    ++alias;
  });
});

const express = require("express"),
      https = require("https"),
      http= require('http'),
      app = express(),
      ejs = require('ejs'),
      config = require('./config'),
      passport = require('passport'),
      partials = require('express-partials'),
      fs = require('fs'),
      path = require('path'),
      validator = require('express-validator'),
      session = require('express-session'),
      static = require('serve-static'),
      expressWinston = require('express-winston'),
      winston = require('winston'),
      morgan = require('morgan'),
      accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'}),
      favicon = require('serve-favicon'),
      BetterMemoryStore = require('session-memory-store')(session),
      store = new BetterMemoryStore({ expires: 60 * 60 * 1000, debug: true }),
      controllers = require('./controllers'),
      options = {
        key: fs.readFileSync('fake-keys/privatekey.pem'),
        cert: fs.readFileSync('fake-keys/certificate.pem')
      };

global.helpers = require('./helpers');
global.attempts = config.get('attempts');
https.createServer(options, app).listen(config.get('port'), ()=>console.log('HTTPS Server start. Port listen: '+config.get('port')));

app.use(morgan('dev', {stream: accessLogStream}));
app.use(session({name:'mysess', store:store, secret: 'odfgjpodpojg', saveUninitialized: true, resave: true,cookie: { path: '/', httpOnly: true, secure: false, maxAge: 10*64*10000 } }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use("/public",static( __dirname + '/public' ));// хранение css/js/files
app.use(favicon(__dirname + '/favicon.ico'));
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');
app.use(partials()); //частичные представления
app.use(require('connect-multiparty')({ uploadDir: './public/files' }))// загрузка файлов
app.use(require('body-parser').json())
app.use(express.urlencoded({ extended: true }));
app.use(validator());
app.use(require('./controllers'));
app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.File({
            name:'errors',
            filename:'./error.log',
            level:'error'
        })
    ]
}));

module.exports.app = app;