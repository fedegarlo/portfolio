<?php
 
$post_data = $HTTP_RAW_POST_DATA;

$header[] = "Content-type: text/xml";
$header[] = "Content-length: ".strlen($post_data);

$ch = curl_init("http://www.spreaker.com/show/1006429/episodes/feed");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_HTTPHEADER, $header);

if ( strlen($post_data)>0 ){
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
}

$response = curl_exec($ch);
$response=str_replace(' | Spreaker','', $response);
$response=str_replace('feeds@spreaker.com','fgarcialorca@gmail.com', $response);
$response=str_replace('http://www.spreaker.com/show/macfools','http://www.macfools.com', $response);
$response=str_replace('<itunes:image href="http://d1bm3dmew779uf.cloudfront.net/big/5f4d32ae1826e42591a17cf624537d07.jpg"/>', '', $response);
$response=str_replace('ahora.</description>', 'ahora.</description><language>es</language><itunes:owner><itunes:name>
<![CDATA[ Fede García ]]>
</itunes:name>
<itunes:email>fgarcialorca@gmail.com</itunes:email></itunes:owner>
<itunes:image href="http://macfools.com/podcast/cover.jpg"/>
<itunes:category text="Technology"/>
<itunes:category text="Technology">
<itunes:category text="Tech News"/>
</itunes:category>
<itunes:explicit>no</itunes:explicit>', $response);
$response=str_replace('http://d1bm3dmew779uf.cloudfront.net/big/5f4d32ae1826e42591a17cf624537d07.jpg', 'http://macfools.com/podcast/cover.jpg', $response);
$response=str_replace('</pubDate>','</pubDate><itunes:image href="http://macfools.com/podcast/cover.jpg"/>', $response);
$response_headers = curl_getinfo($ch);  

if (curl_errno($ch)) {
    print curl_error($ch);
} else {
    curl_close($ch);
    header( 'Content-type: text/xml');
    print $response;
}


?>