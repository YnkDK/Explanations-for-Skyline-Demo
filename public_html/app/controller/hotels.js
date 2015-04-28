controllers.HotelsController = function ($scope) {
  $scope.oneAtATime = true;

    $scope.stars = [
        1,2,3,4,5,6,7,8,9,10
    ];

    $scope.inSkyline = [
        {
            price: 200,
            beach: 0.10,
            downtown: 0.8,
            pools: 3,
            rating: 4.7,
            stars: 5
        },
        {
            price: 150,
            beach: 0.10,
            downtown: 1.1,
            pools: 5,
            rating: 4.9,
            stars: 4
        }
    ];
  $scope.status = {
    isFirstOpen: true,
    isFirstDisabled: false
  };
};