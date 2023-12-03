'use strict';
require('dotenv').config();
const sequelize = require('./utils/database');
const app = require('./app');

const hostname = process.env.HOSTNAME;
const port = process.env.PORT || 3000;

sequelize
    .sync()
    .then(() => console.log('All models were synchronized successfully'))
    .catch((err) => console.log('Error occur during synchronization', err));

app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}`)
});