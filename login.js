var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').createServer(app);
var sessions = require('express-session');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'bubu',
    database: 'users',
    multipleStatements: false 
});
connection.connect();
http.listen(process.env.PORT || 3000);

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));
var name;
var password;
var path = __dirname + '/index.html';
app.get('/', function (req, res) {
  res.sendFile(path);
});
var session;

app.post('/login',function(req,res){
    console.log("phase1")
    //console.log(req);
    name = req.body.username;
    console.log(name);
    password = req.body.password;
    console.log(password);
    connection.query("select password from users where name ="+"'"+name+"'",function(err,result){
        console.log(result[0].password);
        if(password==result[0].password)
        {
            res.redirect('success.html');
        }
    })

    

})
app.post('/sign',function(req,res){
    console.log("phase2");
    var n = req.body.username;
    var p = req.body.password;
    var user = {
        name: n,
        password: p,
        place: ""
    }
    connection.query("insert into users set ? ",user,function(err,result){

    })
    res.redirect('index.html');

})
app.post('/place',function(req,res){
    console.log("phase3")
    var pn = req.body.pname;
    connection.query("update users set place ="+"'"+pn+"'"+" where name = "+"'"+name+"'")
    res.redirect('place.html');
})

