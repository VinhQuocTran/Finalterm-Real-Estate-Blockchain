const router = require('express').Router();
const chainController = require('../controllers/chainController');

router.get('/', chainController.getChain);
router.get('/user', chainController.getAllUsers);
// router.post('/user', chainController.createUser);
// router.get('/user/${id}', chainController.findUserById);
router.get('/offer', chainController.getAllOffers);

module.exports = router;