controllers.TestController = function ($scope, $timeout) {
    var canvases;
    function init() {
        $scope.seed = 'Your random text seed';
        $scope.points = [];
        $scope.currentCanvas = 0;
        $scope.numPoints = 100;
        $scope.cGraph = undefined;

        canvases = $scope.canvases = [
            {
                active: false,
                id: "firstCanvas",
                isDone: false
            },
            {
                active: false,
                id: "secondCanvas",
                isDone: false,
                qL: undefined,
                qU: undefined
            },
            {
                active: false,
                id: "thirdCanvas",
                isDone: false
            },
            {
                active: false,
                id: "fourthCanvas",
                isDone: false
            }
        ];
    }
    init();

    $scope.next = function() {
        $scope.currentCanvas++;
        canvases[$scope.currentCanvas-1].active = false;
        canvases[$scope.currentCanvas-1].isDone = true;
        $timeout(function() {
            canvases[$scope.currentCanvas].active = true;
            handleNewCanvas(canvases[$scope.currentCanvas]);
        }, 100);
    };

    $scope.genData = function(n, seed) {
        Math.seedrandom(seed);
        var max_x = $scope.cGraph.width - $scope.cGraph.offset;
        var max_y = $scope.cGraph.height - $scope.cGraph.offset;
        for(var i = 0; i < n; i++) {
            var x = Math.random() * max_x,
                y = Math.random() * max_y;
            $scope.points.push([
                x,
                y
            ]);
            $scope.cGraph.fillPoint(x, y);
        }

    };
    function bnl(S) {
        var bad = [],
            skyline = [];
        for(var i = 0; i < S.length; i++) {
            var x = S[i][0], y = S[i][1];
            for(var j = 0; j < S.length; j++) {
                var x1 = S[j][0], y1 = S[j][1];
                if(x1 <= x && y1 <= y && (x1 < x || y1 < y)) {
                    bad.push(i);
                }
            }
        }
        bad = bad
            .sort(function(a,b){
                return a - b;
            })
            .reduce(function(a,b){
                if (a.slice(-1)[0] !== b) a.push(b); // slice(-1)[0] means last item in array without removing it (like .pop())
                return a;
            },[]); // this empty array becomes the starting value for a


        for(i = 0; i < S.length; i++) {
            if(i === bad[0]) {
                bad.shift();
                continue;
            }
            skyline.push(S[i]);
        }

        skyline.sort(function(a, b) {
            return a[0] - b[0];
        });
        return skyline;
    }

    function drawSkyline(skyline) {
        var context = $scope.cGraph.context,
            i;
        context.fillStyle = "green";
        context.beginPath();
        context.setLineDash([1, 1]);
        moveTo(skyline[0][0], skyline[0][1]);
        for(i = 0; i < skyline.length; i++) {
            $scope.cGraph.lineTo(skyline[i][0], skyline[i][1]);
        }
        context.stroke();
        for(i = 0; i < skyline.length; i++) {
            $scope.cGraph.fillPoint(skyline[i][0], skyline[i][1]);
        }
    }

    function drawBound(qL, qU) {
        var g = $scope.cGraph;
        g.context.setLineDash([3, 3]);
        g.context.beginPath();
        g.moveTo(qL[0], qL[1]);
        g.lineTo(qL[0], qU[1]);
        g.lineTo(qU[0], qU[1]);
        g.lineTo(qU[0], qL[1]);
        g.lineTo(qL[0], qL[1]);
        g.context.stroke();


    }

    $scope.setBounds = function(e) {
        var g = $scope.cGraph;
        var coordinate = g.getMouseClick(e);
        if(canvases[1].qL === undefined) {
            g.context.fillStyle = "green";
            g.context.font = "8px sans-serif";
            g.context.textAlign = "right";

            var qL = canvases[1].qL = coordinate;
            g.fillPoint(qL[0], qL[1]);
            g.fillText("qL", qL[0] - 2.5, qL[1]);
            $scope.$apply();
        } else if(canvases[1].qU === undefined) {
            if(coordinate[0] > canvases[1].qL[0] && coordinate[1] > canvases[1].qL[1]) {
                $scope.S = [];
                var qU = canvases[1].qU = coordinate;
                qL = canvases[1].qL;
                g.context.fillStyle = "green";
                g.context.font = "8px sans-serif";
                g.context.textAlign = "left";
                g.fillPoint(qU[0], qU[1]);
                g.fillText("qU", qU[0] + 2.5, qU[1]);
                drawBound(qL, qU);


                $scope.$apply();
            }
        }
    };

    $scope.chooseP = function (e) {
        var S = canvases[2].S;
        var coord = $scope.cGraph.getMouseClick(e);
        var minDist = Infinity;
        var x, y, dist, nearest = undefined;
        for(var i = 0; i < S.length; i++) {
            x = S[i][0];
            y = S[i][1];
            dist = Math.sqrt(Math.pow(x-coord[0], 2) + Math.pow(y - coord[1], 2));
            if(dist < 25 && dist < minDist) {
                minDist = dist;
                nearest = S[i];
            }
        }
        canvases[2].p = nearest;

        $scope.cGraph.context.fillStyle = "#FF33FF";
        $scope.cGraph.fillPoint(nearest[0], nearest[1]);
        var C = canvases[2].C = getCloseDominance(nearest, canvases[2].S);
        $scope.cGraph.context.beginPath();
        for(i = 0; i < C.length; i++) {
            var fromx = C[i][0],
                fromy = C[i][1];
            $scope.cGraph.fillArrow(fromx, fromy, nearest[0], nearest[1]);
        }


        $scope.cGraph.context.strokeStyle = "#FF33FF";
        $scope.cGraph.context.lineWidth = 0.5;
        $scope.cGraph.context.setLineDash([0, 0]);
        $scope.cGraph.context.stroke();
        $scope.$apply();
    };

    function getCloseDominance(nearest, S) {
        var C = [];
        var tx = nearest[0], ty = nearest[1];
        for(var i = 0; i < S.length; i++) {
            var sx = S[i][0], sy = S[i][1];
            if(sx == tx && sy == ty) continue;
            if((sx <= tx && sy <= ty && (sx < tx || sy < ty)) || (sx == tx && sy == ty)) {
                var add = true;
                for(var j = 0; j < C.length; j++) {
                    if(C[j] === undefined) continue;
                    var cx = C[j][0], cy = C[j][1];
                    if((sx <= cx && sy <= cy && (sx < cx || sy < cy))) {
                        add = false;
                        break
                    } else if(cx <= sx && cy <= sy && (cx < sx || cy < sy)) {
                        C[j] = undefined;
                    }
                }
                if(add) {
                    C.push(S[i]);
                }
            }
        }
        C = C.filter(function(n) { return n !== undefined });
        return C;
    }

    function boundingRectangleAlgorithm(C, qL) {
        if(C.length === 0) {
            return qL;
        }
        var W = [];
        for(var i = 0; i < C.length; i++) {
            for(var j = i; j < C.length; j++) {
                var cx = Math.min(C[i][0], C[j][0]);
                var cy = Math.min(C[i][1], C[j][1]);
                var corners = [[cx, cy], [qL[0], cy], [cx, qL[1]]];
                for(var l = 0; l < 3; l++) {
                    cx = corners[l][0];
                    cy = corners[l][1];
                    var add = true;
                    for(var k = 0; k < W.length; k++) {
                        if(W[k] === undefined) continue;
                        var px = W[k][0], py = W[k][1];
                        if(cx < px && cy < py) {
                            add = false;
                            break;
                        } else if(px < cx && py < cy) {
                            W[k] = undefined;
                        }
                    }
                    if(add) {
                        W.push([cx, cy]);
                    }
                }
            }
        }

        W = W.filter(function(n) { return n !== undefined });
        W.sort(function(a, b) {
            return Math.abs(a[0]-qL[0])+ Math.abs(a[1]-qL[1]) < Math.abs(b[0]-qL[0]) + Math.abs(b[1]-qL[1]);
        });
        return W[0]
    }

    function handleNewCanvas(c) {
        console.log(c);
        var canvas = document.getElementById(c.id);
        if(canvas === null) {
            console.log("Canvas was null");
            return;
        }
        var g = $scope.cGraph = Graph;
        g.init(canvas);
        g.drawGrid();
        if(c.id === "secondCanvas") {
            g.context.fillStyle = "black";
            for(var i = 0; i < $scope.points.length; i++) {
                var x = $scope.points[i][0], y = $scope.points[i][1];
                g.fillPoint(x, y);
            }
            g.canvas.addEventListener("click", $scope.setBounds, false);
        }
        if(c.id === "thirdCanvas") {
            c.S = [];
            c.notS = [];
            var qL = canvases[1].qL;
            var qU = canvases[1].qU;
            for(i = 0; i < $scope.points.length; i++) {
                var current = $scope.points[i];
                if(qL[0] < current[0] && qL[1] < current[1] && current[0] < qU[0] && current[1] < qU[1]) {
                    c.S.push(current);
                    g.context.fillStyle = "black";
                } else {
                    c.notS.push(current);
                    g.context.fillStyle = "#ccc";
                }
                g.fillPoint(current[0], current[1]);
            }
            drawBound(qL, qU);
            g.context.fillStyle = "green";
            g.context.font = "8px sans-serif";
            g.context.textAlign = "right";
            g.fillPoint(qL[0], qL[1]);
            g.fillText("qL", qL[0] - 2.5, qL[1]);
            canvases[2].skyline = bnl(canvases[2].S);
            drawSkyline(canvases[2].skyline);
            g.canvas.addEventListener("click", $scope.chooseP, false);
        } else if(c.id == "fourthCanvas") {
            qL = canvases[1].qL;
            drawBound(qL, canvases[1].qU);
            g.context.fillStyle = "green";
            g.context.font = "8px sans-serif";
            g.context.textAlign = "right";
            g.fillPoint(qL[0], qL[1]);
            g.fillText("qL", qL[0] - 2.5, qL[1]);
            g.context.fillStyle = "#ccc";
            for(i = 0; i < canvases[2].notS.length; i++) {
                current = canvases[2].notS[i];
                g.fillPoint(current[0], current[1]);
            }
            qL = boundingRectangleAlgorithm(canvases[2].C, canvases[2].p);

            qU = canvases[1].qU;
            drawBound(qL, qU);
            g.context.fillStyle = "#FF33FF";
            g.fillPoint(qL[0], qL[1]);
            g.fillText("qL", qL[0] - 2.5, qL[1]);
            g.context.fillStyle = "green";
            g.context.font = "8px sans-serif";
            g.context.textAlign = "left";
            g.fillPoint(qU[0], qU[1]);
            g.fillText("qU", qU[0] + 2.5, qU[1]);
            c.S = [];
            c.notS = [];
            for(i = 0; i < canvases[2].S.length; i++) {
                current = canvases[2].S[i];
                if(qL[0] < current[0] && qL[1] < current[1] && current[0] < qU[0] && current[1] < qU[1]) {
                    c.S.push(current);
                    g.context.fillStyle = "black";
                } else {
                    c.notS.push(current);
                    g.context.fillStyle = "#ccc";
                }
                g.fillPoint(current[0], current[1]);
            }
            var skyline = bnl(c.S);
            drawSkyline(skyline);
            g.context.fillStyle = "#FF33FF";
            g.fillPoint(canvases[2].p[0], canvases[2].p[1]);
        }
    }

    $scope.$watch(function() {
        return canvases[1].qL;
    }, function() {
        console.log(canvases);
    });

    $timeout(function() {
        canvases[$scope.currentCanvas].active = true;
        handleNewCanvas(canvases[$scope.currentCanvas]);
    }, 100);
};