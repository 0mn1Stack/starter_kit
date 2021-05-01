import React, { Component } from 'react';
import './App.css';
import BuyForm from './BuyForm';
//import ethLogo from '../eth-logo.png';

class Main extends Component {

  constructor(props){
    super(props)
    this.state = {
      output: '0'
    }
  }
  
  render() {
    return (
      <div id="content">

        <div className="card mb-4">

        <div className="card-body">

          < BuyForm 
          ethBalance={this.props.ethBalance}
          tokenBalance={this.props.tokenBalance}
          buyTokens={this.props.buyTokens}
          />
        </div>
</div>


      </div>
    );
  }
}

export default Main;
