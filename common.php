<?php
/* Stuff that is common to every page */
function common_head() { ?>
	<!DOCTYPE html>
	<html>
		<head>
			<title>Question App</title>
			<meta charset="utf-8"/>
			<!-- <link href="..." type="image/..." rel="shortcut icon"/> TODO -->
			<link href="style/main.css" type="text/css" rel="stylesheet"/>
			<script type="text/javascript" src="js/questionApp.js"></script>
		</head>
		<body>
			<div id="navigation">
				<ul>
					<li><a href="/questionapp/home.php">Home</a></li>
					<li><a href="/questionapp/myQuestions.php">My Questions</a></li>
					<li><a href="/questionapp/settings.php">Settings</a></li>
					<li><a href="/questionapp/help.php">Help</a></li>
					<li><a href="/questionapp/logout.php">Logout</a></li>
				</ul>
			</div>
		</body>
	</html>
<?php } ?>
