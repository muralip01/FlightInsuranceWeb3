// SPDX-License-Identifier: GPL-3.0
//when deploying, use the desired insurance provider address in address _insuranceProvider (using account[0] in all the files)
pragma solidity >=0.7.0 <0.9.0;

contract FlightInsurance {
    uint256 public constant premium = 1000000000000000; //0.001 Ether
    uint256 public constant indemnity = 20000000000000000; //0.02 Ether

    struct Policy {
        address passengerAddress;
        string passengerName;
        string flightNumber;
        string flightDate;
        string departureCity;
        string destinationCity;
        string status;
    }

    address public insuranceProvider;
    mapping(address => Policy) public policies;
    address[] public policyAddresses;

    modifier onlyInsuranceProvider {
        require(msg.sender == insuranceProvider, "Only insurance provider can perform this action.");
        _;
    }

    constructor(address _insuranceProvider) {
        insuranceProvider = _insuranceProvider;
    }

    function viewPolicyDetails() public view returns (string memory)  {
        return "Premium: 0.001 Ether, Indemnity: 0.02 Ether, Coverage: Hail, Flood";
    }

    function purchasePolicy(
        string memory passengerName,
        string memory flightNumber,
        string memory flightDate,
        string memory departureCity,
        string memory destinationCity
    ) public payable {
        require(msg.value == premium, "Premium amount not correct.");
        require(policies[msg.sender].passengerAddress == address(0), "Policy already purchased.");

        policies[msg.sender] = Policy({
            passengerAddress: msg.sender,
            passengerName: passengerName,
            flightNumber: flightNumber,
            flightDate: flightDate,
            departureCity: departureCity,
            destinationCity: destinationCity,
            status: "purchased"
        });

        policyAddresses.push(msg.sender);
        payable(insuranceProvider).transfer(premium);
    }

    function viewPurchasedPolicy(address passengerAddress) public view returns (Policy memory) {
        return policies[passengerAddress];
    }

    function viewAllPolicies() public view onlyInsuranceProvider returns (Policy[] memory) {
        Policy[] memory allPolicies = new Policy[](policyAddresses.length);
        for (uint256 i = 0; i < policyAddresses.length; i++) {
            allPolicies[i] = policies[policyAddresses[i]];
        }
        return allPolicies;
    }

    function viewBalance() public view returns (uint256) {
        return address(msg.sender).balance;
    }
    
}