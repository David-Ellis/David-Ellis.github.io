let postcodeData;
let validate;
let postcode;
let jsonData
var longs = [];
var lats = [];

function setup() {
	noCanvas()
}


window.addEventListener("load", function () {
	const pattern = /#postcode_/;
	let pageURL = document.location.href

	jsonData=loadJSON('https://david-ellis.github.io/mini-projects/royal-mail-strike/mail-picket-locs.json'); 
	


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

		postcodeData = loadJSON(url, getNearestPicket);
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
	let n = pageURL.search("/find-a-picket.html");
	document.location = pageURL.slice(0, n+19) +"#postcode_" + postcode;
}

function clearOutput() {
	// If outputInfo div exists - remove it.
	if (document.getElementById("outputInfo")) {
		outDiv = document.getElementById("outputInfo");
		outDiv.remove()
	}
	// If invalid input p exists - remove it.
	if (document.getElementById("invalid")) {
		outDiv = document.getElementById("invalid");
		outDiv.remove()
	}
}

function getCoords(){
	let longs = []
	let lats = []
	for (var i in jsonData["Longitude"]){
		longs.push(jsonData["Longitude"][i])
		lats.push(jsonData["Latitude"][i])
	}

	return [longs, lats];
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2-lat1);  // deg2rad below
	var dLon = deg2rad(lon2-lon1); 
	var a = 
	  Math.sin(dLat/2) * Math.sin(dLat/2) +
	  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
	  Math.sin(dLon/2) * Math.sin(dLon/2)
	  ; 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; // Distance in km
	return d;
  }

function deg2rad(deg) {
	return deg * (Math.PI/180)
}

function getAllDistances(long, lat, longs, lats) {
	let dists = [];
	let dist_i;

	for (var i in longs){
		dist_i = getDistanceFromLatLonInKm(lats[i],longs[i], lat, long)
		dists.push(dist_i)
	}
	return dists
}

function nearestIndex(long, lat){
	coords = getCoords()
	longs = coords[0]
	lats = coords[1]
	
	dists = getAllDistances(long, lat, longs, lats)
	minDist = Math.min(...dists)
	return dists.indexOf(minDist)
}

function getNearestPicket() {
	lat = postcodeData.result.latitude;
	long = postcodeData.result.longitude
	
	clearOutput()
	let outDiv = createDiv();
	outDiv.id("outputInfo")
	outDiv.parent(id = "mainBox")

	index = nearestIndex(long, lat)

	displayInfo(index)
}

function makeTable(parent_id, index) {
	const info_items = ["Name", "Address", "Map", "Dates", "Time"]
	table = createElement('table');
	table.parent(parent_id)
	for (var i in info_items){
		info_data = jsonData[info_items[i]][String(index)]
		if (info_data != null){
			row = createElement('tr')
			row.parent(table)

			header = createElement('th', info_items[i])
			header.parent(row)

			info = createElement('td', info_data)
			info.parent(row)



		}

	}	

	return table
}

function displayInfo(index) {
	div = createDiv()
	div.id("picketInfo")
	div.parent("outputInfo")

	table = makeTable("outputInfo", index) 
	
}
