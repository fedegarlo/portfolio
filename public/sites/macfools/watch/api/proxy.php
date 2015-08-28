<?php

header('Content-type: application/json');
$file= $_GET["file"];
$html = '_polymer_jsonp_callback_0('.file_get_contents($file.'.json').');';


echo $html;

?>