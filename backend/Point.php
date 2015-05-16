<?php
/* ------------------------------------------------------------------------------
** This software is implemented as part of a project at Aarhus Univerity Denmark.
**
** Point.php
** Implementation of Prioritized Recursion Algorithm, which an adaption of the
** work performed by:
**
** Sean Chester and Ira Assent. (2015).
** "Explanations for skyline query results."
** Proceedings of the 18th International Conference on Extending
** DatabaseTechnology (EDBT 2015), pp. 349-360. DOI:  10.5441/002/edbt.2015.31
**
** Licensed under CC BY-NC 4.0
**
** Author: Martin Storgaard, Jesper M. Kristensen and Lars Christensen
** Supervisors: Ira Assent and Sean Chester
**
** 4th quarter 2015
** ----------------------------------------------------------------------------*/

class Point {
    private static $tmp = 0;

    private $elements;
    private $score;
    private $min_value;
    public $pid;

    /**
     * @param array|$elements The elements of this point
     */
    function __construct(array $elements) {
        $this->elements = $elements;
        $this->min_value = INF;
        $this->pid = self::$tmp;
        self::$tmp++;
    }

    /**
     * @param float $score
     */
    public function setScore($score) {
        $this->score = $score;
    }

    public function getNumDims() {
        return count($this->elements);
    }

    /**
     * @return int
     */
    public function getPid() {
        return $this->pid;
    }

    /**
     * @return array
     */
    public function getElements() {
        return $this->elements;
    }

    public function setElement($idx, $val) {
        $this->elements[$idx] = $val;
    }

    public function dominates(Point &$t2) {
        assert($this->getNumDims() === $t2->getNumDims(), "Assume all points have the same dimensions");

        $t2Elements = $t2->getElements();
        for($i = 0; $i < $this->getNumDims() && $this->elements[$i] <= $t2Elements[$i]; $i++);
        if($i < $this->getNumDims()) {
            return false; // Points are incomparable
        }
        for($i = 0; $i < $this->getNumDims(); $i++) {
            if( $this->elements[$i] < $t2Elements[$i]) {
                return true;
            }
        }
        echo "Points are equal<br>";
        return false; // Points are equal
    }

    /**
     * @param mixed $min_value
     */
    public function setMinValue($min_value) {
        $this->min_value = $min_value;
    }

    /**
     * @return mixed
     */
    public function getScore()
    {
        return $this->score;
    }

    public function updateElement($idx, $score) {
        $this->elements[$idx] += $score;
    }

    /**
     * @return mixed
     */
    public function getMinValue()
    {
        return $this->min_value;
    }

    /**
     * Prints the array of points with 8 decimals
     */
    public function printPoint() {
        printf("[");
        foreach($this->elements as $e) {
            printf("%13.8f ", $e);
        }
        printf("]\n");
    }

    /**
     * Compares the score
     *
     * @param $these Point The current point
     * @param $those Point The other point
     * @return bool  True if the current is larger than the other
     */
    public static function cmp($cur, $that) {
        return $cur->score <= $that->score;
    }
}