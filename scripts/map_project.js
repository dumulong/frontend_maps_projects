var map;
var mapData = mapData || {};
var markerList = [];
var myWindow = null;

var Marker = function (item) {
    this.title = item.title;
    this.position = item.position;
    this.infoContent = item.infoContent;
};

var ViewModel = function () {

    var self = this;
    self.filter = ko.observable();

    self.markerList = ko.observableArray([]);

    mapData.markers.forEach(function(marker) {
        self.markerList.push(new Marker(marker));
    });

    self.filterMarkers = function () {

        console.log('here');

        //Reset to a new list
        self.markerList = ko.observableArray([]);

        //Now, if the title maches the filter, add it to our list
        var bounds = new google.maps.LatLngBounds();
        var fltr = new RegExp(self.filter, 'i');

        mapData.markers.forEach(function(marker) {
            if (self.filter !== '') {
                if (fltr.test(marker.title)) {
                    var gMark = self.markerList.push(new Marker(marker));
                    bounds.extend(gMark.position);
                }
            }
        });

        map.fitBounds(bounds);
    };

};

function addMarker(marker, infoWindow) {

    var mrk = new google.maps.Marker({
        position: marker.position,
        map: map,
        title: marker.title,
        animation: google.maps.Animation.DROP
    });

    mrk.addListener('click', function () {
        populateInfoWindow(this, infoWindow);
    });

    return mrk;
}

function populateInfoWindow(marker, infoWindow) {

    if (infoWindow.marker !== marker) {
        infoWindow.marker = marker;
        infoWindow.setContent('<div>' + marker.title + '</div>');
        infoWindow.open(map, marker);
        infoWindow.addListener('closeclick', function () {
            infoWindow.setMarker(null);
        });
    }

}


//Starting here!
function initMap() {

    map = new google.maps.Map(document.getElementById('map'), mapData.mapOptions);

    myWindow = new google.maps.InfoWindow();

    var bounds = new google.maps.LatLngBounds();
    mapData.markers.forEach(function(marker) {
        var gMark = addMarker(marker, myWindow);
        bounds.extend(gMark.position);
    });
    map.fitBounds(bounds);

    ko.applyBindings(new ViewModel());
}


