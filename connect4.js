/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

var WIDTH = 7;
var HEIGHT = 6;

var currPlayer = 1; // active player: 1 or 2
var board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
// console.log(board)
function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array

  for(let i = 0; i < HEIGHT; i++){
    board.push(Array.from({length:WIDTH}))
  }

  // for(let i = 0; i < HEIGHT; i++){
  //   let arr = []
  //   for(let j = 0; j < WIDTH; j++){
  //     arr.push(undefined)
  //   }
  //   board.push(arr)
  // }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector('#board')

  // TODO: add comment for this code
  //create the top row of the game where the player will see in witch colom 
  //the chip wil foll
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  //populate the top row and give every cell an id 
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  //append the top rpw to the board
  htmlBoard.append(top);

  // TODO: add comment for this code
  //create the board a roll * heyght and a cell * width give every cell an unique id
  // and append to the board

  board.forEach((val, y) => {
    const row = document.createElement("tr");
    val.forEach((el, x) =>{
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    })
    htmlBoard.append(row)
  })

  // for (var y = 0; y < HEIGHT; y++) {
  //   const row = document.createElement("tr");
  //   for (var x = 0; x < WIDTH; x++) {
  //     const cell = document.createElement("td");
  //     cell.setAttribute("id", `${y}-${x}`);
  //     row.append(cell);
  //   }
  //   htmlBoard.append(row);
  // }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  for(let i = HEIGHT - 1; i >= 0; i--){
    if(!board[i][x]){
      return i
    }
  }
  return null
  // console.log(board[5][6])
  // console.log(x)
  
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  // console.log(x + ' ' + y)
  const div = document.createElement('div');
  div.classList.add('piece');
  div.classList.add(`player${currPlayer}`);
  


  let cell = document.getElementById(`${y}-${x}`)
  // console.log(cell)
  cell.append(div)
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  const bod = document.querySelector('body')
  bod.innerHTML = ''
  let header = document.createElement('h1')
  header.innerText = msg.toUpperCase()
  bod.append(header)
  // alert(msg)
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;
  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  let full = board.every((val) => val.every((cell) => cell))
  if(full){
    return endGame('Tie')
  }
  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  //why do we need 2 functions to return true
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    // this function wil return true if 4 cells of any template are >= to 0
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.
  // this loop creates a second board for comparing
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      //horizont gives an template of horizontal win going from cur location down
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      //vert gives and template for win going from cur location to left
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      // diagDR gives template for win from cur location going left and down
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      // diagDL gives template for win from cur location going left and up
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
      //reverse vertical gives a template of vertical win going fromright to left
      let vertReverce = [[y, x], [y - 1, x], [y - 2, x], [y - 3, x]];

      //compares the template scenarios of a win to the main board where the game is hapening
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL) || _win(vertReverce)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();


