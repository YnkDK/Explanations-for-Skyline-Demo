<?php
require_once('headers.php');
require_once('BRA.php');
require_once('PointPaper.php');

if(!isset($_SESSION['S']) && !(isset($_GET["id"])))
    die("S is NOT in session OR you forgot to specify id");

//Fetch get parameters and session parameters.
$id = $_GET["id"];
$data = unserialize($_SESSION["S"]);

//Run BRA algorithm
$bra = new BRA();
$res = $bra->query($data, $data[$id], unserialize($_SESSION['qL']));

//Prepare data for view/frontend
$result = array();
$index = 0;
foreach(unserialize($_SESSION['ranges']) as $attrName => $val){
    $attrVal = $res->attributes[$index];
    $result[$attrName] = $attrVal;
    $index++;
}

//Return result in JSON format
echo json_encode(array(
    "qL" => $result
));