'use strict';
require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const globalErrorHandler = require('./controllers/errorController');
const chainRoute = require('./routes/chainRoute');
const accountRoute = require('./routes/accountRoute');
// const propertyRoute = require('./routes/propertyRoute');
// const submitListingPropertyRoute = require('./routes/submitListingPropertyRoute');
// const propertyManagerRoute = require('./routes/propertyManagerRoute');
// const listingPropertyRoute = require('./routes/listingPropertyRoute');
const AppError = require('./utils/appError');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
const app = express();

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// blockchain
app.use('/api/chains', chainRoute);

// non-blockchain
app.use('/api/accounts', accountRoute);
// app.use('/api/properties', propertyRoute);
// app.use('/api/submitListingProperty', submitListingPropertyRoute);
// app.use('/api/propertyManagers', propertyManagerRoute);
// app.use('/api/listingProperty', listingPropertyRoute);

app.use('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;