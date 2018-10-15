var fetch = require("node-fetch");

const TLEJS = require('tle.js');
const tlejs = new TLEJS();

var tleStr = 'ISS (ZARYA)\n1 25544U 98067A   18167.57342809  .00001873  00000-0  35452-4 0  9993\n2 25544  51.6416  21.7698 0002962 191.5103 260.7459 15.54186563118420';

function updateTLE() {
	fetch('http://tracking.brownspace.org/api/equisat_tle').then((res) => {
	if (res.status === 200) {
    	res.text().then((res) => {
        	tleStr = res;
    	});
    }
});

}

updateTLE();
setInterval(() => {
	updateTLE();
}, 1000*60*60*6);

var express = require("express");

var app = express();

app.use(express.static(__dirname));

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/vendor', express.static(__dirname + '/vendor'));
app.use('/fonts', express.static(__dirname + '/fonts'));
app.use('/node_modules/axios', express.static(__dirname + '/node_modules/axios'));

app.get('/getLatLon', function (req, res) {
  res.send(tlejs.getLatLon(tleStr));
})

app.get('/getOrbitLines', function (req, res) {
  res.send(tlejs.getGroundTrackLatLng(tleStr));
})

var server = app.listen(process.env.PORT || 80, function(){
    var port = server.address().port;
    console.log("Server started at http://localhost:%s", port);
});