const game = {
  rows: 4,
  columns: 4,
  score: 4,
  matrix: [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
};

function calc() {
  let sum = 0;
  for (let row = 0; row < game.rows; row++) {
    for (let col = 0; col < game.columns; col++) {
      const tileId = `${row}-${col}`;
      const tileEl = document.getElementById(tileId);
      if (parseInt(tileEl.textContent)) {
        sum += parseInt(tileEl.textContent);
      } else {
        continue;
      }
    }
  }
  return sum;
}

function display() {
  for (let row = 0; row < game.rows; row++) {
    for (let col = 0; col < game.columns; col++) {
      const tileId = `${row}-${col}`;
      const tileEl = document.getElementById(tileId);
      tileEl.classList = "";
      tileEl.classList.add("col");
      if (game.matrix[row][col] == 0) {
        tileEl.textContent = null;
      } else {
        tileEl.textContent = game.matrix[row][col];

        tileEl.classList.add("x" + game.matrix[row][col].toString());
      }
    }
  }
  document.getElementById("score").textContent = calc();
}
function setTwo() {
  const row = Math.floor(Math.random() * game.rows);
  const col = Math.floor(Math.random() * game.columns);

  if (game.matrix[row][col] == 0) {
    game.matrix[row][col] = 2;
    display();
  } else {
    setTwo();
  }
}

function init() {
  for (let row = 0; row < game.rows; row++) {
    for (let col = 0; col < game.columns; col++) {
      game.matrix[row][col] = 0;
    }
  }

  setTwo();
  setTwo();
}

window.addEventListener("load", function () {
  init();
});

function removeZero(arr) {
  return arr.filter((num) => num != 0);
}

function move(arr) {
  arr = removeZero(arr);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] == arr[i + 1]) {
      arr[i] *= 2;
      arr[i + 1] = 0;
    }
  }
  arr = removeZero(arr);

  while (arr.length < game.columns) {
    arr.push(0);
  }
  return arr;
}

function arraysEqual(arr1, arr2) {
  let isValid = false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] != arr2[i]) {
      isValid = true;
    }
  }
  return isValid;
}

function left() {
  const ref = JSON.parse(JSON.stringify(game.matrix));
  let isValid = false;
  for (let row = 0; row < game.rows; row++) {
    const arr = game.matrix[row];
    game.matrix[row] = move(arr);
    if (arraysEqual(game.matrix[row], ref[row])) {
      isValid = true;
    }
  }
  if (isValid) {
    setTwo();
  }
}
function right() {
  const ref = JSON.parse(JSON.stringify(game.matrix));
  let isValid = false;
  for (let row = 0; row < game.rows; row++) {
    const arr = game.matrix[row].reverse();
    game.matrix[row] = move(arr).reverse();
    if (arraysEqual(game.matrix[row], ref[row])) {
      isValid = true;
    }
  }
  if (isValid) {
    setTwo();
  }
}

function up() {
  const ref = JSON.parse(JSON.stringify(game.matrix));
  let isValid = false;
  for (let col = 0; col < game.columns; col++) {
    let arr = [
      game.matrix[0][col],
      game.matrix[1][col],
      game.matrix[2][col],
      game.matrix[3][col],
    ];

    arr = move(arr);
    for (let i = 0; i < arr.length; i++) {
      game.matrix[i][col] = arr[i];
    }
    for (let row = 0; row < game.rows; row++) {
      if (arraysEqual(game.matrix[row], ref[row])) {
        isValid = true;
      }
    }
  }
  if (isValid) {
    setTwo();
  }
}

function down() {
  const ref = JSON.parse(JSON.stringify(game.matrix));
  let isValid = false;
  for (let col = 0; col < game.columns; col++) {
    let arr = [
      game.matrix[0][col],
      game.matrix[1][col],
      game.matrix[2][col],
      game.matrix[3][col],
    ];
    arr = arr.reverse();

    arr = move(arr).reverse();
    for (let i = 0; i < arr.length; i++) {
      game.matrix[i][col] = arr[i];
    }
  }
  for (let row = 0; row < game.rows; row++) {
    if (arraysEqual(game.matrix[row], ref[row])) {
      isValid = true;
    }
  }
  if (isValid) {
    setTwo();
  }
}
window.addEventListener("keyup", function (event) {
  if (event.code == "ArrowLeft") {
    left();
    display();
  } else if (event.code == "ArrowRight") {
    right();
    display();
  } else if (event.code == "ArrowUp") {
    up();
    display();
  } else if (event.code == "ArrowDown") {
    down();
    display();
  }
});

const btnEl = document.getElementById("btn-reset");
btnEl.addEventListener("click", function () {
  init();
});
