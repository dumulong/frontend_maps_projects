<?php

header('Content-type: application/json');

$latitude = $_GET['latitude'];
$longitude = $_GET['longitude'];

$auth = 'Bearer KTjY6iqgQAWGF-q7OEIc8WP__Zdjsoa2jFtx-_n985PbzOZ30GWLDbWnjO3R8ruADAjYx_LWQ9NY1pWqwwL86LF5oPqcn7rywmiJVZ-MFdKJUVZCVRDOuTx3GLTnWnYx';

$url = 'https://api.yelp.com/v3/businesses/search';
$url .= '?latitude=' . $latitude;
$url .= '&longitude=' . $longitude;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL,$url);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$headers = [
    'Cache-Control: no-cache',
    'Content-Type: application/json; charset=utf-8',
    'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:28.0) Gecko/20100101 Firefox/28.0',
    'Authorization: ' . $auth
];

curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$result = curl_exec ($ch);

curl_close ($ch);

$data = json_decode($result,true);
echo json_encode($data);

?>