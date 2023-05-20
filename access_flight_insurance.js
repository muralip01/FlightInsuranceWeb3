(async () => {
    const contractAddress = '0xd9145CCE52D386f254917e481eB44e9943F39138'; //use the address gotten after deploy
    const artifactsPath = `browser/contracts/artifacts/FlightInsurance.json`
    const metadata = JSON.parse(await remix.call('fileManager', 'getFile', artifactsPath))
    const accounts = await web3.eth.getAccounts()
    const flightInsurance = new web3.eth.Contract(metadata.abi, contractAddress)

    const insuranceProvider = accounts[0] 
    const passenger = accounts[1] //from the accounts in remix deploy tab, switch this to change passenger
    
    //using the deploy tab with the specific address will allow you to call each function, 
    //and for insurance provider using the tab will allow you to view all contracts
    
    //view available policy
    const policyDetails = await flightInsurance.methods.viewPolicyDetails().call({ from: passenger })
    console.log('Policy Details:', policyDetails)

    //purchase policy, default value is given, but using deploy tab in remix, 
    //you can give specific values to desired passenger
    //when buying, you must give VALUE = 1000000 Gwei in the deploy tab (which is 0.001 eth)
    const purchaseTx = await flightInsurance.methods
        .purchasePolicy('murals', 'flight123', '2023-04-20', 'DesMoines', 'Toronto')
        .send({ from: passenger, value: web3.utils.toWei('0.001', 'ether'), gas: 300000 })
    console.log('Purchase Policy Transaction:', purchaseTx)

    //view purchased policy
    const purchasedPolicy = await flightInsurance.methods.viewPurchasedPolicy(passenger).call({ from: passenger })
    console.log('Purchased Policy:', purchasedPolicy)

    //view passenger's balance after viewing purchased policy
    const passengerBalance = await flightInsurance.methods.viewBalance().call({ from: passenger });
    const passengerBalanceInEther = web3.utils.fromWei(passengerBalance, 'ether');
    console.log("Passenger's Balance:", passengerBalanceInEther, 'Ether');

    //view all policies (as insurance provider)
    const allPolicies = await flightInsurance.methods.viewAllPolicies().call({ from: insuranceProvider })
    console.log('All Policies:', allPolicies)

})()