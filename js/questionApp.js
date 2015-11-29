//JS file for QuestionApp (working title)
window.onload = function() {
	//alert("here I am");
	//console.log("pls love me");
	refreshNavLinks();
	addWelcome();
};

function refreshNavLinks() {
	var nav = document.getElementById("navigation");
	var navLinks = nav.lastElementChild.children;
	console.log(navLinks);
	var current = window.location.href;
	console.log(current);
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
		var popup = createPopup();
		document.body.appendChild(popup);
		/*
		error.style.display = "none"; //hide error message
		xhttp.open("POST", "processQ", true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send("question"=input);
		xhttp.onreadystatechange = function() {
			
		}
		*/
	}
	else {
		error.innerHTML = "Please enter a question first.";
		error.style.display = "block"; //show error message
	}
}

function createPopup() {
	var popup = document.createElement("DIV");
	popup.className = "blackOverlay";
	popup.onclick = function() {
		this.style.display = "none";
	}
	
	var prompt = document.createElement("DIV");
	prompt.className = "whitePrompt";
	popup.appendChild(prompt);
	return popup;
}