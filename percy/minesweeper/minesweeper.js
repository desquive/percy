// data members
var board = []; 
var rows; 
var columns; 

var minesCount; 
var minesLocation = []; 
var tempMinesCount; 
var minesCorrectlyFound = 0; 

var firstClick = true; 

var tilesClicked = 0; 
var flagEnabled = false; 

let timer = false; 
let hour = 00;
let minute = 00;
let count = 0; 

var gameOver = false; 

//function to set css
function setCSS(diff){
    if(diff === 1){
        localStorage['size'] = "small"; 
    }else if(diff === 2){
        localStorage['size'] = "medium";  
    }else{
        localStorage['size'] = "large"; 
    }
}

//function to find CSS
function findCSS(){
    if(localStorage['size'] === "small"){
        document.querySelector(".size").setAttribute('href',"small.css"); 
        rows = columns = 9; 
        minesCount = tempMinesCount = 10; 
    }
    else if(localStorage['size'] === "medium"){
        document.querySelector(".size").setAttribute('href',"medium.css"); 
        rows = columns = 16; 
        minesCount = tempMinesCount = 40;
    }else if(localStorage['size'] === "large"){
        document.querySelector(".size").setAttribute('href',"large.css"); 
        rows = 30; 
        columns = 16; 
        minesCount = tempMinesCount = 99; 
    }
    startGame(); 
}

function startGame(){
    document.querySelector("#mines-count").innerText = minesCount;
    document.getElementById("flag").addEventListener("click",toggleFlag);
    setMines(); 

    for(var r = 0; r < rows; r++){
        let row = []; 
        for (var c = 0; c < columns; c++){
            //make div tag
            let tile = document.createElement('div'); 
            tile.id = r.toString() + "-" + c.toString(); 
            tile.addEventListener("click",clickTile); 
            document.querySelector("#board").append(tile); 
            
            row.push(tile); 
        }
        board.push(row); 
    }

    // console.log(board); 
}

function setMines(){
    let minesLeft = minesCount; 
    while (minesLeft > 0){
        let r = Math.floor(Math.random()* rows);
        let c = Math.floor(Math.random() * columns); 
        let id = r.toString() + "-" + c.toString(); 

        if(!minesLocation.includes(id)){
            minesLocation.push(id); 
            minesLeft--; 
        }
    }
}

function toggleFlag(){
    if(flagEnabled){
        flagEnabled = false;
        document.getElementById("flag").style.backgroundColor = "#f0f0f0"; 
    }else{
        flagEnabled = true; 
        document.getElementById("flag").style.backgroundColor = "darkgray"; 
    }
}

function clickTile(){ 
    let tile = this; 

    if(firstClick){
        firstClick = false; 
        timer = true; 
        gameTimer(); 
    }

    if(gameOver || tile.classList.contains("tile-clicked")) return; 

    //flag a tile 
    if(flagEnabled){
        // document.querySelector("body").style.backgroundColor = "brown";
        if(tile.innerText == ""){
            if(tempMinesCount == 0) return; 
            tempMinesCount--; 
            document.querySelector("#mines-count").innerText = tempMinesCount;
            tile.innerText = "🚩"
            if(minesLocation.includes(tile.id)){
                minesCorrectlyFound++; 
            }
        }
        else if(tile.innerText == "🚩"){
            tempMinesCount++; 
            document.querySelector("#mines-count").innerText = tempMinesCount;
            tile.innerText = ""; 
            if(minesLocation.includes(tile.id)){ 
                minesCorrectlyFound--;
            }
        }
        if(minesCorrectlyFound == minesCount){
            console.log("Game over"); 
            gameOver = true; 
            timer = false;
            document.querySelector("#mines-count").innerHTML = "Cleared!"; 
            document.querySelector("body").style.backgroundColor = "green"; 
        }
        return; 
    } 

    //unlock a tile 
    if(minesLocation.includes(tile.id)){ 
        timer = false; 
        gameOver = true; 
        revealMines();
        return; 
        alert("GAME OVER");
    }

    if(tile.innerText == "🚩"){
        tempMinesCount++; 
        document.querySelector("#mines-count").innerText = tempMinesCount;
    }

    let coords = tile.id.split("-"); 
    let r = parseInt(coords[0]); 
    let c = parseInt(coords[1]); 

    checkMines(r,c); 
}

function checkMines(r, c){
    if( r < 0 || r >= rows || c < 0 || c >= columns){ 
        return; 
    }
    let minesFound = 0; 
    let tile = board[r][c]; 
    if(tile.classList.contains("tile-clicked")){
        return; 
    }

    tile.classList.add("tile-clicked"); 
    tilesClicked++; 

    // top 3 
    minesFound += checkTile(r-1,c-1); //top left 
    minesFound += checkTile(r-1,c); 
    minesFound += checkTile(r-1, c+1); 

    // same 3 
    minesFound += checkTile(r,c-1); 
    minesFound += checkTile(r,c+1); 

    // bottom 3 
    minesFound += checkTile(r+1,c-1); 
    minesFound += checkTile(r+1,c); 
    minesFound += checkTile(r+1,c+1); 

    if(minesFound > 0){
        tile.innerText = minesFound; 
        tile.classList.add("x"+minesFound.toString()); 
    }else{
        // top 3
        checkMines(r-1,c-1); 
        checkMines(r-1,c); 
        checkMines(r-1,c+1); 

        // same 3 
        checkMines(r,c-1); 
        checkMines(r,c+1); 

        //bottom 3 
        checkMines(r+1,c-1); 
        checkMines(r+1,c); 
        checkMines(r+1,c+1); 
    }

    if(tilesClicked == rows * columns - minesCount || minesCorrectlyFound == minesCount){
        console.log("Game over"); 
        gameOver = true; 
        timer = false;
        document.getElementById("mines-count").innerHTML = "Cleared!"; 
        document.querySelector("body").style.backgroundColor = "green"; 
    }
}

function checkTile(r,c){
    if( r < 0 || r >= rows || c < 0 || c >= columns){ 
        return 0; 
    }
    let tile = board[r][c]; 
    if(minesLocation.includes(tile.id)){
        return 1; 
    }else{
        return 0; 
    }
}

function revealMines(){
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            let tile = board[r][c];
            if(minesLocation.includes(tile.id)){
                tile.innerText = "💣"
                tile.style.backgroundColor = "red"
                document.querySelector("body").style.backgroundColor = "brown"; 
            }
        }
    }
}

function gameTimer(){

    if(timer){
        count++; 

        console.log("in timer"); 

        if(count == 60){
            minute++; 
            count = 0; 
        }
        if(minute == 60){
            hour++; 
            minute = 00; 
        }

        let hrString = hour; 
        let minString = minute;
        let secString = count; 

        if(hour < 10){
            hrString = "0"+hrString; 
        }
        if(minute < 10){
            minString = "0"+minString; 
        }
        if(count < 10){
            secString = "0"+secString; 
        }
        
        console.log(hrString+":"+minString+":"+secString); 
        document.querySelector("#hr").innerText = hrString; 
        document.querySelector("#min").innerText = minString; 
        document.querySelector("#sec").innerText = secString; 
        setTimeout(gameTimer,1000); 
    }
}
