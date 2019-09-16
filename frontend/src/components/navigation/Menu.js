import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SearchBox from '../searchbox/SearchBox';
import Notifications from './Notifications';
import logo from '../../assets/logo.png';

class Menu extends Component {

  state = { unreadNotifications: 0 };

  async componentDidMount() {

  }

  render() {
    //get unread notifications if is logged
    const unread = (this.props.logged && this.state.unreadNotifications > 0) ?
      (<span className="badge badge-danger">{this.state.unreadNotifications}</span>) : null;
    const loggedMenu = this.props.logged ? (
      <nav className="navbar navbar-expand-sm bg-primary navbar-dark ">

        <Link to="/" className="navbar-brand">
          <img src={logo} alt='logo' width='30px' height='26px' />
          VidShare</Link>



        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="collapsibleNavbar">
          <ul className="navbar-nav ml-auto">

            <li>
              <SearchBox />
            </li>

            <li className="nav-item">
              <Link to="/" className="nav-link"><i className="fa fa-home" /></Link>
            </li>
            <li className="nav-item">
              <Link to={'/profile/' + this.props.userId} className="nav-link">
                <i className="fa fa-user" />


              </Link>
            </li>
            <li className="dropdown">

              <span className="nav-link " data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i className="fa fa-bell hover_div">
                {unread}
              </i></span>
              <Notifications
                setUnreadMessages={this.setUnreadMessages} />
            </li>
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={this.props.logoutFunc}>Logout</Link>
            </li>

          </ul>
        </div>
      </nav>
    ) :
      (
        <nav className="navbar navbar-expand-sm bg-primary navbar-dark sticky-top">

          <Link to="/" className="navbar-brand">
            <img src={logo} alt='logo' width='30px' height='26px' />
            VidShare</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="collapsibleNavbar">
            <ul className="navbar-nav ml-auto">


              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>

              <li className="nav-item">
                <Link to="/contact" className="nav-link">Contact</Link>
              </li>
            </ul>
          </div>
        </nav>
      );
    return (<div>{loggedMenu}</div>);

  }

  setUnreadMessages = (unreadNum) => {
    this.setState({ unreadNotifications: unreadNum });
  }
}

export default Menu;