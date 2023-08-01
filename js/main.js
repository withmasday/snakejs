let sectionLanding = document.getElementById("landing");
let sectionFormUser = document.getElementById("formuser");
let sectionMain = document.getElementById("main");
let isempty = document.getElementById("isempty");

let createSnake = [
  [14, 15],
  [13, 15],
  [12, 15],
  [11, 15],
  [10, 15],
  [9, 15],
];

let config = new Snake({
  table: document.getElementById("papan"),
  boardXpixel: '960px',
  boardYpixel: '600px',
  food: [],
  base_snake: createSnake,
  snake: createSnake,
  posisi_snake: [],
  tmp_posisi_snake: [],
  arah: "kanan",
  score: createSnake.length,
  col_x: 48,
  col_y: 30,
  time: 0,
  is_playing: false,
  el_leaderboard: document.getElementById("leaderboard"),
  el_leaderboardGO: document.getElementById("leaderboardGameOver"),
  el_time: document.getElementById("time"),
  el_score: document.getElementById("score"),
  el_rewindTriggred: document.getElementById("rewindTriggred"),
  el_rewindMenu: document.getElementById("rewindMenu"),
  el_rewind: document.getElementById("rewind"),
  el_audioEat: document.getElementById("audio"),
  el_layerGO: document.getElementById("gameover"),
  colorSnake: 'green',
  colorFood: 'red',
  colorBoard: ['#a4b0be', '#2f3640'],
  deadHitBoard: false,
  showFoodAt: 3000,
  removeFoodAt: 5000,
  maxFoodOnBoard: 5,
  gameSpeed: 150,
  maxHistorySnakePerSeconds: 10,
  colorTrap: '#ffa502',
  trap: []
});

config.drawPapan();
config.drawSnake();
config.drawFood();
config.setScore();
config.drawTrap();

function init() {
  config.is_playing = true;
  var loop = 0;
  while (loop < 100000) {
    if (config.is_playing == true) {
      gerakSnake(loop);
      loop++;
    }
  }
}

function gerakSnake(i) {
  setTimeout(function () {
    if (config.is_playing == true) {
      if (config.lanjut()) {
        if (config.arah == "atas") {
          config.snake.unshift([config.snake[0][0], config.snake[0][1] - 1]);
          config.makan();
          config.drawSnake();
        } else if (config.arah == "bawah") {
          config.snake.unshift([config.snake[0][0], config.snake[0][1] + 1]);
          config.makan();
          config.drawSnake();
        } else if (config.arah == "kanan") {
          config.snake.unshift([config.snake[0][0] + 1, config.snake[0][1]]);
          config.makan();
          config.drawSnake();
        } else if (config.arah == "kiri") {
          config.snake.unshift([config.snake[0][0] - 1, config.snake[0][1]]);
          config.makan();
          config.drawSnake();
        } else {
          console.log("Unknown Key Press");
        }
      } else {
        if (config.is_playing == true) {
          config.toLocalStorage();
          config.filterByHighScore();
          config.arah = "kanan";
          i = 99999;
          config.is_playing = false;
          config.drawLeaderboard();
          config.el_layerGO.style.display = "inline";
        }
      }
    }
  }, config.gameSpeed * i);
}

let is_user = localStorage.getItem("saved_username");
if (typeof is_user == "object") {
  document.getElementById("landing").style.display = "inline";
} else {
  if (is_user.length == 0) {
    document.getElementById("landing").style.display = "inline";
  }

  if (is_user.length > 0) {
    data_username = localStorage.getItem("saved_username");
    document.getElementById("main").style.display = "inline";
    init();
  }
}

function nextSlide(slide) {
  var username = document.getElementById("form_username").value;
  if (slide == "landing") {
    config.drawLeaderboard();
    sectionLanding.style.display = "none";
    sectionFormUser.style.display = "inline";
    return true;
  }

  if (slide == "back-landing") {
    sectionLanding.style.display = "inline";
    sectionFormUser.style.display = "none";
    return true;
  }

  if (slide == "play") {
    if (!username) {
      return (isempty.style.display = "block");
    }

    localStorage.setItem("saved_username", username);
    sectionFormUser.style.display = "none";
    sectionMain.style.display = "inline";
    init();
  }
}

setInterval(function () {
  if (config.is_playing == true) {
    var x = Math.round(Math.random() * config.col_x);
    var y = Math.round(Math.random() * config.col_y);
    config.food.push([x, y]);

    try {
      document.getElementById(x + "," + y).classList.add("bg-food");
      if (config.food.length >= config.maxFoodOnBoard) {
        config.normalkanKotak(config.food[0]);
        config.food.shift();
      }
    } catch (e) {}
  }
}, config.showFoodAt);

setInterval(function () {
  if (config.is_playing == true) {
    config.normalkanKotak(config.food[0]);
    config.food.shift();
  }
}, config.removeFoodAt);

setInterval(function () {
  if (config.is_playing == true) {
    config.time += 1000;
    config.timer(config.time);

    if (config.snake.length > 6) {
      if (config.posisi_snake.length > config.maxHistorySnakePerSeconds) {
        let tmpSnake = config.posisi_snake.slice();
        tmpSnake.shift();
        config.posisi_snake = tmpSnake;
      }
      let newSnake = config.snake.slice();
      config.posisi_snake.push([newSnake]);
    }
  }
}, 1000);

document.onkeydown = function (e) {
  switch (e.key) {
    case 'a':
      if (config.arah != "kanan") {
        config.arah = "kiri";
      }
      break;

    case 'w':
      if (config.arah != "bawah") {
        config.arah = "atas";
      }
      break;

    case 'd':
      if (config.arah != "kiri") {
        config.arah = "kanan";
      }
      break;
    case 's':
      if (config.arah != "atas") {
        config.arah = "bawah";
      }
      break;
  }
};
