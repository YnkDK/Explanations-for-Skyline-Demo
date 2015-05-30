<?php
require_once("headers.php");
require_once('Data.php');
require_once('BNL.php');
require_once('BRA.php');


$database = new Data();
$bra = new BRA();

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
if(strcmp($_GET['roomsize'], 'true') === 0) {
    $ranges['roomsize'] = array($_GET['roomsizeFrom'], $_GET['roomsizeTo'], 'MAX');
}
if(strcmp($_GET['price'], 'true') === 0) {
    $ranges['price'] = array($_GET['priceFrom'], $_GET['priceTo'], 'MIN');
}
if(strcmp($_GET['rating'], 'true') === 0) {
    $ranges['rating'] = array($_GET['ratingFrom'], $_GET['ratingTo'], 'MAX');
}
if(strcmp($_GET['wifi'], 'true') === 0) {
    $ranges['wifi'] = array($_GET['wifiFrom'], $_GET['wifiTo'], 'MAX');
}
if(strcmp($_GET['aros'], 'true') === 0) {
    $ranges['aros'] = array($_GET['arosFrom'], $_GET['arosTo'], 'MAX');
}


// Get all hotels within the above ranges
$hotels = $database->hotels;
unset($hotels['__extremes__']);

// Prepare data for algorithms
$extremes = $database->getExtremes();
$data = array();
$qL = array();
foreach($hotels as $id => $value) {
    $tmp = array();
    foreach($ranges as $k=>$v) {
        if($v[2] === 'MIN') {
            array_push($tmp, $value[$k]);   //Price, distance to beach, distance to town
        } elseif($v[2] === 'MAX') {         //Roomsize, aros, wifi, user-ratings
            // Solve the dual to maximize a value
            array_push($tmp, floatval($extremes[$k][1]) - floatval($value[$k]));
        }
    }
    $hotels[$id]["id"] = $id;
    $data[$id] = new PointPaper($tmp);
}

//Die script if no hotels exist between qL and qU.
if(count($data) === 0) {
    die(json_encode(array(
        "skyline" => array(),
        "notSkyline" => array())));
}

//Create qL and qU as PointPapers
$qL = array();
$qU = array();
foreach($ranges as $k=>$v) {
    if($v[2] === 'MAX') {
        array_push($qL, $extremes[$k][1] - $v[1]);
        array_push($qU, $extremes[$k][1] - $v[0]);
    } else {
        array_push($qL, $v[0]);
        array_push($qU, $v[1]);
    }
}
$qL = new PointPaper($qL);
$qU = new PointPaper($qU);


//$S : array with points inside qL and qU
$S = array();
foreach($data as $id=>$hotel){
    if($bra->dominanceOrEqual($qL, $hotel) && $bra->dominanceOrEqual($hotel, $qU)){
        $S[$id] = $hotel;
    }
}

//Find skyline using BNL algorithm
$bnl = new BNL();
foreach($bnl->query($S) as $id => $_) {
    $skyline[$id] = $hotels[$id];
}

//Find not-skyline
foreach(array_diff_key($S, $skyline) as $id => $_) {
    array_push($notSkyline, $hotels[$id]);
}

//Clear session variables
session_unset();

//Add new session variables
$_SESSION['S'] = serialize($S);
$_SESSION['qL'] = serialize($qL);
$_SESSION['ranges'] = serialize($ranges);
$_SESSION['extremes'] = serialize($extremes);

// Return the result as a nice JSON
echo json_encode(array(
    "skyline" => array_values($skyline),
    "skyline-size" => count($skyline),
    "notSkyline" => $notSkyline,
    "notSkyline-size" => count($notSkyline),
    "outputSize" => count($skyline) + count($notSkyline)
));