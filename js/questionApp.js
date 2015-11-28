//JS file for QuestionApp (working title)
window.onload = function() {
	//alert("here I am");
	//console.log("pls love me");
	addWelcome();
};

function addWelcome(){
	var name = getCookie("name");
	//alert(name);
	if (!name) {	//in case this is called without the cookie being set
		throw new Error("User's name was not set");
	}
	var nav = document.getElementById("navigation");
	console.log(nav);
	navList = nav.lastElementChild;
	console.log(navList);
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