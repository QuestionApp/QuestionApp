<?php
session_start();

if (isset($_SESSION["name"])) {
	$name = $_SESSION["name"];
	$type = $_SESSION["type"];
	$classes = $_SESSION["classes"];
	$active = $_SESSION["active"];
}
else {
	$_SESSION["name"] = "Shaun";
	$_SESSION["type"] = "Student"; //can be Student or Teacher
	$_SESSION["classes"] = ["INFO 200"=>True,
							"CSE 142"=>True,
							"MATH 125"=>False];
	$_SESSION["active"] = "INFO 200";
	$name = $_SESSION["name"];
	$type = $_SESSION["type"];
	$classes = $_SESSION["classes"];
	$active = $_SESSION["active"];
}
setcookie("name", $name);
include("common.php");
common_head();
if ($active) {
	if ($type == "Teacher") {
		
	}
	else { //type == Student?>
		<h1><?=$active?></h1>
		<div>	
			<div>Type your question here:</div>
			<div id="questionError" style="display:none">test</div>
			<textarea id="questionInput"></textarea>
			<div><button onclick="submitQuestion()">Submit</button></div>
		</div>
	<?php }
}
else { ?>
	<div id="homeClasses">
		<span>Your Classes</span>
		<?php
		foreach (array_keys($classes) as $class) { 
			if ($classes[$class]) { ?>
				<p><a href="#"><?=$class?></a></p>
			<?php }
			else { ?>
				<p><?=$class?></p>
			<?php }
		}
}

$servername = "localhost";
$username = "questionapp";
$password = "questionapp1234";
$db = "questionapp";

$conn = mysqli_connect($servername, $username, $password, $db);

/*
$servername = "vergil.u.washington.edu";
$username = "root";
$password = "";
$db = "questionapp";
$port = 9001;

$conn = mysqli_connect($servername, $username, $password, $db, $port);
*/
if (!$conn) {
	die("Connection failed: " . mysqli_connect_error());
}

$sql = "SELECT * FROM user WHERE userName = \"$name\"";
$result = mysqli_query($conn, $sql);
if ($result) {
	if (mysqli_num_rows($result) > 0) { /*person exists*/
		/*
		while ($row = mysqli_fetch_assoc($result)) {
			echo "userID: " . $row["userID"] . " Name: " . $row["userName"];
		}
		*/
	}
	else { /*add the new person*/
		$sql = "INSERT INTO user (userName)
				VALUES (\"$name\")";
		mysqli_query($conn, $sql);
		$id = mysqli_insert_id($conn);
		
		$sql = "INSERT INTO usertype (userID, type)
				VALUES ($id, \"$type\");";
		
		foreach (array_keys($classes) as $class) {
			$sql .= "INSERT INTO attending (userID, title)
					 VALUES ($id, \"$class\");";
		}
		
		if(!mysqli_multi_query($conn, $sql)) {
			echo mysqli_error($conn);
		}
	}
}
else {
	echo "Error: $sql <br />" . mysqli_error($conn);
}

mysqli_close($conn);

common_foot();
?>

