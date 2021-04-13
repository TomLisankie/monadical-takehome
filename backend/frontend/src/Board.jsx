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
            winner : null,
            solo : (props.solo ? props.solo : false)
        };
    }

    setUpWebSocket(game_id) {
        this.socket = new WebSocket("ws://localhost:8000/game/" + game_id);
        console.log(this.socket);
        this.socket.addEventListener("open", (event) => {
            console.log(JSON.stringify({updated_board : this.state.spaces}));
            this.socket.send(JSON.stringify({updated_board : this.state.spaces, perma_cookie : sessionStorage.perma_cookie, solo : this.state.solo}));
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
    }

    componentDidMount() {
        let userInfoRequestData = {
            method: "post",
            url: "/api/player/get-info",
            data: {"perma_cookie" : sessionStorage.perma_cookie},
            headers: {"Content-Type" : "application/json"}
        };
        axios(userInfoRequestData).then((response) => {
            this.setState({username : response.data.username});
        });

        let gameRequestData = {
            method: "post",
            url: "/api/game/retrieve-id",
            data: {"perma_cookie" : sessionStorage.perma_cookie, "solo" : this.state.solo},
            headers: {"Content-Type" : "application/json"}
        };
        axios(gameRequestData)
            .then((response) => {
                let id = response.data.id;
                let assignedPiece = response.data.piece;
                this.setUpWebSocket(id);
                this.setState({game_id : id, piece : assignedPiece, xTurn : true});
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
                <h3> { (this.state.winner !== null) && (this.state.winner === this.state.username) ? "You won!!!" : ""} </h3>
                <h3> {(this.state.winner !== null) && this.state.winner !== this.state.username ? "Sorry, you lost." : ""} </h3>
                <div className="rows">
                    {[...Array(BOARD_SIZE).keys()]
                     .map(i =>
                         {
                             return <div className="board-row">
                                        {this.renderMoveChoiceButton("left", i)}
                                        {[...Array(BOARD_SIZE).keys()]
                                         .map(j =>
                                             {
                                                 return this.renderPieceSpace(i, j);
                                             })}
                                        {this.renderMoveChoiceButton("right", i)}
                                    </div>;
                         })}
                </div>
            </div>
        );
    }
}

export default Board;
