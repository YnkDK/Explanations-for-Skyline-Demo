<?php


class PointPaper {
    /* @var int|number */
    private static $num_dims = -1;
    /* @var string */
    private static $distance_function = 'l1';

    /* @var array */
    public $attributes = array();


    function __construct(array $attributes) {
        if(PointPaper::$num_dims == -1) {
            // This is the first point, now all other points must have the same dimension size
            PointPaper::$num_dims = count($attributes);
        } elseif(count($attributes) !== PointPaper::$num_dims) {
            throw new Exception("All points must have the same number of dimensions!");
        }
        foreach($attributes as $a) {
            // Ensure that the keys are 0...|D|-1
            array_push($this->attributes, $a);
        }
    }

    public function getNumberOfDimensions() {
        return count($this->attributes);
//        return PointPaper::$num_dims;
    }

    /**
     * Calculates the distance between this point and another point
     * using the current distance function.
     *
     * @param PointPaper $that
     * @return float|number
     * @throws Exception
     */
    public function dist(PointPaper &$that) {
        switch(PointPaper::$distance_function) {
            case 'l1':
                return $this->l1($that);
            default:
                throw new Exception("Undefined distance function.");
        }
    }

    /**
     * @param PointPaper $that
     * @return float|number
     */
    private function l1(PointPaper &$that) {
        $res = 0.;
        for($d = 0; $d < PointPaper::$num_dims; $d++) {
            $res += abs($this->attributes[$d] - $that->attributes[$d]);
        }
        return $res;
    }

    public function __toString() {
        return implode(',', $this->attributes);
    }
}