<?php
require_once('PointPaper.php');

class BRA {

    public function query(&$points, $p, $qL) {
        $C = $this->closeDominance($points, $p); // Line 1-10
        if(count($C) === 0) {
            return $qL;
        }
        $W = array();
        foreach($this->getCorners($C) as $c) {
            $add = true;
            foreach($W as $p) {
                if($this->strictlyDominated($c, $p)) {
                    $add = false;
                    break;
                } elseif($this->strictlyDominated($p, $c)) {
                    $W = array_diff($W, [$p]);
                }
            }
            if($add) {
                array_push($W, $c);
            }
        }
        $bestDist = INF;
        $w0 = NULL;
        foreach($W as $w) {
            /* @var PointPaper w */
            $dist = $w->dist($qL);
            if($dist < $bestDist) {
                $bestDist = $dist;
                $w0 = $w;
            }
        }
        return $w0;
    }

    public function closeDominance(&$points, $p) {
        $C = array();
        foreach($points as $s) {
            if($p === $s) {
                continue;
            }
            $add = true;
            if($this->dominanceOrEqual($s, $p)) {
                foreach($C as $c) {
                    if($this->dominance($s, $c)) {
                        $add = false;
                        break;
                    } elseif($this->dominance($c, $s)) {
                        $C = array_diff($C, array($c));
                    }
                }
                if($add) {
                    array_push($C, $s);
                }
            }
        }
        return array_values($C);
    }

    public function dominanceOrEqual(PointPaper &$p1, PointPaper &$p2) {
        for($i = 0; $i < $p1->getNumberOfDimensions(); $i++) {
            if($p1->attributes[$i] > $p2->attributes[$i]) {
                return false;
            }
        }
        return true;
    }

    public function dominance(PointPaper &$p1, PointPaper &$p2) {
        $atLeastOneStrict = false;
        for($i = 0; $i < $p1->getNumberOfDimensions(); $i++) {
            if($p1->attributes[$i] > $p2->attributes[$i]) {
                return false;
            } else if ($p1->attributes[$i] < $p2->attributes[$i]){
                $atLeastOneStrict = true;
            }
        }
        if($atLeastOneStrict)
            return true;
        return false;
    }

    public function strictlyDominated(PointPaper $p1, PointPaper $p2) {
        for($i = 0; $i < $p1->getNumberOfDimensions(); $i++) {
            if($p1->attributes[$i] >= $p2->attributes[$i]) {
                return false;
            }
        }
        return true;
    }

    private function getCorners($C) {
        if(count($C) === 1) {
            return $C;
        }
        $combinations = array();
        $numDim = $C[0]->getNumberOfDimensions();
        for($r = 1; $r <= $numDim; $r++) {
            $combinations = array_merge($combinations, $this->getCombinations($C, $r));
        }
        $corners = array();
        foreach($combinations as $c) {
            $min = array_fill(0, $numDim, INF);
            foreach($c as $p) {
                for($d = 0; $d < $numDim; $d++) {
                    if($p->attributes[$d] < $min[$d]) {
                        $min[$d] = $p->attributes[$d];
                    }
                }
            }
            array_push($corners, new PointPaper($min));
        }
        return $corners;
    }

    function getCombinations($base,$n){

        $baselen = count($base);
        if($baselen == 0){
            return;
        }
        if($n == 1){
            $return = array();
            foreach($base as $b){
                $return[] = array($b);
            }
            return $return;
        }else{
            //get one level lower combinations
            $oneLevelLower = $this->getCombinations($base,$n-1);

            //for every one level lower combinations add one element to them that the last element of a combination is preceeded by the element which follows it in base array if there is none, does not add
            $newCombs = array();

            foreach($oneLevelLower as $oll){

                $lastEl = $oll[$n-2];
                $found = false;
                foreach($base as  $key => $b){
                    if($b == $lastEl){
                        $found = true;
                        continue;
                        //last element found

                    }
                    if($found == true){
                        //add to combinations with last element
                        if($key < $baselen){

                            $tmp = $oll;
                            $newCombination = array_slice($tmp,0);
                            $newCombination[]=$b;
                            $newCombs[] = array_slice($newCombination,0);
                        }

                    }
                }

            }

        }

        return $newCombs;
    }


}

// Run the following if we access this file
// Corresponds to Python's if __name__ == '__main__:'
if (!debug_backtrace()) {
    echo "<html><body><pre>";
    $points = array(
        new PointPaper(array(3.5, 4)),
        new PointPaper(array(3.7, 2))
    );

    $bra = new BRA();
    print_r($bra->query($points, new PointPaper(array(4, 4)), new PointPaper(array(0, 0))));
    echo "</pre></body></html>";
}