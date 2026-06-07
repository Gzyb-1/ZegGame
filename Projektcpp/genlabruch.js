//Tu jest wszystko do gnerowania labiryntu i do ruchu
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let fazaruchuhipka = 0;
let gameStarted = false;
const szczurFrames = {
    move: [szczur_move1, szczur_move2],
    attack: [szczur_attack1, szczur_attack2, szczur_attack3]
};  ``
let canAttack=true;
let gameOver = false;
let gameOverAlpha = 0;
let portal = null;
let traps = [];
let victory = false;
let victoryAlpha = 0;
let dmgshows = [];
let inventory = new Array(25).fill(null);
let pokazInventory = false;
let minRats = 1;
const spiderFrames = {
    move: [spider1, spider2],
    attack: [spidera1, spidera2]
};

const sludgeFrames = {
    move: [sludge1, sludge2],
    attack: [sludgea1, sludgea2]
};
  let temps = 3;
let maxRats = 5;
let selectedInventorySlot = -1;
let mouseX = 0;
let mouseY = 0;
let items = [];
let inventoryFullText = 0;
let mapa = []
let exp = 0;
let expToNext = 5;
let level = 1;
const skeletonFrames = {
    move: [skeleton1, skeleton2],
    attack: [skelly1, skelly2]
};
let szczury = [];
let stoiNaSchodach = false;
const itemPools = {
    common: [
        "small_health_potion",
        "health_potion",
        "shortsword",
        "leather_armor",
        "small_axe",
        "small_hammer"
    ],
    rare: [
        "large_health_potion",
        "axe",
        "sword",
        "hammer",
        "mail_armor"
    ],
    legendary: [
        "great_axe",
        "greatsword",
        "huge_hammer",
        "plate_armor"
    ]
};
let equipment = {weapon: null,armor: null,ring: null
};
  let hipekruch = 0;
  let poziom = 0;
  let kierunekgo = "1";
  let fogPulse = 0;
  let pokazPrzerywnik = false;
  let stoiNaZnaku = false;
