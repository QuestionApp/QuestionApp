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

if ($_POST["input"] == null) {
	die("Error: Input not found.");
}

$conn = mysqli_connect($servername, $username, $password, $db, $port);

if (!$conn) {
	die("Connection failed: " . mysqli_connect_error());
}

$sql = "SELECT name
		FROM instructor as i
		JOIN class as c
		ON i.classID = c.classID
		WHERE c.title = \"$class\"";

$result = mysqli_query($conn, $sql);

$row = mysqli_fetch_assoc($result);
while ($row) {
	$name = $row["name"];
	echo "<div id=\"$name\">";
	echo "<span>$name</span>";
	if ($name == $currName) {
		echo "<span> (Me) </span>";
	}
	else {
		echo "<img class=\"instructorX\"></img>";
	}
	echo "</div>";
	$row = mysqli_fetch_assoc($result);
}

echo mysqli_error($conn);
		
mysqli_close($conn);
?>