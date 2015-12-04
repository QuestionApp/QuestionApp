<?php
session_start();
if (!isset($_SESSION["name"])) {
	header("Location: home.php");
	die();
}
else {
	$name = $_SESSION["name"];	
	$class = $_SESSION["active"];
}

require("configure.php");

if ($_POST["qID"] == null) {
	die("Error: No Question ID received.");
}

$id = $_POST["qID"];

$conn = mysqli_connect($servername, $username, $password, $db, $port);

if (!$conn) {
	die("Connection failed: " . mysqli_connect_error());
}

$sql = "SELECT weight FROM question WHERE questionID = $id";

$result = mysqli_query($conn, $sql);

if ($result) {
	if (mysqli_num_rows($result) == 1) {
		$weight = mysqli_fetch_assoc($result)["weight"];
		++$weight;
		$sql = "UPDATE question
				SET weight = $weight
				WHERE questionID = $id";
		if (mysqli_query($conn, $sql)) {
			echo 1;
		}
		else {
			echo mysqli_error($conn);
		}
	}
	else {
		echo "Wrong amount of rows.";
	}
}
else {
	echo mysqli_error($conn);
}

mysqli_close($conn);