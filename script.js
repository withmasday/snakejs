function drawLeaderboard() {
  let leaderboard_elm_new = ''
  let leaderboard_elm_old = document.getElementById('leaderboard');
  let leaderboardGO_elm_old = document.getElementById('leaderboardGameOver')
  let leaderboard_data = JSON.parse(localStorage.getItem('data'));

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
    leaderboard_elm_old.innerHTML = leaderboard_elm_new;
    leaderboardGO_elm_old.innerHTML = leaderboard_elm_new;
  }
}

drawLeaderboard();

var buah = [];
var count_buah = "";
var base_ular = [
  [14, 15],
  [13, 15],
  [12, 15],
  [11, 15],
  [10, 15],
  [9, 15],
];

var ular = base_ular
var posisi_ular = [];
var tmp_posisi_ular = [];
var arah = "kanan";

var score = 6;

var col_x = 48;
var col_y = 30;

var time = 0;
var is_playing = false;

var sectionLanding = document.getElementById("landing");
var sectionFormUser = document.getElementById("formuser");
var sectionMain = document.getElementById("main");
var isempty = document.getElementById("isempty");
var data_username = "";

gambarPapan();
gambarUlar();
gambarBuah();
setScore();

function init() {
  is_playing = true;
  var loop = 0;
  while (loop < 100000) {
    if (is_playing == true) {
      gerakUlar(loop);
      loop++;
    }
  }
}

let is_user = localStorage.getItem('saved_username');
if (typeof is_user == 'object') {
  document.getElementById('landing').style.display = 'inline';
} else {
  if (is_user.length == 0) {
    document.getElementById('landing').style.display = 'inline';
  }
  
  if (is_user.length > 0) {
    data_username = localStorage.getItem('saved_username');
    document.getElementById('main').style.display = 'inline';
    init();
  }
}


function nextSlide(slide) {
  var username = document.getElementById("form_username").value;
  if (slide == "landing") {
    sectionLanding.style.display = "none";
    sectionFormUser.style.display = "inline";
    return true
  }
  
  if (slide == "back-landing") {
    sectionLanding.style.display = "inline";
    sectionFormUser.style.display = "none";
    return true
  }
  
  if (slide == "play") {

    if (!username) {
      return isempty.style.display = "block";
    }

    localStorage.setItem('saved_username', username);
    sectionFormUser.style.display = "none";
    sectionMain.style.display = "inline";
    init();
  }
}


setInterval(function () {
  if (is_playing == true) {
    var x = Math.round(Math.random() * col_x);
    var y = Math.round(Math.random() * col_y);
    buah.push([x, y]);
    try {
      document.getElementById(x + "," + y).classList.add("bg-food");
      if (buah.length >= 5) {
        normalkanKotak(buah[0]);
        buah.shift();
      }
    } catch (e) { }
  }
}, 3000);

setInterval(function () {
  if (is_playing == true) {
    normalkanKotak(buah[0]);
    buah.shift();
  }
}, 5000);

function timer(time) {
  var seconds = Math.floor((time / 1000) % 60);
  var minutes = Math.floor((time / (60 * 1000)) % 60);
  var hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  document.getElementById("time").innerText = `${hours < 10 ? 0 : ""}${hours}:${
    minutes < 10 ? 0 : ""
  }${minutes}:${seconds < 10 ? 0 : ""}${seconds}`;
}

setInterval(function () {
  if (is_playing == true) {
    time += 1000;
    timer(time);

    if (ular.length > 6) {
      // Manipulasi Data Posisi Ular Agar Maksimal Data Hanya 5
      if (posisi_ular.length >= 6) {
        let tmpUlar = posisi_ular.slice();
        tmpUlar.shift();
        posisi_ular = tmpUlar;
      }
      // Push Posisi Ular Setiap 1 Detik
      let newSnake = ular.slice();
      posisi_ular.push([newSnake]);
    }
  }
}, 1000);

function setScore() {
  score = ular.length;
  document.getElementById("score").innerHTML = score;
}

function clickRewind() {
  is_playing = false;
  document.getElementById('rewindTriggred').style.display = 'none';
  document.getElementById('rewindMenu').style.display = 'inline';
}

function rewind() {
  is_playing = false;
  var input_value = document.getElementById("rewind").value;
  ular = posisi_ular[input_value][0];
  gambarPapan();
  gambarUlar();
  setScore();
}

function clickCancle() {
  is_playing = false;
  ular = posisi_ular[5][0];
  gambarPapan();
  gambarUlar();
  gambarBuah();
  setScore();
  is_playing = true;
  document.getElementById('rewindTriggred').style.display = 'inline';
  document.getElementById('rewindMenu').style.display = 'none';
  document.getElementById("rewind").value = 5;
}

function clickPlay() {
  is_playing = true;
  document.getElementById('rewindTriggred').style.display = 'inline';
  document.getElementById('rewindMenu').style.display = 'none';
  document.getElementById("rewind").value = 5;
}

function playAgain() {
  location.reload();
}

function changeUser() {
  localStorage.setItem('saved_username', '');
  location.reload();
}

