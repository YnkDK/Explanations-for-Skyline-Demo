<?php
require_once("headers.php");
require_once('PrioReA.php');
require_once('Data.php');

$database = new Data();

$skyline = array();
$notSkyline = array();
/*
    [beach] => true
    [beachFrom] => 0
    [beachTo] => 17
    [downtown] => true
    [downtownFrom] => 0
    [downtownTo] => 13
    [pools] => true
    [poolsFrom] => 0
    [poolsTo] => 5
    [price] => true
    [priceFrom] => 30
    [priceTo] => 630
    [rating] => true
    [ratingFrom] => 0
    [ratingTo] => 10
    [stars] => true
    [starsFrom] => 1
    [starsTo] => 5
*/
$ranges = array();
if(strcmp($_GET['beach'], 'true') === 0) {
    $ranges['beach'] = array($_GET['beachFrom'], $_GET['beachTo'], 'MIN');
}
if(strcmp($_GET['downtown'], 'true') === 0) {
    $ranges['downtown'] = array($_GET['downtownFrom'], $_GET['downtownTo'], 'MIN');
}
if(strcmp($_GET['pools'], 'true') === 0) {
    $ranges['pools'] = array($_GET['poolsFrom'], $_GET['poolsTo'], 'MAX');
}
if(strcmp($_GET['price'], 'true') === 0) {
    $ranges['price'] = array($_GET['priceFrom'], $_GET['priceTo'], 'MIN');
}
if(strcmp($_GET['rating'], 'true') === 0) {
    $ranges['rating'] = array($_GET['ratingFrom'], $_GET['ratingTo'], 'MAX');
}
if(strcmp($_GET['stars'], 'true') === 0) {
    $ranges['stars'] = array($_GET['starsFrom'], $_GET['starsTo'], 'MAX');
}

$hotels = $database->query($ranges);

// Prepare for PrioReA
$extremes = $database->getExtremes();
$data = array();
foreach($hotels as $id => $value) {
    $tmp = array();
    foreach($ranges as $k=>$v) {
        if($v[2] === 'MIN') {
            array_push($tmp, $value[$k]);
        } elseif($v[2] === 'MAX') {
            array_push($tmp, floatval($extremes[$k][1]) - floatval($value[$k]));
        }
    }
    $data[$id] = $tmp;
}

// Setup PrioReA
$skyNot = new PrioReA($data);
foreach($hotels as $id => $value) {
    $q = $skyNot->getPoint($id);
    if($q === NULL) {
        continue;
    }
    $s = new Point(array_fill(0, count($ranges), 0));
    $score = floatval($skyNot->query($q, $s));
    $hotels[$id]["score"] = $score;
    $i = 0;
    foreach($ranges as $k=>$v) {
        if($s->getElements()[$i] > 0.0) {
            $hotels[$id]["sn" . ucfirst($k)] = $s->getElements()[$i] + 0.00001;
        } else {
            $hotels[$id]["sn" . ucfirst($k)] = $s->getElements()[$i];
        }

        $i++;
    }
    if($score === 0.0) {
        array_push($skyline, $hotels[$id]);
    } else {
        array_push($notSkyline, $hotels[$id]);
    }
}
// Get the hotels as a php-array
/*
$hotels = json_decode(file_get_contents("hotels.json"), true);
$file = fopen('skyNot.csv', 'r');

$i = 0;
while (($line = fgetcsv($file)) !== FALSE) {
    $hotels[$i]["snPrice"]    = floatval($line[0]);
    $hotels[$i]["snBeach"]    = floatval($line[1]);
    $hotels[$i]["snDowntown"] = floatval($line[2]);
    $hotels[$i]["snPools"]    = intval($line[3]);
    $hotels[$i]["snRating"]   = floatval($line[4]);
    $hotels[$i]["snStars"]    = intval($line[5]);

    if(intval($line[0])+intval($line[1])+intval($line[2])+intval($line[3])+intval($line[4])+intval($line[5]) === 0) {
        array_push($skyline, $hotels[$i]);
    } else {
        array_push($notSkyline, $hotels[$i]);
    }
    $i++;
}

*/
echo json_encode(array(
    "skyline" => $skyline,
    "notSkyline" => $notSkyline
));