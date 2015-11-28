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

