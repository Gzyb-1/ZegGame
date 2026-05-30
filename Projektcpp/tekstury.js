const wall = new Image();
wall.src = "wall_front.png";

const floor = new Image();
floor.src = "floor.png";

const wejscie = new Image();
wejscie.src = "wejscie.png";



const zejscie = new Image();
zejscie.src = "zejscie.png";
const player1 = new Image();
player1.src = "player1.png";

const player2 = new Image();
player2.src = "player2.png";

const player3 = new Image();
player3.src = "player3.png";
const player4 = new Image();
player4.src = "player4.png";

const player5 = new Image();
player5.src = "player5.png";

const player6 = new Image();
player6.src = "player6.png";

let player4_loaded = false;
let player5_loaded = false;
let player6_loaded = false;

let player1_loaded = false;
let player2_loaded = false;
let player3_loaded = false;

let wall_loaded = false;
let floor_loaded = false;
let wejscie_loaded = false;
let zejscie_loaded = false;

wall.onload = () => {
  wall_loaded = true;
};

floor.onload = () => {
  floor_loaded = true;
};

wejscie.onload = () => {
  wejscie_loaded = true;
};

zejscie.onload = () => {
  zejscie_loaded = true;
};

player1.onload = () => 
    player1_loaded = true;
player2.onload = () => 
    player2_loaded = true;
player3.onload = () => 
    player3_loaded = true;
player4.onload = () => 
  player4_loaded = true;
player5.onload = () => 
  player5_loaded = true;
player6.onload = () => 
  player6_loaded = true;