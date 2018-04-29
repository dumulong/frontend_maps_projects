var map;
var mapData = mapData || {};

var Marker = function (item) {
    this.title = item.title;
    this.position = item.position;
    this.infoContent = item.infoContent;
};

var ViewModel = function () {

    var self = this;

    self.markerList = ko.observableArray([]);

    mapData.markers.forEach(function(marker) {
        self.markerList.push(new Marker(marker));
    });

};



function addMarker(marker, map) {
    return new google.maps.Marker({
        position: marker.position,
        map: map,
        title: marker.title
    });
}

function addInfoWindow(marker) {
    return new google.maps.InfoWindow({
        content: marker.infoContent
    });
}

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), mapData.mapOptions);

    mapData.markers.forEach(function(marker) {
        addMarker(marker, map);
        addInfoWindow(marker);
    });

    // var infowindow = new google.maps.InfoWindow({
    //     content: 'blablabla...'
    // });

    // marker.addListener('click', function () {

    // });

}

ko.applyBindings(new ViewModel());
