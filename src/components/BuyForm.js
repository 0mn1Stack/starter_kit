import React, { Component } from 'react';
import tokenLogo from '../cypher.png';
import Token from '../abis/Cypher.json';
//import ethLogo from '../eth-logo.png';

class BuyForm extends Component {



    constructor(props) {
        super(props)
        this.state = {
            output: '0',
        }
        //this.transfer = this.transfer.bind(this)
    }

    render() {
        return (

            <form className="mb-3" onSubmit={(event) => {
                event.preventDefault()
                let etherAmount
                etherAmount = this.input.value.toString()
                etherAmount = window.web3.utils.toWei(etherAmount, 'Ether')
                this.props.buyTokens(etherAmount)
                //console.log("purchasing tokens")

            }}>
                <div>
                    <label className="float-left"><b>Input</b></label>
                    <span className="float-right text-muted">
                        Balance: {window.web3.utils.fromWei(this.props.ethBalance, 'Ether')}
                    </span>
                </div>
                <div className="input-group mb-4">
                    <input
                        type="number"
                        pattern="[0-9]+([\.,][0-9]+)?"
                        ref={(input) => { this.input = input }}
                        min="0"
                        onChange={(event) => {
                            console.log("changing...")
                            const etherAmount = this.input.value.toString()
                            this.setState({
                                output: etherAmount * 100
                            })
                            console.log(this.state.output)
                        }}
                        className="form-control form-control-lg"
                        placeholder="0"
                        required
                    />
                    <div className="input-group-append">
                        <div className="input-group-text">
                            <img src="" height="32" alt="" /> &nbsp;&nbsp;&nbsp; ETH
        </div>
                    </div>
                </div>
                <div>
                    <label className="float-left"><p>Output</p></label>
                    <span className="float-right text-muted">
                        Your Balance: {window.web3.utils.fromWei(this.props.tokenBalance, 'Ether')}
                    </span>
                </div>
                <div className="input-group mb-2">
                    <input
                        type="text"
                        id="amount"
                        ref={(input) => { this.amount = input }}
                        className="form-control form-control-lg"
                        placeholder="0"
                        value={this.state.output}
                        disabled />
                    <div className="input-group-append">
                        <div className="input-group-text">
                            <img src={tokenLogo} height="32" alt="" />
        &nbsp; CYPHR
        </div>
                    </div>
                </div>
                <div className="mb-5">
                    <span className="float-left text-muted">Exchange Rate</span>
                    <span className="float-right text-muted">1 ETH = 100 CYPHR</span>
                </div>
                <button type="submit" className="btn btn-primary btn-block btn-lg">Claim</button>
            </form>

        );
    }
}

export default BuyForm;


