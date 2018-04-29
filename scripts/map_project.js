var map;

var ViewModel = function () {
    var self = this;
    this.markerList = ko.observable([]);
    this.addMarker = function (mrkr) {
        self.markerList.push(mrkr);
    };
};

function addMarker(marker, map) {
    var mrkr = new google.maps.Marker({
        position: marker.position,
        map: map,
        title: marker.title
    });
    return mrkr;
}

function addInfoWindow(marker) {
    var inf = new google.maps.InfoWindow({
        content: marker.infoContent
    });
    return inf;
}

function initMap() {

    var jqxhr = $.getJSON('scripts/map_data.json', function(data) {

            map = new google.maps.Map(document.getElementById('map'), data.map);

            data.markers.forEach(function(marker) {
                addMarker(marker, map);
                addInfoWindow(marker);
                ViewModel.addMarker(marker);
            });

            // var infowindow = new google.maps.InfoWindow({
            //     content: 'blablabla...'
            // });

            // marker.addListener('click', function () {

            // });

        })
        .fail(function() {
            toastr.error('Unable to load map data...');
        });

}

