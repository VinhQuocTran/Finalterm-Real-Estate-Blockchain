'use strict';
const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../../../test-application/javascript/AppUtil.js');
const path = require("path");
const fs = require("fs");


class HyperledgerService {
    constructor() {
        const configPath = path.join(__dirname, 'config.json');
        const configFile = fs.readFileSync(configPath, 'utf-8');
        const config = JSON.parse(configFile);
        this.channelName = config.channelName;
        this.chaincodeName = config.chaincodeName;
        this.mspOrg1 = config.mspOrg1;
        this.walletPath = path.join(__dirname, config.walletPath);
        this.org1UserId = config.org1UserId;
        this.ccp = buildCCPOrg1();
        this.caClient = buildCAClient(FabricCAServices, this.ccp, config.caUrl);
    }
    async initialize() {
        try {
            // Setup the wallet to hold the credentials of the application user
            this.wallet = await buildWallet(Wallets, this.walletPath);

            // In a real application, this would be done on an administrative flow, and only once
            await enrollAdmin(this.caClient, this.wallet, this.mspOrg1);

            // In a real application, this would be done only when a new user was required to be added
            // and would be part of an administrative flow
            await registerAndEnrollUser(this.caClient, this.wallet, this.mspOrg1, this.org1UserId, 'org1.department1');

            // Create a new gateway instance for interacting with the fabric network.
            // In a real application, this would be done as the backend server session is set up for
            // a user that has been verified.
            this.gateway = new Gateway();
        } catch (error) {
            console.error(`Failed to initialize Hyperledger Fabric Service: ${error}`);
            throw error;
        }
    }

    async connect() {
        try {
            // Setup the gateway instance
            await this.gateway.connect(this.ccp, {
                wallet: this.wallet,
                identity: this.org1UserId,
                discovery: { enabled: true, asLocalhost: true }
            });
        } catch (error) {
            console.error(`Failed to connect to Hyperledger Fabric network: ${error}`);
            throw error;
        }
    }

    async disconnect() {
        try {
            // Disconnect from the gateway when the application is closing
            // This will close all connections to the network
            await this.gateway.disconnect();
        } catch (error) {
            console.error(`Failed to disconnect from Hyperledger Fabric network: ${error}`);
            throw error;
        }
    }

    async submitTransaction(transactionName, ...args) {
        try {
            // Build a network instance based on the channel where the smart contract is deployed
            const network = await this.gateway.getNetwork(this.channelName);

            // Get the contract from the network.
            const contract = network.getContract(this.chaincodeName);

            // Submit the specified transaction on the smart contract
            await contract.submitTransaction(transactionName, ...args);

            console.log(`Transaction ${transactionName} submitted successfully.`);
        } catch (error) {
            console.error(`Failed to submit transaction on Hyperledger Fabric network: ${error}`);
            throw error;
        }
    }

    async evaluateTransaction(transactionName, ...args) {
        try {
            // Build a network instance based on the channel where the smart contract is deployed
            const network = await this.gateway.getNetwork(this.channelName);

            // Get the contract from the network.
            const contract = network.getContract(this.chaincodeName);

            // Evaluate the specified transaction on the smart contract
            const result = await contract.evaluateTransaction(transactionName, ...args);

            return result.toString();
        } catch (error) {
            console.error(`Failed to evaluate transaction on Hyperledger Fabric network: ${error}`);
            throw error;
        }
    }
}

module.exports = HyperledgerService;
