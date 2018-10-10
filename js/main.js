const equisatIcon = "images/Equisat.png";

let pvd, map, marker;
let mapInited = false;
let deployment = new Date(Date.UTC(2018, 8, 13, 8, 44, 6));

let prevLatlng;

function drawEquisatPath(latlng, map) {
    if(prevLatlng == undefined) {
        prevLatlng = latlng;
    }
    equisatPath = new google.maps.Polyline({
        path: [prevLatlng, latlng],
        strokeColor: "#6aa2c8",
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    prevLatlng = latlng;
    equisatPath.setMap(map);
};

// will be called when the maps API is initialized
function initMap() {    

    pvd = new google.maps.LatLng(41.826684, -71.398011);
    // create map, centered on PVD in case of failure
    map = new google.maps.Map(document.getElementById('map'), {
        center: pvd,
        zoom: 4,   
        minZoom: 2,
        streetViewControl: false,
        zoomControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        gestureHandling: "none",
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_BOTTOM
        },
        mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
              position: google.maps.ControlPosition.LEFT_BOTTOM
        },        
        draggableCursor:'',
        styles: [{"featureType":"all","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"all","elementType":"labels","stylers":[{"visibility":"off"},{"saturation":"-100"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40},{"visibility":"off"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"off"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#19222a"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#3f4c5a"}]},{"featureType":"landscape","elementType":"geometry.stroke","stylers":[{"color":"#3f4c5a"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"color":"#3f4c5a"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"lightness":21}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#3f4c5a"}]},{"featureType":"poi","elementType":"geometry.stroke","stylers":[{"color":"#257bcb"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#d7dee5"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#3f4c5a"},{"lightness":"52"},{"weight":"1"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#3f4c5a"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#3f4c5a"},{"lightness":"14"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#3f4c5a"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#3f4c5a"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#3f4c5a"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#19222a"},{"lightness":19}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#2b3638"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#2b3638"},{"lightness":17}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#19222a"}]},{"featureType":"water","elementType":"geometry.stroke","stylers":[{"color":"#24282b"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.icon","stylers":[{"visibility":"off"}]}]
    });
    // get ISS altitude and velocity
    $.get("https://api.wheretheiss.at/v1/satellites/25544", (res) => {
        marker = new google.maps.Marker({
            position: pvd,
            icon: equisatIcon,
            size: new google.maps.Size(25, 25),
            map: map
        });
        mapInited = true;
    });
}

$(document).ready(() => {

    // continually update the location of EQUiSat on the map
    setInterval(() => {
        $.get("https://api.wheretheiss.at/v1/satellites/25544", (res) => {
            if (!res.latitude || res.name !== "iss") {
                console.log("something went wrong: " + JSON.stringify(res, null, 2));
                if (!mapInited) {
                    $("#map").html("<p>Something went wrong tracking EQUiSat. The page will reload shortly.</p>");
                }
            } else {
                let lat = parseFloat(res.latitude);
                let lng = parseFloat(res.longitude);
                let pos = new google.maps.LatLng(lat, lng);
                // adjust map
                if (mapInited) {
                    marker.setPosition(pos);
                    map.setCenter(pos);
                    drawEquisatPath(pos, map)
                }
            }
        });
    }, 1000);
});