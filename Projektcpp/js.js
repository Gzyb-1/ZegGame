
function moveBy(x,y){
  const tempx  = Math.round((gx +grid*x)/grid)
  const tempy  =  Math.round((gy +grid*y)/grid)
  if (mapa.length>tempy && tempy>=0){
    if (mapa[tempy].length>tempx && tempx>=0){
      if (!mapa[tempy][tempx]){
        gx +=grid*x
        gy +=grid*y 
        renderFrame()
      }
    }
  }

  
}
function maparys(){
  console.log(canvas.height,canvas.width)
  for (let y=0;y<canvas.height/50;y++){
    for (let x=0;x<canvas.width/50;x++){
      ctx.drawImage(mapa[y][x] ? wall : floor, x*50, y*50,50,50);
    };
  };
}
function renderFrame(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  maparys()
  ctx.fillRect(gx, gy, 50, 50);
}
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillStyle="blue";
ctx.font = "80px Arial";
ctx.textAlign = "center";
ctx.textBaseline = "middle"; 
ctx.fillText("Loading", canvas.width/2, canvas.height/2);
const grid = 50;
let gx = 0;
let gy = 0;
let mapa = []
const wall = new Image();
wall.src = "wall_front.png";
wall.width = 50
wall.height = 50
const floor = new Image();
floor.src = "floor.png";
floor.width = 50
floor.height = 50
let floor_loaded = false
let wall_loaded = false
floor.onload = () => {
  floor_loaded = true
};
wall.onload = () =>{
  wall_loaded = true
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main(){
  while (!(wall_loaded && floor_loaded)){
    await sleep(1000)
  }
  console.log('aa')
  for (let y=0;y<canvas.height/50;y++){
    let temp = []
      for (let x=0;x<canvas.width/50;x++){
        temp.push(Boolean(Math.round(Math.random())))
      };
      mapa.push(temp)
    };
  window.addEventListener("keydown", (a) => {
    slow = {'a':[-1,0],'d':[1,0],'w':[0,-1],'s':[0,1]}
    if (a.key in slow){moveBy(...slow[a.key]);}
    });
  renderFrame()
}
main()

