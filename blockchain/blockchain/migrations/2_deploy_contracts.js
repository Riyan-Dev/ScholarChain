const LoanRepayment = artifacts.require("LoanRepayment");

module.exports = function (deployer) {
  deployer.deploy(LoanRepayment);
};
