/***
 *
 */

/**
 * Computes the set C which contains all points which is closely dominated by p,
 * corresponding to Definition 6
 *
 * This corresponds to line 1-10 of the BRA algorithm
 * @param p A point on the form [x, y]
 * @param S The
 * @returns {Array}
 */
function closeDominance(p, S) {
    var C = [];
    for(var i = 0; i < S.length; i++) {
        var s = S[i];
        // If p is added, then nothing closely dominates p
        if(s === p) continue;

        if(dominanceOrEqual(s, p)) {
            var add = true;
            for(var j = 0; j < C.length; j++) {
                if(C[j] === undefined) continue;
                if(dominance(s, C[j])) {
                    add = false;
                    break
                } else if(dominance(C[j], s)) {
                    // Setting an entry to undefined corresponds
                    // to remove it from the set (removed in the end)
                    C[j] = undefined;
                }
            }
            if(add) {
                C.push(S[i]);
            }
        }
    }
    return C.filter(function(n) { return n !== undefined });
}

/**
 * Implementation of line 11-20 of BRA. The first parameter must be
 * the return value of closeDominance(p, S)
 *
 * @param C All points closely dominated by p
 * @param qL The lower corner
 * @returns {Array} The point corresponding to qL'
 */
function boundingRectangleAlgorithm(C, qL) {
    // If no points was closely dominated by p, then it
    // was already in the skyline, thus qL is the best option
    if(C.length === 0) {
        return qL;
    }
    var W = [];
    for(var i = 0; i < C.length; i++) {
        for(var j = i; j < C.length; j++) {
            var cx = Math.min(C[i][0], C[j][0]);
            var cy = Math.min(C[i][1], C[j][1]);
            var corners = [
                [qL[0]   , C[i][1]], // Projection of i'th point to qL
                [C[i][0] , qL[1]],   // Projection of i'th point to qL
                [qL[0]   , C[j][1]], // Projection of j'th point to qL
                [C[j][0] , qL[1]],   // Projection of j'th point to qL
                [cx      , cy]       // Lower corner of the i'th and j'th point
            ];
            for(var l = 0; l < 5; l++) {
                cx = corners[l][0];
                cy = corners[l][1];
                var add = true;
                for(var k = 0; k < W.length; k++) {
                    if(W[k] === undefined) continue;
                    var px = W[k][0], py = W[k][1];
                    if(cx < px && cy < py) { // if c is strictly dominated by p
                        add = false;
                        break;
                    } else if(px < cx && py < cy) { // if p is strictly dominated by c
                        W[k] = undefined;
                    }
                }
                if(add) {
                    W.push([cx, cy]);
                }
            }
        }
    }
    // Actual removal of points
    W = W.filter(function(n) { return n !== undefined });
    // Sort W by ascending proximity to qL
    W.sort(function(a, b) {
        return Math.abs(a[0]-qL[0])+ Math.abs(a[1]-qL[1]) > Math.abs(b[0]-qL[0]) + Math.abs(b[1]-qL[1]);
    });
    // Get the closest
    return W[0]
}

/**
 *
 * @param C
 * @param p
 * @param qL
 * @param D
 * @returns {Array}
 */
function prioritizedRecursionAlgorithm(C, p, qL, D) {
    if(C.length === 0) {
        return qL;
    }
    var best = p;
    // Sort d in D by p[d] - qL[d], ascending
    if(D.length === 2) {
        if(p[0]-qL[0] > p[1]-qL[1]) {
            D[0] = 1;
            D[1] = 0;
        } else {
            D[0] = 0;
            D[1] = 1;
        }
    }
    for(var i = 0; i < D.length; i++) {
        var d = D[i];
        sortS(C, i, qL);
        var maxMin = 0;
        for(var j = 0; j < C.length; j++) {
            var s = C[j];
            if(s[d] - qL[d] + maxMin < manhattan(qL, best)) {
                // Remove the current dimension from D
                var newD;
                if(D.length == 2) {
                    if(d == 0) {
                        newD = [1];
                    } else {
                        newD = [0];
                    }
                } else {
                    newD = [];
                }
                var rec = prioritizedRecursionAlgorithm(C.slice(0, j), p, qL, newD);
                if(manhattan(qL, rec) + s[d] - qL[d] < manhattan(qL, best)) {
                    best = rec;
                    rec[d] = s[d];
                } else if(manhattan(qL, rec) >= manhattan(qL, best)) {
                    break;
                }
            } else if(maxMin >= best[0] + best[1]) {
                break;
            } else {
                // Do nothing
            }
            var min = minD(s, qL);
            if(maxMin < min) {
                maxMin = min;
            }
        }
    }
    console.log(best);
    return best;
}

/**
 * Sort S by s[d] - qL[d], descending
 * @param C
 * @param d
 * @param qL
 */
function sortS(C, d, qL) {
    var tmp = [];
    for(var i = 0; i < C.length; i++) {
        tmp.push({
            score: C[i][d] - qL[d],
            coordinate: C[i]
        });
    }
    tmp.sort(function(a, b) {
        return a.score - b.score;
    });
    for(i = 0; i < C.length; i++) {
        C[i] = tmp[i].coordinate;
    }
}

/**
 * Either s dominates t or they are equal
 *
 * @param s A point
 * @param t A point
 * @returns {boolean} True iff s dominates t _or_ s and t are equal
 */
function dominanceOrEqual(s, t) {
    return dominance(s, t) || (s[0] === t[0] && s[1] === t[1]);
}

/**
 * Implementation of Definition 1.
 *
 * @param s A point
 * @param t A point
 * @returns {boolean} True iff s dominates t
 */
function dominance(s, t) {
    var sx = s[0],
        sy = s[1],
        tx = t[0],
        ty = t[1];
    return sx <= tx && sy <= ty && (sx < tx || sy < ty);
}

/**
 *
 * @param a {Array}
 * @param b {Array}
 * @returns {number}
 */
function manhattan(a, b) {
    return Math.abs(a[0]-b[0]) + Math.abs(a[1]-b[1]);
}

/**
 *
 * @param s {Array}
 * @param qL {Array}
 * @returns {number}
 */
function minD(s, qL) {
    return Math.min(s[0]-qL[0], s[1]-qL[1]);
}