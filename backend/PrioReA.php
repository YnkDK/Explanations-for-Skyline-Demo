<?php
/* ------------------------------------------------------------------------------
** This software is implemented as part of a project at Aarhus Univerity Denmark.
**
** PrioReA.php
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
require_once('Point.php');

define("DOM_LEFT", 0);
define("DOM_RIGHT", 1);
define("DOM_INCOMP", 2);

class PrioReA {
    private $data;
    private $n;
    private $num_dims;
    /**
     * @param array|$data List of selected dimensions
     */
    function __construct(array &$data) {
        $this->data = array();
        foreach($data as $key => $elements) {
            $this->data[$key] = new Point($elements);
        }

        $this->n = count($data);
    }

    public function getPoint($index) {
        return $this->data[$index];
    }

    public function query(Point &$q, Point &$solution) {
        $numDims = $q->getNumDims();
        // Init origin to (0.0, ..., 0.0)
        $origin = new Point(array_fill(0, $numDims, 0.0));
        // Init dims
        $dims = range(0, $numDims-1);

        $closeDoms = $this->getCloseDoms($q->getPid(), $origin);
        return $this->alg($closeDoms, $q, $origin, $solution, $dims);
    }

    private function alg(array &$points, Point &$q, Point &$origin, Point &$solution, array &$dims) {
        if(count($points) === 0) {
            return 0;
        }
        $myPoints = $points;
        $score = $this->l1_dist($q, $origin);


        foreach($dims as $cur_dim) {
            $dims_left = $dims;
            array_shift($dims_left);
            // Sort data by active dimension, and populate metadata
            $this->sortByDim($myPoints, $origin, $cur_dim, $dims_left);
            $max = 0;
            $i = -1;
            foreach($myPoints as $p) {
                /* @var $p Point */
                $i = $i + 1;
                if($p->getScore() + $max < $score) {
                    $soln_recursion = clone $origin;

                    $dims_recursion = $dims_left;
                    $score_recursion = $this->alg(
                        array_slice($myPoints, 0, $i),
                        $q,
                        $origin,
                        $soln_recursion,
                        $dims_recursion
                    );
                    if($score_recursion + $p->getScore() < $score) {
                        $score = $p->getScore() + $score_recursion;
                        $this->copyTuple($soln_recursion, $solution);
                        $solution->updateElement($cur_dim, $p->getScore());
                    } elseif($score_recursion >= $score) {
                        break; // Condition (2) met
                    }
                } elseif($max >= $score) {
                    break; // Condition (2) met
                } else {
                    // Do nothing
                }

                if($p->getMinValue() > $max) {
                    $max = $p->getMinValue();
                }
            }
        }
        return $score;
    }

    private function getCloseDoms($pid, Point &$origin) {
        $closeDoms = array();
        for($i = 0; $i < $this->n; $i++) {
            if($i == $pid) {
                // Do not compare to oneself
                continue;
            }
            $dataI = $this->data[$i];
            if($origin->dominates($this->data[$i]) && $this->data[$i]->dominates($this->data[$pid])) {
                for($j = 0; $j < count($closeDoms); $j++) {
                    $dt_res = $this->dominanceTest($this->data[$i], $closeDoms[$j]);
                    if($dt_res === DOM_LEFT) {
                        break; // clearly not close dominating
                    } elseif($dt_res === DOM_RIGHT) {
                        array_splice($closeDoms, $j, 1);
                    }
                }
                if( $j >= count($closeDoms)) {
                    array_push($closeDoms, $dataI);
                }
            }
        }

        return $closeDoms;
    }

    /**
     * @param Point $t1
     * @param Point $t2
     * @return int
     */
    private function dominanceTest(Point &$t1, Point &$t2) {
        $t1Elements = $t1->getElements();
        $t2Elements = $t2->getElements();
        $t1Better = false;
        $t2Better = false;

        for($i = 0; $i < $t1->getNumDims(); $i++) {
            if($t1Elements[$i] < $t2Elements[$i]) {
                $t1Better = true;
            } else if($t1Elements[$i] > $t2Elements[$i]) {
                $t2Better = true;
            }

            if($t1Better && $t2Better) {
                return DOM_INCOMP;
            }
        }
        if(!$t1Better && $t2Better) {
            return DOM_RIGHT;
        }
        if($t1Better && !$t2Better) {
            return DOM_LEFT;
        }

        // Otherwise they are equal
        return DOM_INCOMP;
    }

    private function l1_dist(Point &$p1, Point &$p2) {
        $x = 0;
        $p1Elements = $p1->getElements();
        $p2Elements = $p2->getElements();
        for($d = 0; $d < $p1->getNumDims(); $d++) {
            $x += abs($p1Elements[$d] - $p2Elements[$d]);
        }
        return $x;
    }

    private function sortByDim(array &$p, Point &$o, $d, array &$dims) {
        foreach($p as &$pi) {
            /* @var $pi Point */
            $pi->setScore($pi->getElements()[$d] - $o->getElements()[$d]);
            $min_d = $this->getMinDim($pi, $o, $dims);
            $pi->setMinValue($pi->getElements()[$min_d] - $o->getElements()[$min_d]);
        }
        uasort($p, array('Point', 'cmp'));
    }

    private function getMinDim(Point &$p, Point &$o, array $dims) {
        $d = $dims[0];
        $i = 0;
        for($i = 1; $i < count($dims); $i++) {
            if($p->getElements()[$dims[$i]] - $o->getElements()[$dims[$i]] < $p->getElements()[$d] - $o->getElements()[$d]) {
                $d = $i;
            }
        }
        return $d;
    }

    private function copyTuple(Point &$src, Point &$dst) {
        $i = 0;
        foreach($src->getElements() as $e) {
            $dst->setElement($i, $e);
            $i++;
        }
    }

}