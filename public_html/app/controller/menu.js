controllers.MenuController = function($scope, $location) {
    $scope.page_name = "Sky-not query";
    $scope.navigation = [
        {
            name: 'Start',
            href: '#/frontpage'
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