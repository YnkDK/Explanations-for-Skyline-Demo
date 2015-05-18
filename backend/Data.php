<?php
require_once('btree.php');

class Data {
    /* @var btree */
    private $bPrice;
    /* @var btree */
    private $bRating;
    /* @var btree */
    private $bDowntown;
    /* @var btree */
    private $bStars;
    /* @var btree */
    private $bPools;
    /* @var btree */
    private $bBeach;

    /**
     *  Opens b-trees and loads the hotel data
     */
    function __construct() {
        touch('index/hotels.bin');
        $this->hotels = unserialize(file_get_contents('index/hotels.bin'));
    }

    /**
     * Open all trees
     */
    private function openTrees() {
        $this->bPrice = btree::open('index/price.tree');
        $this->bRating = btree::open('index/rating.tree');
        $this->bDowntown = btree::open('index/downtown.tree');
        $this->bStars = btree::open('index/stars.tree');
        $this->bPools = btree::open('index/pools.tree');
        $this->bBeach = btree::open('index/beach.tree');
    }


    /**
     * Deletes the previous data and builds an index of 6 of the parameters, and saves
     * the data in a binary file for later usage.
     *
     * In addition we save all the extremes, which can be accessed with getExtremes()
     *
     * @param array $data The new hotel data
     * @return bool|int False if failure, otherwise the number of bytes of the binary file
     */
    public function update(array &$data) {
        // Remove all old data
        unlink('index/price.tree');
        unlink('index/rating.tree');
        unlink('index/downtown.tree');
        unlink('index/stars.tree');
        unlink('index/pools.tree');
        unlink('index/beach.tree');
        unlink('index/hotels.bin');

        // Prepare the B+-trees for insert
        $this->openTrees();

        $extremes = array(
            "price" => array(INF, -INF),
            "rating" => array(INF, -INF),
            "downtown" => array(INF, -INF),
            "stars" => array(INF, -INF),
            "pools" => array(INF, -INF),
            "beach" => array(INF, -INF)
        );
        // Read the data, insert etc
        foreach ($data as $id => $row) {
            /**
             * Array
             * (
             *    [rating] => 5.8
             *    [price] => 76.459880273557
             *    [coordinates] => Array
             *       (
             *          [0] => 10.191851540402
             *          [1] => 56.140825845955
             *       )
             *
             *    [downtown] => 1.2794831317311
             *    [stars] => 1
             *    [address] => P.P.Ã˜rums Gade 5, 8000 Aarhus C
             *    [pools] => 5
             *    [beach] => 8.860194736646
             * )
             */
            $this->bPrice   ->set(Data::float_to_string($row['price'])   , $id);
            $this->bRating  ->set(Data::float_to_string($row['rating'])  , $id);
            $this->bDowntown->set(Data::float_to_string($row['downtown']), $id);
            $this->bStars   ->set(Data::float_to_string($row['stars'])   , $id);
            $this->bPools   ->set(Data::float_to_string($row['pools'])   , $id);
            $this->bBeach   ->set(Data::float_to_string($row['beach'])   , $id);

            if($row['price'] < $extremes['price'][0]) {
                $extremes['price'][0] = $row['price'];
            }
            if($row['price'] > $extremes['price'][1]) {
                $extremes['price'][1] = $row['price'];
            }

            if($row['rating'] < $extremes['rating'][0]) {
                $extremes['rating'][0] = $row['rating'];
            }
            if($row['rating'] > $extremes['rating'][1]) {
                $extremes['rating'][1] = $row['rating'];
            }

            if($row['downtown'] < $extremes['downtown'][0]) {
                $extremes['downtown'][0] = $row['downtown'];
            }
            if($row['downtown'] > $extremes['downtown'][1]) {
                $extremes['downtown'][1] = $row['downtown'];
            }

            if($row['stars'] < $extremes['stars'][0]) {
                $extremes['stars'][0] = $row['stars'];
            }
            if($row['stars'] > $extremes['stars'][1]) {
                $extremes['stars'][1] = $row['stars'];
            }

            if($row['pools'] < $extremes['pools'][0]) {
                $extremes['pools'][0] = $row['pools'];
            }
            if($row['pools'] > $extremes['pools'][1]) {
                $extremes['pools'][1] = $row['pools'];
            }

            if($row['beach'] < $extremes['beach'][0]) {
                $extremes['beach'][0] = $row['beach'];
            }
            if($row['beach'] > $extremes['beach'][1]) {
                $extremes['beach'][1] = $row['beach'];
            }
        }
        // Everything inserted - now compact the files if possible
        /*
        // This apparently takes a long time?
        $this->bPrice->compact();
        $this->bRating->compact();
        $this->bDowntown->compact();
        $this->bStars->compact();
        $this->bPools->compact();
        $this->bBeach->compact();
        */
        $data["__extremes__"] = $extremes;
        // Finally write the data to a serialized file
        return file_put_contents('index/hotels.bin', serialize($data));
    }

