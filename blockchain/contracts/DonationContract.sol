// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DonationTracker {
    // Struct to represent a donor
    struct Donor {
        uint256 totalDonated; // Total amount donated by the donor
        uint256 donationCount; // Number of donations made by the donor
    }

    // State variables
    mapping(address => Donor) private donors; // Mapping to track donor data
    address[] private donorList; // List of unique donor addresses
    uint256 public totalDonations; // Total donations received by the contract

    // Events
    event DonationReceived(address indexed donor, uint256 amount);
    event DonorAdded(address indexed donor);

    // Function to donate to the contract
    function donate(uint256 amount) public  {
        require(amount > 0, "Donation must be greater than zero");

        // Check if the donor is new
        if (donors[msg.sender].donationCount == 0) {
            donorList.push(msg.sender);
            emit DonorAdded(msg.sender);
        }

        // Update donor's data
        donors[msg.sender].totalDonated += amount;
        donors[msg.sender].donationCount += 1;

        // Update total donations
        totalDonations += amount;

        emit DonationReceived(msg.sender, amount);
    }

    // Function to get the total amount donated by a specific donor
    function getDonorInfo(address donor) external view returns (uint256 totalDonated, uint256 donationCount) {
        Donor memory donorData = donors[donor];
        return (donorData.totalDonated, donorData.donationCount);
    }

    // Function to get the list of all donors
    function getAllDonors() external view returns (address[] memory) {
        return donorList;
    }

   

}
