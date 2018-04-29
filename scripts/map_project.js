var map;

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 40.3759154,
            lng: -105.5245827
        },
        zoom: 20
    });

    var tribeca = {
        lat: 40.3759154,
        lng: -105.5245827
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