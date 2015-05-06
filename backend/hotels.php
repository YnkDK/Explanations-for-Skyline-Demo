<?php
require_once("headers.php");
$skyline = [];
$notSkyline = [];

// Get the hotels as a php-array
$hotels = json_decode(file_get_contents("hotels.json"), true);
$file = fopen('skyNot.csv', 'r');

$i = 0;
while (($line = fgetcsv($file)) !== FALSE) {
    $hotels[$i]["sn-price"]    = floatval($line[0]);
    $hotels[$i]["sn-beach"]    = floatval($line[1]);
    $hotels[$i]["sn-downtown"] = floatval($line[2]);
    $hotels[$i]["sn-pools"]    = intval($line[3]);
    $hotels[$i]["sn-rating"]   = floatval($line[4]);
    $hotels[$i]["sn-stars"]    = intval($line[5]);

    if(intval($line[0])+intval($line[1])+intval($line[2])+intval($line[3])+intval($line[4])+intval($line[5]) === 0) {
        array_push($skyline, $hotels[$i]);
    } else {
        array_push($notSkyline, $hotels[$i]);
    }
    $i++;
}

echo json_encode([
    "skyline" => $skyline,
    "notSkyline" => $notSkyline
]);
