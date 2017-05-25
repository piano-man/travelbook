var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').createServer(app);
var sessions = require('express-session');
var io = require('socket.io')(http);

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
var pn;
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
             connection.query("update users set status ="+"'online'"+" where name = "+"'"+name+"'")
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
        place: "",
        status: ""
    }
    connection.query("insert into users set ? ",user,function(err,result){

    })
    res.redirect('index.html');

})
app.post('/place',function(req,res){
    console.log("phase3")
    pn = req.body.pname;
    connection.query("update users set place ="+"'"+pn+"'"+" where name = "+"'"+name+"'")
    res.redirect('place.html');
})

app.get('/exit',function(req,res){
    
    connection.query("update users set status ="+"'offline'"+" where name = "+"'"+name+"'")
    res.redirect('index.html');
})

app.get('/chat',function(req,res){
    console.log("backend magic")
    connection.query("select name from users where status ='online' and place ="+"'"+pn+"'",function(err,result){
        res.send(result);

    })
})
