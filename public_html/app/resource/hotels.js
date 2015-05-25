factories.HotelRange = function($resource) {
    return $resource(backend + 'ranges.php');
};

factories.Hotels = function($resource) {
    return $resource(backend + 'hotels.php');
};

factories.SkyNot = function($resource) {
    return $resource(backend + 'skyNot.php');
};