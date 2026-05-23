
//Tu jest wszystko do gnerowania labiryntu i do ruchu
function moveBy(x,y){

  const tempx = Math.round((gx + grid*x) / grid);
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
      renderFrame();
    }
    if (mapa[tempy][tempx] == 2){
      gx += grid * x;
      gy += grid * y;
      renderFrame();
    }
  }
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
function renderFrame(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cameraX = gx - canvas.width / 2 + grid / 2;
  const cameraY = gy - canvas.height / 2 + grid / 2;
  maparys(cameraX, cameraY);
  ctx.fillStyle = "blue";
  ctx.fillRect(
    canvas.width / 2 - grid / 2,
    canvas.height / 2 - grid / 2,
    grid,
    grid
  );
}
function losowyresp(){

  while (true){
    let x = Math.floor(Math.random() * mapa[0].length);
    let y = Math.floor(Math.random() * mapa.length);
    if (mapa[y][x] == 0){
      gx = x * grid;
gy = y * grid;

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
let mapa = []
const wall = new Image();
wall.src = "wall_front.png";
wall.width = 50
wall.height = 50
const floor = new Image();
floor.src = "floor.png";
floor.width = 50
floor.height = 50
const wejscie = new Image();
wejscie.src = "wejscie.png";
wejscie.width = 50;
wejscie.height = 50;
let floor_loaded = false
let wall_loaded = false
let wejscie_loaded = false;

floor.onload = () => {
  floor_loaded = true
};
wall.onload = () =>{
  wall_loaded = true
}
wejscie.onload = () => {
  wejscie_loaded = true;
};
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
       let losowanie = Math.floor(Math.random() * 4) + 1;
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
  while (!(wall_loaded && floor_loaded && wejscie_loaded)){
    await sleep(1000)
  }
  stworzmape();
  naprawascian();
  losowyresp();
  
  console.log('aa')
  window.addEventListener("keydown", (a) => {
    slow = {'a':[-1,0],'d':[1,0],'w':[0,-1],'s':[0,1]}
    if (a.key in slow){moveBy(...slow[a.key]);}
    });
  renderFrame()
}
main()
