// Structure
// ----------------------------------------------
//ZONE CHECK FORM
	var checkForm = document.querySelector('.zonecheck');
	var checkNumber = document.querySelector('#checknumber');
	var checkStreet = document.querySelector('#checkstreet');
	var checkZip = document.querySelector('#checkzip');

//ZONE RESULTS
var zoneData;
var myStreet;
var myZone = document.querySelector('.letter');
var myFee = document.querySelector('.fee');
var myExpDate;
var myCleanDate = document.querySelector('#cleandate');
var news = document.querySelector('.news');
var zoneTag = document.querySelector('#zonetag');
var noZoneFAQ = document.querySelector('#nozonefaq');


//APP FORM
var appForm = document.querySelector(".application");
var appNumber = document.querySelector('#appnumber');
var appStreet = document.querySelector('#appstreet');
var appZip = document.querySelector('#appzip');


//CONFIRM
var main = document.querySelector(".main");


var myFirebaseRef = new Firebase("https://parking-permit.firebaseIO.com");
var appsFirebaseRef = new Firebase("https://parking-permit.firebaseIO.com/apps");
var newKey;

// Events
// ----------------------------------------------
checkForm.addEventListener("submit", getZone);
appForm.addEventListener("submit", submitApp);




// Setup
// ----------------------------------------------





// Event handlers
// ----------------------------------------------
function getZone(e){
	event.preventDefault();
	myStreet = checkStreet.value;
	myStreet = myStreet.toLowerCase();
	jQuery.getJSON("http://ashleymmeyers.github.io/fewd-36/parking-permit/js/zones.json", storeJSON);
}

function storeJSON(json){
	// console.log("storeJSON");
	zoneData = json["zones"];
	setZone();
}

function setZone () {
	// console.log("setZone");
	//Checking if neither "fell" nor "larkin", if so return
	if ( (myStreet.indexOf("larkin") == -1) && (myStreet.indexOf("eddy") == -1) ) {
		console.log("no street");
		zoneTag.setAttribute("class", "nozone");
		news.textContent = "Sorry, that address is not in a residential parking permit zone.";
		noZoneFAQ.removeAttribute("class");
		return;
	}

	//check if "fell", if so set var zoneData to object 0
	if (myStreet.indexOf("eddy") == 0) {
		zoneData = zoneData[1];
	}

	//check if "larkin", if so set var zoneData to object 1
	if (myStreet.indexOf("larkin") == 0) {
		zoneData = zoneData[0]
	}

	showZone();


}


// Update page functions
// ----------------------------------------------
//to display zone result
function showZone() {
	// console.log("showZone");
	zone = zoneData["zone"]
	expDate = zoneData["exp_date"]
	news.textContent = "Good news! Your address qualifies."
	zoneTag.removeAttribute("class"); 
	noZoneFAQ.setAttribute("class", "hide");
	zoneTag.setAttribute("class", zone);
	myCleanDate.textContent = ("on " + zoneData["clean_date"]);

	myZone.textContent = zone;
	//calculate if <6 months expiration
	// var nowMonth = (new Date()).getMonth();
	// var expMonth = new Date(expDate).getMonth();



	myFee.textContent = zone + " Zone permits expire annually on " + expDate + ". Because this is in less than 6 months, your annual fee of $111 will be reduced to $55 this year.";
	preFill();
}

//to pre-fill application form & copy (also capitalizes street in Check Zone form input)
function preFill(e) {
	// console.log("preFill")
	checkStreet.value = toTitleCase(myStreet);
	appStreet.value = toTitleCase(myStreet);
	appNumber.value = checkNumber.value;
	appZip.value = checkZip.value;
}


//to submit application
function submitApp(form) {
	event.preventDefault();
	// Store to firebase
	var newApp = appsFirebaseRef.push({
	          firstName: appForm.firstName.value,
	          lastName: appForm.lastName.value,
	          email: appForm.email.value,
	          phone: appForm.phone.value,
	          addressNum: appNumber.value,
	          addressStreet: appStreet.value,
	          addressZip: appZip.value,
	          make: appForm.make.value,
	          model: appForm.model.value,
	          plate: appForm.plate.value,
	          year: appForm.year.value
	    });

	var newKey = newApp.key();
	console.log('my new shiny id is '+ newKey);

	var confirm = document.createElement("div");
	confirm.setAttribute("class", "confirm");
	var confirmText = document.createElement("p");
	confirmText.textContent = "Thanks, " + appForm.firstName.value + ". Your application for " + appNumber.value + " " + appStreet.value + " has been submitted.";
	confirm.appendChild(confirmText);
	var nextStep = document.createElement("p");
	nextStep.setAttribute("class", "fee");
	nextStep.textContent = "We'll process your application within 21 days, and will contact you if we have any questions.";
	confirm.appendChild(nextStep);
	main.appendChild(confirm);

}



//Formatting 
// ----------------------------------------------
function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}