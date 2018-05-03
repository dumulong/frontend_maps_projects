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

    self.clickListItem = function (place) {
        gMap.clickMarker(place.marker);
    };

    self.toggleLeftMenu = function () {
        self.showLeftMenu(!self.showLeftMenu());
    };

    self.clearAllMarkers = function () {
        self.placeList().forEach(function(place) {
            place.marker.setMap(null);
        });
    };

    self.filteredPlaces = ko.computed (function() {

        var newList = self.placeList.slice(); //Get a copy...

        gMap.closeInfoWindow();
        self.clearAllMarkers ();

        var bounds = new google.maps.LatLngBounds();

        if (self.filter() !== '') {
            var fltr = new RegExp(self.filter(), 'i');
            newList = newList.filter(function(mrkr) {
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
    var infoWindowHtml = $('#infoWindowTempl').get(0).innerHTML;

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
    };

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
            self.clickMarker(mrk);
        });

        return mrk;

    };

    //Show the marker and make it drop
    self.showMarker = function (place) {
        place.marker.setMap (self.map);
        place.marker.setAnimation(google.maps.Animation.DROP);
    };

    //Click marker shows the info window and bouce the marker
    self.clickMarker = function (marker) {
        openInfoWindow(marker);
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {marker.setAnimation(null); }, 500);
    };

    self.closeInfoWindow = function () {
        infoWindow.close();
    };

    //Open the info window
    function openInfoWindow(marker) {
        if (infoWindow.marker !== marker) {
            infoWindow.marker = marker;
            infoWindow.setContent(buildInfoContent(marker));
            infoWindow.open(self.map, marker);
            infoWindow.addListener('closeclick', function () {
                infoWindow.marker = null;
            });
            getYelpInfo(marker);
        }
    }

    //Build the content for an info window
    function buildInfoContent (marker, yelpRating) {
        if (!yelpRating) {
            yelpRating = '<i class="fa fa-spinner fa-spin" style="font-size:16px"></i> Retrieving Yelp review...';
        }
        var tmpStr = infoWindowHtml.replace ('{{title}}', marker.title);
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
