<?php
require_once("headers.php");
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
            //printf("%f - %f = %f\n", floatval($extremes[$k][1]), floatval($value[$k]), floatval($extremes[$k][1]) - floatval($value[$k]) + 1);
            array_push($tmp, floatval($extremes[$k][1]) - floatval($value[$k]) + 1);
        }
    }
    array_push($data, implode(',', $tmp));
}
if(count($data) === 0) {
    die(json_encode(array(
        "skyline" => array(),
        "notSkyline" => array())));
}



// Setup PrioReA

$minMax = getExtreme($hotels, $ranges);
$idx = 0;
foreach($hotels as $id => $value) {
    // Get the Point-object corresponding to the current hotel
    $output = explode(",", exec('bin/Sky'. count($ranges) .' '.$idx.' "' . implode($data, '|') . '"'));
    $output = array_map('floatval', $output);
    // Set the score for this hotel
    $score =  array_sum($output);
    // Add the sky-not value for each attribute
    $i = 0;
    foreach($ranges as $k=>$v) {
        if($v[2] === 'MAX') {
            if($output[$i] > 0.0) {
                $hotels[$id]["sn" . ucfirst($k)] = $minMax[$k][1] - $output[$i] + 1;
            } elseif($output[$i] === 0.0) {
                $hotels[$id]["sn" . ucfirst($k)] = false;
            }

            $hotels[$id]["score"] = $score - 1;
        } elseif($v[2] === 'MIN') {
            if($output[$i] === 0.0) {
                $hotels[$id]["sn" . ucfirst($k)] = false;
            } else {
                $hotels[$id]["sn" . ucfirst($k)] = $minMax[$k][0] + $output[$i];
            }

            $hotels[$id]["score"] = $score;
        }
        $i++;
    }
    // Determine this hotel is in the skyline
    if($score === 0.0) {
        array_push($skyline, $hotels[$id]);
    } else {
        array_push($notSkyline, $hotels[$id]);
    }
    $idx++;
}

function getExtreme(&$hotels, &$ranges) {
    // Get desired keys
    $res = array();
    foreach($ranges as $k => $v) {
        $res[$k] = array($v[1], $v[0]);
    }

    foreach($hotels as $row) {
        foreach($res as $k => $v) {
            if($row[$k] < $v[0]) {
                $res[$k][0] = $row[$k];
            }
            if($row[$k] > $v[1]) {
                $res[$k][1] = $row[$k];
            }
        }
    }
    return $res;
}

// Return the result as a nice JSON
echo json_encode(array(
    "skyline" => $skyline,
    "notSkyline" => $notSkyline,
    "outputSize" => count($skyline) + count($notSkyline),
    "minMax" => $minMax,
    "query" => implode($data, '|'),
));
