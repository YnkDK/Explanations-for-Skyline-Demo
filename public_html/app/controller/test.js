controllers.TestController = function ($scope, $resource) {
    var color_primary = "#428bca";
    var color_success = "#5cb85c";

    function getConfig(cfg, title) {
        cfg.options = {
            chart: {
                type: 'scatter',
                zoomType: 'x'
            }
        };
        cfg.plotOptions = {
            series: {
                lineWidth: 1/*,
                 point: {
                 events: {
                 'click': function() {
                 if (this.series.data.length > 1) this.remove();
                 }
                 }
                 }*/
            }
        };
        cfg.series = [];
        cfg.title = {text: title};
        cfg.xAxis = {title: {text: "x-coordinate"}};
        cfg.yAxis = {title: {text: "y-coordinate"}};

        return cfg
    }

    function loadJson(url, location, color) {
        $resource(url).get({
            // No parameters
        }, function (values) {
            location.push({
                data: values.data,
                name: values.name,
                color: color,
                marker: {
                    symbol: (color === color_primary) ? "diamond" : "circle"
                }
            });
        }, function (error) {
            alert("That's an error. See console for more info.");
            console.log(error);
        });
    }

    $scope.chartConfig = getConfig({}, 'Skyline on correlated data');


    $scope.chartConfig2 = getConfig({}, 'Skyline on anti-correlated data');

    loadJson('json/corr.json', $scope.chartConfig.series, color_primary);
    loadJson('json/corr-skyline.json', $scope.chartConfig.series, color_success);

    loadJson('json/anti-corr.json', $scope.chartConfig2.series, color_primary);
    loadJson('json/anti-corr-skyline.json', $scope.chartConfig2.series, color_success);
};