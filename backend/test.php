<?php
/**
 * Created by PhpStorm.
 * User: mys
 * Date: 5/16/15
 * Time: 5:12 PM
 */

require_once('headers.php');
require_once('PrioReA.php');

$data = array();
$file = fopen('hotels.csv', 'r');
// TODO: Only push the values needed
// TODO: Read values in a better way
while (($line = fgetcsv($file)) !== FALSE) {
    array_push($data, array(
        floatval($line[0]),
        floatval($line[1]),
        floatval($line[2]),
        floatval($line[3]),
        floatval($line[4]),
        floatval($line[5])
    ));
}
$test = new PrioReA($data);

$q = $test->getPoint(126);
$s = new Point(array());

echo '<pre>';
echo 'Score: '.$test->query($q, $s);
echo '<br>';
$s->printPoint();
echo '</pre>';