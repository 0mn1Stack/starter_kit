import React, { Component } from 'react';
import Web3 from 'web3';
import Navbar from "./Navbar"
import Main from "./Main"
import CypherMarket from '../abis/CypherMarket.json'
import Token from '../abis/Cypher.json'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()

    this.setState({ account: accounts[0] })
    console.log(this.state.account)

    //user balance
    const ethBalance = await web3.eth.getBalance(this.state.account)
    this.setState({ ethBalance })
    console.log(this.state.ethBalance)

    //load token
    const networkId = await web3.eth.net.getId()
    const tokenData = Token.networks[networkId]
    if (tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address)
      this.setState({ token })
      let tokenBalance = await token.methods.balanceOf(this.state.account).call() // how many coins the user has
      //console.log("coin balance", coinBalance.toString())
      this.setState({ tokenBalance: tokenBalance.toString() })
      //console.log(coin)
    }
    else {
      window.alert('Token contrat not deployed to detected network.')
    }


    const swapData = CypherMarket.networks[networkId]
    if (swapData) {
      const cypherSite = new web3.eth.Contract(CypherMarket.abi, swapData.address)

      this.setState({ cypherSite })
    }
    else {
      window.alert('CypherSite contrat not deployed to detected network.')
    }

    console.log(this.state.cypherSite)
    this.setState({ loading: false })
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask.')
    }
  }

  buyTokens = (etherAmount) => {
    this.setState({ loading: true })
    this.state.cypherSite.methods.buyTokens().send({ value: etherAmount, from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  sellTokens = (tokenAmount) => {
    this.setState({ loading: true })
    this.state.token.methods.approve(this.state.cypherSite.address, tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.cypherSite.methods.sellTokens(tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  transferTokens = (etherAmount) => {
    this.setState({ loading: true })
    this.state.token.methods.transfer().send({ value: etherAmount, from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      token: {},
      cypherSite: {},
      ethBalance: '0',
      tokenBalance: '0',
      loading: true,
      currentForm: 'home',

    };
  }

  render() {

    let content

    if (this.state.loading) {
      content = <p id="loader" className="text-center mt-5"> <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div></p>
    }
    else {
      content = <Main
        ethBalance={this.state.ethBalance}
        tokenBalance={this.state.tokenBalance}
        buyTokens={this.buyTokens}
        sellTokens={this.sellTokens}
      />
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
