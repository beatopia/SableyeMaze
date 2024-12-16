const mazeElement = document.querySelector(".maze");
const timerDisplay = document.getElementById("timer");
const modal = document.getElementById("modal");
const startButton = document.getElementById("startButton");
const itemsContainer = document.querySelector(".items");
var mazemusic = new Audio("sounds/mazesong.mp3");
var histheme = new Audio("sounds/histheme.mp3");
var levelup = new Audio("sounds/levelup.mp3");
let doorCode = "";
let notesCollected = 0;
const collectedSpecialTiles = new Set();
let doorAttempts = 0;
let timer = 60;
let visibleTime = 2;
let cycleInterval;
let lastPlayerTile = null;
items = [];

// Generates 10 random integers (0-9) and concatenates them to create the door code
function generateDoorCode() {
  let code = "";
  for (let i = 0; i < 10; i++) {
    code += Math.floor(Math.random() * 10).toString();
  }
  return code;
}
window.onload = function () {
  mazemusic.play();
  mazemusic.volume = 0.15;
  //when the page loads, this plays the maze background music
};
//this defines the outline of the maze in an array, where each number represents a tile type
//0 = path (walkable), 1 = wall, 2 = special tile, 3 = door
const maze = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 1, 0, 0, 0, 1, 2, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 2, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 2, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
  [3, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
];

let playerPosition = { x: 1, y: 1 };
//defines player starting point at top left (one tile right, one tile down from top left)

// Create the maze
function createMaze() {
  maze.forEach((row, y) => {
    //loops through each row in the maze, where y is the row index
    row.forEach((tile, x) => {
      //for each tile in the row, x is the column index
      const div = document.createElement("div");
      //creates a new div to represent the tile
      div.classList.add("tile");
      //adds the class "tile" to every tile
      if (tile === 1) {
        //if the tile should be a wall, it gets assigned the wall class
        div.classList.add("wall");
      } else if (tile === 2) {
        //if the tile should be a special tile, it gets assigned the special class
        div.classList.add("special");
      } else if (tile === 3) {
        //if the tile should be the door, it gets assigned the lock class
        div.classList.add("lock");
      } else {
        //if the tile is just a path tile, it gets assigned the walkable class
        div.classList.add("walkable");
      }
      div.dataset.originalColor = getComputedStyle(div).backgroundColor;
      //remembers the tile's original color in the data-original-color attribute
      //this is used to restore the colors of a tile after the player has walked over it
      mazeElement.appendChild(div);
      //appends the created tileto the mazeelement container
    });
  });
}

// Create a notes display div
function createNotesDisplay() {
  const notesDiv = document.createElement("div");
  //creates a new div element to display the collected notes
  notesDiv.id = "notesDisplay";
  //sets an id so i can refer to the div
  notesDiv.style.position = "absolute";
  notesDiv.style.color = "black";
  notesDiv.style.fontSize = "48px";
  notesDiv.style.fontFamily = "Garamond, sans-serif";
  notesDiv.style.padding = "20px";
  itemsContainer.appendChild(notesDiv);
  //append the notesdisplay to the itemscontainer element
  notesDiv.style.transform = "translateY(-130px)";
}

function updateNotesDisplay() {
  //select the notesdisplay from its id
  const notesDiv = document.getElementById("notesDisplay");
  let notesText = "";
  //initialize the string for the note text
  for (let i = 1; i <= notesCollected; i++) {
    const startIdx = (i - 1) * 2;
    //calc the starting index for the current note's digits
    const digits = doorCode.substring(startIdx, startIdx + 2);
    //extract the current two-digit portion from the door code
    notesText += `Note ${i}: ${digits}\n`;
    //append the information to the actual notesText
  }
  notesDiv.innerHTML = notesText.replace(/\n/g, "<br>");
}

// Get tile element at specific coordinates
function getTileAt(x, y) {
  //y*25 is the row offset and x is the column offset
  return document.querySelector(`.tile:nth-child(${y * 25 + x + 1})`);
}

// Move the player
function movePlayer(direction) {
  const newX = playerPosition.x + direction.x;
  const newY = playerPosition.y + direction.y;
  //calc the player's new pos by adding the direction vector to the current pos

  if (maze[newY] && maze[newY][newX] !== undefined && maze[newY][newX] !== 1) {
    //check if the new position is valid (aka inside maze grid/bounds and is not a wall)
    if (lastPlayerTile) {
      // if player was on a previous tile
      lastPlayerTile.classList.remove("player-tile");
      //remove the player-tile class from it
      lastPlayerTile.style.backgroundColor =
        lastPlayerTile.dataset.originalColor;
      //restore its original color
    }

    playerPosition = { x: newX, y: newY };
    //update the player's new position
    renderPlayer();
    //call renderPlayer() to update the player's position visually

    if (maze[newY][newX] === 2) {
      //if the player landed on a special tile, go through the specialTile action
      specialTileAction();
    } else if (maze[newY][newX] === 3) {
      //if the player landed on the door, go through the doorTile action
      doorTileAction();
    }
  }
}

