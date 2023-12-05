const HyperLedgerService = require('../utils/hyperLedgerService/hyperLedgerService');

const fabricService = new HyperLedgerService();

const getChain = async (req, res) => {
    try {
        await fabricService.initialize();
        await fabricService.connect();
        // await fabricService.submitTransaction("initLedger");
        // await fabricService.submitTransaction("createUser","test",200,5111)
        // await fabricService.submitTransaction("createToken","token99","property10",500,888)
        // let result = await fabricService.evaluateTransaction("getAllByEntity","offer");
        let result = await fabricService.evaluateTransaction("TestQuerySelector");
        await fabricService.disconnect();
        res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error
        });
        console.error(`Failed to start the application: ${error}`);
    } finally {
        await fabricService.disconnect();
    }
}

module.exports = {
    getChain
};