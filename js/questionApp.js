//JS file for QuestionApp (working title)
//whenever a new page loads, refresh the navigation bar
window.onload = function() {
	refreshNavLinks();
	addWelcome();
	if (document.getElementById("allInstructors")) {
		getInstructors();
	}
};

//ensures that the navigation bar will not provide a link
//to the current page
function refreshNavLinks() {
	var nav = document.getElementById("navigation");
	var navLinks = nav.lastElementChild.children;
	var current = window.location.href;
	
	for (var i = 0; i < navLinks.length; ++i) {
		if (current == navLinks[i].lastElementChild.href) {
			navLinks[i].lastElementChild.className = "disabled";
		}
	}
}

//adds a welcome message for whoever is in-session to the navigation bar
function addWelcome(){
	var name = getCookie("name");

	if (!name) {	//in case this is called without the cookie being set
		throw new Error("User's name was not set");
	}
	var nav = document.getElementById("navigation");
	var navList = nav.lastElementChild;
	var welcome = document.createElement("li");
	welcome.innerHTML = "Welcome, " + name;
	
	navList.insertBefore(welcome, navList.firstChild);
	
}

//gets the contents of a cookie of the given name
//cookies come from document.cookie in the form of:
//"cookie1=value; cookie2=value; ..."
function getCookie(cName){
	var fullCookies = document.cookie.split(";");
	
	for (var i = 0; i < fullCookies.length; ++i) {
		curr = fullCookies[i].split("=");
		curr[0].trim();
		if (curr[0] == cName) {
			return curr[1];
		}
	}
	return undefined; 
}

function getInstructors() {
	var allInstructors = document.getElementById("allInstructors");
	
	var data = "input=plsRespond";
	
	XMLRequest("getInstructors.php", data, function(xhttp) {
		allInstructors.innerHTML = xhttp.responseText;
		populateInstructorX();
	});
}

function populateInstructorX() {
	var allX = document.getElementsByClassName("instructorX");

	for (var i = 0; i < allX.length; i++) {
		allX[i].src = "images/X-small.png";
		allX[i].onclick = function() {
			this.onclick = null;
			this.parentElement.parentElement.removeChild(this.parentElement);
			handleX(this.parentElement.id);
		}
	}
}

function handleX(instructorName) {
	var data = "instructorName=" + instructorName;
	
	XMLRequest("deleteInstructor.php", data, function(xhttp) {
		console.log(xhttp.responseText);
	});
}

//populate a questionStream with instructor permissions for the currentClass
function questionStreamInstructor(currentClass) {
	var title = document.createElement("H1");
	title.innerHTML = currentClass
	
	var questionWrapper = document.createElement("DIV");
	questionWrapper.id = "questionWrapper";
	
	var questionStream = document.createElement("DIV");
	questionStream.id = "questionStream";
	
	var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	
	var labels = ["Questions", "Topics", "Flagged"];
	for (var i = 0; i < 3; ++i) {		
		var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
		g.id = labels[i];
		g.setAttribute("class", "inactiveTab");
		
		var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
		text.innerHTML = labels[i];
		text.setAttribute("x", 6 + 195 * i);
		text.setAttribute("y", 30);
		
		var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		var d = "M" + (195 * i) + ",40 L" + (195 * i)
					+ ",0 L" + (185 + 185 * i) + ",0 L"
					+ (195 + 195 * i) + ",40";
		path.setAttribute("d", d);
		//"M0,40 L0,0 L142,0 L158,40"
		
		g.appendChild(path);
		g.appendChild(text);
		svg.appendChild(g);
	}
	questionWrapper.appendChild(svg);
	
	var questionScroll = document.createElement("DIV");
	questionScroll.id = "scrollMenu";
	
	var content = document.getElementById("content");
	
	while(content.firstChild) {
		content.removeChild(content.firstChild);
	}
	
	content.appendChild(title);
	questionStream.appendChild(questionScroll);
	questionWrapper.appendChild(questionStream);
	content.appendChild(questionWrapper);
	
	var activeTab = document.getElementById("Questions");
	activeTab.setAttribute("class", "activeTab");
	populateQuestions(10, "null", 1);
	
}

//called when a student presses the submit button on the home page
//if input was given, create the questions popup, otherwise display error
function submitQuestion() {
	var input = document.getElementById("questionInput").value || null;
	var error = document.getElementById("questionError");
	
	if (input) {
		error.style.display = "none"; //hide error message
		createPopup();
		
		//the button to proceed with posting the question
		var continueB = popupVerify();
		
		continueB.onclick = function() {
			loadingIMG("whitePrompt");
			
			//process the question with processQ.php
			var data = "question=" + input;
			XMLRequest("processQ.php", data, function(xhttp) {
				if (xhttp.responseText) {
					popupResult(true);
				}
				else {
					popupResult(false);
				}
			});
		}
	}
	else {
		error.innerHTML = "Please enter a question first.<br />";
		error.style.display = "inline"; //show error message
	}
}

//sets up a whitePrompt for verifying if a student wants to
//post their question
//assumes a whitePrompt element is available for use
//returns the continue posting button so action can be added to it
function popupVerify() {
	var prompt = document.getElementById("whitePrompt");
	
	var title = document.createElement("P");
	title.innerHTML = "What about these:";
	prompt.appendChild(title);
	
	var questionScroll = document.createElement("DIV");
	questionScroll.id = "scrollMenu";
	prompt.appendChild(questionScroll);
	
	//puts questions in the questionScroll 
	populateQuestions(10, "null");
	
	var continueB = document.createElement("DIV");
	continueB.innerHTML = "<button>Post my question</button>";
	
	var goBack = document.createElement("DIV");
	goBack.innerHTML = "<button>Go Back</button>";
	goBack.onclick = function() {
		hidePopup();
	}
	prompt.appendChild(goBack);
	
	prompt.appendChild(continueB);
	
	return continueB;
}

