<?php
session_start();
if (!isset($_SESSION["name"])) {
	header("Location: home.php");
	die();
}
else {
	$currName = $_SESSION["name"];	
	$class = $_SESSION["active"];
}

require("configure.php");

if ($_POST["instructorName"] == null) {
	die("Error: Input not found.");
}

$instructorName = $_POST["instructorName"];

$conn = mysqli_connect($servername, $username, $password, $db, $port);

if (!$conn) {
	die("Connection failed: " . mysqli_connect_error());
}

$sql = "SELECT classID FROM class 
		WHERE title = \"$class\"";

$result = mysqli_query($conn, $sql);

$classID = mysqli_fetch_assoc($result)["classID"];


$sql = "DELETE FROM instructor
		WHERE classID = $classID
		AND name = \"$instructorName\"";

$result = mysqli_query($conn, $sql);		

echo mysqli_error($conn);
		
mysqli_close($conn);

