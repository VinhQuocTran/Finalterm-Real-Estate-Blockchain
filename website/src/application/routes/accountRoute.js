const router = require('express').Router();
const accountController = require('../controllers/accountController');

router.post('/', accountController.createAccount);
router.get('/', accountController.getAllAccounts);

module.exports = router;