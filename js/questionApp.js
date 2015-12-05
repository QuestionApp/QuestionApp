//JS file for QuestionApp (working title)
window.onload = function() {
	refreshNavLinks();
	addWelcome();
};

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

function addWelcome(){
	var name = getCookie("name");
	//alert(name);
	if (!name) {	//in case this is called without the cookie being set
		throw new Error("User's name was not set");
	}
	var nav = document.getElementById("navigation");
	var navList = nav.lastElementChild;
	var welcome = document.createElement("li");
	welcome.innerHTML = "Welcome, " + name;
	
	navList.insertBefore(welcome, navList.firstChild);
	
}

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

function submitQuestion() {
	var input = document.getElementById("questionInput").value || null;
	var error = document.getElementById("questionError");
	
	if (input) {
		error.style.display = "none"; //hide error message
		var popup = createPopup();
		document.body.appendChild(popup);
		
		var continueB = popupVerify();
		
		continueB.onclick = function() {
			loadingIMG("whitePrompt");
			
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

function popupVerify() {
	var prompt = document.getElementById("whitePrompt");
	
	var title = document.createElement("P");
	title.innerHTML = "What about these:";
	prompt.appendChild(title);
	
	var questionScroll = document.createElement("DIV");
	questionScroll.id = "scrollMenu";
	prompt.appendChild(questionScroll);
	populateQuestions();
	
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

function populateQuestions() {
	var data = "amount=10";
	questionScroll = document.getElementById("scrollMenu");
	
	loadingIMG("scrollMenu");
	
	XMLRequest("populateQ.php", data, function(xhttp) {
		questionScroll.innerHTML = xhttp.responseText;
		populateVotes();
	});
}

function populateVotes() {
	var allVotes = document.getElementsByClassName("vote");

	for (var i = 0; i < allVotes.length; i++) {
		allVotes[i].src = "images/inactiveArrow.png";
		allVotes[i].onclick = function() {
			handleVote(this.parentElement.parentElement.id);
			this.onclick = null;
		}
	}
}

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

function makeVoted(qID) {
	var question = document.getElementById(qID);
	var vote = question.lastElementChild.firstChild;
	var weight = question.lastElementChild.lastChild;
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

function createPopup() {
	if (document.getElementById("blackOverlay")) {
		document.body.removeChild(document.getElementById("blackOverlay"));
	}
	var popup = document.createElement("DIV");
	popup.id = "blackOverlay";
	
	var prompt = document.createElement("DIV");
	prompt.id = "whitePrompt";
	popup.appendChild(prompt);
	return popup;
}

function hidePopup() {
	var popup = document.getElementById("blackOverlay");
	popup.style.display = "none";
}

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



