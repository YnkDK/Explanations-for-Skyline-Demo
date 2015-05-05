controllers.HotelsController = function ($scope, $resource, $location, $filter) {
    $scope.oneAtATime = true;
    var url = "http://" + $location.host() + ":" + $location.port() + '/Explanations-for-Skyline-Demo/backend/hotels.php';
    $scope.stars = [
        1, 2, 3, 4, 5
    ];
    // The accordions data, i.e. the hotels
    $scope.inSkyline = [];
    $scope.notSkyline = [];
    $scope.filteredNotSkyline = [];
    $scope.currentPage = 0;
    $scope.numPerPage = 5;
    $scope.order = 'beach';

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
                $scope.sortBy('price');

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

    $scope.changePage = function(newPage) {
        if($scope.notSkyline.length > 0) {
            var begin = ((newPage - 1) * $scope.numPerPage)
                , end = begin + $scope.numPerPage;

            $scope.filteredNotSkyline = $scope.notSkyline.slice(begin, end);
        }
    };

    $scope.sortBy = function(attribute, reverse) {
        $scope.notSkyline = $filter('orderBy')($scope.notSkyline, attribute, reverse);
        $scope.order = attribute; // TODO: Make this pretty
        $scope.changePage(1);
    };

    $scope.skyNot = function(hotel) {
        alert("You have clicked on this hotel: " + hotel.address);
    }
};