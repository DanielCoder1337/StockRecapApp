const express = require('express');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const bodyParser = require("body-parser");

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

//Initialize handlebars
app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
}));

app.set('views', './views/');
app.set('view engine', 'hbs');

//static folders
app.use(express.static(__dirname + '/public'));
// app.use(express.static(__dirname + '/js'));

//bodyparser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());

//cookieparser
app.use(cookieParser());

//csrf
app.use(csrf({ cookie: true }));

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.get("/", function (request, response) {
    response.render("home.hbs")
})


app.listen(PORT, HOST);
