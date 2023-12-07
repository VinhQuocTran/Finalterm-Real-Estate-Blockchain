/* Swagger configuration */
const options = {
    openapi: 'OpenAPI 3',   // Enable/Disable OpenAPI. By default is null
    language: 'en-US',      // Change response language. By default is 'en-US'
    disableLogs: false,     // Enable/Disable logs. By default is false
    autoHeaders: false,     // Enable/Disable automatic headers capture. By default is true
    autoQuery: false,       // Enable/Disable automatic query capture. By default is true
    autoBody: false         // Enable/Disable automatic body capture. By default is true
}

const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        version: '2.0.0',
        title: 'RealEstate Apis',
        description: 'API for Managing queue calls',
        contact: {
            name: 'API Support',
            email: 'vanthao000009@gmail.com'
        },
    },
    basePath: '/',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            name: 'Queue CRUD',
            description: 'Queue related APIs',
        },
        {
            name: 'Health',
            description: 'Health Check'
        }
    ],
    securityDefinitions: {},               // Security definitions for the API (default: {})
};


const outputFile = './docs/swagger.json';
const endpointsFiles = ['./app.js', './controllers/*.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
