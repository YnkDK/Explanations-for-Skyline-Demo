<?php
require_once('headers.php');
require_once('BRA.php');
require_once('PointPaper.php');

//echo '<html><body><pre>';
$id = $_GET["id"];


if(!isset($_SESSION['S']))
    die("notSkyline is NOT in session");

$data = unserialize($_SESSION["S"]);


//print_r($data);

$bra = new BRA();

//    $points = array(
//        new PointPaper(array(4)),
//        new PointPaper(array(3)),
//        new PointPaper(array(4, 3.5))
//////        new PointPaper(array(3, 5, 3)),
//////        new PointPaper(array(4, 7, 4))
////
//////        new PointPaper(array(4, 6, 4))
////        //        new PointPaper(array(7, 2, 7)),
////        //        new PointPaper(array(8, 1, 8)),
////        //        new PointPaper(array(3, 9, 3)),
////        //        new PointPaper(array(6, 5, 6)),
////        //        new PointPaper(array(7, 3, 7)),
//    );
//
//    $a = new PointPaper(array(1));
//    $b = new PointPaper(array(2));

    //Dominance (Definition 1)
//    $dominance = $bra->dominance($a, $b);
//
//    die();
//    //Dominance or equal (Definition 1)
//    $dominanceOrEqual = $bra->dominanceOrEqual($a, $b);
//
//    //Strictly dominance (Definition 2)
//    $strictlyDominance = $bra->strictlyDominated($a, $b);
//
//    //Close dominance
//    $closeDom = $bra->closeDominance($points, new PointPaper(array(5)));
//    echo "CloseDom: <br />";
//    print_r($closeDom);
//
//
//    echo "Dominance test: " . ($dominance ? 'true' : 'false') . " <br />";
//    echo "DominanceOrEqual test: " . ($dominanceOrEqual ? 'true' : 'false') . " <br />";
//    echo "StrictlyDominance test: " . ($strictlyDominance ? 'true' : 'false') . " <br />";
//    echo PHP_EOL . "===============================================================================" . PHP_EOL;
//
//    die();

//    print_r(unserialize($_SESSION['qL']));
//    echo "<br />";
//    print_r($data[$id]);
//    echo PHP_EOL . "<br /> ========= " . PHP_EOL;
//    print_r($data);

$res = $bra->query($data, $data[$id], unserialize($_SESSION['qL']));
//echo "qL: <br>";
//print_r(unserialize($_SESSION['qL']));
//echo "Res: <br />";
//print_r($res);
//echo "data[$id]: <br>";
//print_r($data[$id]);
//echo "ranges: <br>";
//print_r(unserialize($_SESSION['ranges']));
//echo "DATA: <br>";
//print_r($data);
$result = array();
$index = 0;
foreach(unserialize($_SESSION['ranges']) as $attrName => $val){
//    print_r($res);
    $attr = $res->attributes[$index];
    $result[$attrName] = $attr;

    $index++;
}
echo json_encode(array(
    "qL" => $result
));
//echo '</pre></body></html>';