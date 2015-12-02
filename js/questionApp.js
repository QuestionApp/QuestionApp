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
		popupVerify();
		/*
		popupLoading();
		
		var data = "question=" + input;
		XMLRequest("processQ.php", data, function(xhttp) {
			popup.style.display = "none";
			console.log(xhttp.responseText);			
		});
		*/
	}
	else {
		error.innerHTML = "Please enter a question first.";
		error.style.display = "block"; //show error message
	}
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
	popup.onclick = function() {
		this.style.display = "none"; //the popup dissapears when clicked on
	}
	
	var prompt = document.createElement("DIV");
	prompt.id = "whitePrompt";
	popup.appendChild(prompt);
	return popup;
}

function popupLoading() {
	var prompt = document.getElementById("whitePrompt");
	loading = document.createElement("IMG");
	loading.src = "images/ajax-loader.gif";
	prompt.appendChild(loading);
}

function popupVerify() {
	var prompt = document.getElementById("whitePrompt");
	var title = document.createElement("P");
	title.innerHTML = "Did you mean...?";
	var questionScroll = document.createElement("DIV");
	questionScroll.id = "scrollMenu";
	questionScroll.innerHTML = "<p>a</p><p>b</p><p>c</p><p>d</p><p>a</p><p>b</p><p>c</p><p>d</p><p>a</p><p>b</p><p>c</p><p>d</p>";
	var continueB = document.createElement("P");
	continueB.innerHTML = "<button>No, post my question.</button>"
	
	prompt.appendChild(title);
	prompt.appendChild(questionScroll);
	prompt.appendChild(continueB);
}

