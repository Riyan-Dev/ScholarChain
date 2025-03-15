const DonationTracker = artifacts.require("DonationTracker");
const LoanRepayment = artifacts.require("LoanRepayment");
const Create2Factory = artifacts.require("Create2Factory");

module.exports = async function (deployer, network, accounts) {
  deployer.deploy(Create2Factory);
  deployer.deploy(DonationTracker);
  // const applicant = accounts[0]; // This could be any valid Ethereum address
  // const loanAmount = 1000 // Example loan amount in wei

  // Deploy the LoanRepayment contract with constructor parameters
  // await deployer.deploy(LoanRepayment, applicant, loanAmount);

};
