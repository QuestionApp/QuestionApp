<?php
session_start();
if (isset($_SESSION["name"])) {
	$name = $_SESSION["name"];
}
else {
	$_SESSION["name"] = "Shaun";
	$_SESSION["Type"] = "Student";
	$_SESSION["Classes"] = ["Info 200"=>True,
							"CSE 142"=>True,
							"MATH 125"=>False];
}
setcookie("name", $name);
include("common.php");
common_head();
?>