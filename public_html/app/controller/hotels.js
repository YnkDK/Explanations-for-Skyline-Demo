controllers.HotelsController = function ($scope, $resource, $location) {
    $scope.oneAtATime = true;
    var url = "http://" + $location.host() + ":" + $location.port() + '/Explanations-for-Skyline-Demo/backend/hotels.php';
    $scope.stars = [
        1, 2, 3, 4, 5
    ];
    // The accordions data, i.e. the hotels
    $scope.inSkyline = [];
    $scope.notSkyline = [];
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
                $scope.status.isSecondOpen = true;
            }, function (error) {
                alert("That's an error. See console for more info.");
                console.log(error);
            });
    };

    $scope.status = {
        isFirstOpen: false,
        isSecondOpen: false
    };
};