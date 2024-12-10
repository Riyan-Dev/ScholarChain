// frontend/src/DeployContract.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';  // For making API requests to your backend
import web3 from './web3';   // Import the web3 instance to interact with Ethereum
import loanRepaymentContract from './contract'; // Import the ABI and contract instance

const DeployContract = () => {
    const [loanData, setLoanData] = useState(null);

    // Fetch loan details from FastAPI backend when the component is mounted
    useEffect(() => {
        const fetchLoanData = async () => {
            const response = await axios.get('http://localhost:8000/get-loan-details');
            setLoanData(response.data);  // Assuming your API returns the loan data
        };

        fetchLoanData();
    }, []);

    // Function to deploy the contract
    const deployContract = async () => {
        if (!loanData) {
            console.error('Loan data is not available');
            return;
        }

        // Get the accounts from the user's MetaMask or Ethereum wallet
        const accounts = await web3.eth.getAccounts();

        try {
            const deployedContract = await loanRepaymentContract.deploy({
                data: '0xYourContractBytecode',  // Replace with the actual contract bytecode
                arguments: [
                    loanData.studentAddress,  // The student's address (dynamic value)
                    loanData.loanAmount,      // Loan amount (dynamic value)
                    loanData.totalPayments,   // Total number of payments (dynamic value)
                    loanData.paymentSize      // Payment size (dynamic value)
                ]
            }).send({
                from: accounts[0],  // Sender's address (usually the user's wallet address)
                gas: 2000000,  // Gas limit for deployment
            });

            console.log('Contract deployed at address:', deployedContract.options.address);
        } catch (error) {
            console.error('Error deploying contract:', error);
        }
    };

    return (
        <div>
            {loanData ? (
                <div>
                    <h3>Loan Data:</h3>
                    <p>Loan Amount: {loanData.loanAmount}</p>
                    <p>Payment Size: {loanData.paymentSize}</p>
                    <button onClick={deployContract}>Deploy Contract</button>
                </div>
            ) : (
                <p>Loading loan data...</p>
            )}
        </div>
    );
};

export default DeployContract;
