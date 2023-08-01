class Snake {
  constructor(params) {
    this.table = params.table;
    this.boardXpixel = params.boardXpixel;
    this.boardYpixel = params.boardYpixel;
    this.food = params.food;
    this.base_snake = params.base_snake;
    this.snake = params.snake;
    this.posisi_snake = params.posisi_snake;
    this.tmp_posisi_snake = params.tmp_posisi_snake;
    this.arah = params.arah;
    this.score = params.score;
    this.col_x = params.col_x;
    this.col_y = params.col_y;
    this.time = params.time;
    this.is_playing = params.is_playing;
    this.el_leaderboard = params.el_leaderboard;
    this.el_leaderboardGO = params.el_leaderboardGO;
    this.el_time = params.el_time;
    this.el_score = params.el_score;
    this.el_rewindTriggred = params.el_rewindTriggred;
    this.el_rewindMenu = params.el_rewindMenu;
    this.el_rewind = params.el_rewind;
    this.el_audioEat = params.el_audioEat;
    this.el_layerGO = params.el_layerGO;
    this.colorSnake = params.colorSnake;
    this.colorFood = params.colorFood;
    this.colorBoard = params.colorBoard;
    this.deadHitBoard = params.deadHitBoard;
    this.showFoodAt = params.showFoodAt;
    this.removeFoodAt = params.removeFoodAt;
    this.gameSpeed = params.gameSpeed;
    this.maxFoodOnBoard = params.maxFoodOnBoard;
    this.maxHistorySnakePerSeconds = params.maxHistorySnakePerSeconds;
    this.trap = params.trap;
    this.colorTrap = params.colorTrap;
  }

  drawLeaderboard() {
    let leaderboard_elm_new = "";
    let leaderboard_data = JSON.parse(localStorage.getItem("data"));

    if (leaderboard_data) {
      for (var i = 0; i < leaderboard_data.length; i++) {
        if (i < 5) {
          leaderboard_elm_new += `
                      <li>
                          <div class="name">${leaderboard_data[i].name}</div>
                          <div class="score">Best Score : ${leaderboard_data[i].value} Points</div>
                      </li>`;
        }
      }
      this.el_leaderboard.innerHTML = leaderboard_elm_new;
      this.el_leaderboardGO.innerHTML = leaderboard_elm_new;
    }
  }

  timer(time) {
    var seconds = Math.floor((time / 1000) % 60);
    var minutes = Math.floor((time / (60 * 1000)) % 60);
    var hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.el_time.innerText = `${hours < 10 ? 0 : ""}${hours}:${
      minutes < 10 ? 0 : ""
    }${minutes}:${seconds < 10 ? 0 : ""}${seconds}`;
  }

  setScore() {
    this.score = this.snake.length;
    this.el_score.innerHTML = this.score;
  }

  clickRewind() {
    this.is_playing = false;
    this.el_rewindTriggred.style.display = "none";
    this.el_rewindMenu.style.display = "inline";
    this.el_rewind.max = this.maxHistorySnakePerSeconds;
    this.el_rewind.value = this.maxHistorySnakePerSeconds;
  }

  rewind() {
    this.is_playing = false;
    var input_value = this.el_rewind.value;
    this.snake = this.posisi_snake[input_value][0];
    this.drawPapan();
    this.drawSnake();
    this.setScore();
  }

  clickCancle() {
    this.is_playing = false;
    this.snake = this.posisi_snake[this.maxHistorySnakePerSeconds][0];

    this.drawPapan();
    this.drawSnake();
    this.drawFood();
    this.setScore();
    this.is_playing = true;

    this.el_rewindTriggred.style.display = "inline";
    this.el_rewindMenu.style.display = "none";
    this.el_rewind.max = this.maxHistorySnakePerSeconds;
    this.el_rewind.value = this.maxHistorySnakePerSeconds;
  }

  clickPlay() {
    this.is_playing = true;
    this.el_rewindTriggred.style.display = "inline";
    this.el_rewindMenu.style.display = "none";
    this.el_rewind.max = this.maxHistorySnakePerSeconds;
    this.el_rewind.value = this.maxHistorySnakePerSeconds;
  }

  playAgain() {
    location.reload();
  }

  changeUser() {
    localStorage.setItem("saved_username", "");
    location.reload();
  }

  check_makan() {
    try {
      if (
        this.snake[0][0] == this.food[0][0] &&
        this.snake[0][1] == this.food[0][1]
      ) {
        return true;
      }

      if (
        this.snake[0][0] == this.food[1][0] &&
        this.snake[0][1] == this.food[1][1]
      ) {
        return true;
      }

      if (
        this.snake[0][0] == this.food[2][0] &&
        this.snake[0][1] == this.food[2][1]
      ) {
        return true;
      }

      if (
        this.snake[0][0] == this.food[3][0] &&
        this.snake[0][1] == this.food[3][1]
      ) {
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  makan() {
    try {
      if (this.check_makan()) {
        this.el_audioEat.play();
        this.setScore();
      } else {
        this.normalkanKotak(this.snake[this.snake.length - 1]);
        this.snake.pop();
      }
    } catch (error) {}
  }

  getUnique(array) {
    var uniqueArray = [];
    for (var value of array) {
      if (uniqueArray.indexOf(value) === -1) {
        uniqueArray.push(value);
      }
    }
    return uniqueArray;
  }

  toLocalStorage() {
    let data_user = JSON.parse(localStorage.getItem("data"));
    let localdata = [];
    let localdata_value;

    if (data_user) {
      localdata = data_user;
    }

    localdata = this.getUnique(localdata);

    localdata_value = {
      name: localStorage.getItem("saved_username"),
      value: parseInt(this.snake.length),
    };

    localdata.push(localdata_value);
    localStorage.setItem("data", JSON.stringify(localdata));
  }

  filterByHighScore() {
    var localdata = JSON.parse(localStorage.getItem("data"));
    var filtered = localdata
      .sort(function (a, b) {
        return b.value - a.value;
      })
      .filter((v, i, a) => a.findIndex((v2) => v2.name === v.name) === i);

    localStorage.setItem("data", JSON.stringify(filtered));
  }

  mirrorPosition(params_x, params_y) {
    var tmp_snake = [];
    for (var i = 0; i < this.snake.length; i++) {
      tmp_snake.push([params_x, params_y]);
      this.normalkanKotak(this.snake[i]);
    }
    this.snake = tmp_snake;
  }

  lanjut() {
    if (this.snake[0][0] >= 0 && this.snake[0][0] <= this.col_x && this.snake[0][1] >= 0 && this.snake[0][1] <= this.col_y) {
      for (var i = 1; i < this.snake.length; i++) {
        if (this.snake[0][0] == this.snake[i][0] && this.snake[0][1] == this.snake[i][1]) {
          return false;
        }

        if (this.trap[0][0] == this.snake[i][0] && this.trap[0][1] == this.snake[i][1]) {
          return false;
        }
      }
      return true;
    } else {
      if (this.deadHitBoard == true) {
        return false;
      }

      if (this.snake[0][1] == -1 && this.arah == "atas") {
        this.mirrorPosition(this.snake[0][0], this.col_y);
        return true;
      } else if (this.snake[0][1] == this.col_y + 1 && this.arah == "bawah") {
        this.mirrorPosition(this.snake[0][0], -1);
        return true;
      } else if (this.snake[0][0] == -1 && this.arah == "kiri") {
        this.mirrorPosition(this.col_x, this.snake[0][1]);
        return true;
      } else if (this.snake[0][0] == this.col_x + 1 && this.arah == "kanan") {
        this.mirrorPosition(-1, this.snake[0][1]);
        return true;
      } else {
        return false;
      }
    }
  }

  normalkanKotak(a) {
    try {
      document.getElementById(a[0] + "," + a[1]).classList.remove("bg-snake");
      document.getElementById(a[0] + "," + a[1]).classList.remove("bg-food");
    } catch (e) {}
  }

  drawSnake() {
    try {
      for (var i = 0; i < this.snake.length; i++) {
        document
          .getElementById(this.snake[i][0] + "," + this.snake[i][1])
          .classList.add("bg-snake");
      }
    } catch (e) {}
  }

  drawFood() {
    var x = Math.round(Math.random() * this.col_x);
    var y = Math.round(Math.random() * this.col_y);
    this.food = [[x, y]];

    while (this.snake.includes(this.food)) {
      this.food = [[x, y]];
    }
    document.getElementById(x + "," + y).classList.add("bg-food");
  }

  drawTrap() {
    var x = Math.round(Math.random() * this.col_x);
    var y = Math.round(Math.random() * this.col_y);
    this.trap = [[x, y]];
    document.getElementById(x + "," + y).classList.add("bg-trap");
  }

  drawPapan() {
    document.documentElement.style.setProperty("--board-x", this.boardXpixel);
    document.documentElement.style.setProperty("--board-y", this.boardYpixel);
    document.documentElement.style.setProperty("--snake", this.colorSnake);
    document.documentElement.style.setProperty("--food", this.colorFood);
    document.documentElement.style.setProperty("--trap", this.colorTrap);
    document.documentElement.style.setProperty("--board-0", this.colorBoard[0]);
    document.documentElement.style.setProperty("--board-1", this.colorBoard[1]);
    var papan = "";
    for (var i = 0; i < this.col_y; i++) {
      papan += `<tr>`;
      for (var j = 0; j < this.col_x; j++) {
        papan +=
          `<td style="height:10px;width: 10px;" class="m-0 p-0" id="` +
          j +
          `,` +
          i +
          `"></td>`;
      }
      papan += `</tr>`;
    }
    this.table.innerHTML = papan;
  }
}
