window.onload = function () { 
	const mapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyByLnbq47vhoaLRqap4ucnsICGjFFOU6NA&callback=initMap";
	let script = document.createElement("script");
	script.src = mapsUrl;
	script.setAttribute("async", "");
	script.setAttribute("defer", "");
	document.head.appendChild(script);
}
