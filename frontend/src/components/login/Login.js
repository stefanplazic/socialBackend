import React, { Component } from 'react';

import './Login.css';
import { signIn, register, checkEmail, checkUsername } from '../../api/userService';
import { login } from '../../utils/authHelper';
import ForgotPassModal from './ForgotPassModal';

class Login extends Component {
    state = {
        username: '',
        password: '',
        regUsername: '',
        regPassword: '',
        regEmail: '',
        loginErrMessage: '',
        regErrMessage: '',
        showModal: false,
        usernameTaken: '',
        emailTaken: ''
    };

    loginFunc = async () => {
        const username = this.state.username.trim();
        const password = this.state.password;
        if (username !== '' && password !== '') {
            const response = await signIn(username, password);
            if (response.success) {
                //save token to localStorage
                await login(response.jwt, response.userData);
                this.props.loginFunc();
            }
            else {
                this.setState({ loginErrMessage: response.message });

            }

        }

    }
    regFunc = async (e) => {
        e.preventDefault();
        const username = this.state.regUsername.trim();
        const password = this.state.regPassword;
        const email = this.state.regEmail.trim();
        if (username === '' || password === '' || email === '') {
            return;
        }
        const response = await register(username, email, password);
        if (response.success) {
            const response = await signIn(username, password);
            if (response.success) {
                //save token to localStorage
                await login(response.jwt, response.userData);
                this.props.loginFunc();
            }
            //login user

        }
        else {
            this.setState({ regErrMessage: response.message });

        }



    }


    render() {

        return (

            <div className="container login-container">
                <div className="text-center "><h1 className="">Enjoy and share short videos</h1></div>
                <div className="row">
                    <div className="col-md-6 login-form-1">
                        <h3>Login</h3>
                        <form>
                            {this.renderLoginErrorMessage()}
                            <div className="form-group">
                                <input type="text" required className="form-control" placeholder="Your Username *" onChange={(event) => { this.setState({ username: event.target.value }) }} value={this.state.username} />
                            </div>
                            <div className="form-group">
                                <input type="password" required className="form-control" placeholder="Your Password *" onChange={(event) => { this.setState({ password: event.target.value }) }} value={this.state.password} />
                            </div>
                            <div className="form-group">
                                <input type="button" className="btnSubmit" value="Login" onClick={this.loginFunc} />
                            </div>
                            <div className="form-group">
                                <span className="ForgetPwd" onClick={this.togleModal}>Forgot Password?</span>
                            </div>
                        </form>
                    </div>


                    <div className="col-md-6 login-form-2">
                        <h3>Register</h3>

                        <form onSubmit={this.regFunc}>
                            {this.renderRegErrorMessage()}
                            {this.renderEmailTakenError()}
                            <div className="form-group">
                                <input type="email" required className="form-control" placeholder="Your Email *" onChange={this.checkEmail} value={this.state.regEmail} />
                            </div>
                            {this.renderUsernameTakenError()}
                            <div className="form-group">
                                <input type="text" required minLength="4" className="form-control" placeholder="Username *" onChange={this.checkUsername} value={this.state.regUsername} />
                            </div>
                            <div className="form-group">
                                <input type="password" required minLength="4" className="form-control" placeholder="Your Password *" onChange={(event) => { this.setState({ regPassword: event.target.value }) }} value={this.state.regPassword} />
                            </div>
                            <div className="form-group">
                                <input type="submit" className="btnSubmit" value="Register" />
                            </div>

                        </form>
                    </div>
                </div>
                <ForgotPassModal
                    isOpen={this.state.showModal}
                    toggle={this.togleModal} />

            </div>

        );
    }

    //check email
    checkEmail = async (event) => {
        const email = event.target.value.trim();
        this.setState({ regEmail: email });
        if ((/\S+@\S+\.\S+/.test(email))) {
            const response = await checkEmail(email);

            if (response && response.success && response.exists) {
                //show error message
                this.setState({ emailTaken: "Email is taken" });
            }
            else
                this.setState({ emailTaken: "" });

        }

    }

    //check email
    checkUsername = async (event) => {
        const username = event.target.value.trim();
        this.setState({ regUsername: username });
        const response = await checkUsername(username);

        if (response && response.success && response.exists) {
            //show error message
            this.setState({ usernameTaken: "Username is taken" });
        }
        else
            this.setState({ usernameTaken: "" });



    }

    renderLoginErrorMessage() {
        const erroMessage = (this.state.loginErrMessage !== '') ?
            (<div className="alert alert-danger error_message" role="alert">
                {this.state.loginErrMessage}
            </div>) : null;
        return erroMessage;
    }

    renderRegErrorMessage() {
        const erroMessage = (this.state.regErrMessage !== '') ?
            (<div className="alert alert-danger error_message" role="alert">
                {this.state.regErrMessage}
            </div>) : null;
        return erroMessage;
    }

    renderUsernameTakenError() {
        const erroMessage = (this.state.usernameTaken !== '') ?
            (<div className="alert alert-danger error_message" role="alert">
                {this.state.usernameTaken}
            </div>) : null;
        return erroMessage;
    }

    renderEmailTakenError() {
        const erroMessage = (this.state.emailTaken !== '') ?
            (<div className="alert alert-danger error_message" role="alert">
                {this.state.emailTaken}
            </div>) : null;
        return erroMessage;
    }


    togleModal = () => {
        this.setState({ showModal: !this.state.showModal });
    }
}

export default Login;
