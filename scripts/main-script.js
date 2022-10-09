//------------------------------  Nav-bar ----------------------------------//

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction(dropID) {
    console.log(dropID)
    document.getElementById(dropID).style.display = "block";
    }
    
    // Close the dropdown if the user clicks outside of it
    window.onclick = function(e) {
    if (!e.target.matches('#button2')) {
        document.getElementById("drop2").style.display = "none";
    }
    }

//--------------------------------------------------------------------------//
