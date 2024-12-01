pragma solidity ^0.8.0;

contract Scholarchain {
    address public company;
    mapping(address => uint) public donations;
    mapping(address => uint) public loans;
    mapping(address => bool) public students;

    event DonationReceived(address indexed donor, uint amount);
    event LoanGranted(address indexed student, uint amount);

    constructor() {
        company = msg.sender; // Scholarchain (company) deploying the contract
    }

    // Function for NGOs to donate to Scholarchain
    function donate() public payable {
        require(msg.value > 0, "Donation must be greater than zero");
        donations[msg.sender] += msg.value;
        emit DonationReceived(msg.sender, msg.value);
    }

    // Function for students to apply for loans
    function applyForLoan(uint amount) public {
        require(students[msg.sender], "You must be a registered student");
        require(
            address(this).balance >= amount,
            "Insufficient funds in contract"
        );
        loans[msg.sender] += amount;
        payable(msg.sender).transfer(amount);
        emit LoanGranted(msg.sender, amount);
    }

    // Register a student for applying for loans
    function registerStudent(address student) public {
        require(
            msg.sender == company,
            "Only the company can register students"
        );
        students[student] = true;
    }

    // Function to view the contract's balance (for Scholarchain to track funds)
    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }
}
