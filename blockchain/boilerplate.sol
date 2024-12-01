pragma solidity ^0.8.0;

contract LoanRepayment {
    address public company; // Scholarchain (the company)
    address public student;
    uint public loanAmount;
    uint public totalPayments;
    uint public paymentSize;
    uint public paymentsMade;
    uint public amountPaid;

    bool public loanPaidOff;

    event LoanCreated(
        address indexed student,
        uint loanAmount,
        uint totalPayments,
        uint paymentSize
    );
    event PaymentMade(address indexed student, uint amountPaid);
    event LoanPaidOff(address indexed student, uint totalAmountPaid);

    constructor() {
        company = msg.sender;
    }

    // Function to initialize loan details (called by Scholarchain)
    function createLoan(
        address _student,
        uint _loanAmount,
        uint _totalPayments,
        uint _paymentSize
    ) public {
        require(msg.sender == company, "Only company can create loans");
        require(
            _totalPayments > 0 && _paymentSize > 0,
            "Invalid payment details"
        );

        student = _student;
        loanAmount = _loanAmount;
        totalPayments = _totalPayments;
        paymentSize = _paymentSize;
        paymentsMade = 0;
        amountPaid = 0;
        loanPaidOff = false;

        emit LoanCreated(student, loanAmount, totalPayments, paymentSize);
    }

    // Function for student to make a payment
    function makePayment() public payable {
        require(msg.sender == student, "Only the student can make payments");
        require(!loanPaidOff, "Loan is already paid off");
        require(msg.value == paymentSize, "Payment size is incorrect");

        amountPaid += msg.value;
        paymentsMade += 1;

        emit PaymentMade(student, msg.value);

        // Check if loan is paid off
        if (amountPaid >= loanAmount) {
            loanPaidOff = true;
            emit LoanPaidOff(student, amountPaid);
        }
    }

    // Function to view loan details
    function getLoanDetails()
        public
        view
        returns (uint, uint, uint, uint, uint, bool)
    {
        return (
            loanAmount,
            totalPayments,
            paymentSize,
            paymentsMade,
            amountPaid,
            loanPaidOff
        );
    }
}
