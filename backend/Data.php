<?php

class Data {
    /**
     *  Load the data
     */
    function __construct() {
        touch('index/hotels.bin');
        $this->hotels = unserialize(file_get_contents('index/hotels.bin'));
    }

    function getExtremes() {
        return  $this->hotels["__extremes__"] ;
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
        unlink('index/hotels.bin');
        $extremes = array();
        // Get keys
        $keys = array();
        foreach($data as $row) {
            foreach($row as $key => $value) {
                if(is_float($value)) {
                    array_push($keys, $key);
                }
            }
            break;
        }
        foreach($keys as $key) {
            $extremes[$key] = array(INF, -INF);
        }
        // Read the data, insert etc
        foreach ($data as $id => $row) {
            foreach($extremes as $key=>$interval) {
                if($row[$key] < $interval[0]) {
                    $extremes[$key][0] = $row[$key];
                }
                if($row[$key] > $interval[1]) {
                    $extremes[$key][1] = $row[$key];
                }
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


}

// Run the below code, only if we access this file
if (!debug_backtrace()) {
    echo '<pre>';
    $d = new Data();

    // The following creates the "database" if it does not exist

    $hotels = json_decode(file_get_contents("hotels.json"), true);
    echo "Written " . $d->update($hotels) . " bytes to disc.";

    echo '</pre>';
}