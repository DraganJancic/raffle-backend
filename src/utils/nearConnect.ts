const path = require("path");
const homedir = require("os").homedir();

import * as nearAPI from "near-api-js";

const { connect, utils, keyStores } = nearAPI

const CREDENTIALS_DIR = ".near-credentials";
const credentialsPath = path.join(homedir, CREDENTIALS_DIR);

const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);


export async function makeConnectionToNearTestnet() {
  const connectionConfig = {
    headers: {},
    networkId: "testnet",
    keyStore: keyStore, // first create a key store
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
  };
  const nearConnection = await connect(connectionConfig);
  return nearConnection
}

export async function getAllRaffles() {
  const near = await makeConnectionToNearTestnet();
  const accountId = process.env.ACCOUNT_ID;

  const account = new nearAPI.Account(near.connection, accountId);
  const contractId = process.env.RAFFLE_CONTRACT_ID;

  const contract = new nearAPI.Contract(account, contractId, {
    viewMethods: ['get_all_raffles'], // Read-only methods
    changeMethods: [], // Methods that change state
  });

  const raffles = await (contract as any).get_all_raffles();
  return raffles
}


export async function getSingleRaffleFromBlockchain(raffle_id: string) {
  const near = await makeConnectionToNearTestnet();
  const accountId = 'jancicd.testnet'; // stavi u env variable

  const account = new nearAPI.Account(near.connection, accountId);
  const contractId = 'raffle-nft4.testnet'; // stavi u env variable

  const contract = new nearAPI.Contract(account, contractId, {
    viewMethods: ['get_single_raffle'], // Read-only methods
    changeMethods: [], // Methods that change state
  });

  const raffle = await (contract as any).get_single_raffle({ raffle_id });
  return raffle
}

export async function makeConnectionToNear(nodeURL: string = 'https://rpc.mainnet.near.org') {
  const connectionConfig = {
    headers: {},
    networkId: "mainnet",
    keyStore: keyStore, // first create a key store
    nodeUrl: nodeURL,
    walletUrl: "https://wallet.mainnet.near.org",
    helperUrl: "https://helper.mainnet.near.org",
    explorerUrl: "https://explorer.mainnet.near.org",
  };
  const nearConnection = await connect(connectionConfig);
  return nearConnection
}


