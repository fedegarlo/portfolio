<?php
/**
 * @file
 * User has successfully authenticated with Twitter. Access tokens saved to session and DB.
 */

/* Load required lib files. */
session_start();
require_once('twitteroauth/twitteroauth.php');
require_once('config.php');

$usuarioActual = substr($_SERVER['REQUEST_URI'],6);

/* If access tokens are not available redirect to connect page. */

/* Get user access tokens out of the session. */
$access_token = $_SESSION['access_token'];
/* Create a TwitterOauth object with consumer/user tokens. */
if (!empty($_SESSION['access_token'])) {
	$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);

	/* If method is set change API call made. Test is called by default. */
	$content2 = $connection->get('account/verify_credentials')->id;
	$user_img = $connection->get('account/verify_credentials')->profile_image_url;
	$user_name = $connection->get('account/verify_credentials')->screen_name;
	$user_description = $connection->get('account/verify_credentials')->description;

	if ($content2.length != 0) {
		$_SESSION['user_name'] = $user_name;
		$_SESSION['id_user'] = $content2;
		$_SESSION['id_user_img'] = $user_img;
		$hoy = date("Y-m-d H:i:s");

		$sql = "INSERT INTO `gpa_users` VALUES ('".$content2."', '".$user_name."', '".$user_img."', '".$user_description."','','".$hoy."')";
		$resp = mysql_query($sql);

		$sql = "UPDATE `gpa_users` SET  `profile_image_url` =  '".$user_img."' WHERE  `id` ='".$content2."' LIMIT 1" ;
		$resp = mysql_query($sql);
	}
}

if (!empty($_SESSION['id_user'])) {
	$content = '<a href="https://twitter.com/share?text=I´m a Mac Fool&hashtag=apple&url=http%3A%2F%2Fmacfools.com%2Fuser%2F'.$_SESSION['user_name'].'" class="twitter-share-button" data-lang="en">Tweet</a>';
	$tabContent='data-toggle="tab"'; 
	$misProductos = true;
	$logado = '<script>var logado = true;</script>';

} else {
	$content = '<a href="http://www.macfools.com/redirect.php"><img src="./images/lighter.png" alt="Sign in with Twitter"/></a>';
	$tabContent = 'data-toggle="modal" data-target="#myModal"';
	$misProductos = false;
	$logado = '<script>var logado = false;</script>';
}
include('usuarios.inc');
