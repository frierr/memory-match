const play_field = document.getElementById("field");
const difficulty_slider = document.getElementById("diff");
const wait_time = 1000; //in ms
var game = [];
var selected = [];
//unique symbols to be used:
const symbols = ["🌵", "💿", "⌚️", "🧭", "☎️", "🔋", "💡", "💶", "💎", "🔧",
 "⚙️", "🧲", "🔫", "💣", "🧨", "🪓", "🔪", "⚔️", "🚬", "⚰️",
 "🪦", "⚱️", "🏺", "🔮", "📿", "🧿", "🪬", "💈", "⚗️", "🔭",
 "🔬", "🩹", "🩺", "🩻", "🩼", "💊", "💉", "🩸", "🧬", "🦠",
 "🧫", "🧪", "🧹", "🪠", "🧺", "🧻", "🚽", "🚰", "🚿", "🛁",
 "🛀", "🧼", "🪥", "🪒", "🧽", "🪣", "🧴", "🔑", "🚪", "🪑",
 "🛌", "🧸", "🪆", "🪟", "🛒", "🎁", "🎈", "🎀", "🪄", "🪅",
 "🎉", "✉️"]; //72 symbols max - 12x12 field

window.onload = function() {
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/*
MEMORY MATCH GAME FUNCTIONS
*/

//start game
function start() {
    game = [];
    selected = [];
    //generate field
    generateGame(difficulty_slider.value);
    click_allowed = true;
}

//generate play field. get size from difficulty slider
function generateGame(size) {
    //get a list of symbols to use
    const sym_len = (size * size) / 2;
    var sym = [];
    for (var i = 0; i < sym_len; i++) {
        sym[i] = symbols[i];
    }
    for (var i = sym_len; i < sym_len * 2; i++) {
        sym[i] = symbols[i - sym_len];
    }
    sym = shuffle(sym);
    for (var i = 0; i < size; i++) {
        game[i] = [];
        for (var j = 0; j < size; j++) {
            game[i][j] = sym.pop();
        }
    }
    updateField();
}

//update game field
function updateField() {
    play_field.innerHTML = "";
    for (var i = 0; i < game.length; i++) {
        for (var j = 0; j < game.length; j++) {
            play_field.appendChild(getNewBlock(i, j, game[i][j]));
        }
    }
}

//generate new block
function getNewBlock(X, Y, value) {
    var box = document.createElement("div");
    box.style.gridRowStart = X;
    box.style.gridRowEnd = X + 1;
    box.style.gridColumnStart = Y;
    box.style.gridColumnEnd = Y + 1;
    if (value != 0) {
        box.className = "gameblock";
        box.onclick = function () {
            if (selected.length < 2){
                blockClick(X, Y);
            }
        };
        box.textContent = (isSelected(X, Y) ? value : "");
    } else {
        box.className = "emptyblock";
    }
    return box;
}

//checks if this block was selected
function isSelected(X, Y) {
    for (var i = 0; i < selected.length; i++) {
        if (selected[i][0] == X && selected[i][1] == Y) {
            return true;
        }
    }
    return false;
}

//react to block click
async function blockClick(X, Y) {
    if (selected.length > 0 && (selected[0][0] != X || selected[0][1] != Y)) {
        //a block was selected previously - show current and check if they match
        selected.push([X, Y]);
        updateField();
        if (checkMatch()) {
            removeMatched();
        } else {
            clearSelected();
        }
        await sleep (wait_time);
    } else if (selected.length > 0 && selected[0][0] == X && selected[0][1] == Y) {
        selected.pop();
    } else {
        //no block selected - show this one
        selected.push([X, Y]);
    }
    updateField();
}

//check if selected items match
function checkMatch() {
    return selected.length > 1 && game[selected[0][0]][selected[0][1]] == game[selected[1][0]][selected[1][1]]; 
}

//removes selected elements
function removeMatched() {
    while (selected.length > 0) {
        const elem = selected.pop();
        game[elem[0]][elem[1]] = 0;
    }
}

//clear selected
function clearSelected() {
    while (selected.length > 0) {
        selected.pop();
    }
}