    /**
     * Returns all hotels within a given query, e.g.
     * array(
     *     "price" => array(10, 500)
     * )
     * retrieves all hotels that have a price between 10 and 500
     *
     * @param array $q
     * @return array
     */
    public function query(array &$q) {
        $this->openTrees();
        if(!($this->bPrice && $this->bRating && $this->bDowntown && $this->bStars && $this->bPools && $this->bBeach)) {
            die('One of the b+-trees could not be opened!');
        }

        $result = array();
        foreach($q as $k => $v) {
            switch($k) {
                case "price":
                    // Query all hotels with the given price range
                    $tmp = $this->bPrice->range(Data::float_to_string($v[0]), Data::float_to_string($v[1]));
                    break;
                case "rating":
                    // You get the idea
                    $tmp = $this->bRating->range(Data::float_to_string($v[0]), Data::float_to_string($v[1]));
                    break;
                case "downtown":
                    $tmp = $this->bDowntown->range(Data::float_to_string($v[0]), Data::float_to_string($v[1]));
                    break;
                case "stars":
                    $tmp = $this->bStars->range(Data::float_to_string($v[0]), Data::float_to_string($v[1]));
                    break;
                case "pools":
                    $tmp = $this->bPools->range(Data::float_to_string($v[0]), Data::float_to_string($v[1]));
                    break;
                case "beach":
                    $tmp = $this->bBeach->range(Data::float_to_string($v[0]), Data::float_to_string($v[1]));
                    break;
                default:
                    $tmp = array();
            }
            // Unfold the nested values (for duplicate keys)
            $tmp2 = array();
            foreach($tmp as $arr) {
                foreach($arr as $k_=>$v_) {
                    $tmp2[$v_] = '';
                }
            }

            if(count($result) === 0) {
                // This is the first loop
                $result = $tmp2;
            } else {
                // Only take the hotels which fulfills all requirements
                $result = array_intersect_key($result, $tmp2);
            }

            if(count($result) === 0) {
                // If there are no matches now, we are not going to get
                // some later
                break;
            }
        }
        // Extract the actual data using the resulting keys
        return array_intersect_key($this->hotels, $result);
    }

    /**
     * Since the btree only can store string as keys, we need to covert all floats
     * to strings. Note that no float can be larger than 9999 and the precision is
     * at most 5 digits.
     *
     * @param $float
     * @return string
     */
    private static function float_to_string($float) {
        return str_pad(number_format($float, 5, '.', ''), 10, ' ', STR_PAD_LEFT);
    }

    /**
     * Returns the extremes points, which can be used as a query to get all points
     * @return array
     */
    public function getExtremes() {
        return $this->hotels['__extremes__'];
    }
}

// Run the below code, only if we access this file
if (!debug_backtrace()) {
    echo '<pre>';
    $d = new Data();

    // The following creates the "database" if it does not exist

//    $hotels = json_decode(file_get_contents("hotels.json"), true);
//    echo $d->update($hotels);


    // Make a range query
    //$query = $d->getExtremes();
    $query = array(
        "price" => array(100, 300),
        "rating" => array(5, 10),
        "stars" => array(4, 5),
        "beach" => array(0, 2)
    );
    printf("Query:\n");
    print_r($query);
    $start = microtime(true);
    $res = $d->query($query);
    $time = microtime(true) - $start;
    printf("Query took %f microseconds. Result size: %d\n", $time, count($res));
    print_r($res);

    echo '</pre>';
}