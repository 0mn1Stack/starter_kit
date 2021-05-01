const CypherSite = artifacts.require("CypherSite");
const CypherCoin = artifacts.require("CypherCoin");

require('chai').use(require('chai-as-promised')).should()

function tokens(n){
	return web3.utils.toWei(n, 'ether');
}

contract('CypherSite', ([deployer, investor]) => {

	let coin, site

	before(async () => {
		coin = await CypherCoin.new()
		site = await CypherSite.new(coin.address)

		await coin.transfer(site.address, tokens('50000000000'))		
	})

	describe('Token deployment', async () => {
		it('contract has a name', async () => {
			
			const name = await coin.name()
			assert.equal(name, 'CypherCoin')
		})
	})

	describe('Site deployment', async () => {
		it('contract has a name', async () => {
			
			const name = await site.name()
			assert.equal(name, 'CypherSite')
		})

		it('contract has tokens', async () => {

			let balance = await coin.balanceOf(site.address)
			assert.equal(balance.toString(), tokens('50000000000'))
	})

	})


	describe('buyTokens()', async () => {
		let result

		before(async () => {
			result = await site.buyTokens({from: investor, value: web3.utils.toWei('1', 'ether')})	
		})

		it('allows user buy tokens from site', async () => {
			let investorBalance = await coin.balanceOf(investor)
			assert.equal(investorBalance.toString(), tokens('100'))

			let siteBalance
			siteBalance = await coin.balanceOf(site.address)
			assert.equal(siteBalance.toString(), tokens('49999999900'))
			siteBalance = await web3.eth.getBalance(site.address)
			assert.equal(siteBalance.toString(), web3.utils.toWei('1', 'ether'))
			

			const event = result.logs[0].args
			assert.equal(event.account, investor)
			assert.equal(event.token, coin.address)
			assert.equal(event.amount.toString(), tokens('100').toString())
			assert.equal(event.rate.toString(), '100')
		})
	})

		describe('sellTokens()', async () => {
		let result

		before(async () => {
			await coin.approve(site.address, tokens('100'), {from: investor})
			result = await site.sellTokens(tokens('100'), {from: investor})	
		})

		it('allows user to sell tokens from site', async () => {
			let investorBalance = await coin.balanceOf(investor)
			assert.equal(investorBalance.toString(), tokens('0'))

			let siteBalance
			siteBalance = await coin.balanceOf(site.address)
			assert.equal(siteBalance.toString(), tokens('50000000000'))
			siteBalance = await web3.eth.getBalance(site.address)
			assert.equal(siteBalance.toString(), web3.utils.toWei('0', 'ether'))

			const event = result.logs[0].args
			assert.equal(event.account, investor)
			assert.equal(event.token, coin.address)
			assert.equal(event.amount.toString(), tokens('100').toString())
			assert.equal(event.rate.toString(), '100')

			await site.sellTokens(tokens('500'), {from: investor}).should.be.rejeted;
		})
	})


})