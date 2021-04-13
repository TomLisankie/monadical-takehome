import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "username" : "",
            "wins" : -1
        };
    }

    render() {
        return (
            <div className="dashboard">
                <h1 className="player-info">
                    Hello, {this.state.username}! You've made {this.state.wins} wins so far.
                </h1>
                <div className="dashboard-options">
                    <div className="dashboard-option">
                        <button onClick={(e) => window.location.href="http://localhost:3000/game"}>
                            <h1>Play With Someone</h1>
                        </button>
                    </div>
                    <div className="dashboard-option">
                        <button onClick={(e) => window.location.href="http://localhost:3000/solo-game"}>
                            <h1>Play Solo</h1>
                        </button>
                    </div>
                    <div className="dashboard-option">
                        <button>
                            <h1>Leaderboard</h1>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        let requestData = {
            method: "post",
            url: "/api/player/get-info",
            data: {"perma_cookie" : sessionStorage.perma_cookie},
            headers: {"Content-Type" : "application/json"}
        }
        axios(requestData).then((response) => {
            this.setState({
                "username" : response.data.username,
                "wins" : response.data.wins
            });
        });
    }
}

export default Dashboard;