let aktywnyNapis = "";
let pokazNapis = false;
let maxHp = 20;
let hp = 20;
let ruchy = 0;
let szczurAnimFrame = 0;
let szczurAnimTick = 0
function drawStartScreen(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "80px Algerian";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("The Labirinth", canvas.width / 2, canvas.height / 2 - 100);

    ctx.fillStyle = "darkred";
    ctx.fillRect(canvas.width / 2 - 150, canvas.height / 2 + 20, 300, 80);

    ctx.strokeStyle = "white";
    ctx.strokeRect(canvas.width / 2 - 150, canvas.height / 2 + 20, 300, 80);

    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    ctx.fillText("Start Game", canvas.width / 2, canvas.height / 2 + 60);
}
function getChunkSizeForLevel(){
    if(poziom === 1){
        return { x: 4, y: 2 };
    }

    if(poziom === 2){
        return { x: 4, y: 4 };
    }

    if(poziom === 3){
        return { x: 8, y: 4 };
    }

    return { x: 2, y: 2 };
}
function addExp(amount){
    exp += amount;
    while(exp >= expToNext){
    exp -= expToNext;
    level++;
    maxHp += 10;
hp += 10;
    if(hp > maxHp){
        hp = maxHp;
    }
    expToNext += 5;
}
}
function spawnTraps(){
    traps = [];

    for(let y = 0; y < mapa.length; y++){
        for(let x = 0; x < mapa[y].length; x++){

            if(mapa[y][x] !== 0){
                continue;
            }

            if(Math.random() < 1 / 150){
                traps.push({
                    x: x * grid,
                    y: y * grid,
                    active: false
                });
            }
        }
    }
}
function checkGameOver(){
    if(hp <= 0 && !gameOver){
        gameOver = true;
        gameOverAlpha = 0;
    }
}
function getEnemyFrames(rat){
    if(rat.type === "skeleton") return skeletonFrames;
    if(rat.type === "giant_spider") return spiderFrames;
    if(rat.type === "sludge") return sludgeFrames;

    return szczurFrames;
}
function updateSzczurAnim(rat){
    rat.animTick++;

    const frames = getEnemyFrames(rat);

    if(rat.state === "idle"){
        rat.animFrame = 0;
        return;
    }

    if(rat.state === "move"){
        if(rat.animTick % 10 === 0){
            rat.animFrame = (rat.animFrame + 1) % frames.move.length;
        }
    }

    if(rat.state === "attack"){
        if(rat.animTick % 15 === 0){
            rat.animFrame++;

            if(rat.animFrame >= frames.attack.length){
                rat.animFrame = 0;
                rat.state = "idle";
            }
        }
    }
}
function pokadmg(dmg, worldX, worldY, color){
    let slot = 0;

    while(dmgshows.some(d => d.slot === slot)){
        slot++;
    }

    dmgshows.push({
        text: "-" + dmg,
        worldX,
        worldY: worldY - slot * 30,
        age: 0,
        slot,
        color
    });
}
async function animatePortalDestroy(){
    portal.animating = true;

    portal.frame = 0;
    renderFrame();
    await sleep(200);

    portal.frame = 1;
    renderFrame();
    await sleep(200);

    portal.frame = 2;
    renderFrame();
    await sleep(200);

    portal.frame = 3;
    renderFrame();
    await sleep(200);

    portal.active = false;
portal.animating = false;

triggerVictory();

renderFrame();
    
}
function playerAttack(dx, dy){
  if(!gameStarted) return;
  if(gameOver || victory) return;
    if(pokazNapis || pokazPrzerywnik || czyterazwruchujest){
        return;
    }
    const attackX = Math.round(gx / grid) + dx;
    const attackY = Math.round(gy / grid) + dy;
    if(portal && portal.active && !portal.animating){
    const portalX = Math.round(portal.x / grid);
    const portalY = Math.round(portal.y / grid);

    if(attackX === portalX && attackY === portalY){
        animatePortalDestroy();
        return;
    }
}
    let hit = false;
for(let i = szczury.length - 1; i >= 0; i--){
    const rat = szczury[i];
    const ratX = Math.round(rat.x / grid);
    const ratY = Math.round(rat.y / grid);
    if(ratX === attackX && ratY === attackY){
    let dmg;

if(equipment.weapon){
    dmg = rand(equipment.weapon.minDmg, equipment.weapon.maxDmg);
    if(
    equipment.ring &&
    equipment.ring.type === "attack_ring"
){
    dmg *= 2;
}
}
else{
    dmg = rand(1, 3);
}
    rat.hp -= dmg;
    pokadmg(
    dmg,
    rat.x,
    rat.y - 40,
    "yellow"
);
    if(rat.hp <= 0){
    szczury.splice(i, 1);
    addExp(rat.xp);
}
    break;
}
}
    for(const rat of szczury){
        moveszczur(rat);
    }
    renderFrame();
}
function pokaRatDmg(rat, dmg){
    dmgshows.push({
        text: "-" + dmg,
        worldX: rat.drawX,
        worldY: rat.drawY - 30,
        age: 0,
        slot: 0
    });
}
function wykonajRuchGracza(x, y){
    gx += grid * x;
    gy += grid * y;
    pickupItems();
checkTrap();
    g3X = gx;
    g3Y = gy;
    czyterazwruchujest = true;
    ruchy++;
    let regenRate = 25;

if(
    equipment.ring &&
    equipment.ring.type === "regeneration_ring"
){
    regenRate = 3;
}

if(ruchy >= regenRate){
    hp = Math.min(maxHp, hp + 1);
    ruchy = 0;
}
    for(const rat of szczury){
    const moves = rat.movesPerTurn || 1;

    for(let i = 0; i < moves; i++){
        moveszczur(rat);
    }
}
    renderFrame();
}
function moveBy(x, y){
  if(!gameStarted) return;
  if(gameOver || victory) return;
    const tempx = Math.round((gx + grid * x) / grid);
    const tempy = Math.round((gy + grid * y) / grid);

    if(pokazNapis || pokazPrzerywnik || czyterazwruchujest||pokazInventory) return;

    if(x !== 0){
        kierunekgo = x < 0 ? "1" : "2";
    }

    if(
        tempy < 0 ||
        tempy >= mapa.length ||
        tempx < 0 ||
        tempx >= mapa[tempy].length
    ){
        return;
    }

    if(mapa[tempy][tempx] === 1){
        return;
    }

    for(const rat of szczury){
        const ratTileX = Math.round(rat.x / grid);
        const ratTileY = Math.round(rat.y / grid);

        if(tempx === ratTileX && tempy === ratTileY){
            return;
        }
    }

    wykonajRuchGracza(x, y);
}
    function drawHP(){
    const barWidth = 200;
    const barHeight = 20;
    const x = canvas.width - barWidth - 20;
    const y = 20;
    const percent = hp / maxHp;
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, barWidth * percent, barHeight);
    ctx.strokeStyle = "white";
    ctx.strokeRect(x, y, barWidth, barHeight);
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.fillText(`${hp} / ${maxHp}`, canvas.width - 20, y);
}
function drawEXP(){
    const barWidth = 200;
    const barHeight = 16;
    const x = canvas.width - barWidth - 20;
    const y = 50;
    const percent = exp / expToNext;

    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(x, y, barWidth, barHeight);

    ctx.fillStyle = "blue";
    ctx.fillRect(x, y, barWidth * percent, barHeight);

    ctx.strokeStyle = "white";
    ctx.strokeRect(x, y, barWidth, barHeight);

    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.fillText("LV " + level + "  " + exp + " / " + expToNext, canvas.width - 20, y + 18);
}
function spawnLevelItems(){
    items = [];

    const itemCount = Math.floor(Math.random() * 5) + 3;

    for(let i = 0; i < itemCount; i++){
        spawnRandomItem();
    }
}
function generujlvl(){
  if(poziom === 4){
    generujPortalLevel();
    return;
}
    mapa = [];
    tekstyZnakow = {};
    stworzmape();
    naprawascian();
    generujpngki();
    losowyresp();
    agdziewyjscie();
    generujZnaki();
    spawnLevelItems();
    spawnszczur();
    spawnSkeleton();
    spawnDeepEnemies();
    spawnTraps();
    renderFrame();
}
function spawnszczur(){
    szczury = [];

    const count = Math.floor(Math.random() * 5) + 1;

    for(let i = 0; i < count; i++){
        spawnEnemy("rat");
    }
}
function spawnDeepEnemies(){
    if(poziom === 2){
        spawnEnemy("giant_spider");

        spawnEnemy("sludge");
        spawnEnemy("sludge");

        return;
    }
    if(poziom === 3){

        for(let i = 0; i < 3; i++){
            spawnEnemy("giant_spider");
        }

        for(let i = 0; i < 5; i++){
            spawnEnemy("sludge");
        }
        return;
    }
}
function spawnEnemy(type){
    while(true){
        const x = Math.floor(Math.random() * mapa[0].length);
        const y = Math.floor(Math.random() * mapa.length);

        if(mapa[y][x] !== 0) continue;

        if(type === "rat"){
            szczury.push({
                type: "rat",
                x: x * grid,
                y: y * grid,
                drawX: x * grid,
                drawY: y * grid,
                targetX: x * grid,
                targetY: y * grid,
                state: "idle",
                animFrame: 0,
                animTick: 0,
                facing: 1,
                hp: 10,
                minDmg: 1,
                maxDmg: 5,
                xp: 2,
                movesPerTurn: 1
            });
        }

        if(type === "skeleton"){
            szczury.push({
                type: "skeleton",
                x: x * grid,
                y: y * grid,
                drawX: x * grid,
                drawY: y * grid,
                targetX: x * grid,
                targetY: y * grid,
                state: "idle",
                animFrame: 0,
                animTick: 0,
                facing: 1,
                hp: 25,
                minDmg: 1,
                maxDmg: 10,
                xp: 5,
                movesPerTurn: 1
            });
        }
        if(type === "giant_spider"){
    szczury.push({
        type: "giant_spider",
        x: x * grid,
        y: y * grid,
        drawX: x * grid,
        drawY: y * grid,
        targetX: x * grid,
        targetY: y * grid,
        state: "idle",
        animFrame: 0,
        animTick: 0,
        facing: 1,
        hp: 30,
        minDmg: 10,
        maxDmg: 20,
        xp: 10,
        movesPerTurn: 2
    });
}

if(type === "sludge"){
    szczury.push({
        type: "sludge",
        x: x * grid,
        y: y * grid,
        drawX: x * grid,
        drawY: y * grid,
        targetX: x * grid,
        targetY: y * grid,
        state: "idle",
        animFrame: 0,
        animTick: 0,
        facing: 1,
        hp: 75,
        minDmg: 5,
        maxDmg: 15,
        xp: 15,
        movesPerTurn: 1
    });
}

        return;
    }
}
function spawnSkeleton(){
    if(poziom < 1 || poziom > 3){
        return;
    }
    const count = Math.floor(Math.random() * temps) + 1;
    for(let i = 0; i < count; i++){
        spawnEnemy("skeleton");
    }
}
function isRing(item){
    return item.type === "regeneration_ring" ||
           item.type === "defense_ring" ||
           item.type === "attack_ring";
}
function SpawnItem(type, chance){
    if(Math.random() > chance){
        return;
    }

    if(Math.random() < 1 / 50){
        const extraItems = [
            "regeneration_ring",
            "defense_ring",
            "attack_ring"
        ];

        type = extraItems[
            Math.floor(Math.random() * extraItems.length)
        ];
    }

    const createdItem = createItem(type);

    if(!createdItem){
        console.error("createItem failed for:", type);
        return;
    }

    while(true){
        const x = Math.floor(Math.random() * mapa[0].length);
        const y = Math.floor(Math.random() * mapa.length);

        if(mapa[y][x] !== 0){
            continue;
        }
        const occupiedByRat = szczury.some(rat =>
            rat.x / grid === x &&
            rat.y / grid === y
        );
        if(occupiedByRat){
            continue;
        }

        items.push({
            item: createdItem,
            x: x * grid,
            y: y * grid
        });

        return;
    }
}
function pickupItems(){
    const playerX = Math.round(gx / grid);
    const playerY = Math.round(gy / grid);

    for(let i = items.length - 1; i >= 0; i--){
        const floorItem = items[i];

        const itemX = Math.round(floorItem.x / grid);
        const itemY = Math.round(floorItem.y / grid);

        if(itemX === playerX && itemY === playerY){
            const realItem = floorItem.item || floorItem;

            const added = dodajDoInventory(realItem);

            if(added){
                items.splice(i, 1);
            }
            else{
                inventoryFullText = 180;
            }
        }
    }
}
function getRarityColor(rarity){
    if(rarity === "common") return "gray";
    if(rarity === "rare") return "lightskyblue";
    if(rarity === "legendary") return "gold";

    return "white";
}
function getItemTexture(type){
    if(type === "small_health_potion") return small_health_potion;
    if(type === "health_potion") return health_potion;
    if(type === "large_health_potion") return large_health_potion;

    if(type === "shortsword") return shortsword;
    if(type === "sword") return sword;
    if(type === "greatsword") return greatsword;

    if(type === "small_axe") return small_axe;
    if(type === "axe") return axe;
    if(type === "great_axe") return great_axe;

    if(type === "small_hammer") return small_hammer;
    if(type === "hammer") return hammer;
    if(type === "huge_hammer") return huge_hammer;

    if(type === "leather_armor") return leather_armor;
    if(type === "mail_armor") return mail_armor;
    if(type === "plate_armor") return plate_armor;

    return null;
}
function canSzczurMoveTo(x, y){
    const tx = Math.round(x / grid);
    const ty = Math.round(y / grid);
    if(
        ty < 0 ||
        ty >= mapa.length ||
        tx < 0 ||
        tx >= mapa[0].length
    ) return false;
    return mapa[ty][tx] !== 1;
}
function isRatOnTile(tileX, tileY, currentRat){
    for(const rat of szczury){
        if(rat === currentRat) continue;
        const rx = Math.round(rat.x / grid);
        const ry = Math.round(rat.y / grid);
        if(rx === tileX && ry === tileY){
            return true;
        }
    }
    return false;
}
function nastepnatura(){
  if(!gameStarted) return;
  if(gameOver || victory) return;
    ruchy++;
    if(ruchy >= 25){
        ruchy = 0;
        healuj(1);
    }
    for(const rat of szczury){
        moveszczur(rat);
    }
    renderFrame();
}
function triggerVictory(){
    if(victory) return;

    victory = true;
    victoryAlpha = 0;
}
function moveszczur(rat){
    const player = graczapozycjatera();
    const sx = rat.x / grid;
    const sy = rat.y / grid;
    
    if(areAdjacent(sx, sy, player.x, player.y)){
        for(const rat of szczury){
    checkszczurHit(rat);
}
        rat.state = "attack";
        rat.animFrame = 0;
rat.animTick = 0;
        return;
    }
    if(szczurCanSeePlayer(rat)){
        rat.targetX = gx;
        rat.targetY = gy;
    }
    const path = znajdzSciezke(
        sx,
        sy,
        rat.targetX / grid,
        rat.targetY / grid
    );
    if(path && path.length > 1){
        const next = path[1];
        const nextX = next.x;
        const nextY = next.y;
        if(isRatOnTile(nextX, nextY, rat)){
    return;
}
        if(nextX < sx){
            rat.facing = -1;
        } else if(nextX > sx){
            rat.facing = 1;
        }
        rat.x = nextX * grid;
        rat.y = nextY * grid;

        rat.state = "move";
    }
    if(Math.random() < 0.05){
        pickRandomTarget(rat);
    }
    if(rat.x === rat.targetX && rat.y === rat.targetY){
        pickRandomTarget(rat);
    }
}
function szczurCanSeePlayer(rat){
    const ex = rat.x / grid;
    const ey = rat.y / grid;
    const px = gx / grid;
    const py = gy / grid;
    const dx = px - ex;
    const dy = py - ey;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist <= 5;
}
function graczapozycjatera(){
    return {
        x: gx / grid,
        y: gy / grid
    };
}
function areAdjacent(x1, y1, x2, y2){
    const dx = Math.abs(x1 - x2);
    const dy = Math.abs(y1 - y2);

    return dx <= 1 && dy <= 1 && (dx || dy);
}
function pickRandomTarget(rat){
    rat.targetX = Math.floor(Math.random() * mapa[0].length) * grid;
    rat.targetY = Math.floor(Math.random() * mapa.length) * grid;
}
function updatedmgshowers(){
    for(let i = dmgshows.length - 1; i >= 0; i--){
        const d = dmgshows[i];

        d.age++;
        d.worldY -= 0.5;

        if(d.age > 180){
            dmgshows.splice(i, 1);
        }
    }
}
function drawdmg(){
    ctx.save();
    ctx.font = "32px amiri";
    ctx.textAlign = "center";
    for(const d of dmgshows){
    let alpha = 1;
    if(d.age > 120){
        alpha = 1 - ((d.age - 120) / 60);
    }
    ctx.globalAlpha = alpha;
    const screenX =
        d.worldX - g2X + canvas.width / 2;
    const screenY =
        d.worldY - g2Y + canvas.height / 2;
    ctx.fillStyle = d.color;
    ctx.fillText(
        d.text,
        screenX,
        screenY
    );
}
    ctx.restore();
}
function checkszczurHit(rat){
    const player = graczapozycjatera();

    const sx = rat.x / grid;
    const sy = rat.y / grid;
    const dx = Math.abs(sx - player.x);
    const dy = Math.abs(sy - player.y);
    if(dx <= 1 && dy <= 1 && !(dx === 0 && dy === 0)){
        let dmg = rand(rat.minDmg, rat.maxDmg);
        if(equipment.armor){
            const armor = rand(equipment.armor.minArmor, equipment.armor.maxArmor);
            dmg = Math.max(0, dmg - armor);
            if(
    equipment.ring &&
    equipment.ring.type === "defense_ring"
){
    dmg = Math.floor(dmg / 2);
}

        }
        hp = Math.max(0, hp - dmg);
        checkGameOver();
        pokadmg(
            dmg,
            gx,
            gy - 40,
            "red"
        );
    }
}
function drawItemTooltip(item){
    if(!item) return;

    item = item.item || item;

    const boxW = 430;
    const boxH = 160;
    const x = mouseX + 20;
    const y = mouseY + 20;

    ctx.fillStyle = "black";
    ctx.fillRect(x, y, boxW, boxH);

    ctx.strokeStyle = "white";
    ctx.strokeRect(x, y, boxW, boxH);

    const texture = getItemTexture(item.type);

    if(texture){
        ctx.drawImage(texture, x + 20, y + 25, 100, 100);
    }

    ctx.textAlign = "left";

    ctx.fillStyle = getRarityColor(item.rarity);
    ctx.font = "28px Arial";
    ctx.fillText(item.name, x + 140, y + 55);

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    if(item.type === "regeneration_ring"){
    ctx.fillText(
        "10x regeneration",
        x + 140,
        y + 95
    );
}

if(item.type === "defense_ring"){
    ctx.fillText(
        "50% damage reduction",
        x + 140,
        y + 95
    );
}

if(item.type === "attack_ring"){
    ctx.fillText(
        "2x damage",
        x + 140,
        y + 95
    );
}

    if(item.heal !== undefined){
        ctx.fillText("+" + item.heal + " HP", x + 140, y + 95);
    }
    else if(item.minDmg !== undefined){
        ctx.fillText("Damage: " + item.minDmg + " - " + item.maxDmg, x + 140, y + 95);
    }
    else if(item.minArmor !== undefined){
        ctx.fillText("Armor: " + item.minArmor + " - " + item.maxArmor, x + 140, y + 95);
    }
}
function animacjaruchugracza(){
      if(gameOver && gameOverAlpha < 1){
    gameOverAlpha += 1 / 180;
}
if(victory && victoryAlpha < 1){
    victoryAlpha += 1 / 180;
}
  updatedmgshowers();
  for(const rat of szczury){
    updateSzczurRender(rat);
    updateSzczurAnim(rat);
}

  const speedruchu = 5;
  fogPulse += 0.01;
  if(g2X < g3X){
    g2X = Math.min(g2X + speedruchu, g3X);
  }
  if(g2X > g3X){
    g2X = Math.max(g2X - speedruchu, g3X);
  }
  if(g2Y < g3Y){
    g2Y = Math.min(g2Y + speedruchu, g3Y);
  }
  if(g2Y > g3Y){
    g2Y = Math.max(g2Y - speedruchu, g3Y);
  }
  czyterazwruchujest = g2X !== g3X || g2Y !== g3Y;
  if(czyterazwruchujest){
    hipekruch++;
    if(hipekruch > 5){
    hipekruch = 0;
      fazaruchuhipka = fazaruchuhipka === 1 ? 2 : 1;
}
  }
  else{
    fazaruchuhipka = 0;
  }
  for(const rat of szczury){
    updateSzczurAnim(rat);
}
  renderFrame();
  requestAnimationFrame(animacjaruchugracza);
  const tileX = Math.round(gx / grid);
const tileY = Math.round(gy / grid);
stoiNaSchodach = mapa[tileY][tileX] == 3;
stoiNaZnaku = mapa[tileY][tileX] == 4;
}
function updateSzczurRender(rat){
    const speed = 6;
    const moving = rat.drawX !== rat.x || rat.drawY !== rat.y;

if(moving){
    rat.state = "move";
}
else if(rat.state === "move"){
    rat.state = "idle";
}
    if(rat.drawX < rat.x){
        rat.drawX = Math.min(rat.drawX + speed, rat.x);
    }
    if(rat.drawX > rat.x){
        rat.drawX = Math.max(rat.drawX - speed, rat.x);
    }
    if(rat.drawY < rat.y){
        rat.drawY = Math.min(rat.drawY + speed, rat.y);
    }
    if(rat.drawY > rat.y){
        rat.drawY = Math.max(rat.drawY - speed, rat.y);
    }
}
function maparys(cameraX, cameraY){
  for (let y = 0; y < mapa.length; y++){
    for (let x = 0; x < mapa[y].length; x++){
      const screenX = Math.round(x * grid - cameraX);
      const screenY = Math.round(y * grid - cameraY);
      let texture;
if (mapa[y][x] == 1){
  switch(sciana[y][x]){
    case 0:
    texture = wall;
    break;
        case 1:
            texture = wall2;
            break;
        case 2:
            texture = wall1;
            break;
        case 3:
            texture = wall3;
            break;
        
}}
else if (mapa[y][x] == 2){
  texture = wejscie;
}
else if (mapa[y][x] == 3){
  texture = zejscie;
}
else if(mapa[y][x] == 4){
    texture = sign;
}
else{
  texture = floor;
}
ctx.drawImage(
  texture,
  screenX,
  screenY,
  grid,
  grid
);
    }
  }
}
function znajdzSciezke(startX, startY, endX, endY){
    const open = [];
    const closed = new Set();

    open.push({
        x: startX,
        y: startY,
        g: 0,
        h: Math.abs(endX - startX) + Math.abs(endY - startY),
        parent: null
    });

    while(open.length > 0){
        open.sort((a, b) => (a.g + a.h) - (b.g + b.h));

        const current = open.shift();
        const key = current.x + "," + current.y;

        if(closed.has(key)) continue;
        closed.add(key);

        if(current.x === endX && current.y === endY){
            const path = [];

            let node = current;

            while(node){
                path.unshift({
                    x: node.x,
                    y: node.y
                });

                node = node.parent;
            }

            return path;
        }

        const dirs = [
            [1,0],
            [-1,0],
            [0,1],
            [0,-1]
        ];

        for(const [dx, dy] of dirs){
            const nx = current.x + dx;
            const ny = current.y + dy;

            if(
                ny < 0 ||
                ny >= mapa.length ||
                nx < 0 ||
                nx >= mapa[0].length
            ){
                continue;
            }

            if(mapa[ny][nx] === 1){
                continue;
            }

            open.push({
                x: nx,
                y: ny,
                g: current.g + 1,
                h: Math.abs(endX - nx) + Math.abs(endY - ny),
                parent: current
            });
        }
    }
    return null;
}
function healuj(amount){
    hp = Math.min(maxHp, hp + amount);
}
function naprawascian(){
  const chunkSize = 9;
  const size = getChunkSizeForLevel();
const xchunkow = size.x;
const ychunkow = size.y;

  for(let cy = 0; cy < ychunkow; cy++){
    for(let cx = 0; cx < xchunkow; cx++){
      const startX = cx * chunkSize;
      const startY = cy * chunkSize;
      for(let x = 1; x < chunkSize-1; x++){
        const worldX = startX + x;
        const worldY = startY;
        if(mapa[worldY][worldX] == 0){
          if(cy == 0){
            mapa[worldY][worldX] = 1;
          }
          else{
            if(mapa[worldY - 1][worldX] != 0){
              mapa[worldY][worldX] = 1;
            }
          }
        }
      }
      for(let x = 1; x < chunkSize-1; x++){

        const worldX = startX + x;
        const worldY = startY + chunkSize - 1;

        if(mapa[worldY][worldX] == 0){

          if(cy == ychunkow - 1){
            mapa[worldY][worldX] = 1;
          }
          else{
            if(mapa[worldY + 1][worldX] != 0){
              mapa[worldY][worldX] = 1;
            }
          }
        }
      }
      for(let y = 1; y < chunkSize-1; y++){
        const worldX = startX;
        const worldY = startY + y;
        if(mapa[worldY][worldX] == 0){
          if(cx == 0){
            mapa[worldY][worldX] = 1;
          }
          else{
            if(mapa[worldY][worldX - 1] != 0){
              mapa[worldY][worldX] = 1;
            }
          }
        }
      }
      for(let y = 1; y < chunkSize-1; y++){
        const worldX = startX + chunkSize - 1;
        const worldY = startY + y;
        if(mapa[worldY][worldX] == 0){
          if(cx == xchunkow - 1){
            mapa[worldY][worldX] = 1;
          }
          else{
            if(mapa[worldY][worldX + 1] != 0){
              mapa[worldY][worldX] = 1;
            }
          }
        }
      }
    }
  }
}
const napisy = [
    "The walls seem to whisper.",
    "Someone was here before you.",
    "Beware the depths below.",
    "The air grows colder.",
    "A faded warning is carved here.",
    "Many things await below.",
    "Do not go deeper.",
    "Nothing is what it seems.",
    "A strange symbol is etched here.",
    "Turn back while you still can."
];
let tekstyZnakow = {};
function generujZnaki(){

    const ileZnakow = Math.floor(Math.random() * 6);
    for(let i = 0; i < ileZnakow; i++){
        while(true){
            const x = Math.floor(Math.random() * mapa[0].length);
            const y = Math.floor(Math.random() * mapa.length);
            if(mapa[y][x] == 0){
    mapa[y][x] = 4;
    tekstyZnakow[x + "," + y] =
        napisy[Math.floor(Math.random() * napisy.length)];
    break;
}
        }
    }
}
function generujpngki(){
  sciana = [];
    for(let y = 0; y < mapa.length; y++){
        sciana[y] = [];
        for(let x = 0; x < mapa[y].length; x++){
            if(mapa[y][x] != 1){
                sciana[y][x] = 0;
                continue;
            }
            let los = Math.random();
            if(los < 0.95){
                sciana[y][x] = 0;
            }
            else{
                los = Math.random();
                if(los < 0.6){
                    sciana[y][x] = 1;
                }
                else if(los < 0.95){
                    sciana[y][x] = 2;
                }
                else{
                    sciana[y][x] = 3;
            }
        }
    }
}
}
function agdziewyjscie(){
  const minDistance = Math.min(20, Math.floor(Math.min(mapa.length, mapa[0].length) / 2));
  const playerTileX = gx / grid;
  const playerTileY = gy / grid;
  while(true){
    let x = Math.floor(Math.random() * mapa[0].length);
    let y = Math.floor(Math.random() * mapa.length);
    if(mapa[y][x] == 0){

      const dx = x - playerTileX;
      const dy = y - playerTileY;
      const distance = Math.sqrt(dx*dx + dy*dy);
      if(distance >= minDistance){

        mapa[y][x] = 3;
        return;
      }
    }
  }
}
function generujPortalLevel(){
    mapa = [];
    items = [];
    szczury = [];
    traps = [];
    tekstyZnakow = {};
    portal = null;

    const size = 21;

    for(let y = 0; y < size; y++){
        mapa[y] = [];

        for(let x = 0; x < size; x++){
            if(y === 0 || y === size - 1 || x === 0 || x === size - 1){
                mapa[y][x] = 1;
            }
            else{
                mapa[y][x] = 0;
            }
        }
    }

    gx = 10 * grid;
    gy = 15 * grid;
    g2X = gx;
    g2Y = gy;
    g3X = gx;
    g3Y = gy;

    portal = {
        x: 10 * grid,
        y: 10 * grid,
        active: true,
        animating: false,
        frame: 0
    };

    generujpngki();
    renderFrame();
}
function renderFrame(){
    if(pokazPrzerywnik){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        const obrazekPoziomu = levelImages[Math.min(poziom + 1, 5)];

        ctx.drawImage(
            przerywnik,
            Math.round(canvas.width / 2 - przerywnik.width / 2),
            100
        );

        ctx.drawImage(
            obrazekPoziomu,
            Math.round(canvas.width / 2 - obrazekPoziomu.width / 2),
            100 + przerywnik.height + 20
        );

        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cameraX = g2X - canvas.width / 2 + grid / 2;
    const cameraY = g2Y - canvas.height / 2 + grid / 2;

    maparys(cameraX, cameraY);
if(portal && portal.active){
    const portalFrames = [portal_png, portal1, portal2, portal3];
    const texture = portalFrames[portal.frame];

    const screenX = portal.x - g2X + canvas.width / 2 - grid / 2;
    const screenY = portal.y - g2Y + canvas.height / 2 - grid / 2;

    ctx.drawImage(texture, screenX, screenY, grid, grid);
}
    for(const t of traps){
        const screenX = t.x - g2X + canvas.width / 2 - grid / 2;
        const screenY = t.y - g2Y + canvas.height / 2 - grid / 2;
        const texture = t.active ? trap1 : trapTexture;

        if(texture){
            ctx.drawImage(texture, screenX, screenY, grid, grid);
        }
    }

    for(const item of items){
        const itemData = item.item || item;
        const screenX = item.x - g2X + canvas.width / 2 - grid / 2;
        const screenY = item.y - g2Y + canvas.height / 2 - grid / 2;
        const texture = getItemTexture(itemData.type);

        if(texture){
            ctx.drawImage(texture, screenX, screenY, grid, grid);
        }
    }

    let teksturagracza;

    if(kierunekgo === "2"){
        teksturagracza =
            fazaruchuhipka === 0 ? player1 :
            fazaruchuhipka === 1 ? player2 : player3;
    }
    else{
        teksturagracza =
            fazaruchuhipka === 0 ? player4 :
            fazaruchuhipka === 1 ? player5 : player6;
    }

    ctx.drawImage(
        teksturagracza,
        canvas.width / 2 - grid / 2,
        canvas.height / 2 - grid / 2,
        grid,
        grid
    );

    for(const rat of szczury){
        let frameImg;

        if(rat.type === "skeleton"){
            if(rat.state === "idle"){
                frameImg = skeleton;
            }
            else if(rat.state === "attack"){
                frameImg = skeletonFrames.attack[rat.animFrame];
            }
            else{
                frameImg = skeletonFrames.move[rat.animFrame];
            }
        }
        else if(rat.type === "giant_spider"){
            if(rat.state === "idle"){
                frameImg = spider1;
            }
            else if(rat.state === "attack"){
                frameImg = spiderFrames.attack[rat.animFrame];
            }
            else{
                frameImg = spiderFrames.move[rat.animFrame];
            }
        }
        else if(rat.type === "sludge"){
            if(rat.state === "idle"){
                frameImg = sludge1;
            }
            else if(rat.state === "attack"){
                frameImg = sludgeFrames.attack[rat.animFrame];
            }
            else{
                frameImg = sludgeFrames.move[rat.animFrame];
            }
        }
        else{
            if(rat.state === "idle"){
                frameImg = szczur;
            }
            else if(rat.state === "attack"){
                frameImg = szczurFrames.attack[rat.animFrame];
            }
            else{
                frameImg = szczurFrames.move[rat.animFrame];
            }
        }

        if(!frameImg){
            console.error("Missing enemy texture:", rat);
            continue;
        }

        ctx.save();

        const screenX = rat.drawX - g2X + canvas.width / 2;
        const screenY = rat.drawY - g2Y + canvas.height / 2;

        ctx.translate(screenX, screenY);

        if(rat.facing === -1){
            ctx.scale(-1, 1);
        }

        const enemySize = rat.type === "rat" ? grid * 0.75 : grid;

        ctx.drawImage(
            frameImg,
            -enemySize / 2,
            -enemySize / 2,
            enemySize,
            enemySize
        );

        ctx.restore();
    }

    const fogScale = 1 + Math.sin(fogPulse) * 0.02;
    const fogWidth = canvas.width * fogScale * 1.1;
    const fogHeight = canvas.height * fogScale * 1.1;

    ctx.drawImage(
        fog,
        (canvas.width - fogWidth) / 2,
        (canvas.height - fogHeight) / 2,
        fogWidth,
        fogHeight
    );

    drawHP();
    drawEXP();
    drawdmg();

    if(stoiNaSchodach){
        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Press SPACE to go down", canvas.width / 2, canvas.height - 50);
    }

    if(pokazNapis){
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(100, canvas.height - 180, canvas.width - 200, 120);

        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.fillText(aktywnyNapis, canvas.width / 2, canvas.height - 120);
    }

    if(pokazInventory){
        let hoveredItem = null;
        selectedInventorySlot = -1;

        const slotSize = 60;
        const gap = 10;
        const cols = 5;
        const rows = 5;

        const startX = canvas.width / 2 - (cols * slotSize + (cols - 1) * gap) / 2;
        const startY = canvas.height / 2 - (rows * slotSize + (rows - 1) * gap) / 2;

        ctx.fillStyle = "rgba(0,0,0,0.85)";
        ctx.fillRect(
            startX - 160,
            startY - 70,
            cols * slotSize + (cols - 1) * gap + 190,
            rows * slotSize + (rows - 1) * gap + 100
        );

        drawEquipmentSlots(startX, startY);

        ctx.fillStyle = "white";
        ctx.font = "28px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Inventory", canvas.width / 2, startY - 30);

        for(let i = 0; i < inventory.length; i++){
            const col = i % cols;
            const row = Math.floor(i / cols);

            const x = startX + col * (slotSize + gap);
            const y = startY + row * (slotSize + gap);

            ctx.fillStyle = "rgba(255,255,255,0.15)";
            ctx.fillRect(x, y, slotSize, slotSize);

            ctx.strokeStyle = "white";
            ctx.strokeRect(x, y, slotSize, slotSize);

            const item = inventory[i];

            if(item !== null){
                const texture = getItemTexture(item.type);

                if(texture){
                    ctx.drawImage(texture, x + 5, y + 5, slotSize - 10, slotSize - 10);
                }

                if(
                    mouseX >= x &&
                    mouseX <= x + slotSize &&
                    mouseY >= y &&
                    mouseY <= y + slotSize
                ){
                    hoveredItem = item;
                    selectedInventorySlot = i;
                }
            }
        }

        if(hoveredItem){
            drawItemTooltip(hoveredItem);
        }
    }

    if(inventoryFullText > 0){
        ctx.save();

        ctx.globalAlpha = Math.min(1, inventoryFullText / 60);
        ctx.fillStyle}
      if(gameOver){
    ctx.save();

    ctx.globalAlpha = gameOverAlpha;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalAlpha = Math.min(1, gameOverAlpha * 2);
    ctx.fillStyle = "red";
    ctx.font = "80px Algerian";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
        "GAME OVER",
        canvas.width / 2,
        canvas.height / 2
    );

    ctx.restore();
}
if(victory){
    ctx.save();

    ctx.globalAlpha = victoryAlpha;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalAlpha = Math.min(1, victoryAlpha * 2);

    ctx.fillStyle = "lime";
    ctx.font = "80px Algerian";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "VICTORY",
        canvas.width / 2,
        canvas.height / 2
    );

    ctx.restore();
}}
        
