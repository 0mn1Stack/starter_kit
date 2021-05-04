const CypherMarket = artifacts.require("CypherMarket");
const Cypher = artifacts.require("Cypher");


module.exports = async function (deployer) {
  await deployer.deploy(Cypher);
  const token = await Cypher.deployed()
  await deployer.deploy(CypherMarket, token.address);
  const market = await CypherMarket.deployed()
  await token.transfer(market.address, '1000000000000000000000000')
};
