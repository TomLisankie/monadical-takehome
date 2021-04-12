import React from 'react';
import ReactDOM from 'react-dom';

class PieceSpace extends React.Component {
    render() {
        return (
            <div className="piece-space">
                {this.props.value}
            </div>
        );
    }
}

export default PieceSpace;
