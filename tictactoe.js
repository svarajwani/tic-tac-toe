function Gameboard (){
    const rows = 3;
    const columns = 3;
    let board = [];
    let playStopped = false;

    //create 2d array for tictactoe board
    const resetBoard = () => {
        board = [];
        for(let i = 0; i < rows; i++){
            board[i] = [];
            for (let j = 0; j < columns; j++){
                board[i][j] = Cell();
            }
        }
        console.log(board);
    }


    //retrieve board for UI 
    const getBoard = () => board;
    
    const checkMoveValidity = (row, column) => {
        if(board[row][column].getCellValue() === 0){
            return true;
        }
        return false;
    }

    const checkForWin = () => {
        const boardWithVals = board.map((row) => row.map((cell) => cell.getCellValue()));
        for (let i = 0; i < 3; i++){
            currentRow = boardWithVals[i];
            if (currentRow[0] !== 0 && 
                currentRow[0] === currentRow[1] && 
                currentRow[1] === currentRow[2]){
                playStopped = true;
                return true;
            }
        }

        for (let i = 0; i < 3; i++){
            if (boardWithVals[0][i] !== 0 && 
                boardWithVals[0][i] === boardWithVals[1][i] && 
                boardWithVals[1][i] === boardWithVals [2][i]){
                playStopped = true;
                return true;
            }
        }

        if(boardWithVals[0][0] !== 0 && 
            boardWithVals[0][0] === boardWithVals[1][1] && 
            boardWithVals[1][1] === boardWithVals[2][2]){
            playStopped = true;
            return true;
        }

        if(boardWithVals[0][2] !== 0 &&
            boardWithVals[0][2] === boardWithVals[1][1] && 
            boardWithVals[1][1] === boardWithVals[2][0]){
            playStopped = true;
            return true;
        }
        return false;
    }

    const checkForTie = () => {
        const boardWithVals = board.map((row) => row.map((cell) => cell.getCellValue()));

        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                if (boardWithVals[i][j] === 0){
                    
                    return false;
                }
            }
        }
        playStopped = true;
        return true;
    }

    //add player token to the corresponding cell
    const playerMove = (row, column, player) => {
        if(checkForWin()){
            return;
        }
        if(checkForTie()){
            return;
        }
        console.log(board[row][column]);
        board[row][column].addToken(player.token);
    }

    //print out board for console
    const printBoard = () => {
        const boardWithCellVals = board.map((row) => row.map((cell) => cell.getCellValue()));
        console.log(boardWithCellVals);
    }

    resetBoard();

    return{playerMove, printBoard, getBoard, checkMoveValidity, resetBoard, checkForWin, checkForTie, playStopped};
}


//2d array will be populated with cells that will either be assigned '1' or '2'
function Cell(){
    let cellValue = 0;

    const addToken = (token) => {
        cellValue = token;
    }

    const getCellValue = () => {
        return cellValue;
    }

    return { 
        addToken, 
        getCellValue,
    };
}

function GameController(playerOne, playerTwo){
    let gameboard = Gameboard();

    const players  = [
        {
            name: playerOne,
            token: 1,
        },

        {
            name: playerTwo,
            token: 2,
        }
    ];

    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    const setPlayerNames = (playerOneName, playerTwoName) => {
        players[0].name = playerOneName;
        players[1].name = playerTwoName;
    }

    const switchActivePlayer = () => {
        if (activePlayer === players[0]){
            activePlayer = players[1]
        } else {
            activePlayer = players[0];
        }
    }

    const playTurn = (row, column) => {

        if (!gameboard.checkMoveValidity(row, column)){
            //console.log("Invalid move. Please try again.")
            //printNewTurn();
            return;
        }
        gameboard.playerMove(row, column, getActivePlayer());

        if(gameboard.checkForWin()){
            return;
        }
        if(gameboard.checkForTie()){
            return;
        }

        switchActivePlayer();
    }

    const resetGame = () => {
        gameboard.resetBoard();
        console.log(gameboard.getBoard().map((row) => row.map((cell) => cell.getCellValue())));
        activePlayer = players[0];
    }

    return {
        getActivePlayer, 
        setPlayerNames,
        playTurn,
        getBoard: gameboard.getBoard,
        checkForWin: gameboard.checkForWin,
        checkForTie: gameboard.checkForTie,
        resetGame,
    }
}

function ScreenController(){
    let game = GameController("Player One", "Player Two");
    const currentTurn = document.querySelector(".currentTurn");
    const container = document.querySelector(".container");
    const reset =  document.querySelector(".reset");
    const playStopped = false;

    

    const updateScreen = () => {
        container.textContent = "";
        const currentBoard = game.getBoard();
        const activePlayer = game.getActivePlayer();

        currentTurn.textContent = `${activePlayer.name}'s turn.`;


        currentBoard.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = cellIndex;



                if(cell.getCellValue() === 0){
                    cellButton.textContent = "";
                }
                else if (cell.getCellValue() === 1){
                    cellButton.textContent = 'x';
                }
                else {
                    cellButton.textContent = 'o';
                }
                container.appendChild(cellButton);
            });
        });

        if(game.checkForWin()){
            currentTurn.textContent = `${activePlayer.name} wins.`;
            return;
        }
        if(game.checkForTie()){
            currentTurn.textContent = `It's a tie.`;
            return;
        }
    }

    const getNamesFromUser = () => {
        const modal = document.querySelector(".name-dialog");
        const nameForm = document.querySelector(".name-form");
        modal.showModal();

        nameForm.addEventListener("submit", (event) => {
            const playerOneName = document.querySelector("#player-one-name").value;
            const playerTwoName = document.querySelector("#player-two-name").value;
            game.setPlayerNames(playerOneName, playerTwoName);
            updateScreen();
            event.preventDefault();
            modal.close();
        })
    }

    const clickHandler = (container) => {
        const clickedRow = container.target.dataset.row;
        const clickedColumn = container.target.dataset.column;

        if (!clickedRow){
            return;
        }

        game.playTurn(clickedRow, clickedColumn, playStopped);
        updateScreen();
    }

    const resetHandler = () => {
        game.resetGame();
        getNamesFromUser();
    }

    reset.addEventListener("click", resetHandler);
    container.addEventListener("click", clickHandler);
    updateScreen();
    getNamesFromUser();
}

const screen = ScreenController();
