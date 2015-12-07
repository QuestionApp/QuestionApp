<?php
/*
echoes, in table format, all questions of the active class,
or all questions of a given class if provided
*/
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

if ($_POST["amount"] == null) {
	die("Error: Amount not found.");
}

if ($_POST["class"] != "null") {
	$class = $_POST["class"];
}

$amount = $_POST["amount"];

$conn = mysqli_connect($servername, $username, $password, $db, $port);

if (!$conn) {
	die("Connection failed: " . mysqli_connect_error());
}

$sql = "SELECT questionID, questionContent, weight FROM question
		WHERE class = \"$class\" AND flagged = 0;";

$result = mysqli_query($conn, $sql);

if ($result) {
	$i = 0;
	
	if ($_POST["isInstructor"] != 0) {
		echo "<table id=\"qTable\">";
		$row = mysqli_fetch_assoc($result);
		while ($row && $i < $amount) {
			echo "<tr id=\"q".$row["questionID"]."\">"
			."<td style=\"width: 50px;\"><img class=\"flag\"></img></td>"
			."<td><p>".$row["questionContent"]."</p></td>"
			."<td style=\"width: 50px;\"><img class=\"vote\"></img>"
			."<span class=\"weight\">".$row["weight"]."</span></td>"
			."<td style=\"width: 50px;\"><img class=\"check\"></img></td></tr>";
			
			$row = mysqli_fetch_assoc($result);
			++$i;
		}
		echo "</table>";
	}
	else {
		echo "<table id=\"qTable\">";
		$row = mysqli_fetch_assoc($result);
		while ($row && $i < $amount) {	
			echo "<tr id=\"q".$row["questionID"]."\">"
			."<td><p>".$row["questionContent"]."</p></td>"
			."<td style=\"width: 50px;\"><img class=\"vote\"></img><span class=\"weight\">"
			.$row["weight"]."</span></td></tr>";		
			
			$row = mysqli_fetch_assoc($result);
			++$i;
		}
		echo "</table>";
	}
}
else {
	echo mysqli_error($conn);
}

mysqli_close($conn);
?>


