var express = require('express');
var path = require('path');
var hbs = require('express-handlebars');

var app = express();

app.set('views', (__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'index',
    layoutsDir: __dirname + '/views/layout/'
}));

// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname, + 'public'));

app.get('/', (req, res) => {
    res.render('home');
});

app.listen(3000);