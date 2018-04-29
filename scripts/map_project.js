var map;

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 40.376004,
            lng: -105.524226
        },
        zoom: 12
    });

    var tribeca = {
        lat: 40.376004,
        lng: -105.524226
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
