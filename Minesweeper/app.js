const game = {
  bodyEl: document.getElementById("app"),
  startEl: document.getElementById("btn-start"),
  tableEl: document.getElementById("map"),
  mines: [true, false, false, false, false],
  size: 20,
  totalMines: 0,
  flagged: 0,
  directions: [
    { row: -1, col: -1 },
    { row: -1, col: 0 },
    { row: -1, col: 1 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
    { row: 1, col: -1 },
    { row: 1, col: 0 },
    { row: 1, col: 1 },
  ],
  red: "#ff0000",
  green: "#00ff00",
  yellow: "#ffff00",
};

function createGame(num) {
  for (let i = 1; i <= num; i++) {
    const rowEl = document.createElement("tr");
    rowEl.setAttribute("class", "row");
    rowEl.setAttribute("id", i.toString());
    game.tableEl.append(rowEl);

    for (let j = 1; j <= num; j++) {
      const cellEl = document.createElement("td");
      rowEl.append(cellEl);

      const btnEl = document.createElement("button");
      btnEl.setAttribute("id", i.toString() + "-" + j.toString());
      btnEl.setAttribute("class", "grid");
      btnEl.classList.add("unClick");

      const isMine = game.mines[Math.floor(Math.random() * 5)];

      if (isMine) {
        btnEl.classList.add("mine");
        game.totalMines++;
      } else {
        btnEl.classList.add("empty");
      }

      cellEl.append(btnEl);
    }
  }

  const buttons = document.querySelectorAll(".grid");

  buttons.forEach(function (button) {
    button.addEventListener("click", digHandler);
    button.addEventListener("contextmenu", flagHandler);
  });
}

function countSurroundingButtons(row, col) {
  let count = 0;

  for (const direction of game.directions) {
    const newRow = row + direction.row;
    const newCol = col + direction.col;
    // Check if the neighboring button exists
    const neighborBtn = document.getElementById(`${newRow}-${newCol}`);
    if (neighborBtn) {
      if (neighborBtn.className.split(" ")[2] === "mine") {
        count++;
      }
    }
  }

  return count;
}
// let emptyLst = [];
// function revealEmpty(row, col) {
//   // 遍历周围8个单元格
//   for (const direction of game.directions) {
//     const newRow = row + direction.row;
//     const newCol = col + direction.col;

//     // 获取相邻单元格id
//     const neighborBtn = document.getElementById(`${newRow}-${newCol}`);
//     // 如果单元格存在且不为地雷，加入empty数组
//     if (
//       neighborBtn && // 存在
//       // !neighborBtn.classList.contains("mine") && // 不为雷
//       !neighborBtn.classList.contains("clicked") // 未揭示
//     ) {
//       const isZero = countSurroundingButtons(newRow, newCol) === 0; //是否count为0
//       if (isZero) {
//         emptyLst.push(`${newRow}-${newCol}`); // 加入数组
//         neighborBtn.classList.replace("unClick", "clicked"); // 添加clicked标签
//       } else {
//         neighborBtn.textContent = countSurroundingButtons(newRow, newCol); //显示count
//       }
//       neighborBtn.style.backgroundColor = "#00ff00";

//       neighborBtn.classList.replace("unClick", "clicked");
//     }
//   }

//   // 循环递归
//   for (let i = 0; i < emptyLst.length; i++) {
//     const [row, col] = emptyLst[i];
//     const btn = document.getElementById(emptyLst[i]);
//     if (btn.classList.contains("unClick")) {
//       revealEmpty(row, col);
//     }
//   }
// }

function digHandler(event) {
  const btn = event.target;
  const btnId = btn.id.split("-");
  const btnRow = parseInt(btnId[0]);
  const btnCol = parseInt(btnId[1]);
  const btnList = btn.className.split(" ");

  // 如果点击的是unClick单元格
  if (btn.classList.contains("unClick")) {
    btn.classList.replace("unClick", "clicked"); // 更新为clicked
    // 如果该单元格不是雷，计算count。若为雷，揭示所有雷，游戏结束。
    if (btn.classList.contains("empty")) {
      const count = countSurroundingButtons(btnRow, btnCol);
      // 如果count不为0，显示count，反之揭示
      if (count != 0) {
        btn.textContent = count;
      } else {
        revealEmpty(btnRow, btnCol);
      }
      btn.style.backgroundColor = game.green;
    } else {
      revealMines();
      btn.style.backgroundColor = game.red;
      setTimeout(() => {
        window.alert("BOOM!");
      }, 1000);
    }
  }
  //   console.log(btn.id + ": " + btnList);
}

function revealEmpty(row, col) {
  // 重置数组
  let emptyLst = [];

  function revealAdjacentEmptyButtons(row, col) {
    for (const direction of game.directions) {
      const newRow = row + direction.row;
      const newCol = col + direction.col;

      const neighborBtn = document.getElementById(`${newRow}-${newCol}`);

      if (
        neighborBtn &&
        !neighborBtn.classList.contains("mine") &&
        !neighborBtn.classList.contains("clicked")
      ) {
        const isZero = countSurroundingButtons(newRow, newCol) === 0;
        if (isZero) {
          neighborBtn.classList.replace("unClick", "clicked");
          neighborBtn.style.backgroundColor = game.green;
          emptyLst.push({ row: newRow, col: newCol });
          revealAdjacentEmptyButtons(newRow, newCol);
        } else {
          neighborBtn.textContent = countSurroundingButtons(newRow, newCol);
          neighborBtn.classList.replace("unClick", "clicked");
          neighborBtn.style.backgroundColor = game.green;
        }
      }
    }
  }

  const currentBtn = document.getElementById(`${row}-${col}`);
  currentBtn.classList.replace("unClick", "clicked");
  currentBtn.style.backgroundColor = game.green;

  revealAdjacentEmptyButtons(row, col);

  for (const emptyCell of emptyLst) {
    const { row, col } = emptyCell;
    const emptyBtn = document.getElementById(`${row}-${col}`);
    emptyBtn.style.backgroundColor = game.green;
  }
}

function flagHandler(event) {
  event.preventDefault();

  const btn = event.target;

  // 标记，若已经被标记，则恢复
  if (!btn.innerHTML) {
    btn.style.backgroundColor = game.yellow;
    btn.textContent = "🚩";
    if (btn.classList.contains("mine")) {
      game.flagged++;
      btn.classList.replace("unClick", "clicked");
    }
    setTimeout(checkWin, 0);
  } else {
    btn.innerHTML = "";
    btn.style.background = "";
    if (btn.classList.contains("mine")) {
      game.flagged--;
      btn.classList.replace("clicked", "unClick");
    }
  }
}

function revealMines() {
  const mineButtons = document.querySelectorAll(".mine");
  mineButtons.forEach((btn) => {
    if (!btn.classList.contains("clicked")) {
      btn.style.backgroundColor = game.red;
    }
    btn.textContent = "💣";
  });
}

function setup() {
  game.bodyEl.style.background = "#770000";
  //game.size = window.prompt("Please Enter the Game Level: ");
  createGame(game.size);
}

function reset() {
  game.tableEl.innerHTML = "";
}

function checkWin() {
  if (game.totalMines === game.flagged) {
    window.alert("Win!");
  }
}

window.addEventListener("load", setup);
game.startEl.addEventListener("click", function () {
  reset();
  setup();
});
