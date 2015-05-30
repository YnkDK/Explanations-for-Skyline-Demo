controllers.HotelsController = function ($scope, $modal, $timeout, HotelRange, Hotels, SkyNot, $location, $filter) {
    // Define scope variables
    $scope.ranges = {}; // Defines qL and qU for the range query
    $scope.currentSkyNot = {}; // The previous value if BRA/PrioReA tells to change the range query
    $scope.hotels = []; // Index 0 holds all hotels in skyline, while index 1 holds all non-skyline
    $scope.numPerPage = 5; // The number of pages in each accordion
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
                isClickable: false
                //isOpen: false
            });
            $scope.hotels.push({
                hotels: hotels.notSkyline,
                heading: 'Not skyline',
                isClickable: true
                //isOpen: true
            });
            $scope.sortBy('price', true, $scope.hotels[0]);
            $scope.sortBy('price', true, $scope.hotels[1]);
            console.log("Sorted");
            modalInstance.dismiss();

            if($scope.currentHotel) {
                var tmp = $scope.hotels[0].hotels;
                var found = false;
                for(var i = 0; i < tmp.length; i++) {
                    if(tmp[i].id === $scope.currentHotel.id) {
                        tmp[i].highlight = true;
                        moveHighlightedHotelToFrontpage();

                        found = true;
                        break;
                    }
                }
                if(found) {
                    $scope.hotels[0].isOpen = true;
                    $scope.hotels[1].isOpen = false;
                    $scope.currentHotel = undefined;

                } else {
                    alert("DID NOT FIND THE SELECTED HOTEL IN SKYLINE");
                }
            } else {
                $scope.hotels[0].isOpen = false;
                $scope.hotels[1].isOpen = true;
            }
        });
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
        // TODO: Fix this!!
        if(isClickable) {
            $scope.currentHotel = hotel;
            $scope.hotels = [];
            $scope.currentSkyNot = {}; //Reset previous values (red numbers)
            var skyNot = SkyNot.get({id: hotel.id}, function() {
                var ql;
                var epsilon = 0.000000001;
                if($scope.ranges.beach) {
                    ql = parseFloat(skyNot.qL.beach);
                    if(ql != $scope.ranges.beachFrom) {
                        $scope.currentSkyNot.beachFrom = $scope.ranges.beachFrom;
                        $scope.ranges.beachFrom = ql + epsilon;
                    }
                }
                if($scope.ranges.price) {
                    ql = parseFloat(skyNot.qL.price);
                    if(ql != $scope.ranges.priceFrom) {
                        $scope.currentSkyNot.priceFrom = $scope.ranges.priceFrom;
                        $scope.ranges.priceFrom = ql + epsilon;
                    }
                }
                if($scope.ranges.downtown) {
                    ql = parseFloat(skyNot.qL.downtown);
                    if(ql != $scope.ranges.downtownFrom) {
                        $scope.currentSkyNot.downtownFrom = $scope.ranges.downtownFrom;
                        $scope.ranges.downtownFrom = ql + epsilon;
                    }
                }
                if($scope.ranges.wifi) {
                    ql = parseFloat(skyNot.qL.wifi);
                    if(ql != $scope.ranges.wifiTo) {
                        $scope.currentSkyNot.wifiTo = $scope.ranges.wifiTo;
                        $scope.ranges.wifiTo = ql - epsilon;
                    }
                }
                if($scope.ranges.rating)  {
                    ql = parseFloat(skyNot.qL.rating);
                    if(ql != $scope.ranges.ratingFrom) {
                        $scope.currentSkyNot.ratingTo = $scope.ranges.ratingTo;
                        $scope.ranges.ratingTo = ql - epsilon;
                    }
                }
                if($scope.ranges.roomsize) {
                    ql = parseFloat(skyNot.qL.roomsize);
                    if(ql != $scope.ranges.roomsizeTo) {
                        $scope.currentSkyNot.roomsizeTo = $scope.ranges.roomsizeTo;
                        $scope.ranges.roomsizeTo = ql - epsilon;
                    }
                }
                if($scope.ranges.aros) {
                    ql = parseFloat(skyNot.qL.aros);
                    if(ql != $scope.ranges.arosTo) {
                        $scope.currentSkyNot.arosTo = $scope.ranges.arosTo;
                        $scope.ranges.arosTo = ql - epsilon;
                    }
                }
            });
        }
        console.log(hotel);
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

    function highlight(hotels) {
        for(var i = 0; i < hotels.length; i++) {
            if(hotels[j].id === $scope.currentHotel.id) {
                hotels[j].highlight = true;
                return true;
            }
        }
        return false;
    }

    function moveHighlightedHotelToFrontpage(){
        var tempH;

        for(var j = 0; j < $scope.hotels[0].filtered.length; j++){
            //console.log($scope.hotels[0].filtered[j].id + " vs " + $scope.currentHotel.id);
            if($scope.hotels[0].filtered[j].id === $scope.currentHotel.id){
                tempH = $scope.hotels[0].filtered[0];
                $scope.hotels[0].filtered[0] = $scope.hotels[0].filtered[j];
                $scope.hotels[0].filtered[j] = tempH;
            }
        }
    }


    // Start by getting the extreme ranges
    fetchRanges();
    $timeout(function() {
        if(modalInstance) {
            modalInstance.dismiss();
        }
    }, 1000);

    $scope.$watchGroup('ranges', function() {
        console.log("CHANGED");
    }, true)
};

Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};