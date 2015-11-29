<?php
session_start();

if (isset($_SESSION["name"])) {
	$name = $_SESSION["name"];
	$type = $_SESSION["type"];
	$classes = $_SESSION["classes"];
	
}
else {
	$_SESSION["name"] = "Shaun";
	$_SESSION["type"] = "Student";
	$_SESSION["classes"] = ["INFO 200"=>True,
							"CSE 142"=>True,
							"MATH 125"=>False];
	$name = $_SESSION["name"];
	$type = $_SESSION["type"];
	$classes = $_SESSION["classes"];
}
setcookie("name", $name);
include("common.php");
common_head();
?>
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

common_foot();
?>

