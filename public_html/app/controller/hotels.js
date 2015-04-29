controllers.HotelsController = function ($scope, $resource, $location) {
  $scope.oneAtATime = true;
    var url = "http://" + $location.host() + ":" + $location.port() + '/Explanations-for-Skyline-Demo/backend/hotels.php';
    $scope.stars = [
        1,2,3,4,5,6,7,8,9,10
    ];

    $scope.inSkyline = [];
    $scope.notSkyline = [];
    $scope.data = {};


    $scope.query = function() {
        $resource(url).get(
            $scope.data
        , function (values) {
            $scope.inSkyline = values.skyline;
                $scope.notSkyline = values.notSkyline;
                $scope.status.isSecondOpen = true;
        }, function (error) {
            alert("That's an error. See console for more info.");
            console.log(error);
        });
    };

  $scope.status = {
    isFirstOpen: false,
      isSecondOpen: false
  };
};