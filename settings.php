<?php
session_start();
if (!isset($_SESSION["name"])) {
	header("Location: home.php");
	die();
}

$name = $_SESSION["name"];
$type = $_SESSION["type"];

$connected = "Connected";

include("common.php");
common_head();

if ($type == "Student") {
	settingsStart($name, $connected);
	settingsBottom();
}
elseif ($type == "Instructor") { 
	settingsStart($name, $connected); ?>
	
	<h3>Instructors for this course:</h3>
	<div id="form">
		<span>Add Instructor:</span>
		<input type="text" name="userName"></input>
		<br />
		<input type="submit" value="Add" onclick="addInstructor()"></input>
	</div>
	<div id="allInstructors">
		
	</div>
	<?php
	settingsBottom();
}
else {
	print("Error: Incorrect login type");
	die();
}	

function settingsStart($name, $connected) { ?>
	<div class="menu">
		<h2><?=$name?> - <?=$connected?></h2>
		<form action="home.php" method="get">
			<div>
				<span>Choose your preferred language:</span>
				<select name="Language">
					<option value="English">English</option>
					<option value="Chinese">Chinese</option>
					<option value="Spanish">Spanish</option>
				</select>
			</div>
			<div>
				<span>Choose your preferred UI Theme:</span>
				<select name="UITheme">
					<option value="Bright">Bright</option>
					<option value="Dark">Dark</option>
				</select>
			</div>
			<input type="submit" value="Apply">
		</form>
<?php }

function settingsBottom() { ?>
		<div id="settingsBottom">
			<ul>
				<li><a href="#">Report Bug</a></li>
				<li><a href="#">Terms & Service</a></li>
				<li><a href="#">Privacy Policy</a></li>
			</ul>
		</div>
	</div>	
<?php }

common_foot();
?>