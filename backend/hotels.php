<?php
require_once("headers.php");
require_once('PrioReA.php');
require_once('Data.php');

$database = new Data();

$skyline = array();
$notSkyline = array();

// Define the user-specified ranges
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
// Get all hotels within the above ranges
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
            // Solve the dual to maximize a value
            array_push($tmp, floatval($extremes[$k][1]) - floatval($value[$k]));
        }
    }
    $data[$id] = $tmp;
}

// Setup PrioReA
$skyNot = new PrioReA($data);
foreach($hotels as $id => $value) {
    // Get the Point-object corresponding to the current hotel
    $q = $skyNot->getPoint($id);
    // Ensure that we actual did find a hotel
    if($q === NULL) {
        continue;
    }
    // Start with an optimal solution
    $s = new Point(array_fill(0, count($ranges), 0));
    // Query the PrioReA
    $score = floatval($skyNot->query($q, $s));
    // Set the score for this hotel
    $hotels[$id]["score"] = $score;
    // Add the sky-not value for each attribute
    $i = 0;
    foreach($ranges as $k=>$v) {
        if($s->getElements()[$i] > 0.0) {
            $hotels[$id]["sn" . ucfirst($k)] = $s->getElements()[$i] + 0.00001;
        } else {
            $hotels[$id]["sn" . ucfirst($k)] = $s->getElements()[$i];
        }

        $i++;
    }
    // Determine this hotel is in the skyline
    if($score === 0.0) {
        array_push($skyline, $hotels[$id]);
    } else {
        array_push($notSkyline, $hotels[$id]);
    }
}
// Return the result as a nice JSON
echo json_encode(array(
    "skyline" => $skyline,
    "notSkyline" => $notSkyline
));