(async () => {
    try {
        console.log('Running deployFlightInsurance script...')

        const insuranceProviderAddress = '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4'; //from the deploy tab in remix, first account
        const constructorArgs = [insuranceProviderAddress]
        const artifactsPath = `browser/contracts/artifacts/FlightInsurance.json`

        const metadata = JSON.parse(await remix.call('fileManager', 'getFile', artifactsPath))
        const accounts = await web3.eth.getAccounts()

        let contract = new web3.eth.Contract(metadata.abi)

        contract = contract.deploy({
            data: metadata.data.bytecode.object,
            arguments: constructorArgs
        })

        const newContractInstance = await contract.send({
            from: accounts[0],
            gas: 1500000, 
            gasPrice: '30000000000'
        })
        console.log('Contract deployed at address: ', newContractInstance.options.address) //use this address in access
    } catch (e) {
        console.log(e.message)
    }
})()