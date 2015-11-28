<?php
session_start();
if (isset($_SESSION["name"])) {
	$name = $_SESSION["name"];
}
else {
	$_SESSION["name"] = "Shaun";
}
include("common.php");
common_head();
?>