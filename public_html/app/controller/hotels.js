controllers.HotelsController = function ($scope, $resource, $location, $filter) {
    $scope.oneAtATime = true;
    var urlHotelData = "http://" + $location.host() + ":" + $location.port() + '/Explanations-for-Skyline-Demo/backend/hotels.php';
    var urlDefaultData = "http://" + $location.host() + ":" + $location.port() + '/Explanations-for-Skyline-Demo/backend/ranges.php';
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
    $scope.edit = {};

    // Load default settings for the query
    $resource(urlDefaultData).get(
        {}
        , function (values) {

            $scope.data = values.data;

            $scope.data.priceFrom = parseInt(Math.floor(values.data.priceFrom / 10) * 10);
            $scope.data.priceTo = parseInt(Math.ceil(values.data.priceTo / 10) * 10);

            $scope.data.beachFrom = Math.floor(values.data.beachFrom);
            $scope.data.beachTo = Math.ceil(values.data.beachTo);

            $scope.data.downtownFrom = Math.floor(values.data.downtownFrom);
            $scope.data.downtownTo = Math.ceil(values.data.downtownTo);

        }, function (error) {
            alert("The server did not respond. See console for more info.");
            console.log(error);
        });



    /**
     * Sends the query to backend and update the accordions
     * with the result
     */
    $scope.query = function () {
        console.log($scope.data);
        $resource(urlHotelData).get(
            $scope.data
            , function (values) {
                $scope.inSkyline = values.skyline;
                $scope.notSkyline = values.notSkyline;
                $scope.sortBy('price');

                $scope.status.isSecondOpen = true;

            }, function (error) {
                alert("The server did not respond. See console for more info.");
                console.log(error);
            });

        if($scope.currentSkyNot !== undefined){
            resetPreviousDataValues();
        }

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
        // TODO: Rewrite such that it works
        console.log(hotel);
        $scope.notSkyline = [];
        $scope.filteredNotSkyline = [];
        $scope.status.isSecondOpen = false;

        //Current data
        $scope.currentSkyNot = {
            priceFrom : (hotel.snPrice === 0) ? '' : $scope.data.priceFrom,
            beachFrom : (hotel.snBeach === 0) ? '' : $scope.data.beachFrom,
            downtownFrom : (hotel.snDowntown === 0) ? '' :  $scope.data.downtownFrom,
            poolsTo : (hotel.snPools === 0) ? '' : $scope.data.poolsTo,
            ratingsTo : (hotel.snRating === 0) ? '' : $scope.data.ratingTo,
            starsTo : (hotel.snStars === 0) ? '' : $scope.data.starsTo
        };

        $scope.data.priceFrom = (hotel.snPrice === 0) ? $scope.data.priceFrom : hotel.snPrice;
        $scope.data.priceTo = ($scope.data.priceTo < $scope.data.priceFrom ? $scope.data.priceFrom : $scope.data.priceTo);

        $scope.data.beachFrom = (hotel.snBeach === 0) ? $scope.data.beachFrom : hotel.snBeach;
        $scope.data.beachTo = ($scope.data.beachTo < $scope.data.beachFrom ? $scope.data.beachFrom : $scope.data.beachTo);

        $scope.data.downtownFrom = (hotel.snDowntown === 0) ? $scope.data.downtownFrom : hotel.snDowntown;
        $scope.data.downtownTo = ($scope.data.downtownTo < $scope.data.downtownFrom ? $scope.data.downtownFrom : $scope.data.downtownTo);

        $scope.data.poolsTo = (hotel.snPools === 0) ? $scope.data.poolsTo : hotel.snPools;
        $scope.data.poolsFrom = ($scope.data.poolsFrom > $scope.data.poolsTo ? $scope.data.poolsTo : $scope.data.poolsFrom);

        $scope.data.ratingTo = (hotel.snRating === 0) ? $scope.data.ratingTo : hotel.snRating;
        $scope.data.ratingFrom = ($scope.data.ratingFrom > $scope.data.ratingTo ? $scope.data.ratingTo : $scope.data.ratingFrom);

        $scope.data.starsTo = (hotel.snStars === 0) ? $scope.data.starsTo : hotel.snStars;
        $scope.data.starsFrom = ($scope.data.starsFrom > $scope.data.starsTo ? $scope.data.starsTo : $scope.data.starsFrom);
    };

    function resetPreviousDataValues(){
        $scope.currentSkyNot.priceFrom = "";
        $scope.currentSkyNot.beachFrom = "";
        $scope.currentSkyNot.downtownFrom = "";
        $scope.currentSkyNot.poolsTo = "";
        $scope.currentSkyNot.ratingsTo = "";
        $scope.currentSkyNot.starsTo = "";
    }
};