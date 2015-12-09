<?php
session_start();
if (!isset($_SESSION["name"])) {
	header("Location: home.php");
	die();
}
include("common.php");
common_head(); ?>

<div class="menu">
	<h2>Under Construction</h2>
	<img src="images/alert.png"></img>
</div>

<?php
common_foot();
?>