function check_makan() {
  try {
    if (ular[0][0] == buah[0][0] && ular[0][1] == buah[0][1]) {
      return true;
    }

    if (ular[0][0] == buah[1][0] && ular[0][1] == buah[1][1]) {
      return true;
    }

    if (ular[0][0] == buah[2][0] && ular[0][1] == buah[2][1]) {
      return true;
    }

    if (ular[0][0] == buah[3][0] && ular[0][1] == buah[3][1]) {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}
function makan() {
  try {
    if (check_makan()) {
      var audio = document.getElementById("audio").play();
      setScore(score);
    } else {
      normalkanKotak(ular[ular.length - 1]);
      ular.pop();
    }
  } catch (error) {}
}

document.onkeydown = function (e) {
  // W A S D
  switch (e.keyCode) {
    case 65:
      if (arah != "kanan") {
        arah = "kiri";
      }
      break;
    case 87:
      if (arah != "bawah") {
        arah = "atas";
      }
      break;
    case 68:
      if (arah != "kiri") {
        arah = "kanan";
      }
      break;
    case 83:
      if (arah != "atas") {
        arah = "bawah";
      }
      break;
  }
};

function getUnique(array){
    var uniqueArray = [];
    for(var value of array){
        if(uniqueArray.indexOf(value) === -1){
            uniqueArray.push(value);
        }
    }
    return uniqueArray;
}

function toLocalStorage() {
  let data_user = JSON.parse(localStorage.getItem("data"));
  let localdata = [];
  let localdata_value;
  if (data_user) {
    localdata = data_user;
  }

  localdata = getUnique(localdata);
  localdata_value = {
    name: localStorage.getItem('saved_username'),
    value: parseInt(ular.length),
  };
  localdata.push(localdata_value);
  localStorage.setItem("data", JSON.stringify(localdata));
}

function filterByHighScore() {
  var localdata = JSON.parse(localStorage.getItem("data"));
  var filtered = localdata.sort(function (a, b) {
    return b.value - a.value;
  }).filter((v, i, a) => a.findIndex((v2) => v2.name === v.name) === i);
  
  localStorage.setItem('data', JSON.stringify(filtered));
}

function mirrorPosition(params_x, params_y) {
  var tmp_ular = [];
  for (var i = 0; i < ular.length; i++) {
    tmp_ular.push([params_x, params_y]);
    normalkanKotak(ular[i]);
  }
  ular = tmp_ular
}

function lanjut() {
  // Bermain Di Dalam Board
  if (ular[0][0] >= 0 && ular[0][0] <= col_x && ular[0][1] >= 0 && ular[0][1] <= col_y) {

    // Ular Menabrak Tubuh Sendiri
    for (var i = 1; i < ular.length; i++) {
      if (ular[0][0] == ular[i][0] && ular[0][1] == ular[i][1]) {
        return false;
      }
    }
    return true;

  // Bermain Ke Luar Area Board
  } else {
    if (ular[0][1] == -1 && arah == "atas") {
      mirrorPosition(ular[0][0], col_y);
      return true
    } else if (ular[0][1] == col_y + 1 && arah == "bawah") {
      mirrorPosition(ular[0][0], -1);
      return true
    } else if (ular[0][0] == -1 && arah == "kiri") {
      mirrorPosition(col_x, ular[0][1]);
      return true
    } else if (ular[0][0] == col_x + 1 && arah == "kanan") {
      mirrorPosition(-1, ular[0][1]);
      return true
    } else {
      return false
    }
  }
}

function gerakUlar(i) {
  setTimeout(function () {
    if (is_playing == true) {
      if (lanjut()) {
        if (arah == "atas") {
          ular.unshift([ular[0][0], ular[0][1] - 1]);
          makan();
          gambarUlar();
        } else if (arah == "bawah") {
          ular.unshift([ular[0][0], ular[0][1] + 1]);
          makan();
          gambarUlar();
        } else if (arah == "kanan") {
          ular.unshift([ular[0][0] + 1, ular[0][1]]);
          makan();
          gambarUlar();
        } else if (arah == "kiri") {
          ular.unshift([ular[0][0] - 1, ular[0][1]]);
          makan();
          gambarUlar();
        } else {
          console.log("Unknown Key Press");
        }
      } else {
        if (is_playing == true) {
          toLocalStorage();
          filterByHighScore();
          arah = "kanan";
          i = 99999;
          is_playing = false;
          drawLeaderboard();
          document.getElementById("gameover").style.display = 'inline';
        }
      }
    }
  }, 150 * i);

  // Pengaturan kecepatan ular dalam millisecond (semakin kecil maka pergerakan akan semakin cepat)
}

function normalkanKotak(a) {
  try {
    document.getElementById(a[0] + "," + a[1]).classList.remove("bg-snake");
    document.getElementById(a[0] + "," + a[1]).classList.remove("bg-food");
  } catch (e) {}
}

function gambarUlar() {
  try {
    for (var i = 0; i < ular.length; i++) {
      document
        .getElementById(ular[i][0] + "," + ular[i][1])
        .classList.add("bg-snake");
    }
  } catch (e) {}
}

function gambarBuah() {
  var x = Math.round(Math.random() * col_x);
  var y = Math.round(Math.random() * col_y);
  buah = [[x, y]];

  while (ular.includes(buah)) {
    buah = [[x, y]];
  }
  document.getElementById(x + "," + y).classList.add("bg-food");
}

function gambarPapan() {
  var papan = "";
  for (var i = 0; i < col_y; i++) {
    papan += `<tr>`;
    for (var j = 0; j < col_x; j++) {
      papan +=
        `<td style="height:10px;width: 10px;" class="m-0 p-0" id="` +
        j +
        `,` +
        i +
        `"></td>`;
    }
    papan += `</tr>`;
  }
  document.getElementById("papan").innerHTML = papan;
}

