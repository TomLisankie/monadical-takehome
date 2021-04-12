import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import MoveChoiceButton from './MoveChoiceButton';
import PieceSpace from './PieceSpace';

const BOARD_SIZE = 7;

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
            piece : null,
            xTurn : true,
            filled : Array(BOARD_SIZE).fill(false),
            winner : null
        };
    }

    setUpWebSocket(game_id) {
        this.socket = new WebSocket("ws://localhost:8000/game/" + game_id);
        console.log(this.socket);
        this.socket.addEventListener("open", (event) => {
            console.log(JSON.stringify({updated_board : this.state.spaces}));
            this.socket.send(JSON.stringify({updated_board : this.state.spaces, player_id : this.state.player_id}));
        });
        this.socket.addEventListener("message", (event) => {
            console.log("Event received: ");
            console.log(event);
            const event_data = JSON.parse(event.data);
            if (event_data["type"] === "game_state_update") {
                this.setState({spaces : event_data["updated_board"], xTurn : event_data["updated_turn"]})
            } else if (event_data["type"] === "game_won") {
                let winner_id = event_data["winner"];
                this.setState({winner : winner_id});
            }
        });
        console.log("WebSocket setup should be complete");
    }

    componentDidMount() {
        axios.get("/player/new")
            .then((response) => {
                this.setState({player_id : response.data.id});
                let data = {
                    player_id : this.state.player_id
                }
                let requestData = {
                    method: "post",
                    url: "/game/retrieve-id",
                    data: data,
                    headers: {"Content-Type" : "application/json"}
                };
                axios(requestData)
                    .then((response) => {
                        let id = response.data.id;
                        let assignedPiece = response.data.piece;
                        this.setUpWebSocket(id);
                        this.setState({game_id : id, piece : assignedPiece, xTurn : true});
                    })
                    .catch((error) => console.log(error));
            })
            .catch((error) => console.log(error));
    }

    renderPieceSpace(row, column) {
        return <PieceSpace value={this.state.spaces[row][column]} />;
    }

    renderMoveChoiceButton(side, row) {
        return <MoveChoiceButton side={side} row={row} onClick={() => this.handleMoveButtonClick(side, row)} />;
    }

    updateRow(row, rowArray, side, playerLetter) {
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

    handleMoveButtonClick(side, row) {
        if (this.state.filled[row] || this.state.winner || (this.state.xTurn && this.state.piece == "O") || (!this.state.xTurn && this.state.piece == "X")) {
            return
        }

        let spaces = this.state.spaces.slice();
        let xTurn = this.state.xTurn;
        spaces[row] = this.updateRow(row, spaces[row].slice(), side, this.state.piece);
        this.setState(
            {
                spaces : spaces,
                xTurn : !xTurn
            });
        this.socket.send(JSON.stringify({updated_board : spaces}));
    }

    render() {

        return (
            <div className="game-board">
                <h1 className="game-title"> Topsy Turvy </h1>
                <h2 className="status"> <i>{this.state.xTurn ? "Your turn" : "Other turn"}</i> </h2>
                <h3> { (this.state.winner !== null) && (this.state.winner === this.state.player_id) ? "You won!!!" : ""} </h3>
                <h3> {(this.state.winner !== null) && this.state.winner !== this.state.player_id ? "Sorry, you lost." : ""} </h3>
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

export default Board;
