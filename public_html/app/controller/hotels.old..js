controllers.HotelsController = function ($scope, $resource, $location, $filter) {
    $scope.oneAtATime = true;
    var urlHotelData = backend + 'hotels.php';
    var urlDefaultData = backend + 'ranges.php';
    $scope.stars = [
        1, 2, 3, 4, 5
    ];
    // The accordions data, i.e. the hotels
    $scope.inSkyline = [];
    $scope.notSkyline = [];
    $scope.filteredNotSkyline = [];
    $scope.currentPage = 1;
    $scope.numPerPage = 5;
    $scope.order = 'beach';
    $scope.edit = {};
    $scope.currentSkyNot = {};

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
        console.log(newPage);
        $scope.currentPage = newPage;

        if($scope.notSkyline.length > 0) {
            var begin = ((newPage - 1) * $scope.numPerPage)
                , end = begin + $scope.numPerPage;

            $scope.filteredNotSkyline = $scope.notSkyline.slice(begin, end);

            //$scope.currentPage = newPage;
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
        resetPreviousDataValues();

        if(hotel.snPrice && $scope.data.price) {
            $scope.currentSkyNot.priceFrom = $scope.data.priceFrom;
            $scope.data.priceFrom = parseFloat(hotel.snPrice);
            $scope.data.priceTo = ($scope.data.priceTo < $scope.data.priceFrom ? $scope.data.priceFrom : $scope.data.priceTo);
        }
        if(hotel.snBeach && $scope.data.beach) {
            $scope.currentSkyNot.beachFrom = $scope.data.beachFrom;
            $scope.data.beachFrom = parseFloat(hotel.snBeach);
            $scope.data.beachTo = ($scope.data.beachTo < $scope.data.beachFrom ? $scope.data.beachFrom : $scope.data.beachTo);
        }
        if(hotel.snDowntown && $scope.data.downtown) {
            $scope.currentSkyNot.downtownFrom = $scope.data.downtownFrom;
            $scope.data.downtownFrom = parseFloat(hotel.snDowntown);
            $scope.data.downtownTo = ($scope.data.downtownTo < $scope.data.downtownFrom ? $scope.data.downtownFrom : $scope.data.downtownTo);
        }
        if(hotel.snPools && $scope.data.pools) {
            $scope.currentSkyNot.poolsTo = $scope.data.poolsTo;
            $scope.data.poolsTo = parseFloat(hotel.snPools);
            $scope.data.poolsFrom = ($scope.data.poolsFrom > $scope.data.poolsTo ? $scope.data.poolsTo : $scope.data.poolsFrom);
        }
        if(hotel.snRating && $scope.data.rating) {
            $scope.currentSkyNot.ratingTo = $scope.data.ratingTo;
            $scope.data.ratingTo = parseFloat(hotel.snRating);
            $scope.data.ratingFrom = ($scope.data.ratingFrom > $scope.data.ratingTo ? $scope.data.ratingTo : $scope.data.ratingFrom);
        }
        if(hotel.snStars && $scope.data.stars) {
            $scope.currentSkyNot.starsTo = $scope.data.starsTo;
            $scope.data.starsTo = parseFloat(hotel.snStars);
            $scope.data.starsFrom = ($scope.data.starsFrom > $scope.data.starsTo ? $scope.data.starsTo : $scope.data.starsFrom);
        }
    };

    function resetPreviousDataValues(){
        $scope.currentSkyNot = {};
    }

    $scope.findHotel = function(hotel) {
        if(hotel.score === 0.0) {
            // In skyline
        } else {
            var found = false;
            // Open the correct accordion
            $scope.status.isFirstOpen = false;
            $scope.status.isSecondOpen = true;
            for(var i = 0; i < $scope.notSkyline.length; i++) {
                $scope.changePage(i);
                for(var j = 0; j < $scope.filteredNotSkyline.length; j++) {
                    if($scope.filteredNotSkyline[j] === hotel) {
                        found = true;
                        $scope.currentPage = i;
                        break;
                    }
                }
                if(found) break;
            }
            hotel.highlight = true;
            // TODO: Scroll to hotel
        }
    }
};