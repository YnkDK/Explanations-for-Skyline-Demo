<?php
require_once('headers.php');
require_once('BRA.php');
require_once('PointPaper.php');

if(!isset($_SESSION['S']) && !(isset($_GET["id"])))
    die("S is NOT in session OR you forgot to specify id");

//Fetch get parameters and session parameters.
$id = $_GET["id"];
$data = unserialize($_SESSION["S"]);
$ranges = unserialize($_SESSION["ranges"]);
$extremes = unserialize($_SESSION["extremes"]);
$qL = unserialize($_SESSION['qL']);

echo "<pre>";
$p = $data[$id];
print_r(array_combine(array_keys($ranges), array_values($p->attributes)));
// Use f(x) on all points in S
foreach($data as &$point) {
    f($point);
}
// Use f(x) on p
f($p);
// Use f(x) on qL
f($qL);

$bra = new BRA();
$res = $bra->query($data, $data[$id], $qL);
f($res);
print_r($res);

function f(&$x) {
    global $ranges;
    $j = 0;
    foreach($ranges as $key => $value) {
        if($value[2] === 'MIN') {
            $x->attributes[$j] = 500 - $x->attributes[$j];
        }
        $j++;
    }
}