// will go to frontend/src

import web3 from './web3';

const contractABI = [/* ABI from Truffle build/contracts/LoanRepayment.json */];
const contractAddress = '0xYourDeployedContractAddress';  // Replace with the actual address after deployment

const loanRepaymentContract = new web3.eth.Contract(contractABI, contractAddress);

export default loanRepaymentContract;
