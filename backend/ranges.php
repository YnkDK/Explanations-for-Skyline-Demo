<?php
require_once("headers.php");

$hotels = json_decode(file_get_contents("hotels.json"), true);

$range = array(
    "price" => TRUE,
    "priceFrom" => INF,
    "priceTo" => -INF,
    "beach" => TRUE,
    "beachFrom" => INF,
    "beachTo" => -INF,
    "downtown" => TRUE,
    "downtownFrom" => INF,
    "downtownTo" => -INF,
    "pools" => TRUE,
    "poolsFrom" => INF,
    "poolsTo" => -INF,
    "rating" => TRUE,
    "ratingFrom" => INF,
    "ratingTo" => -INF,
    "stars" => TRUE,
    "starsFrom" => INF,
    "starsTo" => -INF
);

for($i = 0; $i < count($hotels); $i++) {
// Set ranges, i.e. min/max for each attribute
    if($hotels[$i]["price"] < $range["priceFrom"]) {
        $range["priceFrom"] = $hotels[$i]["price"];
    }
    if($hotels[$i]["price"] > $range["priceTo"]) {
        $range["priceTo"] = $hotels[$i]["price"];
    }

    if($hotels[$i]["beach"] < $range["beachFrom"]) {
        $range["beachFrom"] = $hotels[$i]["beach"];
    }
    if($hotels[$i]["beach"] > $range["beachTo"]) {
        $range["beachTo"] = $hotels[$i]["beach"];
    }

    if($hotels[$i]["downtown"] < $range["downtownFrom"]) {
        $range["downtownFrom"] = $hotels[$i]["downtown"];
    }
    if($hotels[$i]["downtown"] > $range["downtownTo"]) {
        $range["downtownTo"] = $hotels[$i]["downtown"];
    }

    if($hotels[$i]["pools"] < $range["poolsFrom"]) {
        $range["poolsFrom"] = $hotels[$i]["pools"];
    }
    if($hotels[$i]["pools"] > $range["poolsTo"]) {
        $range["poolsTo"] = $hotels[$i]["pools"];
    }

    if($hotels[$i]["rating"] < $range["ratingFrom"]) {
        $range["ratingFrom"] = $hotels[$i]["rating"];
    }
    if($hotels[$i]["rating"] > $range["ratingTo"]) {
        $range["ratingTo"] = $hotels[$i]["rating"];
    }

    if($hotels[$i]["stars"] < $range["starsFrom"]) {
        $range["starsFrom"] = $hotels[$i]["stars"];
    }
    if($hotels[$i]["stars"] > $range["starsTo"]) {
        $range["starsTo"] = $hotels[$i]["stars"];
    }
}

echo json_encode(array(
    "data" => $range
));