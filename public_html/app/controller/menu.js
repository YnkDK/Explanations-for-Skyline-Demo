controllers.MenuController = function($scope, $location) {
    $scope.page_name = "Sky-not query";
    $scope.navigation = [
        {
            name: 'Start',
            href: '#/frontpage'
        },
        {
            name: 'Hotels',
            href: '#/hotels'
        },
        {
            name: 'Hotels (map)',
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