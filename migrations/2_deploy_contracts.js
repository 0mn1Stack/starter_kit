const CypherSite = artifacts.require("CypherSite");
const CypherCoin = artifacts.require("CypherCoin");

module.exports = async function(deployer) {

  await deployer.deploy(CypherCoin);
  const cypher = await CypherCoin.deployed();
  
  await deployer.deploy(CypherSite, cypher.address);
  const site = await CypherSite.deployed();

  await cypher.transfer(site.address, '50000000000000000000000000000');
};