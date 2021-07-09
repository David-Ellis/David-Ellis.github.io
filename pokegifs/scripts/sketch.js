function setup() {
	// needed in order to use p5.js
	noCanvas()
}


function get_gif() {
		let poke_name = document.getElementById("input").value.toLowerCase().replace(/ /g, "")
		//console.log(poke_name)
		if (poke_name != "Enter Pokémon name/id"){
			url = `https://pokeapi.co/api/v2/pokemon/${poke_name}`
			pokeData = loadJSON(url, displayGif);
		}
}

function clearOutput() {
	// If gif_box div exists - remove it.
	if (document.getElementById("gif_box")) {
		outDiv = document.getElementById("gif_box");
		outDiv.remove()
	}	
}

function displayGif(){
	// As test just display the first 1
	clearOutput()
	
	let outDiv = createDiv();
	outDiv.id("gif_box")
	outDiv.parent(id = "mainBox")
	//output.load(pokeData)
	shiny = document.getElementById("shiny").checked;
	let type;
	if (!shiny){
		type = "front_default";
	} else {
		type = "front_shiny";
	}
	
	let gif_box = document.getElementById("gif_box");
	let gif_url = pokeData["sprites"]["versions"]["generation-v"]["black-white"]["animated"][type];
	
	var img = document.createElement("img");
	img.src = gif_url;
	var src = document.getElementById("gif_box");
	src.appendChild(img);
	
}