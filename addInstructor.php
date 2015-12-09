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

if ($_POST["userName"] == null) {
	header("Location: settings.php?er=n");
	die();
}

$instructorName = $_POST["userName"];

if (trim($instructorName) == "") {
	header("Location: settings.php?er=b");
	die();
}

$conn = mysqli_connect($servername, $username, $password, $db, $port);

if (!$conn) {
	die("Connection failed: " . mysqli_connect_error());
}

$sql = "SELECT classID FROM class 
		WHERE title = \"$class\"";

$result = mysqli_query($conn, $sql);

$classID = mysqli_fetch_assoc($result)["classID"];

$sql = "SELECT instructorID
		FROM instructor as i
		JOIN class as c
		ON c.classID = i.classID
		WHERE c.classID = $classID
		AND i.name = \"$instructorName\"";

$result = mysqli_query($conn, $sql);
		
if (mysqli_num_rows($result) > 0) {
	mysqli_close($conn);
	header("Location: settings.php?er=e");
	die();
}	

$sql = "INSERT INTO instructor (classID, name)
		VALUES ($classID, \"$instructorName\")";

mysqli_query($conn, $sql);

mysqli_close($conn);
header("Location: settings.php?er=");
die();
?>