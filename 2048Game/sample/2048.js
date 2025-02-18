game = {
  rows: 4,
  columns: 4,
  score: 0,
  board: [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
};

window.onload = function () {
  setGame();
};

function setGame() {
  for (let row = 0; row < game.rows; row++) {
    for (let col = 0; col < game.columns; col++) {
      let tile = document.createElement("div");
      tile.id = row.toString() + "-" + col.toString();
      let num = game.board[row][col];
      updateTile(tile, num);
      document.getElementById("board").append(tile);
    }
  }

  setTwos();
  setTwos();
}

function hasEmptyTile() {
  let count = 0;
  for (let r = 0; r < game.rows; r++) {
    for (let c = 0; c < game.columns; c++) {
      if (game.board[r][c] == 0) {
        return true;
      }
    }
  }
  return false;
}

function setTwos() {
  if (!hasEmptyTile()) {
    return;
  }
  let found = false;
  while (!found) {
    let r = Math.floor(Math.random() * game.rows);
    let c = Math.floor(Math.random() * game.columns);

    if (game.board[r][c] == 0) {
      game.board[r][c] = 2;
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      tile.innerText = "2";
      tile.classList.add("x2");
      found = true;
    }
  }
}

function updateTile(tile, num) {
  tile.innerText = "";
  tile.classList.value = "";
  tile.classList.add("tile");
  if (num > 0) {
    tile.innerText = num;
    if (num <= 4096) {
      tile.classList.add("x" + num.toString());
    } else {
      tile.classList.add("x8192");
    }
  }
}

document.addEventListener("keyup", (event) => {
  if (event.code == "ArrowLeft") {
    slideLeft();
    setTwos();
  } else if (event.code == "ArrowRight") {
    slideRight();
    setTwos();
  } else if (event.code == "ArrowUp") {
    slideUp();
    setTwos();
  } else if (event.code == "ArrowDown") {
    slideDown();
    setTwos();
  }
  document.getElementById("score").innerText = game.score;
});

function filterZero(row) {
  return row.filter((num) => num !== 0);
}

function slide(row) {
  row = filterZero(row);

  for (let i = 0; i < row.length; i++) {
    if (row[i] == row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      game.score += row[i];
    }
  }

  row = filterZero(row);

  while (row.length < game.columns) {
    row.push(0);
  }

  return row;
}

function slideLeft() {
  for (let r = 0; r < 4; r++) {
    let row = game.board[r];
    row = slide(row);
    game.board[r] = row;

    for (let c = 0; c < game.columns; c++) {
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = game.board[r][c];
      updateTile(tile, num);
    }
  }
}

function slideRight() {
  for (let r = 0; r < 4; r++) {
    let row = game.board[r];
    row = row.reverse();
    row = slide(row);
    row = row.reverse();
    game.board[r] = row;

    for (let c = 0; c < game.columns; c++) {
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = game.board[r][c];
      updateTile(tile, num);
    }
  }
}

function slideUp() {
  for (let c = 0; c < game.columns; c++) {
    let row = [
      game.board[0][c],
      game.board[1][c],
      game.board[2][c],
      game.board[3][c],
    ];
    row = slide(row);
    for (let r = 0; r < game.rows; r++) {
      game.board[r][c] = row[r];
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = game.board[r][c];
      updateTile(tile, num);
    }
  }
}

function slideDown() {
  for (let c = 0; c < game.columns; c++) {
    let row = [
      game.board[0][c],
      game.board[1][c],
      game.board[2][c],
      game.board[3][c],
    ];
    row = row.reverse();
    row = slide(row);
    row = row.reverse();
    for (let r = 0; r < game.rows; r++) {
      game.board[r][c] = row[r];
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = game.board[r][c];
      updateTile(tile, num);
    }
  }
}
