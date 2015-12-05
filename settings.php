<?php
session_start();
if (!isset($_SESSION["name"])) {
	header("Location: home.php");
	die();
}

$name = $_SESSION["name"];

$connected = "Connected";

include("common.php");
common_head();
?>
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
	<div id="settingsBottom">
		<ul>
			<li><a href="#">Report Bug</a></li>
			<li><a href="#">Terms & Service</a></li>
			<li><a href="#">Privacy Policy</a></li>
		</ul>
	</div>
</div>
<?php 
common_foot();
?>