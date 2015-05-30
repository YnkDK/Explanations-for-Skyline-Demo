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
                    var px = W[k][0], py = W[k][1];
                    if(cx < px && cy < py) { // if c is strictly dominated by p
                        add = false;
                        break;
                    } else if(px < cx && py < cy) { // if p is strictly dominated by c
                        console.log(W[k]);
                        W[k] = undefined;
                    }
                }
                if(add) {
                    console.log([cx, cy]);
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

    return [];
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

function sortD(D, p, qL) {
    // TODO: Implement this
    return [];
}

function sortS(S, qL) {
    // TODO: Implement this
    return [];
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