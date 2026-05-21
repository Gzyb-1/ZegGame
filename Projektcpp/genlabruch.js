
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
  for (let y=0;y<18;y++){
    for (let x=0;x<36;x++){
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
function stworzmape(){
  const chunkSize=9;
  const fullwidth=4;
  const fullheight=2;
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
  while (!(wall_loaded && floor_loaded)){
    await sleep(1000)
  }
  stworzmape();
  
  console.log('aa')
  window.addEventListener("keydown", (a) => {
    slow = {'a':[-1,0],'d':[1,0],'w':[0,-1],'s':[0,1]}
    if (a.key in slow){moveBy(...slow[a.key]);}
    });
  renderFrame()
}
main()