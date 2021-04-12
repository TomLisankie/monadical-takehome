import React from 'react';
import ReactDOM from 'react-dom';

class MoveChoiceButton extends React.Component {
    render() {
        return (
            <div className="move-choice-button" onClick={this.props.onClick}>
                {this.props.side === "left" ? "➡️" : "⬅️"}
            </div>
        );
    }
}

export default MoveChoiceButton
