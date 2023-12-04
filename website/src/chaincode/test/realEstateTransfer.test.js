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

    describe('processRequestsLoop', () => {
        it('Auction', async () => {
            await contract.initLedger(ctx);
            await contract.processRequestsLoop(ctx);
            const user = await contract.queryTokenTransaction(ctx, 'transaction1');
            expect(user.id).to.equal('transaction1');
        });
    });
    // processRequestsLoop
});