function checkTrap(){
    const playerX = Math.round(gx / grid);
    const playerY = Math.round(gy / grid);

    for(const t of traps){

        const trapX = Math.round(t.x / grid);
        const trapY = Math.round(t.y / grid);

        if(
            trapX === playerX &&
            trapY === playerY &&
            !t.active
        ){
            t.active = true;

            hp = Math.max(0, hp - 10);
            checkGameOver();

            pokadmg(
                10,
                gx,
                gy - 40,
                "red"
            );

            setTimeout(() => {
                t.active = false;
            }, 500);

            return;
        }
    }
}
function drawEquipmentSlots(startX, startY){
    const slotSize = 60;
    const gap = 15;

    const labels = ["Weapon", "Armor", "Extra"];
    const keys = ["weapon", "armor", "extra"];

    for(let i = 0; i < 3; i++){
        const x = startX - 100;
        const y = startY + i * (slotSize + gap);

        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.fillRect(x, y, slotSize, slotSize);

        ctx.strokeStyle = "white";
        ctx.strokeRect(x, y, slotSize, slotSize);

        ctx.fillStyle = "white";
        ctx.font = "14px Arial";
        ctx.textAlign = "right";
        ctx.fillText(labels[i], x - 10, y + 35);
        const item = equipment[keys[i]];

if(item){
    const texture = getItemTexture(item.type);

    if(texture){
        ctx.drawImage(
            texture,
            x + 5,
            y + 5,
            slotSize - 10,
            slotSize - 10
        );
    }
}
if(
    mouseX >= x &&
    mouseX <= x + slotSize &&
    mouseY >= y &&
    mouseY <= y + slotSize
){
    drawItemTooltip(item);
}
        }
    
}
function isWeapon(item){
    return item && item.minDmg !== undefined;
}

