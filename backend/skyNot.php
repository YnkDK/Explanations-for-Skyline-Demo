<?php
require_once('headers.php');
require_once('BRA.php');
require_once('PointPaper.php');

echo '<html><body><pre>';
$id = $_GET["id"];
$data = unserialize($_SESSION["notSkyline"]);

$bra = new BRA();

$res = $bra->query($data, $data[$id], unserialize($_SESSION['qL']));
echo "qL: <br>";
print_r(unserialize($_SESSION['qL']));
echo "res: <br>";
print_r($res);
echo "data[$id]: <br>";
print_r($data[$id]);
echo "ranges: <br>";
print_r(unserialize($_SESSION['ranges']));
echo "DATA: <br>";
print_r($data);
echo json_encode(array(
    "qLPrime" => $res->attributes
));
echo '</pre></body></html>';