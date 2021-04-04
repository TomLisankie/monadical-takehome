import logo from './logo.svg';
import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';

const BOARD_SIZE = 7;

class PieceSpace extends React.Component {
    render() {
        return (
            <div className="piece-space">
                {this.props.value}
            </div>
        );
    }
}

class MoveChoiceButton extends React.Component {
    render() {
        return (
            <div className="move-choice-button" onClick={this.props.onClick}>
                {this.props.side === "left" ? "➡️" : "⬅️"}
            </div>
        );
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        let spaces = [];
        for (let i = 0; i < BOARD_SIZE; i++) {
            let row = [];
            for (let j = 0; j < BOARD_SIZE; j++) {
                row.push("___");
            }
            spaces.push(row);
        }
        this.state = {
            spaces : spaces,
            xTurn : true,
            filled : Array(BOARD_SIZE).fill(false),
            winner : null
        };
    }

    renderPieceSpace(row, column) {
        return <PieceSpace value={this.state.spaces[row][column]} />;
    }

    renderMoveChoiceButton(side, row) {
        return <MoveChoiceButton side={side} row={row} onClick={() => this.handleClick(side, row)} />;
    }

    newRow(row, rowArray, side, playerLetter) {
        let newRow = [playerLetter];

        if (side === "left") {
            // find index of empty space to leave out
            let indexToLeave = 0;
            while (rowArray[indexToLeave] != "___") {
                indexToLeave += 1;
                if (indexToLeave == BOARD_SIZE) {
                    let filled = this.state.filled;
                    filled[row] = true;
                    this.setState({filled : filled});
                    return rowArray;
                }
            }
            // shift off all elements of old array into new array except one marked to leave out
            for (let i = 0; i < rowArray.length; i++) {
                let piece = rowArray[i];
                if (i != indexToLeave) {
                    newRow.push(piece);
                }
            }
        } else {
            let indexToLeave = BOARD_SIZE - 1;
            while (rowArray[indexToLeave] != "___") {
                indexToLeave -= 1;
                if (indexToLeave < 0) {
                    let filled = this.state.filled;
                    filled[row] = true;
                    this.setState({filled : filled});
                    return rowArray;
                }
            }
            for (let i = BOARD_SIZE - 1; i >= 0; i--) {
                let piece = rowArray.pop();
                if (i != indexToLeave) {
                    newRow.unshift(piece);
                }
            }
        }

        return newRow;
    }

    checkForHorizontalWin(spaces) {
        for (let row = 0; row < BOARD_SIZE; row++) {
            let startColumn = 0;
            let endColumn = 4;
            while (endColumn != BOARD_SIZE + 1) {
                let slice = spaces[row].slice(startColumn, endColumn);
                let set = new Set(slice)
                if (set.size == 1 && set.values().next().value != "___") {
                    return set.values().next().value;
                }
                startColumn += 1;
                endColumn += 1;
            }
        }
        return null;
    }

    checkForVerticalWin(spaces) {
        let rows = [0, 1, 2, 3];
        while (rows[rows.length - 1] != BOARD_SIZE) {
            for (let column = 0; column < BOARD_SIZE; column++) {
                let set = new Set([spaces[rows[0]][column], spaces[rows[1]][column], spaces[rows[2]][column], spaces[rows[3]][column]]);
                if (set.size == 1 && set.values().next().value != "___") {
                    return set.values().next().value;
                }
            }
            for (let i = 0; i < rows.length; i++) {
                rows[i] += 1;
            }
        }
        return null;
    }

    checkForDiagonalWin(spaces) {
        function checkForLeftDiagonal(spaces) {
            let positions = [[0,0], [1,1], [2,2], [3,3]];
            while (positions[positions.length - 1][0] != BOARD_SIZE) {
                for (let column = 0; column < BOARD_SIZE; column++) {
                    let set = new Set([spaces[positions[0][0]][positions[0][1]], spaces[positions[1][0]][positions[1][1]], spaces[positions[2][0]][positions[2][1]], spaces[positions[3][0]][positions[3][1]]]);
                    if (set.size == 1 && set.values().next().value != "___") {
                        return set.values().next().value;
                    }
                }
                for (let i = 0; i < positions.length; i++) {
                    positions[i][0] += 1;
                    positions[i][1] += 1;
                }
            }
            return null;
        }
        function checkForRightDiagonal(spaces) {
            let positions = [[BOARD_SIZE - 1,0], [BOARD_SIZE - 2,1], [BOARD_SIZE - 3,2], [BOARD_SIZE - 4,3]];
            while (positions[positions.length - 1][0] != -1) {
                for (let column = BOARD_SIZE - 1; column > 0; column--) {
                    let set = new Set([spaces[positions[0][0]][positions[0][1]], spaces[positions[1][0]][positions[1][1]], spaces[positions[2][0]][positions[2][1]], spaces[positions[3][0]][positions[3][1]]]);
                    if (set.size == 1 && set.values().next().value != "___") {
                        return set.values().next().value;
                    }
                }
                for (let i = 0; i < positions.length; i++) {
                    positions[i][0] -= 1;
                    positions[i][1] -= 1;
                }
            }
            return null;
        }
        let possibleDiagonals = [checkForLeftDiagonal(spaces), checkForRightDiagonal(spaces)];
        for (let possibleWin of possibleDiagonals) {
            if (possibleWin) {
                return possibleWin;
            }
        }
    }

