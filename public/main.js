// Focus div based on nav button click
document.getElementById("homenav").onclick = function(){

}

document.getElementById("singlenav").onclick = function(){

}

document.getElementById("multinav").onclick = function(){

}

document.getElementById("guessnav").onclick = function(){

}
// Flip one coin and show coin image to match result when button clicked
function singleFlip(){
    fetch('http/localhost:5000/app/flip', {mode: 'cors'}).then(function(response){
        return response.json();
    }).then(function(result){
        console.log(result);
        document.getElementById("singleResult").innerHTML = result.flip;
        document.getElementById("singleResulimg").src = `./assets/img/${result.flip}.png`;

    });

}
// Flip multiple coins and show coin images in table as well as summary results
// Enter number and press button to activate coin flip series

// Guess a flip by clicking either heads or tails button