//calls a php file to get questions related to the class chosen
//from the database in format that is directly placed into the
//questionScroll HTML
function populateQuestions(amount, classChosen, isInstructor) {
	isInstructor = isInstructor || 0;
	
	var data = 	"amount=" + amount + "&class=" + classChosen 
				+ "&isInstructor=" + isInstructor;
				
	questionScroll = document.getElementById("scrollMenu");
	
	loadingIMG("scrollMenu");
	if (isInstructor) {
		//get questions related to class and amount for istructor
		XMLRequest("populateQ.php", data, function(xhttp) {
			questionScroll.innerHTML = xhttp.responseText;
			populateVotes();
			populateChecks();
			populateFlags();
		});
	}
	else {
		//get questions related to class and amount for student
		XMLRequest("populateQ.php", data, function(xhttp) {
			questionScroll.innerHTML = xhttp.responseText;
			populateVotes();
		});	
	}
}

function populateFlags() {
	var allFlags = document.getElementsByClassName("flag");

	for (var i = 0; i < allFlags.length; i++) {
		allFlags[i].src = "images/inactiveFlag.png";
		allFlags[i].onclick = function() {
			this.onclick = null;
			this.src = "images/activeFlag.png";
			handleFlag(this.parentElement.parentElement.id);
		}
	}
}

//assumes all elements of class "vote" are img elements
//and gives them the inactive arrow picture and a click action 
function populateVotes() {
	var allVotes = document.getElementsByClassName("vote");

	for (var i = 0; i < allVotes.length; i++) {
		allVotes[i].src = "images/inactiveArrow.png";
		allVotes[i].onclick = function() {
			this.onclick = null;
			handleVote(this.parentElement.parentElement.id);
		}
	}
}

//assumes all elements of class "check" are img elements
//and gives them the inactive check picture
//hovering and clicking cause the image to change
function populateChecks() {
	var allChecks = document.getElementsByClassName("check");

	for (var i = 0; i < allChecks.length; i++) {
		allChecks[i].src = "images/inactiveCheck.png";
		
		allChecks[i].onmouseenter = function() {
			this.src = "images/hoverCheck.png";
		}
		
		allChecks[i].onmouseleave = function() {
			this.src = "images/inactiveCheck.png";
		}
		
		allChecks[i].onclick = function() {
			this.onclick = null;
			this.onmouseenter = null;
			this.onmouseleave = null;
			this.src = "images/activeCheck.png";
			handleCheck(this.parentElement.parentElement.id);
		}
	}
}

//tells the server that a certain question has been upvoted
function handleVote(qID) {
	id = qID.substring(1, qID.length);
	data = "qID=" + id;
	XMLRequest("addWeight.php", data, function(xhttp) {
		if (xhttp.responseText == 1) {
			makeVoted(qID);
		}
		else {
			console.log(xhttp.responseText);
		}
	});
}

//updates the question's vote element to show its been upvoted
function makeVoted(qID) {
	var question = document.getElementById(qID);
	var vote = question.getElementsByClassName("vote")[0];
	var weight = vote.parentElement.lastElementChild;
	weight.innerHTML = parseInt(weight.innerHTML) + 1;
	vote.src = "images/activeArrow.png";
}

//does a POST request to the target url and gives it the callback function
function XMLRequest(url, postData, callback) {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				callback(xhttp);
			}
			else if (xhttp.status == 404){
				console.log("page not found");
				console.log(xhttp.readyState);
			}
			else {
				
			}
		};
		xhttp.open("POST", url, true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send(postData);	
}

//creates a new Popup, consisting of a blackOverlay and whitePrompt
function createPopup() {
	if (document.getElementById("blackOverlay")) {
		document.body.removeChild(document.getElementById("blackOverlay"));
	}
	var popup = document.createElement("DIV");
	popup.id = "blackOverlay";
	
	var prompt = document.createElement("DIV");
	prompt.id = "whitePrompt";
	popup.appendChild(prompt);
	
	document.body.appendChild(popup);
}

//hides the Popup
function hidePopup() {
	var popup = document.getElementById("blackOverlay");
	popup.style.display = "none";
}

//puts a success or failure image in the Popup based
//on the boolean parameter 
function popupResult(success) {
	var prompt = document.getElementById("whitePrompt");
	
	while(prompt.firstChild) {
		prompt.removeChild(prompt.firstChild);
	}
	
	if (success) {
		prompt.innerHTML = "<img src=\"images/check.png\"></img>";
	}
	else {
		prompt.innerHTML = "<img src=\"images/X.png\"></img>";
	}
	
	var goBack = document.createElement("P");
	goBack.innerHTML = "<button>Go Back</button>";
	goBack.onclick = function() {
		questionInput = document.getElementById("questionInput");
		questionInput.value = "";
		hidePopup();
	}
	prompt.appendChild(goBack);
}

//Removes all children from element of given ID 
//and then places a loading gif image
function loadingIMG(id) {
	var prompt = document.getElementById(id);
	if (prompt) {
		while(prompt.firstChild) {
			prompt.removeChild(prompt.firstChild);
		}
		
		loading = document.createElement("IMG");
		loading.src = "images/ajax-loader.gif";
		prompt.appendChild(loading);
	}
	else {
		console.log("loading passed bad id");
	}
}



