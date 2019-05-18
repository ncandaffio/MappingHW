var EQmap = L.map("map", {
    center: [46.222480, -13.468259],
    zoom: 2
  });

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(EQmap);

var APIurl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
var geojson;
var minMag = 10000
var maxMag = 0
d3.json(APIurl, function (data) {
    data.features.forEach(function (feature){
        if (feature.properties.mag > maxMag){maxMag = feature.properties.mag}
        if (feature.properties.mag < minMag){minMag = feature.properties.mag}
    })  
    magInterval = (maxMag - minMag) / 10
    function setColor(value) {
        colorScale = {
        0:'#FFFFCC', 
        1: '#FFE8B8', 
        2: '#FFD2A5', 
        3: '#FFBC91',
        4: '#FFA67E',
        5: '#FF906B',
        6: '#FF7957',
        7: '#FF6344',
        8: '#FF4D30',
        9: '#FF371D',
        10: '#FF210A',
    };
    var scaledValue = Math.round((value - minMag) / magInterval)
    return colorScale[scaledValue]
    };

    data.features.forEach(function (feature){
        var radius = 100 + ((feature.properties.mag - minMag) / magInterval * 10000)
        var color = setColor(feature.properties.mag)
        L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            color: color,
            fillColor: color,
            fillOpacity: 0.75,
            radius: radius
        })
        .bindPopup("<h1>" + feature.properties.title + "</h1> <hr> <h3>Magnitude: " + feature.properties.mag + "</h3>")
        .addTo(EQmap);
    });
});
