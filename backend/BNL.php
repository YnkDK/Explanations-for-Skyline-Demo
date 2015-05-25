<?php
require_once('PointPaper.php');

class BNL {
    public function query(&$points) {
        $bad = array();
        foreach($points as $p) {
            foreach($points as $p1) {
                $strict = false;
                $add = true;
                for($i = 0; $i < $p->getNumberOfDimensions(); $i++) {
                    if($p->attributes[$i] > $p1->attributes[$i]) {
                        $add = false;
                        break;
                    }
                    if($p->attributes[$i] < $p1->attributes[$i]) {
                        $strict = true;
                    }
                }
                if($add && $strict) {
                    array_push($bad, $p1);
                }
            }
        }
        return array_diff($points, $bad);
    }
}

// Run the following if we access this file
// Corresponds to Python's if __name__ == '__main__:'
if (!debug_backtrace()) {
    echo "<html><body><pre>";
    $points = array(
        new PointPaper(array(1, 8, 1)),
        new PointPaper(array(2, 7, 2)),
        new PointPaper(array(3, 5, 3)),
        new PointPaper(array(5, 4, 5)),
        new PointPaper(array(7, 2, 7)),
        new PointPaper(array(8, 1, 8)),
        new PointPaper(array(3, 9, 3)),
        new PointPaper(array(6, 5, 6)),
        new PointPaper(array(7, 3, 7)),
        new PointPaper(array(4,6, 4))
    );

    $bnl = new BNL();
    print_r($bnl->query($points));
    echo "</pre></body></html>";
}