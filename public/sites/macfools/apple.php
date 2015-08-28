<?php

header('Content-type: application/json');

$html = '_polymer_jsonp_callback_0('.file_get_contents('datos.json').');';


echo $html;

?>