function isArmor(item){
    return item && item.minArmor !== undefined;
}

function equipItemFromInventory(index){
    const item = inventory[index];
    if(!item) return;

    if(isRing(item)){
    inventory[index] = equipment.ring;
    equipment.ring = item;
}
    if(isWeapon(item)){
        inventory[index] = equipment.weapon;
        equipment.weapon = item;
        return;
    }

    if(isArmor(item)){
        inventory[index] = equipment.armor;
        equipment.armor = item;
        return;
    }
}
function equipItemFromInventory(index){
    const item = inventory[index];
    if(!item) return;

    if(isWeapon(item)){
        inventory[index] = equipment.weapon;
        equipment.weapon = item;
        return;
    }

    if(isArmor(item)){
        inventory[index] = equipment.armor;
        equipment.armor = item;
        return;
    }
}
function equipItemFromSlot(index){
    const item = inventory[index];
    if(!item) return;
    if(item === isWeapon(item)){
        equipment.weapon = item;
        inventory[index] = null;
    }
    if(item === isArmor(item)){
        equipment.armor = item;
        inventory[index] = null;
    }
}
function dodajDoInventory(item){
    for(let i = 0; i < inventory.length; i++){
        if(inventory[i] === null){
            inventory[i] = item;
            return true;
        }
    }

    return false;
}

