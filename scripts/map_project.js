var gMap = {}; //Objet used for the google maps API
var mapData = mapData || {}; //Our initial data for the map

var ViewModel = function () {

    var self = this;

    self.showLeftMenu = ko.observable(true);
    self.filter = ko.observable('');

    var Place = function (item) {
        this.id = item.id;
        this.title = item.title;
        this.position = item.position;
        this.comment = item.comment;
        this.marker = gMap.createMarker(this);
    };

    self.placeList = ko.observableArray([]);
    mapData.markers.forEach(function(place) {
        self.placeList.push(new Place(place));
    });

    self.findMarker = function (place) {
        gMap.findMarker(place);
    };

    self.toggleLeftMenu = function () {
        self.showLeftMenu(!self.showLeftMenu());
    };

    self.filteredPlaces = ko.computed (function() {

        var filter = self.filter();
        var newList = self.placeList.slice();

        gMap.clearAllMarkers ();

        var bounds = new google.maps.LatLngBounds();

        if (filter !== '') {
            var tempList = self.placeList.slice();
            var fltr = new RegExp(filter, 'i');
            newList = tempList.filter(function(mrkr) {
                return fltr.test(mrkr.title);
            });
        }

        newList.forEach(function(place) {
            gMap.showMarker(place);
            bounds.extend(place.marker.position);
        });

        if (newList.length > 0) { gMap.map.fitBounds(bounds); }

        return newList;
    });

};

(function () {

    var self = this;

    self.map = null;
    var infoWindow = null;

    var markerList = [];

    var infoHtml = $('#infoWindowTempl').get(0).innerHTML;

    //Starting here!
    self.initMap = function () {

        self.map = new google.maps.Map($('#map').get(0), mapData.mapOptions);
        infoWindow = new google.maps.InfoWindow();

        var viewModel = new ViewModel();
        var bounds = new google.maps.LatLngBounds();

        var list = viewModel.filteredPlaces();
        list.forEach(function(place) {
            self.showMarker(place);
            bounds.extend(place.marker.position);
        });
        self.map.fitBounds(bounds);

        ko.applyBindings(viewModel);
    };

    self.googleLoadError = function () {
        toastr.error('Unable to load the Google Maps API!');
    }

    self.createMarker = function (place) {

        var mrk = new google.maps.Marker({
            id: place.id,
            title: place.title,
            comment: place.comment,
            position: place.position,
            map: self.map,
            animation: google.maps.Animation.DROP
        });

        mrk.addListener('click', function () {
            clickMarker(mrk);
        });

        return mrk;

    };

    self.showMarker = function (place) {
        place.marker.setMap (self.map);
        place.marker.setAnimation(google.maps.Animation.DROP)
        markerList.push(place.marker);
    };

    self.clearAllMarkers = function () {
        infoWindow.close();
        markerList.forEach(function(marker) {
            marker.setMap(null);
        });
    };

    self.findMarker = function (marker) {
        markerList.forEach(function(gMarker) {
            if (gMarker.id === marker.id) { clickMarker(gMarker); }
        });
    };

    function clickMarker (marker) {
        openInfoWindow(marker);
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {marker.setAnimation(null); }, 500);
    }

    function openInfoWindow(marker) {

        if (infoWindow.marker !== marker) {

            var tmpStr = infoHtml.replace ('{{title}}', marker.title);
            tmpStr = tmpStr.replace ('{{comment}}', marker.comment);
            infoWindow.marker = marker;
            infoWindow.setContent(tmpStr);
            infoWindow.open(self.map, marker);
            infoWindow.addListener('closeclick', function () {
                infoWindow.marker = null;
            });
            getYelpInfo(marker);
        }

    }

    function buildInfoContent (marker, yelpRating) {
        if (!yelpRating) {
            yelpRating = '<i class="fa fa-spinner fa-spin" style="font-size:16px"></i> Retrieving Yelp review...';
        }
        var tmpStr = infoHtml.replace ('{{title}}', marker.title);
        tmpStr = tmpStr.replace ('{{comment}}', marker.comment);
        tmpStr = tmpStr.replace ('{{yelpRating}}', yelpRating);
        return tmpStr;
    }

    function getYelpInfo (marker) {

        var yelpURL = 'http://weborso.com/Udacity/frontend_maps_projects/yelp_proxy.php';
        var latlng = 'latitude=' + marker.position.lat() + '&longitude=' +  marker.position.lng();
        var url = yelpURL + '?' + latlng;

        infoWindow.setContent(buildInfoContent(marker));

        $.getJSON(url, function(data) {

            var tmpStr = 'No review found...';
            var items = data.businesses;

            for (var i = 0; i < items.length; i++) {
                if (items[i].name.toLowerCase() === marker.title.toLowerCase()) {
                    tmpStr = 'Yelp Rating: ' + items[i].rating;
                    tmpStr += ' from ' + items[i].review_count + ' Reviewers';
                }
            }

            infoWindow.setContent(buildInfoContent(marker, tmpStr));

        })
        .fail(function() {
            toastr.error('Unable to retrieve Yelp rating...');
            infoWindow.setContent(buildInfoContent(marker, 'Unable to retrieve Yelp rating'));
        });

    }

    gMap = self;

})();
