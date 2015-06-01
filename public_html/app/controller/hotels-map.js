controllers.HotelsMapController = function ($scope, $modal, $timeout, uiGmapGoogleMapApi, HotelRange, Hotels) {
    $scope.ranges = {}; // Defines qL and qU for the range query
    $scope.hotels = [];
    $scope.loadingText = "";

    $scope.map = {center: {latitude: 45, longitude: -73}, zoom: 8};
    uiGmapGoogleMapApi.then(function (maps) {
        maps.visualRefresh = true;
    });

    angular.extend($scope, {
        map: {
            show: true,
            control: {},
            version: "unknown",
            showTraffic: false,
            showBicycling: false,
            showWeather: false,
            showHeat: false,
            center: {
                latitude: 56.152457,
                longitude: 10.140608
            },
            options: {
                streetViewControl: false,
                panControl: false,
                maxZoom: 20,
                minZoom: 3
            },
            zoom: 12,
            markersEvents: {
                click: function(marker, eventName, model, arguments) {
                    $scope.map.window.model = model;
                    $scope.map.window.show = true;
                }
            },
            window: {
                marker: {},
                show: false,
                closeClick: function() {
                    this.show = false;
                },
                options: {} // define when map is ready
            }
        }
    });


    // Define local variables
    var modalInstance = undefined;
    // Define local functions
    /**
     * Shows a loading gif
     */
    function loading() {
        modalInstance = $modal.open({
            templateUrl: 'app/partials/modal-loading.html',
            size: 'sm',
            backdrop: 'static',
            keyboard: false,
            scope: $scope
        });
    }

    /**
     * Fetches the default ranges from the server
     */
    function fetchRanges() {
        $scope.loadingText = "Fetching ranges...";
        loading();
        var ranges = HotelRange.get({}, function() {
            $scope.ranges = ranges.data;

            //Swap min and max
            //for(var property in $scope.ranges) {
            //    if($scope.ranges.hasOwnProperty(property)) {
            //        if($scope.ranges[property] === 'MAX') {
            //            $scope.ranges[property] = 'MIN';
            //        } else if($scope.ranges[property] === 'MIN') {
            //            $scope.ranges[property] = 'MAX';
            //        }
            //    }
            //}
            // Do not use attributes that cannot be changed
            $scope.ranges.beach = false;
            $scope.ranges.aros = false;
            $scope.ranges.downtown = true;
            // Ensure that the rest is enabled
            $scope.ranges.price = true;
            $scope.ranges.rating = false;
            $scope.ranges.wifi = false;
            $scope.ranges.roomsize = false;
            // Get skyline of the hotels using these parameters
            $scope.loadingText = "Computing skyline...";
            var hotels = Hotels.get($scope.ranges, function() {
                for(var i = 0; i < hotels.skyline.length; i++) {
                    var h = hotels.skyline[i];
                    $scope.hotels.push({
                        id: h.id,
                        latitude: h.coordinates[1],
                        longitude: h.coordinates[0]
                    })
                }
                $scope.notSkyline = hotels.notSkyline;
                $scope.skyline = hotels.skyline;
                console.log($scope.notSkyline);
                modalInstance.dismiss();
            });
        });
    }

    // Start by getting the extreme ranges
    fetchRanges();

};