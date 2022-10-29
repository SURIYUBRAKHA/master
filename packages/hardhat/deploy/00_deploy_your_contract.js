// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";

// const sleep = (ms) =>
//   new Promise((r) =>
//     setTimeout(() => {
//       console.log(`waited for ${(ms / 1000).toFixed(3)} seconds`);
//       r();
//     }, ms)
//   );

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  const collectInterval = 60; // 1 minute, block.timestamp is in UNIX seconds

  /*
  // localhost
  const loogiesContractAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
  const loogieCoinContractAddress =
    "0x5c74c94173F05dA1720953407cbb920F3DF9f887";


  // kovan optimism
  const loogiesContractAddress = "0x43693eeC62666D621ba33095090BE60d4aF6D6FA";
  const loogieCoinContractAddress =
    "0x37a76CFB334b62C0eAf8808Dc9B5Ff82bB246827";
   */

  // optimism
  const loogiesContractAddress = "0xbE7706DFA9Cc5aEEB5b26698C1bc5c43829E808A";
  const loogieCoinContractAddress =
    "0x83eD2eE1e2744D27Ffd949314f4098f13535292F";

  console.log(
    `Attempting to deploy Game.sol to network number ${chainId} from ${deployer.address}`
  );

  const gameContract = await deploy("Game", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [collectInterval, loogiesContractAddress, loogieCoinContractAddress],
    log: true,
  });

  console.log(`Game contract deployed to ${gameContract.address}`);

  const GameContract = await ethers.getContract("Game", deployer);

  await GameContract.start();

  await GameContract.setDropOnCollect(true);

  await GameContract.transferOwnership(
    "0x5dCb5f4F39Caa6Ca25380cfc42280330b49d3c93"
  );

  try {
    await run("verify:verify", {
      address: gameContract.address,
      contract: "contracts/Game.sol:Game",
      constructorArguments: [
        collectInterval,
        loogiesContractAddress,
        loogieCoinContractAddress,
      ],
    });
  } catch (error) {
    console.error(error);
  }

  // Getting a previously deployed contract
  // const YourContract = await ethers.getContract("YourContract", deployer);
  /*  await YourContract.setPurpose("Hello");

    To take ownership of yourContract using the ownable library uncomment next line and add the
    address you want to be the owner.
    // await yourContract.transferOwnership(YOUR_ADDRESS_HERE);

    //const yourContract = await ethers.getContractAt('YourContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
  */

  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const yourContract = await deploy("YourContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */

  // Verify from the command line by running `yarn verify`

  // You can also Verify your contracts with Etherscan here...
  // You don't want to verify on localhost
  // try {
  //   if (chainId !== localChainId) {
  //     await run("verify:verify", {
  //       address: YourContract.address,
  //       contract: "contracts/YourContract.sol:YourContract",
  //       contractArguments: [],
  //     });
  //   }
  // } catch (error) {
  //   console.error(error);
  // }
};
module.exports.tags = ["YourContract"];
