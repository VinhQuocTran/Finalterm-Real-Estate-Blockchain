'use strict';
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');
const globalErrorHandler = require('./controllers/errorController');
const chainRoute = require('./routes/chainRoute');
const accountRoute = require('./routes/accountRoute');
const propertyRoute = require('./routes/propertyRoute');
const submitPropertyVerificationRoute = require('./routes/submitPropertyVerificationRoute');
const submitPropertyListingRoute = require('./routes/submitPropertyListingRoute');
const propertyManagerRoute = require('./routes/propertyManagerRoute');
const backgroundCheckServiceRoute = require('./routes/backgroundCheckServiceRoute');
const propertyInspectionServiceRoute = require('./routes/propertyInspectionServiceRoute');
const propertyValuationServiceRoute = require('./routes/propertyValuationServiceRoute');
const listingBackgroundCheckRoute = require('./routes/listingBackgroundCheckRoute');
const listingPropertyInspectionRoute = require('./routes/listingPropertyInspectionRoute');
const listingPropertyRoute = require('./routes/listingPropertyRoute');
const listingPropertyValuationRoute = require('./routes/listingPropertyValuationRoute');
const monthlyPropertyValuationRoute = require('./routes/monthlyPropertyValuationRoute');
const operatingReserveRoute = require('./routes/operatingReserveRoute');
const proposalRepairRoute = require('./routes/proposalRepairRoute');
const proposalVotingRoute = require('./routes/proposalVotingRoute');
const repairTransactionRoute = require('./routes/repairTransactionRoute');
const dailyReplenishTransactionRoute = require('./routes/dailyReplenishTransactionRoute');
const customRoute = require('./routes/customRoute');
const AppError = require('./utils/appError');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');

const {startMatchingOffersTask,startPaymentDailyRentTask,getMatchingOffers,getPaymentDailyRent} = require('./controllers/customController');
const app = express();

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(cors());

// set schedulers
// startMatchingOffersTask(getMatchingOffers);
// startPaymentDailyRentTask(getPaymentDailyRent);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// blockchain
app.use('/api/chains', chainRoute);
// non-blockchain
app.use('/api/accounts', accountRoute);
app.use('/api/properties', propertyRoute);
app.use('/api/submitPropertyVerifications', submitPropertyVerificationRoute);
app.use('/api/submitPropertyListings', submitPropertyListingRoute);
app.use('/api/propertyManagers', propertyManagerRoute);
app.use('/api/listingProperties', listingPropertyRoute);
app.use('/api/backgroundCheckServices', backgroundCheckServiceRoute);
app.use('/api/listingBackgroundChecks', listingBackgroundCheckRoute);
app.use('/api/propertyInspectionServices', propertyInspectionServiceRoute);
app.use('/api/listingPropertyInspections', listingPropertyInspectionRoute);
app.use('/api/propertyValuationServices', propertyValuationServiceRoute);
app.use('/api/listingPropertyValuations', listingPropertyValuationRoute);
app.use('/api/monthlyPropertyValuations', monthlyPropertyValuationRoute);
app.use('/api/opeatingReserves', operatingReserveRoute);
app.use('/api/proposalRepairs', proposalRepairRoute);
app.use('/api/proposalVotings', proposalVotingRoute);
app.use('/api/repairTransactions', repairTransactionRoute);
app.use('/api/dailyReplenishTransactions', dailyReplenishTransactionRoute);
// custom - related to multiple-table
app.use('/api/custom', customRoute);

app.use('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;