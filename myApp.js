const express = require('express');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const { MemoryStore } = require('express-session');
const https = require("https");
const http = require("http")
const fs = require("fs")

// Constants
const PORT = 80;
const HOST = '192.168.0.157';

// App
const app = express();

//Initialize handlebars
app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
}));


app.use(cors());

app.set('views', './views/');
app.set('view engine', 'hbs');

//session
app.set('trust proxy', 1)
//cookieparser
app.use(cookieParser());
app.use(session({
    store: new MemoryStore(),
    secret: "something secret",
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false}
}))

//static folders
app.use(express.static(__dirname + '/app/public'));
// app.use(express.static(__dirname + '/js'));

//bodyparser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());

//csrf
app.use(csrf({ cookie: true }));

app.use(function (req,res,next){
    res.locals.loggedIn = req.session.loggedIn;
    res.locals.user = req.session.user;
    res.locals.admin = req.session.admin;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use (function (req, res, next) {
    if (req.secure) {
            // request was via https, so do no special handling
            next();
    } else {
            // request was via http, so redirect to https
            res.redirect('https://' + req.headers.host + req.url);
    }
});

app.get("/", function (request, response) {
    response.render("home.hbs")
})

//routes
require("./app/routes/email")(app);
require("./app/routes/users")(app);
require("./app/routes/login")(app);
require("./app/routes/portfolios")(app);


const options = {
    key: fs.readFileSync('realCert.key'),
    cert: fs.readFileSync('www_ekerothinvest_se.crt')
}

https.createServer(options,app).listen(443)
http.createServer(app).listen(80);

//app.listen(PORT, HOST);
