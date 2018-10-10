var express = require("express");
 
var app = express();
 
app.use(express.static(__dirname));
 
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/vendor', express.static(__dirname + '/vendor'));
app.use('/fonts', express.static(__dirname + '/fonts'));
app.use('/node_modules/axios', express.static(__dirname + '/node_modules/axios'));
 
var server = app.listen(process.env.PORT || 80, function(){
    var port = server.address().port;
    console.log("Server started at http://localhost:%s", port);
});