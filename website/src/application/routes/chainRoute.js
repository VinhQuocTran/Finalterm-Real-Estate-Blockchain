const router = require('express').Router();
const chainController = require('../controllers/chainController');

router.get('/', chainController.getChain);

module.exports = router;