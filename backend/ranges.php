<?php
require_once("headers.php");
require_once("Data.php");

$db = new Data();
$ex = $db->getExtremes();

echo json_encode(array(
    "data" => array(
        "price" => FALSE,
        "priceFrom" => $ex["price"][0],
        "priceTo" => $ex["price"][1],
        "beach" => FALSE,
        "beachFrom" => $ex["beach"][0],
        "beachTo" => $ex["beach"][1],
        "downtown" => FALSE,
        "downtownFrom" => $ex["downtown"][0],
        "downtownTo" => $ex["downtown"][1],
        "pools" => FALSE,
        "poolsFrom" => $ex["pools"][0],
        "poolsTo" => $ex["pools"][1],
        "rating" => FALSE,
        "ratingFrom" => $ex["rating"][0],
        "ratingTo" => $ex["rating"][1],
        "stars" => FALSE,
        "starsFrom" => $ex["stars"][0],
        "starsTo" => $ex["stars"][1]
    )
));
