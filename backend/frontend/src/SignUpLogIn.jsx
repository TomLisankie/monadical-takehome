import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {"username" : "",
                      "password" : "",
                      "email" : ""};
    }

    handleSignUpSubmit(event) {
        event.preventDefault();
        console.log(this.state);
    }

    render() {
        return (
            <div className="sign-up-area">
                <h2>Sign Up</h2>
                <form onSubmit={(e) => this.handleSignUpSubmit(e)}>
                    <label className="log-in-sign-up-input">
                        <div className="field-label">Email: </div>
                        <input type="email" id="sign-up-email" onChange={(e) => this.setState({email: e.target.value})}></input>
                    </label>
                    <label className="log-in-sign-up-input">
                        <div className="field-label">Username: </div>
                        <input type="text" id="sign-up-username" onChange={(e) => this.setState({username: e.target.value})}></input>
                    </label>
                    <label className="log-in-sign-up-input">
                        <div className="field-label">Password: </div>
                        <input type="password" id="sign-up-password" onChange={(e) => this.setState({password: e.target.value})}></input>
                    </label>
                    <input type="submit" value="Sign Up" />
                </form>
            </div>
        );
    }
}

class LogIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {"username" : "",
                      "password" : ""};
    }

    handleLogInSubmit(event) {
        event.preventDefault();
        console.log(this.state);
    }

    render() {
        return (
            <div className="log-in-area">
                <h2>Log In</h2>
                <form onSubmit={(e) => this.handleLogInSubmit(e)}>
                    <label className="log-in-sign-up-input">
                        <div className="field-label">Username: </div>
                        <input type="text" id="log-in-username" onChange={(e) => this.setState({username: e.target.value})}></input>
                    </label>
                    <label className="log-in-sign-up-input">
                        <div className="field-label">Password: </div>
                        <input type="password" id="log-in-password" onChange={(e) => this.setState({password: e.target.value})}></input>
                    </label>
                    <input type="submit" value="Log In" />
                </form>
            </div>
        );
    }
}

class SignUpLogIn extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="homepage">
                <h1>Welcome to the Topsy-Turvy game!</h1>
                <h3>Sign Up or Log In to play</h3>
                <div className="sign-up-log-in-content">
                    <SignUp />
                    <LogIn />
                </div>
            </div>);
    }
}

export default SignUpLogIn;
