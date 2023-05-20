const Web3 = require('web3');
const fs = require('fs');

const web3 = new Web3('http://localhost:8545');
const contractAddress = '0xD4Fc541236927E2EAf8F27606bD7309C1Fc2cbee'; //replace with contract address from deploying

const contractAbi = JSON.parse(fs.readFileSync('contractABI.json', 'utf-8')); //saved ABI from compiling sol to this json
const contract = new web3.eth.Contract(contractAbi, contractAddress);

//should read and based on weather.txt and policy bought using the fields in access,
//should pay out indemnities
//this is run locally with the weather.txt and contractABI.json in the same directory,
//web3 and fs packages should be installed

async function getWeatherData() {
  const weatherData = await fs.promises.readFile('weather.txt', 'utf-8');
  const weatherLines = weatherData.trim().split('\n');
  const weatherInfo = {};

  weatherLines.slice(1).forEach((line) => {
    const [date, city, weather] = line.split(' ');
    weatherInfo[`${date}_${city}`] = weather;
  });

  return weatherInfo;
}

async function verifyPolicy(policy) {
  const weatherInfo = await getWeatherData();
  const key = `${policy.flightDate}_${policy.departureCity}`;

  if (weatherInfo[key] === 'Hail' || weatherInfo[key] === 'Flood') {
    return true;
  }
  return false;
}

async function payIndemnity(passengerAddress) {
  const accounts = await web3.eth.getAccounts();
  const insuranceProvider = accounts[0];
  const indemnity = 20000000000000000; //0.02 Ether

  await web3.eth.sendTransaction({
    from: insuranceProvider,
    to: passengerAddress,
    value: indemnity,
  });

  console.log(`Sent indemnity (${indemnity} Wei) to ${passengerAddress}`);
}

(async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    const insuranceProvider = accounts[0];

    //get all policies
    const allPolicies = await contract.methods.viewAllPolicies().call({ from: insuranceProvider });

    //verify and pay indemnity for each policy
    for (const policy of allPolicies) {
      if (await verifyPolicy(policy)) {
        await payIndemnity(policy.passengerAddress);
      }
    }
  } catch (e) {
    console.error(e.message);
  }
})();