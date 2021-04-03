import logo from './logo.svg';
import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';

class PieceSpace extends React.Component {
    render() {
        return (
            <div className="piece-space">
                ___
            </div>
        );
    }
}

class MoveChoiceButton extends React.Component {
    render() {
        return (
            <div className="move-choice-button">
                {this.props.side == "left" ? "➡️" : "⬅️"}
            </div>
        );
    }
}

class Board extends React.Component {
    renderPieceSpace(i) {
        return <PieceSpace />;
    }
    render() {
        return (
            <div className="game-board">
                <h1 className="game-title"> Topsy Turvy </h1>
                <h2 className="status"> <i>Your turn</i> </h2>
                <div className="board-row">
                    <MoveChoiceButton side="left" />
                    {this.renderPieceSpace(1)}
                    {this.renderPieceSpace(2)}
                    {this.renderPieceSpace(3)}
                    {this.renderPieceSpace(4)}
                    {this.renderPieceSpace(5)}
                    {this.renderPieceSpace(6)}
                    {this.renderPieceSpace(7)}
                    <MoveChoiceButton side="right" />
                </div>
                <div className="board-row">
                    <MoveChoiceButton side="left" />
                    {this.renderPieceSpace(1)}
                    {this.renderPieceSpace(2)}
                    {this.renderPieceSpace(3)}
                    {this.renderPieceSpace(4)}
                    {this.renderPieceSpace(5)}
                    {this.renderPieceSpace(6)}
                    {this.renderPieceSpace(7)}
                    <MoveChoiceButton side="right" />
                </div>
                <div className="board-row">
                    <MoveChoiceButton side="left" />
                    {this.renderPieceSpace(1)}
                    {this.renderPieceSpace(2)}
                    {this.renderPieceSpace(3)}
                    {this.renderPieceSpace(4)}
                    {this.renderPieceSpace(5)}
                    {this.renderPieceSpace(6)}
                    {this.renderPieceSpace(7)}
                    <MoveChoiceButton side="right" />
                </div>
                <div className="board-row">
                    <MoveChoiceButton side="left" />
                    {this.renderPieceSpace(1)}
                    {this.renderPieceSpace(2)}
                    {this.renderPieceSpace(3)}
                    {this.renderPieceSpace(4)}
                    {this.renderPieceSpace(5)}
                    {this.renderPieceSpace(6)}
                    {this.renderPieceSpace(7)}
                    <MoveChoiceButton side="right" />
                </div>
                <div className="board-row">
                    <MoveChoiceButton side="left" />
                    {this.renderPieceSpace(1)}
                    {this.renderPieceSpace(2)}
                    {this.renderPieceSpace(3)}
                    {this.renderPieceSpace(4)}
                    {this.renderPieceSpace(5)}
                    {this.renderPieceSpace(6)}
                    {this.renderPieceSpace(7)}
                    <MoveChoiceButton side="right" />
                </div>
                <div className="board-row">
                    <MoveChoiceButton side="left" />
                    {this.renderPieceSpace(1)}
                    {this.renderPieceSpace(2)}
                    {this.renderPieceSpace(3)}
                    {this.renderPieceSpace(4)}
                    {this.renderPieceSpace(5)}
                    {this.renderPieceSpace(6)}
                    {this.renderPieceSpace(7)}
                    <MoveChoiceButton side="right" />
                </div>
                <div className="board-row">
                    <MoveChoiceButton side="left" />
                    {this.renderPieceSpace(1)}
                    {this.renderPieceSpace(2)}
                    {this.renderPieceSpace(3)}
                    {this.renderPieceSpace(4)}
                    {this.renderPieceSpace(5)}
                    {this.renderPieceSpace(6)}
                    {this.renderPieceSpace(7)}
                    <MoveChoiceButton side="right" />
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
