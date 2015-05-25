factories.HotelRange = function($resource) {
    return $resource(backend + 'ranges.php');
};

factories.Hotels = function($resource) {
    return $resource(backend + 'hotels.php');
};