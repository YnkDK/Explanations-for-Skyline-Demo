<?php
require_once("headers.php");

$string = file_get_contents("hotels.json");
$json_a = json_decode($string, true);
echo json_encode([
    "skyline" => [
        [
            "id" => 1,
            "price" => 200,
            "beach" => 0.1,
            "downtown" => 0.8,
            "pools" => 3,
            "rating" => 4.7,
            "stars" => 5
        ],
        [
            "id" => 2,
            "price" => 150,
            "beach" => 0.1,
            "downtown" => 1.1,
            "pools" => 5,
            "rating" => 4.9,
            "stars" => 4
        ]
    ],
    "notSkyline" => $json_a,
    'GET' => $_GET["price"] === "true" ? true : false
]);