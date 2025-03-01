pragma solidity ^0.8.0;

contract LoanRepayment {
    address public student;
    uint public loanAmount;
    uint public amountRepaid;
    uint public discountGiven;
    
    constructor(address _student, uint256 _loanAmount) {
        student = _student;
        loanAmount = _loanAmount;
        amountRepaid = 0;
        discountGiven = 0;
    }


    function repay(uint256 amount) public {
        require(msg.sender == student, "Only the applicant can repay");
        require(amountRepaid + amount <= loanAmount, "Cannot overpay");
        amountRepaid += amount;
    }

     function getRemainingAmount() public view returns (uint256) {
        return loanAmount - amountRepaid - discountGiven;
    }
}
