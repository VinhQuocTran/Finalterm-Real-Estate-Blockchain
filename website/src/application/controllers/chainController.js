const HyperLedgerService = require('../utils/hyperLedgerService/hyperLedgerService');

const fabricService = new HyperLedgerService();

const getChain = async (req, res) => {
    try {
        await fabricService.initialize();
        await fabricService.connect();
        // await fabricService.submitTransaction("createUser","user2",1000,0);
        let result = await fabricService.evaluateTransaction("queryUser","user2");

        res.status(200).json({
            status: 'success',
            data: result
        });        
    } catch (error) {
        console.error(`Failed to start the application: ${error}`);
    } finally {
        await fabricService.disconnect();
    }
}

module.exports = {
    getChain
};