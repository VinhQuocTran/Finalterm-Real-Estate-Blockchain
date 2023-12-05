'use strict';

const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const expect = chai.expect;

const { Context } = require('fabric-contract-api');
const { ChaincodeStub } = require('fabric-shim');

const RealEstateTransfer = require('../lib/realEstateTransfer');
const {c} = require("sinon/lib/sinon/spy-formatters");

describe('RealEstateTransfer Smart Contract', () => {
    let contract;
    let ctx;
    let chaincodeStub;
    beforeEach(() => {
        ctx = new Context();
        contract = new RealEstateTransfer();
        chaincodeStub = sinon.createStubInstance(ChaincodeStub);
        ctx.setChaincodeStub(chaincodeStub);

        chaincodeStub.putState.callsFake((key, value) => {
            if (!chaincodeStub.states) {
                chaincodeStub.states = {};
            }
            chaincodeStub.states[key] = value;
        });

        chaincodeStub.getState.callsFake(async (key) => {
            let ret;
            if (chaincodeStub.states) {
                ret = chaincodeStub.states[key];
            }
            return Promise.resolve(ret);
        });

        chaincodeStub.deleteState.callsFake(async (key) => {
            if (chaincodeStub.states) {
                delete chaincodeStub.states[key];
            }
            return Promise.resolve(key);
        });

        chaincodeStub.getStateByRange.callsFake(async () => {
            function* internalGetStateByRange() {
                if (chaincodeStub.states) {
                    // Shallow copy
                    const copied = Object.assign({}, chaincodeStub.states);

                    for (let key in copied) {
                        yield {value: copied[key]};
                    }
                }
            }

            return Promise.resolve(internalGetStateByRange());
        });

    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            await contract.createUser(ctx, 'user4', 1000, 0);
            const user = await contract.queryUser(ctx, 'user4');
            expect(user.id).to.equal('user4');
            expect(user.cash_balance).to.equal(1000);
            expect(user.token_balance).to.equal(0);
        });
    });

    describe('initLedger', () => {
        it('should initialize the ledger with sample data', async () => {
            await contract.initLedger(ctx);

            // Add assertions to check the state after initialization

            // Example assertion (modify according to your data structure)
            const user1 = await contract.queryUser(ctx, 'user1');
            expect(user1.cash_balance).to.equal(1000000);
            expect(user1.token_balance).to.equal(500 * 50);
            // const allUsers = await contract.getAllByEntity(ctx,'offer');
            // const all = await contract.getAllByEntity(ctx,'user');
            // const all = await contract.TestQuerySelector(ctx);


            await contract.matchingOffers(ctx);
            const allTrans = await contract.getAllByEntity(ctx,"tokenTransaction")

            // console.log(allUsers)
            console.log(allTrans)
            const allOffers = await contract.getAllByEntity(ctx,'offer');
            console.log(allOffers)
            const allUsers = await contract.getAllByEntity(ctx,'user');
            console.log(allUsers)

            // Similar assertions for other sample data

            // // Example assertion for checking the number of records
            // await contract.createUser(ctx, 'user4', 1000, 0);
            // const allUsers = await contract.GetAllUsers(ctx);
            // console.log(allUsers)
            // expect(allUsers).to.have.lengthOf(3);  // Assuming you have 3 sample users
        });
    });

});
