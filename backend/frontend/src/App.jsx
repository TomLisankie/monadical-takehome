import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';
import Board from './Board';
import SignUpLogIn from './SignUpLogIn';
import {BrowserRouter as Router,
        Switch,
        Route,} from "react-router-dom";

function App() {
    return (
            <Router>
                <Switch>
                    <Route path="/game">
                        <div className="Board">
                            <Board />
                        </div>
                    </Route>
                    <Route path="/">
                        <SignUpLogIn />
                    </Route>
                </Switch>
            </Router>
    );
}

export default App;
