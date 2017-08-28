<?php

/**
 * @file
 * A single location to store configuration.
 */
$misProductos = false;

$DBhost = "db346.1and1.es";   // servidor
$DBuser = "dbo348591756";            // usuario base
$DBpass = "amansalva";            // contraseña del host
$DBName = "db348591756";            // nombre de la base de datos
$DBConn = mysql_connect($DBhost,$DBuser,$DBpass) or die("Error" . mysql_error());
mysql_select_db($DBName, $DBConn) or die("Error" . mysql_error());

define('CONSUMER_KEY', 'hn14tFpuX4OBuOCMc9O7Q');
define('CONSUMER_SECRET', 'r1qzVJWa0SuBim0ljYMOU4Bbot7IPcyYlLpbfDC6I');
define('OAUTH_CALLBACK', 'http://www.macfools.com/callback.php');
