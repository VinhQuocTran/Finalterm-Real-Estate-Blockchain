const router = require('express').Router();
const accountController = require('../controllers/accountController');

router.post('/', accountController.createAccount);

module.exports = router;