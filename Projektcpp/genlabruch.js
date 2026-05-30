//Tu jest wszystko do gnerowania labiryntu i do ruchu
let fazaruchuhipka = 0;
  let hipekruch = 0;
  let kierunekgo = "left";
function moveBy(x,y){const tempx = Math.round((gx + grid*x) / grid);
  if(czyterazwruchujest) return;
  if(x < 0){
    kierunekgo = "1";
}
if(x > 0){
    kierunekgo = "2";
}
const tempy = Math.round((gy + grid*y) / grid);
  if (
    tempy >= 0 &&
    tempy < mapa.length &&
    tempx >= 0 &&
    tempx < mapa[tempy].length
  ) {
    if (mapa[tempy][tempx] == 0){
      gx += grid * x;
gy += grid * y;
g3X = gx;
g3Y = gy;
czyterazwruchujest = true;
      renderFrame();
    }
    if (mapa[tempy][tempx] == 2){
      gx += grid * x;
gy += grid * y;
g3X = gx;
g3Y = gy;
czyterazwruchujest = true;
      renderFrame();
    }
    if (mapa[tempy][tempx] == 3){
      gx += grid * x;
gy += grid * y;
g3X = gx;
g3Y = gy;
czyterazwruchujest = true;
      renderFrame();
    }
  }
}
function animacjaruchugracza(){
  const speedruchu = 5;
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
      if(fazaruchuhipka === 1){
        fazaruchuhipka = 2;
    } else {
        fazaruchuhipka = 1;
    }
}
  }
  else{
    fazaruchuhipka = 0;
  }
  renderFrame();
  requestAnimationFrame(animacjaruchugracza);
}
function maparys(cameraX, cameraY){
  for (let y = 0; y < mapa.length; y++){
    for (let x = 0; x < mapa[y].length; x++){
      const screenX = Math.round(x * grid - cameraX);
      const screenY = Math.round(y * grid - cameraY);
      let texture;
if (mapa[y][x] == 1){
  texture = wall;
}
else if (mapa[y][x] == 2){
  texture = wejscie;
}
else if (mapa[y][x] == 3){
  texture = zejscie;
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
function naprawascian(){
  const chunkSize = 9;
  const xchunkow = 8;
  const ychunkow = 4;

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
function agdziewyjscie(){
  const minDistance = 20;
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
function renderFrame(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cameraX = g2X - canvas.width / 2 + grid / 2;
  const cameraY = g2Y - canvas.height / 2 + grid / 2;
  maparys(cameraX, cameraY);
  let teksturagracza;
if(kierunekgo === "2"){
    if(fazaruchuhipka === 0){
        teksturagracza = player1;
    }
    else if(fazaruchuhipka === 1){
        teksturagracza = player2;
    }
    else{
        teksturagracza = player3;
    }

}else{
    if(fazaruchuhipka === 0){
        teksturagracza = player4;
    }
    else if(fazaruchuhipka === 1){
        teksturagracza = player5;
    }
    else{
        teksturagracza = player6;
    }
  }
    ctx.drawImage(
      teksturagracza,
      Math.round(canvas.width / 2 - grid / 2),Math.round(canvas.height / 2 - grid / 2),grid,grid
    );}
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
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillStyle="blue";
ctx.font = "80px Arial";
ctx.textAlign = "center";
ctx.textBaseline = "middle"; 
ctx.fillText("Loading", canvas.width/2, canvas.height/2);
const grid = 50;
let gx = 50;
let gy = 50;
let g2X = gx;
let g2Y = gy;
let g3X = gx;
let g3Y = gy;
let czyterazwruchujest = false;
let mapa = []
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function stworzmape(){
 const chunkSize = 9;
const fullwidth = 8;
const fullheight = 4;
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
async function main(){
while (!(wall_loaded &&floor_loaded &&wejscie_loaded &&zejscie_loaded &&player1_loaded &&player2_loaded &&player3_loaded)){
    await sleep(1000)
  }
  stworzmape();
  naprawascian();
  losowyresp();
  agdziewyjscie();
  animacjaruchugracza();
  
  console.log('aa')
  window.addEventListener("keydown", (a) => {
    slow = {a:[-1,0],d:[1,0],w:[0,-1],s:[0,1]}
    if (a.key in slow){moveBy(...slow[a.key]);}
    });
  renderFrame()
}
main()
