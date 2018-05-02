var gMap = {}; //Objet used for the google maps API
var mapData = mapData || {}; //Our initial data for the map

var ViewModel = function () {

    var self = this;

    self.showLeftMenu = ko.observable(true);
    self.filter = ko.observable('');

    var Marker = function (item) {
        this.id = item.id;
        this.title = item.title;
        this.position = item.position;
        this.infoContent = item.infoContent;
    };

    self.markerList = ko.observableArray([]);
    mapData.markers.forEach(function(marker) {
        self.markerList.push(new Marker(marker));
    });

    self.findMarker = function (marker) {
        gMap.findMarker(marker);
    };

    self.toggleLeftMenu = function () {
        self.showLeftMenu(!self.showLeftMenu());
    };

    self.filterMarkers = function () {

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
                var gMarker = gMap.addMarker(marker);
                bounds.extend(gMarker.position);
            }
        });

        if (self.markerList().length > 0) { gMap.map.fitBounds(bounds); }
    };

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

        var bounds = new google.maps.LatLngBounds();
        mapData.markers.forEach(function(marker) {
            var gMark = self.addMarker(marker, infoWindow);
            bounds.extend(gMark.position);
        });
        self.map.fitBounds(bounds);

        ko.applyBindings(new ViewModel());
    };

    self.addMarker = function (marker) {

        var mrk = new google.maps.Marker({
            id: marker.id,
            title: marker.title,
            infoContent: marker.infoContent,
            position: marker.position,
            map: self.map,
            animation: google.maps.Animation.DROP
        });

        markerList.push(mrk);

        mrk.addListener('click', function () {
            clickMarker(mrk);
        });

        return mrk;
    };

    self.clearAllMarkers = function () {
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
            tmpStr = tmpStr.replace ('{{infoContent}}', marker.infoContent);
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
        tmpStr = tmpStr.replace ('{{infoContent}}', marker.infoContent);
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
