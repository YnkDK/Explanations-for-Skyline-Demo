controllers.HotelsController = function ($scope, $modal, $timeout, HotelRange, Hotels, $location, $filter) {
    // Define scope variables
    $scope.ranges = {}; // Defines qL and qU for the range query
    $scope.hotels = []; // Index 0 holds all hotels in skyline, while index 1 holds all non-skyline
    $scope.numPerPage = 5; // The number of pages in each accordion
    $scope.stars = [1, 2, 3, 4, 5]; // The maximum number stars allowed
    // Define scope functions
    /**
     * Fetches all hotels within the given ranges, dividing them into skyline and not-skyline
     */
    $scope.query = function() {
        loading();
        $scope.hotels = [];
        var hotels = Hotels.get($scope.ranges, function() {

            $scope.hotels.push({
                hotels: hotels.skyline,
                heading: 'Skyline',
                isClickable: false,
                isOpen: false
            });
            $scope.hotels.push({
                hotels: hotels.notSkyline,
                heading: 'Not skyline',
                isClickable: true,
                isOpen: true
            });
            $scope.sortBy('price', true, $scope.hotels[0]);
            $scope.sortBy('price', true, $scope.hotels[1]);
            modalInstance.dismiss();

            if($scope.currentHotel) {
                // TODO: Locate the hotel and show it
            }
        })
        console.log("hotels: " + hotels);
    };

    /**
     * Sorts the hotels found in the wanted accordion on the given attribute in the given order
     *
     * @param attribute
     * @param reverse
     * @param acc
     */
    $scope.sortBy = function(attribute, reverse, acc) {
        acc.hotels = $filter('orderBy')(acc.hotels, attribute, reverse);
        $scope.order = attribute; // TODO: Make this pretty
        $scope.changePage(1, acc);
    };

    /**
     * Changes the page in a accordion
     *
     * @param newPage
     * @param acc
     */
    $scope.changePage = function(newPage, acc) {
        $scope.currentPage = newPage;
        if(acc.hotels.length > 0) {
            var begin = ((newPage - 1) * $scope.numPerPage)
                , end = begin + $scope.numPerPage;

            acc.filtered = acc.hotels.slice(begin, end);
        }
    };

    /**
     * Runs the sky-not algorithm for the clicked hotel,
     * sets the new Query data
     *
     * @param hotel
     * @param isClickable
     */
    $scope.skyNot = function(hotel, isClickable) {
        if(isClickable) {
            $scope.currentHotel = hotel;
            $scope.hotels = [];
            // TODO: Fetch new Query data from backend
        }
    };

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
            keyboard: false
        });
    }

    /**
     * Fetches the default ranges from the server
     */
    function fetchRanges() {
        loading();
        var ranges = HotelRange.get({}, function() {
            $scope.ranges = ranges.data;

            $scope.ranges.priceFrom = parseInt(Math.floor(ranges.data.priceFrom / 10) * 10);
            $scope.ranges.priceTo = parseInt(Math.ceil(ranges.data.priceTo / 10) * 10);

            $scope.ranges.beachFrom = Math.floor(ranges.data.beachFrom);
            $scope.ranges.beachTo = Math.ceil(ranges.data.beachTo);

            $scope.ranges.downtownFrom = Math.floor(ranges.data.downtownFrom);
            $scope.ranges.downtownTo = Math.ceil(ranges.data.downtownTo);

            modalInstance.dismiss();
        });
    }

    // Start by getting the extreme ranges
    fetchRanges();

};