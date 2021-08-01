let postcodeData;
let weatherData;
let validate;
let postcode;

const weatherKey = "60a300374dd5d7d920d7f1d3493283f9";

function setup() {
	noCanvas()
}


window.addEventListener("load", function () {
	const pattern = /#postcode_/;
	let pageURL = document.location.href
	if (pattern.test(pageURL)){
		let n = pageURL.search("#postcode_");
		postcode = pageURL.slice(n+10,)
		console.log(postcode)
		validatePostcode(postcode)
		}
  });

function getInput() {
	postcode = document.getElementById("input").value;

	postcode = removeSpaces(postcode);
	
	//createP("Your input: " + postcode);
	
	valid = validatePostcode(postcode);
}

function removeSpaces(input) {
	return input.replace(/\s/g,'')
}


function validatePostcode(postcode) {
	url = `https://api.postcodes.io/postcodes/${postcode}/validate`;
	validate = loadJSON(url, checkData);
}

function checkData() {
	if (validate.result === true){
		url = `https://api.postcodes.io/postcodes/${postcode}`;

		// Change url so this can be saved
		changeURL(postcode) 

		postcodeData = loadJSON(url, getWeatherWithPostcode);
	} else {
		clearOutput()
		para = createP("Invalid postcode :(")
		para.parent(id = "mainBox")
		para.id("invalid")
	}
}

function changeURL(postcode) {
	// adds postcode to end of url
	let	pageURL = document.location.href;
	let n = pageURL.search("/weather.html");
	document.location = pageURL.slice(0, n+13) +"#postcode_" + postcode;
}

function clearOutput() {
	// If outputWeather div exists - remove it.
	if (document.getElementById("outputWeather")) {
		outDiv = document.getElementById("outputWeather");
		outDiv.remove()
	}
	// If invalid input p exists - remove it.
	if (document.getElementById("invalid")) {
		outDiv = document.getElementById("invalid");
		outDiv.remove()
	}
}

function getWeatherWithPostcode() {
	lat = postcodeData.result.latitude;
	long = postcodeData.result.longitude
	
	api = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=metric&exclude=current,minutely,hourly&appid=${weatherKey}`;
	
	clearOutput()
	let outDiv = createDiv();
	outDiv.id("outputWeather")
	outDiv.parent(id = "mainBox")
	
	// Add subtitle
	townTitle = createElement('h2', postcodeData.result.admin_district);
	townTitle.id("townTitle")
	townTitle.parent(outDiv)
	
	weatherData = loadJSON(api, displayWeather);
}

function displayWeather() {


	div = createDiv();
	div.parent(id = "outputWeather")
	div.id("weatherBoxes")
	for (i=0; i<5; ++i) {
		div = createDiv();
		div.parent(id = "weatherBoxes")
		
		weekdayHeading = createElement('h3', getWeekDay(i));
		weekdayHeading.parent(div)
		
		//console.log(weatherData	)
		mainWeather = weatherData.daily[i].weather[0].main;
		mainEmoji = getWeatherEmoji(mainWeather);
		mainEmoji.parent(div)
		mainEmoji.id("weatherEmoji")
		
		weatherDesc = weatherData.daily[i].weather[0].description;
		weatherTxt = createP(weatherDesc)
		weatherTxt.parent(div)
		weatherTxt.id("outputDesc")
		
		temp = weatherData.daily[i].temp.day;
		tempTxt = createP(Math.round(temp) + "&#176;C")
		tempTxt.parent(div)
		tempTxt.id("temp")
		
		
	}
}

function getWeatherEmoji(mainWeather) {
	//console.log("mainWeather")
	if (mainWeather === "Rain") {
		para = createP("☔");
	}
	else if (mainWeather === "Clear"){
		para = createP("☀️");
	}
	else if (mainWeather === "Clouds"){
		para = createP("☁️");
	}
	else if (mainWeather === "Thunderstorm"){
		para = createP("🌩️");
	}
	else if (mainWeather === "Snow"){
		para = createP("🌨️");
	}
	else if (mainWeather === "Drizzle"){
		para = createP("🌦️");
	}
	else if (mainWeather === "Mist"){
		para = createP("🌫️")
	}
	else {
		para = createP(mainWeather);
	}
	return para
}

function getWeekDay(fromToday) {
	// Returns weekday <fromToday> days away from today
	var d = new Date();
	var weekdays = ["Sunday","Monday", "Tuesday","Wednesday","Thursday", "Friday","Saturday"];
	
	var index = d.getDay() + fromToday;
	
	if (index >= 7) {
		index -= 7;
	}
	
	weekday = weekdays[index]
	
	return weekday
}



