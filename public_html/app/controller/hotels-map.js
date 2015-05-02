controllers.HotelsMapController = function ($scope, $resource, $location, uiGmapGoogleMapApi, $log) {
    $scope.oneAtATime = true;
    var url = "http://" + $location.host() + ":" + $location.port() + '/Explanations-for-Skyline-Demo/backend/hotels.php';
    $scope.stars = [
        1, 2, 3, 4, 5
    ];
    // The accordions data, i.e. the hotels
    $scope.inSkyline = [];
    $scope.notSkyline =

        // Default settings for the query
        $scope.data = {
            price: true,
            priceFrom: 100,
            priceTo: 500,

            beach: true,
            beachFrom: 0.0,
            beachTo: 2.0,

            downtown: true,
            downtownFrom: 0.0,
            downtownTo: 1.5,

            pools: true,
            poolsFrom: 0,
            poolsTo: 10,

            ratings: true,
            ratingsFrom: 3,
            ratingsTo: 5,

            stars: true,
            starsFrom: 0,
            starsTo: 5
        };

    /**
     * Sends the query to backend and update the accordions
     * with the result
     */
    $scope.query = function () {
        $resource(url).get(
            $scope.data
            , function (values) {
                $scope.inSkyline = values.skyline;
                $scope.notSkyline = values.notSkyline;
            }, function (error) {
                alert("That's an error. See console for more info.");
                console.log(error);
            });
    };
    /**
     *
     */

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

    $scope.hotels = [];
    var notSkyline = [];
    $resource(url).get(
        $scope.data
        , function (values) {
            for(var i = 0; i < values.notSkyline.length; i++) {
                $scope.hotels.push({
                    id: i,
                    latitude: values.notSkyline[i].coordinates[1],
                    longitude:values.notSkyline[i].coordinates[0]
                });
                notSkyline.push(values.notSkyline[i]);
            }
            $log.info(values.notSkyline);
        }, function (error) {
            alert("That's an error. See console for more info.");
            console.log(error);
        });
};