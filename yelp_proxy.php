<?php
//header('Authorization: Bearer KTjY6iqgQAWGF-q7OEIc8WP__Zdjsoa2jFtx-_n985PbzOZ30GWLDbWnjO3R8ruADAjYx_LWQ9NY1pWqwwL86LF5oPqcn7rywmiJVZ-MFdKJUVZCVRDOuTx3GLTnWnYx');
header('Content-type: application/json');

$latitude = $_GET['latitude'];
$longitude = $_GET['longitude'];

//TESTTESTTEST
//$origins = '37.407585,-122.145287';
//$destinations = '37.482890,-122.150235|37.80645,-107.77414';
//TESTTESTTEST

// $url = 'https://api.yelp.com/v3/businesses/search';
// $url .= '?latitude=' . $latitude;
// $url .= '&longitude=' . $longitude;

// $handle = fopen($url, "r");

// if ($handle) {
//     while(!feof($handle)) {
//         $buffer = fgets($handle, 4096);
//         echo $buffer;
//     }
//     fclose($handle);
// }
$auth = 'Bearer KTjY6iqgQAWGF-q7OEIc8WP__Zdjsoa2jFtx-_n985PbzOZ30GWLDbWnjO3R8ruADAjYx_LWQ9NY1pWqwwL86LF5oPqcn7rywmiJVZ-MFdKJUVZCVRDOuTx3GLTnWnYx';
// $r = new HttpRequest('https://api.yelp.com/v3/businesses/search', HttpRequest::METH_GET);
// $r->setHeaders([array('Authorization' => $auth)]);
// $r->addQueryData(array('latitude' => $latitude));
// $r->addQueryData(array('longitude' => $longitude));
// try {
//     $r->send();
//     if ($r->getResponseCode() == 200) {
//         file_put_contents('local.rss', $r->getResponseBody());
//     }
// } catch (HttpException $ex) {
//     echo $ex;
// }

// // Get cURL resource
// $curl = curl_init();
// // Set some options - we are passing in a useragent too here
// curl_setopt_array($curl, array(
//     CURLOPT_RETURNTRANSFER => 1,
//     CURLOPT_URL => 'http://testcURL.com/?item1=value&item2=value2',
//     CURLOPT_USERAGENT => 'Codular Sample cURL Request'
// ));
// // Send the request & save response to $resp
// $resp = curl_exec($curl);
// // Close request to clear up some resources
// curl_close($curl);
// echo $resp;

// $url = 'https://api.yelp.com/v3/businesses/search';
// $url .= '?latitude=' . $latitude;
// $url .= '&longitude=' . $longitude;

// $curl = curl_init();
// curl_setopt($curl, CURLOPT_URL, $url);
// curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
// curl_setopt($curl, CURLOPT_HTTPHEADER, array(
//     'Authorization: ' . $auth
// ));
// $result = curl_exec($curl);
// curl_close($curl);

// echo $url;
// echo $result;

$url = 'https://api.yelp.com/v3/businesses/search';
$url .= '?latitude=' . $latitude;
$url .= '&longitude=' . $longitude;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL,$url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$headers = [
    'X-Apple-Tz: 0',
    'X-Apple-Store-Front: 143444,12',
    'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Encoding: gzip, deflate',
    'Accept-Language: en-US,en;q=0.5',
    'Cache-Control: no-cache',
    'Content-Type: application/x-www-form-urlencoded; charset=utf-8',
    'Host: www.example.com',
    'Referer: http://www.example.com/index.php', //Your referrer address
    'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:28.0) Gecko/20100101 Firefox/28.0',
    'Authorization: ' . $auth
];

curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$server_output = curl_exec ($ch);

curl_close ($ch);

print  $server_output ;
?>