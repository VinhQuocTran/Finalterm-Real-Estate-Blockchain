'use strict';
const HyperLedgerService = require('./hyperLedgerService');

function prettyJSONString(inputString) {
    return JSON.stringify(JSON.parse(inputString), null, 2);
}
const http = require('http');

const hostname = 'localhost';
const port = 3000;
const fabricService = new HyperLedgerService();
const server = http.createServer(async (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    try {
        await fabricService.initialize();
        await fabricService.connect();
        // await fabricService.submitTransaction("createUser","user2",1000,0);
        let result = await fabricService.evaluateTransaction("queryUser","user2");
        console.log(prettyJSONString(result));
        res.write(prettyJSONString(result));
    } catch (error) {
        console.error(`Failed to start the application: ${error}`);
    } finally {
        await fabricService.disconnect();
    }

    res.end('Hello, World!');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});