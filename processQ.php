<?php
session_start();
if (!isset($_SESSION["name"])) {
	header("Location: home.php");
	die();
}
include("common.php");
common_head();

print(htmlentities($_POST["question"]));

common_foot();
?>