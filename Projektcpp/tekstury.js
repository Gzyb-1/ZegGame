const wall = new Image();
wall.src = "wall_front.png";
const wall1 = new Image();
wall1.src = "wall_woda.png";
const wall2 = new Image();
wall2.src = "wall_crc.png";
const wall3 = new Image();
wall3.src = "wall_eye.png";
const wejscie = new Image();
wejscie.src = "wejscie.png";
const floor = new Image();
floor.src = "floor.png"
const szczur = new Image();
szczur.src = "szczur.png"
const szczur_move1 = new Image();
szczur_move1.src = "szczur_move1.png"
const szczur_move2 = new Image();
szczur_move2.src = "szczur_move2.png"
const szczur_attack1 = new Image();
szczur_attack1.src = "szczur_attack1.png"
const szczur_attack2 = new Image();
szczur_attack2.src = "szczur_attack2.png"
const szczur_attack3 = new Image();
szczur_attack3.src = "szczur_attack2.png"
const large_health_potion = new Image();
large_health_potion.src = "large_health_potion.png";
const small_health_potion = new Image();
small_health_potion.src = "small_health_potion.png";
const skeleton = new Image();
skeleton.src = "skeleton.png";
const small_axe = new Image();
small_axe.src = "small_axe.png";

const axe = new Image();
axe.src = "axe.png";

const great_axe = new Image();
great_axe.src = "great_axe.png";

const sword = new Image();
sword.src = "sword.png";

const greatsword = new Image();
greatsword.src = "greatsword.png";

const small_hammer = new Image();
small_hammer.src = "small_hammer.png";

const hammer = new Image();
hammer.src = "hammer.png";

const huge_hammer = new Image();
huge_hammer.src = "huge_hammer.png";

const mail_armor = new Image();
mail_armor.src = "mail_armor.png";

const plate_armor = new Image();
plate_armor.src = "plate_armor.png";
const skeleton1 = new Image();
skeleton1.src = "skeleton1.png";

const skeleton2 = new Image();
skeleton2.src = "skeleton2.png";

const skelly1 = new Image();
skelly1.src = "skelly1.png";
const portal_png = new Image();
portal_png.src = "portal.png";

const portal1 = new Image();
portal1.src = "portal1.png";

const portal2 = new Image();
portal2.src = "portal2.png";

const portal3 = new Image();
portal3.src = "portal3.png";
const skelly2 = new Image();
skelly2.src = "skelly2.png";
const zejscie = new Image();
zejscie.src = "zejscie.png";
const player1 = new Image();
player1.src = "player1.png";

const player2 = new Image();
player2.src = "player2.png";
const trapTexture = new Image();
trapTexture.src = "trap.png";

const trap1 = new Image();
trap1.src = "trap1.png";
const regeneration_ring = new Image();
regeneration_ring.src = "regeneration_ring.png";

const defense_ring = new Image();
defense_ring.src = "defense_ring.png";

const attack_ring = new Image();
attack_ring.src = "attack_ring.png";
const player3 = new Image();
player3.src = "player3.png";
const player4 = new Image();
player4.src = "player4.png";
const spider1 = new Image();
spider1.src = "spider1.png";

const spider2 = new Image();
spider2.src = "spider2.png";

const spidera1 = new Image();
spidera1.src = "spidera1.png";

const spidera2 = new Image();
spidera2.src = "spidera2.png";

const sludge1 = new Image();
sludge1.src = "sludge1.png";

const sludge2 = new Image();
sludge2.src = "sludge2.png";

const sludgea1 = new Image();
sludgea1.src = "sludgea1.png";

const sludgea2 = new Image();
sludgea2.src = "sludgea2.png";
const player5 = new Image();
player5.src = "player5.png";

const player6 = new Image();
player6.src = "player6.png";
const fog = new Image();
fog.src = "fog.png";
const giant_spider = new Image();
giant_spider.src = "giant_spider.png";

const sludge = new Image();
sludge.src = "sludge.png";
const przerywnik = new Image();
przerywnik.src = "przerywnik.png";
const levelImages = [];
for(let i = 0; i <= 5; i++){
    levelImages[i] = new Image();
    levelImages[i].src = i + ".png";
}
const background = new Image();
background.src = "background.png";
const sign = new Image();
sign.src = "sign.png";
const shortsword = new Image();
shortsword.src = "shortsword.png";
const leather_armor = new Image();
leather_armor.src = "leather_armor.png";
const health_potion = new Image();
health_potion.src = "health_potion.png";
let background_loaded = false;
let fog_loaded = false;
let player4_loaded = false;
let player5_loaded = false;
let player6_loaded = false;
let szczur_loaded = false
let szczur_attack1_loaded = false
let szczur_attack2_loaded = false
let szczur_move1_loaded = false
let szczur_move2_loaded = false
let szczur_attack3_loaded = false
let player1_loaded = false;
let player2_loaded = false;
let player3_loaded = false;

let wall_loaded = false;
let wall1_loaded = false;
let wall2_loaded = false;
let wall3_loaded = false;
let floor_loaded = false;
let wejscie_loaded = false;
let zejscie_loaded = false;
let shortsword_loaded = false;
let leather_armor_loaded = false;
let health_potion_loaded = false;

shortsword.onload = () => shortsword_loaded = true;
leather_armor.onload = () => leather_armor_loaded = true;
health_potion.onload = () => health_potion_loaded = true;
background.onload = () => {
    background_loaded = true;
};
wall.onload = () => {
  wall_loaded = true;
};
wall1.onload = () => {
  wall1_loaded = true;
};
wall2.onload = () => {
  wall2_loaded = true;
};
wall3.onload = () => {
  wall3_loaded = true;
};
szczur_attack1.onload = () => {
  szczur_attack1_loaded = true;
};
szczur_attack2.onload = () => {
  szczur_attack2_loaded = true;
};
szczur_attack3.onload = () => {
  szczur_attack3_loaded = true;
};
szczur_move1.onload = () => {
  szczur_move1_loaded = true;
};
szczur_move2.onload = () => {
  szczur_move2_loaded = true;
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
fog.onload = () => {
    fog_loaded = true;
};
szczur.onload = () => {
    szczur_loaded = true;
};
