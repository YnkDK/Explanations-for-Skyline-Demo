<?php
require_once("headers.php");
require_once("Data.php");

$db = new Data();
$ex = $db->getExtremes();

echo json_encode(array(
    "data" => array(
        "price" => TRUE,
        "priceFrom" => $ex["price"][0],
        "priceTo" => $ex["price"][1],
        "beach" => FALSE,
        "beachFrom" => $ex["beach"][0],
        "beachTo" => $ex["beach"][1],
        "downtown" => FALSE,
        "downtownFrom" => $ex["downtown"][0],
        "downtownTo" => $ex["downtown"][1],
        "roomsize" => FALSE,
        "roomsizeFrom" => $ex["roomsize"][0],
        "roomsizeTo" => $ex["roomsize"][1],
        "rating" => TRUE,
        "ratingFrom" => $ex["rating"][0],
        "ratingTo" => $ex["rating"][1],
        "wifi" => TRUE,
        "wifiFrom" => $ex["wifi"][0],
        "wifiTo" => $ex["wifi"][1],
        "aros" => FALSE,
        "arosFrom" => $ex["aros"][0],
        "arosTo" => $ex["aros"][1]
    )
));