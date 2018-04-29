var map;

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 40.373242,
            lng: -105.521494
        },
        zoom: 12
    });

    var tribeca = {
        lat: 40.373242,
        lng: -105.521494
    };

    var marker = new google.maps.Marker({
        position: tribeca,
        map: map,
        title: 'First Maker'
    });

    var infowindow = new google.maps.InfoWindow({
        content: 'blablabla...'
    });

    marker.addListener('click', function () {

    });
}

var ViewModel = function () {
    var self = this;
    this.markerList = ko.observable([]);
    markers.array.forEach(function(marker){
        self.markerList.push( new Marker(marker));
    });
}