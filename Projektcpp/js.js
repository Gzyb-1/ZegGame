const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillStyle="blue";
const grid = 50;
let gx = 0;
let gy = 0;
window.addEventListener("keydown", (d) => {if (d.key === "d") 
  {
    wprawo();
  };});
function wprawo()
{
  gx = gx + grid;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(gx, gy, 50, 50);
}
window.addEventListener("keydown", (w) => {if (w.key === "w") 
  {
    wgore();
  };});
  function wgore()
{
  gy = gy - grid;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(gx, gy, 50, 50);
}
window.addEventListener("keydown", (a) => {if (a.key === "a") 
  {
    wlewo();
  };});
  function wlewo()
{
  gx = gx - grid;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(gx, gy, 50, 50);
}
window.addEventListener("keydown", (s) => {if (s.key === "s") 
  {
    wdol();
  };});
  function wdol()
{
  gy = gy + grid;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(gx, gy, 50, 50);
}
function maparys()
{

}
