pragma solidity 0.5.16;

import "./CypherCoin.sol";

contract CypherSite {
	string public name = "CypherSite";
	CypherCoin public coin;
	uint public rate = 100;

	event TokensPurchased(

		address account,
		address token,
		uint amount,
		uint rate
	);

	event TokensSold(

		address account,
		address token,
		uint amount,
		uint rate
	);


	constructor(CypherCoin _coin) public{
		coin = _coin;
	}

	function buyTokens() public payable{

		uint coinAmount = msg.value * rate;


		require(coin.balanceOf(address(this)) >= coinAmount);

		coin.transfer(msg.sender, coinAmount);


		emit TokensPurchased(msg.sender, address(coin), coinAmount, rate);
	}


	function sellTokens(uint _amount) public {

		require(coin.balanceOf(msg.sender) >= _amount);

		uint etherAmount = _amount / rate;

		require(address(this).balance >= etherAmount);

		coin.transferFrom(msg.sender, address(this), _amount);
		msg.sender.transfer(etherAmount);

		emit TokensSold(msg.sender, address(coin), _amount, rate);

	}
}