<?php
require_once("headers.php");

echo json_encode([
    "skyline" => [
        [
            "price" => 200,
            "beach" => 0.1,
            "downtown" => 0.8,
            "pools" => 3,
            "rating" => 4.7,
            "stars" => 5
        ],
        [
            "price" => 150,
            "beach" => 0.1,
            "downtown" => 1.1,
            "pools" => 5,
            "rating" => 4.9,
            "stars" => 4
        ]
    ],
    "notSkyline" => [
        [
            "price" => 250,
            "beach" => 0.15,
            "downtown" => 0.6,
            "pools" => 2,
            "rating" => 4.9,
            "stars" => 4
        ]
    ]
]);