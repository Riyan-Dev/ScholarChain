// SPDX-License-Identifier: MIT

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

contract Create2Factory {

    event Deploy(address addr);

    // to deploy another contract using owner address and salt specified

    function deploy(uint256 _loanAmount, uint _salt) external {
        LoanRepayment _contract = new LoanRepayment{

            salt: bytes32(_salt)

        }(msg.sender, _loanAmount);

        emit Deploy(address(_contract));

    }

    // get the computed address before the contract DeployWithCreate2 deployed using Bytecode of contract DeployWithCreate2 and salt specified by the sender

    function getAddress(bytes memory bytecode, uint _salt) public view returns (address) {

        bytes32 hash = keccak256(

            abi.encodePacked(

                bytes1(0xff), address(this), _salt, keccak256(bytecode)

          )

        );

        return address (uint160(uint(hash)));

    }

    // get the ByteCode of the contract DeployWithCreate2

    function getBytecode(address _student, uint _loanAmount) public pure returns (bytes memory) {

        bytes memory bytecode = type(LoanRepayment).creationCode;

        return abi.encodePacked(bytecode, abi.encode(_student, _loanAmount));

    }

}