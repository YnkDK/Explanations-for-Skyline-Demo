<?php
require_once "PointPaper.php";

define("EPSILON", 0.000000001);

class PrioReAPaper {
    public function query(array &$points, PointPaper $query, PointPaper $lowerBound) {
        if(count($points) === 0) {
            throw new Exception("You must query on some points");
        }
        $D = range(0, $query->getNumberOfDimensions()-1);
        $C = $this->getCloseDoms($points, $query, $lowerBound);
        return $this->algorithm($C, $query, $lowerBound, $D);
    }

    private function getCloseDoms(&$points, $q, $qL) {
        // TODO: Make sure that this is correct
        $closeDominance = array();
        foreach($points as $p) {
            if($p !== $q && $this->dominateLeft($qL, $p) && $this->dominateLeft($p, $q)) {
                $closeDominanceSize = count($closeDominance);
                for($j = 0; $j < $closeDominanceSize; $j++) {
                    $dtRes = $this->dominanceTest($p, $closeDominance[$j]);
                    if($dtRes === true) {
                        break;
                    } elseif($dtRes === false) {
                        unset($closeDominance[$j]);
                    }
                }
                if($j >= $closeDominanceSize) {
                    $closeDominance[$j] = $p;
                }
            }
        }
        return $closeDominance;
    }

    private function algorithm(array &$C, PointPaper &$p, PointPaper &$qL, array &$D) {
        $size = count($C);
        if($size === 0) {
            return $qL;
        }

        $best = $p;
        $D = $this->sortD($D, $p, $qL);
        foreach($D as $d) {
            $S = $this->sortC($d, $C, $qL);
            $maxMin = 0.;
            for($i = 0; $i < $size; $i++) {
                /* @var PointPaper */
                $s = $S[$i];
                if($s->attributes[$d] - $qL->attributes[$d] + $maxMin < $qL->dist($best)) {
                    $dim_left = $D;
                    unset($dim_left[array_search($d, $dim_left)]);
                    $rec = $this->algorithm(
                        array_slice($S, 0, $i), // TODO: Check if it should be $i-1
                        $qL,
                        $p,
                        $dim_left
                    );
                    if($qL->dist($rec) + $s->attributes[$d] - $qL->attributes[$d] < $qL->dist($best)) {
                        $best = $rec;
                        $best->attributes[$d] = $s->attributes[$d];
                    } elseif($qL->dist($rec) >= $qL->dist($best)) {
                        break;
                    }
                } elseif($maxMin >= array_sum($best->attributes)) {
                    break;
                } else {

                }
                $minDiff = $this->minDiff($s->attributes, $qL->attributes);
                if($maxMin < $minDiff) {
                    $maxMin = $minDiff;
                }
            }
        }
        return $best;
    }


    /**
     * Corresponds to line 4, i.e. Sort d in D by p[d] - qL[d], ascending
     *
     * @param $D array
     * @param $p PointPaper
     * @param $qL PointPaper
     * @return array
     */
    private function sortD(array &$D, PointPaper &$p, PointPaper &$qL) {
        $tmp = array();
        // Find p[d] - qL[d] for all d in D
        foreach($D as $d) {
            $tmp[$d] = $p->attributes[$d] - $qL->attributes[$d];
        }
        // Arrange from smallest to largest
        // The function asort sorts the values and keeps the keys
        asort($tmp, SORT_NUMERIC);
        // Prepare the result
        $res = array();
        foreach($tmp as $d => $_) {
            array_push($res, $d);
        }
        return $res;
    }

    /**
     * Corresponds to line 6, i.e. Sort s in S by s[d] - qL[d], descending
     *
     * @param $d number
     * @param array $p
     * @param PointPaper $qL
     * @return array
     */
    private function sortC($d, array $p, PointPaper $qL) {
        $qLD = $qL->attributes[$d];
        $tmp = array();
        for($i = 0; $i < count($p); $i++) {
            $tmp[$i] = $p[$i]->attributes[$d] - $qLD;
        }
        // Arrange from largest to smallest
        arsort($tmp, SORT_NUMERIC);

        $res = array();
        foreach($tmp as $idx => $_) {
            array_push($res, $p[$idx]);
        }
        return $res;
    }

    /**
     * Computes a1 - a2 for all a1 in arr1 and for all a2 in arr2
     * and returns the minimum
     *
     * @param array $arr1
     * @param array $arr2
     * @return float|number
     */
    private function minDiff(array $arr1, array $arr2) {
        $min = INF;
        for($i = 0; $i < count($arr1); $i++) {
            $tmp = $arr1[$i] - $arr2[$i];
            if($tmp < $min) {
                $min = $tmp;
            }
        }
        return $min;
    }

    private function dominateLeft(PointPaper &$p1, PointPaper &$p2) {
        // TODO: Make sure that this is correct
        $numDims = $p1->getNumberOfDimensions();
        for($i = 0; $i < $numDims && $p1->attributes[$i] <= $p2->attributes[$i]; $i++);
        if($i < $numDims) {
            return false;
        }
        for($i = 0; $i < $numDims; $i++) {
            if($p1->attributes[$i] < $p2->attributes[$i]) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns true if p2 dominates p1, false if p1 dominates p2 and
     * NULL if they are incomparable
     *
     * @param PointPaper $p1
     * @param PointPaper $p2
     * @return bool|null
     */
    private function dominanceTest(PointPaper $p1, PointPaper $p2) {
        // TODO: Make sure that this is correct
        $p1Better = false;
        $p2Better = false;
        for($i = 0; $i < $p1->getNumberOfDimensions(); $i++) {
            if($p1->attributes[$i] < $p2->attributes[$i]) {
                $p1Better = true;
            } elseif($p2->attributes[$i] < $p1->attributes[$i]) {
                $p2Better = true;
            }

            if($p1Better && $p2Better) {
                return NULL;
            }
        }
        if(!$p1Better && $p2Better) {
            return true;
        }
        if(!$p2Better && $p1Better) {
            return false;
        }
        return NULL;
    }
}

// Run the following if we access this file
// Corresponds to Python's if __name__ == '__main__:'
if (!debug_backtrace()) {
    echo "<html><body><pre>";
    $points = array(
        new PointPaper(array(1, 5)),
        new PointPaper(array(1.5, 4)),
        new PointPaper(array(3, 3)),
        new PointPaper(array(4.5, 2.5)),
        new PointPaper(array(6.5, 2)),
        new PointPaper(array(4.0, 4.0))
    );

    $qL = new PointPaper(array(0.5, 0.5));

    $alg = new PrioReAPaper();
    foreach($points as $p) {
        printf("Query: ");
        print_r($p);
        print_r("Solution: ");
        print_r($alg->query($points, $p, $qL));
        printf("=================================\n");
    }

    echo "</pre></body></html>";
}