// Render the player
function renderPlayer() {
  const currentTile = getTileAt(playerPosition.x, playerPosition.y);
  //find the tile corresponding to the player's position

  if (lastPlayerTile && lastPlayerTile !== currentTile) {
    //if the previous tile is not the same as the current tile
    lastPlayerTile.classList.remove("player-tile");
    //remove "player-tile"from the previous tile
    lastPlayerTile.style.backgroundColor = lastPlayerTile.dataset.originalColor;
    //restore its original color with the originalcolor attribute
  }

  currentTile.classList.add("player-tile");
  //add the player-tile class to the tile the player is on
  currentTile.style.backgroundColor = "#31ff2e";
  //change background of tile the player is on to highlight the player's position
  lastPlayerTile = currentTile;
  //update the last player tile var so if the player moves we can reset it and properly display the player's position
}

function specialTileAction() {
  const tileKey = `${playerPosition.x},${playerPosition.y}`;
  //create a key for the current tile based on its position

  if (!collectedSpecialTiles.has(tileKey)) {
    //check if the special tile the player is on has already been collected
    collectedSpecialTiles.add(tileKey);
    //if it has not been collected, add the afformentioned tilekey to set of collected tiles
    notesCollected++;
    // increment number of notes collected by player
    const startIdx = (notesCollected - 1) * 2;
    const digits = doorCode.substring(startIdx, startIdx + 2);
    //extract the next 2 digits of the door code based on how many notes have been collected
    levelup.volume = 0.3;
    levelup.play();
    //play the Pokemon levelup sound at 30% volume

    updateNotesDisplay();
    //update the notes display on the right to visually display the collected digits
    if (notesCollected === 5) {
      //if all 5 notes have been collected alert the player to go find the door to escape
      alert(
        "You've found all the notes! Now find the door and enter the complete code!"
      );
    }
  }
}

function doorTileAction() {
  if (doorAttempts >= 2) {
    //if the player has made 2 incorrect attempts to type the code redirect them to the loss screen
    alert("Too many incorrect attempts! Game Over!");
    window.location.href = "loss.html";
    return;
  }

  const userCode = prompt("Enter the 10-digit door code:");
  //prompt the player to enter the code
  if (userCode === doorCode) {
    //if the code is right, they win!
    alert("Correct code! You've escaped!");
    window.location.href = "win.html";
  } else {
    //if the code is wrong, increment the number of wrong attempts
    doorAttempts++;
    if (doorAttempts < 2) {
      //if this is their first mistake, tell them they have one more chance
      alert("Incorrect code! You have one more attempt!");
    } else {
      //otherwise, game over and they go to the loss screen
      alert("Incorrect code! Game Over!");
      window.location.href = "loss.html";
    }
  }
}

function startTimer() {
  const interval = setInterval(() => {
    timer--;
    //decrement timer value by 1 every second
    timerDisplay.textContent = timer;
    //update the timer text in the actual website to display accurate remaining time

    if (timer <= 0) {
      //when the timer reaches 0:
      clearInterval(interval);
      //stop the timer by clearing interval
      window.location.href = "loss.html";
      //redirect player to loss screen
    }
  }, 1000); //interval is 1000 ms or 1 second
}

function cycleVisibility() {
  const imageElement = document.querySelector(
    ".center-content.light.black img"
  );
  cycleInterval = setInterval(() => {
    const tiles = document.querySelectorAll(".tile");
    //select all tiles in the maze

    tiles.forEach((tile) => {
      if (!tile.classList.contains("player-tile")) {
        tile.style.backgroundColor = "black";
        //for tiles the player is NOT on, set their color to black
      }
    });
    imageElement.src = "images/red.webp";
    //make Sableye red *like a red light*

    setTimeout(() => {
      tiles.forEach((tile) => {
        //for all tiles that aren't the player's current position, restore their color
        if (!tile.classList.contains("player-tile")) {
          tile.style.backgroundColor = tile.dataset.originalColor;
        }
      });
      imageElement.src = "images/green.webp";
      //make Sableye green *like a green light*
    }, visibleTime * 1000); //timeout to restore visibility. visibleTime = 2, so 2 sec
  }, (visibleTime + 2) * 1000); //repeats the cycle every visibleTime+2 seconds
}

document.addEventListener("keydown", (event) => {
  //listens for a key press
  switch (event.key) {
    case "w":
    case "ArrowUp":
      //if it was w or ArrowUp, move the player up by decreasing y
      movePlayer({ x: 0, y: -1 });
      //calls the movePlayer function with the parameters of how it wants
      //the player the move based on the key presses
      break;
    case "s":
    case "ArrowDown":
      //if it was s or ArrowDown, move the player down by increasing y
      movePlayer({ x: 0, y: 1 });
      break;
    case "a":
    case "ArrowLeft":
      //if it was a or ArrowLeft, move the player left by decreasing x
      movePlayer({ x: -1, y: 0 });
      break;
    case "d":
    case "ArrowRight":
      //if it was d or ArrowRight, move the player right by increasing x
      movePlayer({ x: 1, y: 0 });
      break;
  }
});

//intiliazes and starts game
createMaze();
renderPlayer();
doorCode = generateDoorCode();
startTimer();
renderPlayer();
cycleVisibility();
createNotesDisplay();
