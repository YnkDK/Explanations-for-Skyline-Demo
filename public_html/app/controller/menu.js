controllers.MenuController = function($scope, $location) {
    $scope.page_name = "The sky-not query";
    $scope.navigation = [
        {
            name: '2D Demo',
            href: '#/frontpage'
        },
        {
            name: 'Hotel guest',
            href: '#/hotels'
        },
        {
            name: 'Hotel manager',
            href: '#/hotels-map'
        },
        {
            name: 'License',
            href: '#/license'
        }
    ];

    $scope.isActive = function(route) {
        return route.substring(1) === $location.path();
    };
};