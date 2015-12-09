<?php
session_start();

if (isset($_SESSION["name"]) && $_SESSION["name"] == $_SERVER["REMOTE_USER"]) {
	$name = $_SESSION["name"];
	$type = $_SESSION["type"];
	$classes = $_SESSION["classes"];
	$active = $_SESSION["active"];
}
else {
	if ($_SERVER["REMOTE_USER"]) {
		$_SESSION["name"] = $_SERVER["REMOTE_USER"];
		$_SESSION["type"] = "Instructor"; //can be Student or Instructor
		$_SESSION["classes"] = ["INFO 200"=>True,
								"CSE 142"=>True,
								"MATH 125"=>False];
		$_SESSION["active"] = "INFO 200";
		
		$name = $_SESSION["name"];
		$type = $_SESSION["type"];
		$classes = $_SESSION["classes"];
		$active = $_SESSION["active"];
	}
}
setcookie("name", $name);
include("common.php");
require("configure.php");

$newUser = saveUser($servername, $username, $password, $db, 
					$port, $name, $type, $active, $classes);

common_head();
if ($active) {
	if ($type == "Instructor") { ?>
		<script type="text/javascript">
			questionStreamInstructor(<?="\"$active\""?>);
		</script>
	<?php } 
	else { //type == Student ?>
		<h1><?=$active?></h1>
		<div class="menu">	
			<h2>Type your question here:</h2>
			<p id="questionError"></p>
			<textarea id="questionInput"></textarea>
			<p><button onclick="submitQuestion()">Submit</button></p>
		</div>
	<?php }
}
else { ?>
	<div id="homeClasses" class="menu">
		<h2>Your Classes</h2>
		<?php
		foreach (array_keys($classes) as $class) { 
			if ($classes[$class]) { ?>
				<p><a onclick="streamClass(<?=$class?>)" href="#"><?=$class?></a></p>
			<?php }
			else { ?>
				<p><?=$class?></p>
			<?php }
		}?>
	</div>
<?php }

function saveUser($servername, $username, $password, $db, 
				  $port,$name, $type, $active, $classes) {
	$conn = mysqli_connect($servername, $username, $password, $db, $port);

	if (!$conn) {
		die("Connection failed: " . mysqli_connect_error());
	}

	$sql = "SELECT * FROM user WHERE userName = \"$name\"";
	$result = mysqli_query($conn, $sql);
	if ($result) {
		if (mysqli_num_rows($result) > 0) { /*person exists*/
			$sql = "SELECT us.type
					FROM user as u
					JOIN usertype as us
					ON u.userID = us.userID
					WHERE u.userName = \"$name\"
					AND us.type = \"$type\"";
			
			$result = mysqli_query($conn, $sql);
			
			if (mysqli_num_rows($result) > 0) { 
			/*user has had this type before */
				return true;
			}
			
			$sql = "SELECT userID FROM user WHERE userName = \"$name\"";
			$result = mysqli_query($conn, $sql);
			$userID = mysqli_fetch_assoc($result)["userID"];
			
			$sql = "INSERT INTO usertype (userID, type)
					VALUES ($userID, \"$type\");";
			
			$result = mysqli_query($conn, $sql);
			mysqli_close($conn);
			
			if ($type = "Instructor") {
				addTeacher($servername, $username, $password, $db, $port,
						   $name, $active);
			}
			
			return true;
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
				mysqli_close($conn);
				die("Error: " . mysqli_error($conn));
			}
			
			if ($type = "Instructor") {
				addTeacher($servername, $username, $password, $db, $port,
						   $name, $active);
			}
			
			return False;
		}
	}
	else {
		mysqli_close($conn);
		die("Error: " . mysqli_error($conn));
	}

}

//adds the teacher's name to the specified class
function addTeacher ($servername, $username, $password, $db, $port, $name, $class) {
	
	$conn = mysqli_connect($servername, $username, $password, $db, $port);

	if (!$conn) {
		die("Connection failed: " . mysqli_connect_error());
	}	
	
	$sql = "SELECT classID FROM class 
			WHERE name = \"$class\"";
	
	$result = mysqli_query($conn, $sql);

	//class existed already
	if (mysqli_num_rows($result) > 0) {
		$classID = mysqli_fetch_assoc($result)["classID"];
	}
	//add the class first
	else {
		$sql = "INSERT INTO class (title)
				VALUES (\"$class\")";
		
		mysqli_query($conn, $sql);

		$classID = mysqli_insert_id($conn);
	}
	
	//add the instructor to the class
	$sql = "INSERT INTO instructor (classID, name)
			VALUES ($classID, \"$name\")";
	
	mysqli_query($conn, $sql);
}

common_foot();
?>

