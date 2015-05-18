<?php
/**
 * Created by PhpStorm.
 * User: mys
 * Date: 5/16/15
 * Time: 5:12 PM
 */
echo '<html><body><pre>';
require_once('headers.php');
require_once('PrioReA.php');
require_once('Data.php');

$d = new Data();
$query = array(
    "price" => array(100, 300, 'MIN'),
    "rating" => array(5, 10, 'MAX'),
    "stars" => array(4, 5, 'MAX'),
    "beach" => array(0, 2, 'MIN')
);
$extremes = $d->getExtremes();
$hotels = $d->query($query);
//print_r($hotels);
$data = array();
foreach($hotels as $id => $value) {
    $tmp = array();
    foreach($query as $k=>$v) {
        if(count($v) < 3) $v[2] = 'MIN';
        if($v[2] === 'MIN') {
            array_push($tmp, $value[$k]);
        } elseif($v[2] === 'MAX') {
            array_push($tmp, $extremes[$k][1] - $value[$k]);
        }
    }
    $data[$id] = $tmp;
}

$notsky = new PrioReA($data);
$q = $notsky->getPoint(21);
$s = new Point(array_fill(0, count($query), 0));
$notsky->query($q, $s);

print_r($s->toJSON($query));

echo '</pre></body></html>';