    checkForWin(spaces) {
        let possibleWins = [this.checkForHorizontalWin(spaces), this.checkForVerticalWin(spaces), this.checkForDiagonalWin(spaces)];
        for (let possibleWin of possibleWins) {
            if (possibleWin) {
                return possibleWin;
            }
        }
        return null;
    }

    handleClick(side, row) {
        if (this.state.filled[row] || this.state.winner) {
            return
        }
        let spaces = this.state.spaces.slice();
        let xTurn = this.state.xTurn;
        spaces[row] = this.newRow(row, spaces[row].slice(), side, xTurn ? "X" : "O");
        this.setState(
            {
                spaces : spaces,
                xTurn : !xTurn,
                winner : this.checkForWin(spaces)
            });
    }

    render() {
        return (
            <div className="game-board">
                <h1 className="game-title"> Topsy Turvy </h1>
                <h2 className="status"> <i>{this.state.xTurn ? "Your turn" : "Other turn"}</i> </h2>
                <h3> Winner: {this.state.winner ? this.state.winner : ""} </h3>
                <div className="board-row">
                    {this.renderMoveChoiceButton("left", 0)}
                    {this.renderPieceSpace(0, 0)}
                    {this.renderPieceSpace(0, 1)}
                    {this.renderPieceSpace(0, 2)}
                    {this.renderPieceSpace(0, 3)}
                    {this.renderPieceSpace(0, 4)}
                    {this.renderPieceSpace(0, 5)}
                    {this.renderPieceSpace(0, 6)}
                    {this.renderMoveChoiceButton("right", 0)}
                </div>
                <div className="board-row">
                    {this.renderMoveChoiceButton("left", 1)}
                    {this.renderPieceSpace(1, 0)}
                    {this.renderPieceSpace(1, 1)}
                    {this.renderPieceSpace(1, 2)}
                    {this.renderPieceSpace(1, 3)}
                    {this.renderPieceSpace(1, 4)}
                    {this.renderPieceSpace(1, 5)}
                    {this.renderPieceSpace(1, 6)}
                    {this.renderMoveChoiceButton("right", 1)}
                </div>
                <div className="board-row">
                    {this.renderMoveChoiceButton("left", 2)}
                    {this.renderPieceSpace(2, 0)}
                    {this.renderPieceSpace(2, 1)}
                    {this.renderPieceSpace(2, 2)}
                    {this.renderPieceSpace(2, 3)}
                    {this.renderPieceSpace(2, 4)}
                    {this.renderPieceSpace(2, 5)}
                    {this.renderPieceSpace(2, 6)}
                    {this.renderMoveChoiceButton("right", 2)}
                </div>
                <div className="board-row">
                    {this.renderMoveChoiceButton("left", 3)}
                    {this.renderPieceSpace(3, 0)}
                    {this.renderPieceSpace(3, 1)}
                    {this.renderPieceSpace(3, 2)}
                    {this.renderPieceSpace(3, 3)}
                    {this.renderPieceSpace(3, 4)}
                    {this.renderPieceSpace(3, 5)}
                    {this.renderPieceSpace(3, 6)}
                    {this.renderMoveChoiceButton("right", 3)}
                </div>
                <div className="board-row">
                    {this.renderMoveChoiceButton("left", 4)}
                    {this.renderPieceSpace(4, 0)}
                    {this.renderPieceSpace(4, 1)}
                    {this.renderPieceSpace(4, 2)}
                    {this.renderPieceSpace(4, 3)}
                    {this.renderPieceSpace(4, 4)}
                    {this.renderPieceSpace(4, 5)}
                    {this.renderPieceSpace(4, 6)}
                    {this.renderMoveChoiceButton("right", 4)}
                </div>
                <div className="board-row">
                    {this.renderMoveChoiceButton("left", 5)}
                    {this.renderPieceSpace(5, 0)}
                    {this.renderPieceSpace(5, 1)}
                    {this.renderPieceSpace(5, 2)}
                    {this.renderPieceSpace(5, 3)}
                    {this.renderPieceSpace(5, 4)}
                    {this.renderPieceSpace(5, 5)}
                    {this.renderPieceSpace(5, 6)}
                    {this.renderMoveChoiceButton("right", 5)}
                </div>
                <div className="board-row">
                    {this.renderMoveChoiceButton("left", 6)}
                    {this.renderPieceSpace(6, 0)}
                    {this.renderPieceSpace(6, 1)}
                    {this.renderPieceSpace(6, 2)}
                    {this.renderPieceSpace(6, 3)}
                    {this.renderPieceSpace(6, 4)}
                    {this.renderPieceSpace(6, 5)}
                    {this.renderPieceSpace(6, 6)}
                    {this.renderMoveChoiceButton("right", 6)}
                </div>
            </div>
        );
    }
}

function App() {
    return (
        <div className="App">
            <div className="App-content">
                <Board />
            </div>
        </div>
    );
}

export default App;
