import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import LoanRepayment from './contracts/LoanRepayment.json';


const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545');

const DeployContract = () => {
    const [loanData, setLoanData] = useState(null);

    useEffect(() => {
        // Fetch loan details from the backend
        const fetchLoanData = async () => {
            try {
                const response = await fetch('http://localhost:8000/get-loan-details');
                const data = await response.json();
                setLoanData(data); // Save loan details to state
            } catch (error) {
                console.error('Error fetching loan details:', error);
            }
        };

        fetchLoanData();
    }, []);

    const deployContract = async () => {
        try {
            const accounts = await web3.eth.getAccounts();
            const contract = new web3.eth.Contract(LoanRepayment.abi);
    
            // Deploy the contract
            const deployedContract = await contract.deploy({
                data: LoanRepayment.bytecode,
            }).send({
                from: accounts[0],
                gas: 2000000,
            });
    
            console.log('Contract deployed at:', deployedContract.options.address);
    
            // Call the createLoan function to initialize loan details
            await deployedContract.methods.createLoan(
                loanData.student,
                loanData.loanAmount,
                loanData.totalPayments,
                loanData.paymentSize
            ).send({
                from: accounts[0],
                gas: 2000000,
            });
    
            alert(`Contract deployed and initialized at: ${deployedContract.options.address}`);
        } catch (error) {
            console.error('Error deploying or initializing contract:', error);
        }
    };

    return (
        <div>
            {loanData ? (
                <div>
                    <h3>Loan Details:</h3>
                    <p>Student Address: {loanData.student}</p>
                    <p>Loan Amount: {loanData.loanAmount}</p>
                    <p>Total Payments: {loanData.totalPayments}</p>
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
