var express = require('express'),
    app = express(),
    mysql = require('mysql'),
    bodyParser = require('body-parser'),
    conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        port: '3309',
        database: 'ownroom'
    });

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static('public'));
var server =  app.listen(3000, function(){
    console.log('Express server has started on port 3000');
});

var router = require('./router/restfulAPI')(app, conn),
    naverlogin = require('./router/naverlogin')(app),
    test = require('./router/test')(app);