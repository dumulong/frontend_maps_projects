var gMap = {}; //Objet used for the google maps API
var mapData = mapData || {}; //Our initial data for the map

(function () {

    var self = this;

    self.map = null;
    var infoWindow = null;

    var markerList = [];

    //Starting here!
    self.initMap = function () {

        self.map = new google.maps.Map(document.getElementById('map'), mapData.mapOptions);

        infoWindow = new google.maps.InfoWindow();

        var bounds = new google.maps.LatLngBounds();
        mapData.markers.forEach(function(marker) {
            var gMark = self.addGMarker(marker, infoWindow);
            bounds.extend(gMark.position);
        });
        self.map.fitBounds(bounds);

        ko.applyBindings(new ViewModel());
    };

    self.addGMarker = function (marker) {

        var mrk = new google.maps.Marker({
            position: marker.position,
            map: self.map,
            title: marker.title,
            animation: google.maps.Animation.DROP
        });

        markerList.push(mrk);

        mrk.addListener('click', function () {
            populateInfoWindow(this, infoWindow);
        });

        return mrk;
    };

    self.clearAllMarkers = function () {
        markerList.forEach(function(marker) {
            marker.setMap(null);
        });
    };

    function populateInfoWindow(marker) {

        if (infoWindow.marker !== marker) {
            infoWindow.marker = marker;
            infoWindow.setContent('<div>' + marker.title + '</div>');
            infoWindow.open(self.map, marker);
            infoWindow.addListener('closeclick', function () {
                infoWindow.setMarker(null);
            });
        }

    }

    gMap = self;

})();


var ViewModel = function () {

    var self = this;

    self.filter = ko.observable('');

    var Marker = function (item) {
        this.title = item.title;
        this.position = item.position;
        this.infoContent = item.infoContent;
    };

    self.markerList = ko.observableArray([]);
    mapData.markers.forEach(function(marker) {
        self.markerList.push(new Marker(marker));
    });

    self.filterMarkers = function () {

        console.log('here');

        //Reset to a new list
        self.markerList = ko.observableArray([]);
        gMap.clearAllMarkers ();

        //Now, if the title maches the filter, add it to our list
        var bounds = new google.maps.LatLngBounds();
        var fltr = new RegExp(self.filter(), 'i');

        mapData.markers.forEach(function(marker) {

            var isMatch = true;
            if (self.filter() !== '') { isMatch = fltr.test(marker.title); }

            if (isMatch) {
                self.markerList.push(new Marker(marker));
                var gMarker = gMap.addGMarker(marker);
                bounds.extend(gMarker.position);
            }
        });

        gMap.map.fitBounds(bounds);
    };

};