function losowyresp(){
  while (true){
    let x = Math.floor(Math.random() * mapa[0].length);
    let y = Math.floor(Math.random() * mapa.length);
    if (mapa[y][x] == 0){
      gx = x * grid;
gy = y * grid;
g2X = gx;
g2Y = gy;
g3X = gx;
g3Y = gy;
mapa[y][x] = 2;
      return;
    }
  }
}
const grid = 50;
let gx = 50;
let gy = 50;
let g2X = gx;
let g2Y = gy;
let g3X = gx;
let g3Y = gy;
let czyterazwruchujest = false;
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function stworzmape(){
 const chunkSize = 9;
const size = getChunkSizeForLevel();
const fullwidth = size.x;
const fullheight = size.y;
  for(let y = 0; y < fullheight * chunkSize; y++){
    mapa[y] = []
    for(let x=0; x< fullwidth * chunkSize; x++){
      mapa[y][x] = 1;
    }
  }
  for(let gy=0; gy < fullheight;gy++){
    for(let gx =0; gx < fullwidth;gx++){
       let losowanie = Math.floor(Math.random() * 8) + 1;
       let wylosowanychunk = []
      if (losowanie==1){
       wylosowanychunk=chunk1
      }
      else{
        if (losowanie==2){
          wylosowanychunk=chunk2
        }
        else{
          if (losowanie==3){
            wylosowanychunk=chunk3
          }
          else{
            if (losowanie==4){
              wylosowanychunk=chunk4
      }
      else{
        if(losowanie==5){
          wylosowanychunk=chunk5
        }
        else{
        if(losowanie==6){
          wylosowanychunk=chunk6
        }
        else{
        if(losowanie==7){
          wylosowanychunk=chunk7
        }
        else{
        if(losowanie==8){
          wylosowanychunk=chunk8
        }}}
        }
      }
    }
  }
}
      let chunk = wylosowanychunk;
      for(let y=0; y < chunkSize; y++){
        for(let x = 0; x <chunkSize; x++){
          mapa[
            gy*chunkSize+y][gx*chunkSize+x] = chunk[y][x];
          
        }
      }
    }
  }
}
function isRatAdjacent(){
    const player = graczapozycjatera();

    for(const rat of szczury){
        const dx = Math.abs(rat.x / grid - player.x);
        const dy = Math.abs(rat.y / grid - player.y);

        if(dx <= 1 && dy <= 1 && !(dx === 0 && dy === 0)){
            return true;
        }
    }

    return false;
}
async function zejdzPoziom(){
    pokazPrzerywnik = true;
    renderFrame();
    await sleep(3000);
    poziom++;
    
    if(poziom >= 0 && poziom <= 4){
    minRats = minRats*3;
    maxRats = Math.ceil(maxRats * 2.5);
    temps = temps * 1.5;
    console.log("szkielety:", temps, poziom)
}
if(poziom == 4){
  minrats=0;
  maxrats=0;
  temps=0;
}
    generujlvl();
    g2X = gx;
    g2Y = gy;
    g3X = gx;
    g3Y = gy;
    pokazPrzerywnik = false;
    renderFrame();
}
function firstFreeInventorySlot(){
    for(let i = 0; i < inventory.length; i++){
        if(inventory[i] === null) return i;
    }
    return -1;
}

