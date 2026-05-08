const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const TILE_SIZE = 64;

  const cols = Math.floor(canvas.width / TILE_SIZE);
  const rows = Math.floor(canvas.height / TILE_SIZE);

  // =========================
  // TEKSTURY
  // =========================

  // Wrzuć pliki do tego samego folderu:
  // wall.png
  // floor.png
  // player.png

  const wallTexture = new Image();
  wallTexture.src = "wall.png";

  const floorTexture = new Image();
  floorTexture.src = "floor.png";

  const playerTexture = new Image();
  playerTexture.src = "player.png";

  // =========================
  // MAPA
  // =========================

  const map = [];

  for (let y = 0; y < rows; y++) {

    map[y] = [];

    for (let x = 0; x < cols; x++) {

      // Ściany na bokach mapy
      if (
        x === 0 ||
        y === 0 ||
        x === cols - 1 ||
        y === rows - 1
      ) {
        map[y][x] = 1;
      } else {
        map[y][x] = 0;
      }
    }
  }

  // =========================
  // GRACZ
  // =========================

  const player = {
    x: 2,
    y: 2
  };

  let canMove = true;

  document.addEventListener("keydown", (e) => {

    if (!canMove) return;

    let newX = player.x;
    let newY = player.y;

    const key = e.key.toLowerCase();

    if (key === "w") newY--;
    if (key === "s") newY++;
    if (key === "a") newX--;
    if (key === "d") newX++;

    // Kolizja
    if (map[newY][newX] === 0) {
      player.x = newX;
      player.y = newY;
    }

    canMove = false;
  });

  document.addEventListener("keyup", () => {
    canMove = true;
  });

  // =========================
  // RYSOWANIE MAPY
  // =========================

  function drawMap() {

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {

        const tileX = x * TILE_SIZE;
        const tileY = y * TILE_SIZE;

        // PODŁOGA
        if (map[y][x] === 0) {
          ctx.drawImage(
            floorTexture,
            tileX,
            tileY,
            TILE_SIZE,
            TILE_SIZE
          );
        }

        // ŚCIANA
        if (map[y][x] === 1) {
          ctx.drawImage(
            wallTexture,
            tileX,
            tileY,
            TILE_SIZE,
            TILE_SIZE
          );
        }
      }
    }
  }

  // =========================
  // RYSOWANIE GRACZA
  // =========================

  function drawPlayer() {

    ctx.drawImage(
      playerTexture,
      player.x * TILE_SIZE,
      player.y * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE
    );
  }

  // =========================
  // GAME LOOP
  // =========================

  function gameLoop() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawMap();
    drawPlayer();

    requestAnimationFrame(gameLoop);
  }

  gameLoop();