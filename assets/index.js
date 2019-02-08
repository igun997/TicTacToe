$(document).ready(function() {
  var enemyTurn = false;
  var boardblock = [];
  var resetBlock = [];
  var resetBoard = "";
  var countstep = 0;
  var symbollist = ["X", "O"];
  var symbolpick = 0;
  var removeClass = function(id = '', show = '') {
    $(id).hide('slow');
    $(show).show('slow');
  }

  function _generateBlock(row = '', col = '') {
    console.log("Generated Block Row : " + row);
    console.log("Generated Block Col : " + col);
    var total = (row * col);
    console.log("Total Block " + total);
    tab = [];
    cell = 1;
    for (var i = 0; i < row; i++) {
      var td = [];
      cols = [];
      for (var x = 0; x < col; x++) {
        td[x] = "<td><button class='cell' id='cell" + cell++ + "' data-col='" + x + "' data-row='" + i + "'></button></td>";
        cols[x] = null;
      }
      boardblock[i] = cols;
      tab[i] = "<tr>" + td.join("") + "</tr>";
    }
    resetBlock = boardblock;
    resetBoard = tab.join("");
    $("#boardgame").html(resetBoard);
  }
  start();

  function start() {
    console.log("Start Function Running . .");
    intro();
    blockpick();
    maingame();
  }
  $("#restart").on('click', function(event) {
    event.preventDefault();
    for (var i = 0; i < boardblock.length; i++) {
      newboard = [];
      for (var x = 0; x < boardblock[i].length; x++) {
        newboard[x] = null;
      }
      boardblock[i] = newboard;
    }
    console.log(boardblock);
    $("#boardgame").html(resetBoard);
    toastr.info("Restart Game Success")
  });
  function intro() {
    console.log("Intro Screen Running . .");
    animationPack("#intro-screen");

    $("#choose-x").on('click', function(event) {
      event.preventDefault();
      console.log("Player Pick X");
      symbolpick = 0;
      removeClass("#intro-screen", '#box-screen');
    });
    $("#choose-o").on('click', function(event) {
      event.preventDefault();
      console.log("Player Pick O");
      symbolpick = 1;
      removeClass("#intro-screen", '#box-screen');
    });
  }

  function blockpick() {
    console.log("Block Pick Function Running . .");
    $("#boardselection").on('click', function(event) {
      event.preventDefault();
      row = $("#row").val();
      col = $("#col").val();
      if ((isNaN(parseInt(row)) || isNaN(parseInt(col))) || (parseInt(row) * parseInt(col)) < 6) {
        console.log("Wrong Condition Detected");
        toastr.error("Please Fill Num Only & Row x Col  More or Equal than 3");
      } else {
        console.log("Board Block Locked " + col + " X " + row);
        toastr.info("Board Block Locked " + col + " X " + row);
        _generateBlock(col, row);
        removeClass('#box-screen', '#game-screen');
      }
    });
  }

  function maingame() {
    console.log("Main Game Running . . ");
    obj = $("#boardgame");
    obj.on('click', '.cell', function(event) {
      event.preventDefault();
      col = parseInt($(this).data("col"));
      row = parseInt($(this).data("row"));
      console.log("Row " + row + " Col " + col + "  Clicked");
      $(this).attr("style", "color:red");
      $(this).attr("disabled", true);
      $(this).html(symbollist[symbolpick]);
      boardblock[row][col] = symbolpick;
      comp_behavior();
      var c = 0;
      for (var i = 0; i < boardblock.length; i++) {
        for (var x = 0; x < boardblock[i].length; x++) {
            if (boardblock[i][x] != null) {
              c++;
            }
        }
      }
      if (c == 9) {
        toastr.info("Game Complete");
        r = checkWinner(boardblock);
        console.log(r);
        toastr.info("Score O "+r.o);
        toastr.info("Score X "+r.x);
        if (r.o > r.x) {
          if (symbolpick == 0) {
            toastr.success("You Win");
          }else {
            toastr.success("CPU Win");
          }
        }else if(r.o == r.x){
          toastr.info("Draw")
        }else {
          if (symbolpick == 1) {
            toastr.success("You Win");
          }else {
            toastr.success("CPU Win");
          }
        }
      }
    });
  }

  function comp_behavior() {
    loopcast = 1;
    console.log("Clicked");
    for (var i = 0; i < boardblock.length; i++) {
      isdone = false;
      console.log("I = " + i);
      for (var x = 0; x < boardblock[i].length; x++) {
        if (boardblock[i][x] != 0 && boardblock[i][x] != 1) {
          console.log("N " + boardblock[i][x]);
          console.log("X = " + x);
          console.log("Trigger ID #cell" + loopcast);
          console.log("Match array [" + i + "] [" + x + "]");
          if (symbolpick == 1) {
            my = 0;
          } else {
            my = 1;
          }
          $("#game-screen #boardgame").find("#cell" + loopcast).html(symbollist[my]);
          $("#game-screen #boardgame").find("#cell" + loopcast).attr("style", "color:blue");
          $("#game-screen #boardgame").find("#cell" + loopcast).attr("disabled", true);
          row = parseInt($("#game-screen #boardgame").find("#cell" + loopcast).data("row"));
          col = parseInt($("#game-screen #boardgame").find("#cell" + loopcast).data("col"));
          boardblock[row][col] = my;
          isdone = true;
          break;
        }
        loopcast++;
      }
      if (isdone) {
        break;
      }
    }
    return 0;
  }

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  function checkWinner(block = []) {
    // Horizontal
    var oh = 0;
    var xh = 0;
    for (var i = 0; i < block.length; i++) {
      toh = 0;
      txh = 0;
      for (var x = 0; x < block[i].length; x++) {
        if (block[i][x] == 0) {
          toh++;
        }
      }
      for (var x = 0; x < block[i].length; x++) {
        if (block[i][x] == 1) {
          txh++;
        }
      }
      if (toh == 3) {
        oh = oh + 1;
      }
      if (txh == 3) {
        xh = xh + 1;
      }
    }
    // Vertical
    console.log("Transpose Matrix");
    inv = math.transpose(block);
    for (var i = 0; i < inv.length; i++) {
      toh = 0;
      txh = 0;
      for (var x = 0; x < inv[i].length; x++) {
        if (inv[i][x] == 0) {
          toh++;
        }
      }
      for (var x = 0; x < inv[i].length; x++) {
        if (inv[i][x] == 1) {
          txh++;
        }
      }
      if (toh == 3) {
        oh = oh + 1;
      }
      if (txh == 3) {
        xh = xh + 1;
      }
    }
    // Diagonal LR
    toh = 0;
    txh = 0;
    lr = [];
    lri = 0;
    for (var i = 0; i < block.length; i++) {
      for (var j = 0; j < block.length; j++) {
        if (i >= j && block[i][j] !== null) {
          lr[lri++] = block[i][j];
        }
      }
    }
    buildLr = [lr[0], lr[2], lr[5]];
    for (var i = 0; i < buildLr.length; i++) {
      if (buildLr[i] == 0) {
        toh = toh + 1;
      } else if (buildLr[i] == 1) {
        txh = txh + 1;
      }
    }
    if (toh == 3) {
      oh = oh + 1;
    }
    if (txh == 3) {
      xh = xh + 1;
    }
    // D Rl
    toh = 0;
    txh = 0;
    rl = [];
    rli = 0;
    var flip = function(m) {
      newarr = [];
      for (var i = 0; i < m.length; i++) {
        newarr[i] = [m[i][2], m[i][1], m[i][0]];
      }
      return newarr;
    };
    flipblock = flip(block);
    console.log(flipblock);
    for (var i = 0; i < flipblock.length; i++) {
      for (var j = 0; j < flipblock.length; j++) {
        if (i >= j && flipblock[i][j] !== null) {
          console.log(flipblock[i][j]);
          rl[rli++] = flipblock[i][j];
        }
      }
    }
    // console.log(rl);
    buildrl = [rl[0], rl[2], rl[5]];
    console.log(buildrl);
    for (var i = 0; i < buildrl.length; i++) {
      if (buildrl[i] == 0) {
        toh = toh + 1;
      } else if (buildrl[i] == 1) {
        txh = txh + 1;
      }
    }
    if (toh == 3) {
      oh = oh + 1;
    }
    if (txh == 3) {
      xh = xh + 1;
    }
    return {
      "o": oh,
      "x": xh
    };
  }

  function animationPack(id, position = 470) {
    console.log("=========================");
    console.log("ANIMEJS");
    console.log("=========================");
    console.log("Animation Running on " + id);
    console.log("With Position " + position);
    console.log("=========================");
    anime({
      targets: id,
      translateX: position,
      delay: anime.stagger(300, {
        easing: 'easeOutQuad'
      })
    });
  }
});
