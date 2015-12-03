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

if ($_POST["question"] == null) {
	die("Error: Question not found.");
}

$conn = mysqli_connect($servername, $username, $password, $db, $port);

$flagged = 0;
$checked = 0;
$question = htmlentities($_POST["question"]);
$postedTime = date("Y-m-d H:i:s");

$sql = "SELECT userID
		FROM user
		WHERE user.userName = \"$name\"";
$result = mysqli_fetch_assoc(mysqli_query($conn, $sql));
$userID = $result["userID"];

$sql = "INSERT INTO question (userID, flagged, checked, questionContent, timePosted, class) 
		VALUES ($userID, $flagged, $checked, \"$question\", \"$postedTime\", \"$class\")"; 
		
if (mysqli_query($conn, $sql)) {
	echo True;
}
else {
	echo False;
}
		
mysqli_close($conn);
?>