function isWeapon(item){
    return item && item.minDmg !== undefined;
}

function isArmor(item){
    return item && item.minArmor !== undefined;
}

function equipItemFromInventory(index){
    const item = inventory[index];
    if(!item) return;

    if(isWeapon(item)){
        inventory[index] = equipment.weapon;
        equipment.weapon = item;
        return;
    }

    if(isArmor(item)){
        inventory[index] = equipment.armor;
        equipment.armor = item;
        return;
    }
}
function rand(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function unequipItem(slot){
    if(!equipment[slot]) return;

    const free = firstFreeInventorySlot();
    if(free === -1) return;

    inventory[free] = equipment[slot];
    equipment[slot] = null;
}
function rollRarity(){
    const r = Math.floor(Math.random() * 20);
    if(r < 14){
        return "common";
    }
    if(r < 19){
        return "rare";
    }
    return "legendary";
}
function rand(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fixStats(min, max){
    if(min >= max){
        max = min + 1;
    }

    return { min, max };
}
function spawnRandomItem(){
    const rarity = rollRarity();
    const pool = itemPools[rarity];
    const type = pool[Math.floor(Math.random() * pool.length)];

    SpawnItem(type, 1);
}
function createItem(type){
  if(type === "small_health_potion"){
    return {
        type: "small_health_potion",
        name: "Small Health Potion",
        heal: 10,
        rarity: "common"
    };
}
if(type === "regeneration_ring"){
    return {
        type: "regeneration_ring",
        name: "Regeneration Ring",
        rarity: "legendary"
    };
}

if(type === "defense_ring"){
    return {
        type: "defense_ring",
        name: "Defense Ring",
        rarity: "legendary"
    };
}

if(type === "attack_ring"){
    return {
        type: "attack_ring",
        name: "Attack Ring",
        rarity: "legendary"
    };
}
    if(type === "health_potion"){
        return { type, name: "Health Potion", heal: 20, rarity: "common" };
    }

    if(type === "large_health_potion"){
        return { type, name: "Large Health Potion", heal: 40, rarity: "rare" };
    }

    if(type === "small_axe"){
        const s = fixStats(rand(0, 1), rand(4, 10));
        return { type, name: "Small Axe", minDmg: s.min, maxDmg: s.max, rarity: "common" };
    }

    if(type === "axe"){
        const s = fixStats(rand(0, 3), rand(4, 15));
        return { type, name: "Axe", minDmg: s.min, maxDmg: s.max, rarity: "rare" };
    }
if(type === "shortsword"){
    let minDmg = rand(1, 6);
    let maxDmg = rand(2, 10);

    if(minDmg >= maxDmg){
        maxDmg = minDmg + 1;
    }

    return {
        type: "shortsword",
        name: "Shortsword",
        minDmg: minDmg,
        maxDmg: maxDmg,
        rarity: "common"
    };
}
if(type === "leather_armor"){
    let minArmor = rand(0, 1);
    let maxArmor = rand(1, 5);

    if(minArmor >= maxArmor){
        maxArmor = minArmor + 1;
    }

    return {
        type: "leather_armor",
        name: "Leather Armor",
        minArmor,
        maxArmor,
        rarity: "common"
    };
}
    if(type === "great_axe"){
        const s = fixStats(rand(0, 4), rand(6, 30));
        return { type, name: "Great Axe", minDmg: s.min, maxDmg: s.max, rarity: "legendary" };
    }

    if(type === "sword"){
        const s = fixStats(rand(2, 8), rand(4, 12));
        return { type, name: "Sword", minDmg: s.min, maxDmg: s.max, rarity: "rare" };
    }

    if(type === "greatsword"){
        const s = fixStats(rand(6, 12), rand(10, 20));
        return { type, name: "GreatSword", minDmg: s.min, maxDmg: s.max, rarity: "legendary" };
    }

    if(type === "small_hammer"){
        return { type, name: "Small Hammer", minDmg: rand(3, 5), maxDmg: rand(3, 5), rarity: "common" };
    }

    if(type === "hammer"){
        return { type, name: "Hammer", minDmg: rand(5, 8), maxDmg: rand(5, 8), rarity: "rare" };
    }

    if(type === "huge_hammer"){
        return { type, name: "Huge Hammer", minDmg: rand(8, 15), maxDmg: rand(8, 15), rarity: "legendary" };
    }

    if(type === "mail_armor"){
        const s = fixStats(rand(1, 4), rand(2, 8));
        return { type, name: "Mail Armor", minArmor: s.min, maxArmor: s.max, rarity: "rare" };
    }

    if(type === "plate_armor"){
        const s = fixStats(rand(4, 9), rand(7, 16));
        return { type, name: "Plate Armor", minArmor: s.min, maxArmor: s.max, rarity: "legendary" };
    }
}

async function main(){
ctx.imageSmoothingEnabled = false;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillStyle="blue";
ctx.font = "80px Arial";
ctx.textAlign = "center";
ctx.textBaseline = "middle"; 
ctx.fillText("Loading", canvas.width/2, canvas.height/2);
while (!(wall_loaded &&floor_loaded &&wejscie_loaded &&zejscie_loaded &&player1_loaded &&player2_loaded &&player3_loaded &&fog_loaded&&szczur_loaded&&szczur_attack1_loaded&&szczur_attack2_loaded&&szczur_attack3_loaded&&szczur_move1_loaded&&szczur_move2_loaded)){
    await sleep(1000)
  }
  drawStartScreen();
  canvas.addEventListener("click", (e) => {
    if(gameStarted) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const bx = canvas.width / 2 - 150;
    const by = canvas.height / 2 + 20;
    const bw = 300;
    const bh = 80;

    if(x >= bx && x <= bx + bw && y >= by && y <= by + bh){
        gameStarted = true;
        generujlvl();
        animacjaruchugracza();
    }
});

  window.addEventListener("keydown", (a) => {
     if(!gameStarted) return;
    
    const slow = {
        a: [-1,0],
        d: [1,0],
        w: [0,-1],
        s: [0,1]
    };
    const attacks = {
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
    ArrowUp: [0, -1],
    ArrowDown: [0, 1]
};
window.addEventListener("keyup", (a) => {
    const attacks = {
        ArrowLeft: true,
        ArrowRight: true,
        ArrowUp: true,
        ArrowDown: true
    };

    if(a.key in attacks){
        canAttack = true;
    }
});
function deleteHoveredItem(){
    if(!pokazInventory) return;

    if(
        selectedInventorySlot !== -1 &&
        inventory[selectedInventorySlot] !== null
    ){
        inventory[selectedInventorySlot] = null;
        renderFrame();
    }
}
if(a.key.toLowerCase() === "x"){
    deleteHoveredItem();
}
canvas.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});
if(pokazInventory && a.key >= "1" && a.key <= "9"){
    equipItemFromSlot(Number(a.key) - 1);
    renderFrame();}
if(a.key.toLowerCase() === "e"){
    pokazInventory = !pokazInventory;
    renderFrame();
}
    if(a.key in slow){
        moveBy(...slow[a.key]);
    }
if(a.key in attacks && canAttack){
    canAttack = false;
    playerAttack(...attacks[a.key]);
}
    if(a.key.toLowerCase() === "q"){
    if(!isRatAdjacent()){
        nastepnatura();
    }
}
    if (a.code === "Space" && stoiNaSchodach){
    zejdzPoziom();
}
if(a.code === "Space" && stoiNaZnaku){
  if(stoiNaZnaku && !pokazNapis){
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText(
        "Press SPACE to read",
        canvas.width / 2,
        canvas.height - 80
    )};
  if(pokazNapis) return;
    const tileX = Math.round(gx / grid);
    const tileY = Math.round(gy / grid);
    aktywnyNapis =
    tekstyZnakow[tileX + "," + tileY] ||
    "The sign is too worn to read.";
    pokazNapis = true;
    renderFrame();
}
canvas.addEventListener("click", (e) => {
    if(!pokazInventory) return;

    const mx = e.clientX;
    const my = e.clientY;

    const slotSize = 60;
    const gap = 10;
    const cols = 5;
    const rows = 5;

    const startX = canvas.width / 2 - (cols * slotSize + (cols - 1) * gap) / 2;
    const startY = canvas.height / 2 - (rows * slotSize + (rows - 1) * gap) / 2;

    const eqX = startX - 100;
    const eqGap = 15;
    const eqKeys = ["weapon", "armor", "extra"];

    for(let i = 0; i < eqKeys.length; i++){
        const x = eqX;
        const y = startY + i * (slotSize + eqGap);

        if(mx >= x && mx <= x + slotSize && my >= y && my <= y + slotSize){
            unequipItem(eqKeys[i]);
            renderFrame();
            return;
        }
    }
selectedInventorySlot = -1;
    for(let i = 0; i < inventory.length; i++){
        const col = i % cols;
        const row = Math.floor(i / cols);

        const x = startX + col * (slotSize + gap);
        const y = startY + row * (slotSize + gap);

        if(mx >= x && mx <= x + slotSize && my >= y && my <= y + slotSize){
            if(
    inventory[i]?.type === "small_health_potion" ||
    inventory[i]?.type === "health_potion" ||
    inventory[i]?.type === "large_health_potion"
){
    hp = Math.min(
        maxHp,
        hp + inventory[i].heal
    );

    inventory[i] = null;
}
else{
    equipItemFromInventory(i);
}
            renderFrame();
            return;
        }
    }
});
if(a.code === "Escape"){
    pokazNapis = false;
    renderFrame();
}
renderFrame();
});}
main()
