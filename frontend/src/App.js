import React, { Component } from 'react';
import { HashRouter, Route, Redirect, Switch } from 'react-router-dom';

import './App.css';
import Menu from './components/navigation/Menu';
import Home from './components/home/Home.js';
import Login from './components/login/Login';
import Contact from "./components/contact/Contact";
import Profile from "./components/profile/Profile";
import HashPost from "./components/hashtags/HashPost";

import { isUserLogged, logoutFunc, getUserId } from './utils/authHelper';


const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route {...rest} render={(props) => (
    isAuthenticated === true
      ? <Component {...props} />
      : <Redirect to='/login' />
  )} />);

const PublicRoute = ({ component: Component, isAuthenticated, loginFunc, ...rest }) => (
  <Route {...rest} render={(props) => (
    isAuthenticated === false
      ? <Component {...props} loginFunc={loginFunc} />
      : <Redirect to='/' />

  )} />);

class App extends Component {
  state = {
    token: null,
    userData: null,
    isLogged: false,
    userId: ''
  };

  async componentDidMount() {
    //check if user is logged
    var isLogged = await isUserLogged();
    this.setState({ isLogged: isLogged });
    var userId = await getUserId();
    this.setState({ userId: userId });


  }


  //logout function
  logout = async () => {
    //delete jwt token from storage
    await logoutFunc();
    this.setState({ isLogged: false });
  }

  login = async () => {

    var userId = await getUserId();
    this.setState({ isLogged: true, userId: userId });



  }

  render() {
    return (
      <HashRouter>
        <div>

          <Menu logged={this.state.isLogged} logoutFunc={this.logout} userId={this.state.userId} />
          <main className="main-content">
            <Switch>
              <PrivateRoute exact path="/" component={Home} isAuthenticated={this.state.isLogged} />
              <PrivateRoute path="/profile/:userId" component={Profile} isAuthenticated={this.state.isLogged} />
              <PrivateRoute path="/byTags/:tag" component={HashPost} isAuthenticated={this.state.isLogged} />
              <PublicRoute path="/login" component={Login} loginFunc={this.login} isAuthenticated={this.state.isLogged} />
              <PublicRoute path="/contact" component={Contact} isAuthenticated={this.state.isLogged} loginFunc={this.login} />
              <Redirect from='*' to='/' />
            </Switch>
          </main>
        </div>
      </HashRouter>
    );
  }
}

export default App;
