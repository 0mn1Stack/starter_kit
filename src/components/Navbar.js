import React, { Component } from 'react';
import Identicon from 'identicon.js'


class Navbar extends Component {


  render() {
    return (
      <nav className="navbar fixed-top  flex-md-nowrap p-0 shadow">
        <ul>
          <li><a
            className="navbar-brand col-sm-3 col-md-2 mr-0"

            onClick={(event) => {
              console.log("nav click")
              //this.setState({ currentForm: 'buy' })
            }}
          >
            CypherCoin
          </a></li>
          <li><a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="#"
            onClick={(event) => {
              console.log(this.props.currentForm)
              //this.setState({ currentForm: 'buy' })
            }}
          >
            Wallet
          </a></li>
        </ul>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-secondary">
              <small id="account">{this.props.account}</small>
            </small>

            {this.props.account
              ? <img
                className="ml-2"
                width='30'
                height='30'
                src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
                alt=""
              />
              : <span></span>
            }
          </li>
        </ul>

      </nav>
    );
  }
}

export default Navbar;
