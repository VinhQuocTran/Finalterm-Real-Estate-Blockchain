const router = require('express').Router();
const accountController = require('../controllers/accountController');
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.get('/signout', authController.signout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
// router.use(authController.protect);

router.get('/me', accountController.getMe, accountController.getAccount);
router.patch('/updateMyPassword', authController.updatePassword);
router.patch('/updateMe', accountController.updateMe);
router.delete('/deleteMe', accountController.deleteMe);

// Restrict to Admin after this middleware
// router.use(authController.restrictTo('admin'));

router
    .route('/')
    .get(accountController.getAllAccounts)
    .post(accountController.createAccount);

router 
    .route('/:id')
    .get(accountController.getAccount)
    .patch(accountController.updateAccount)
    .delete(accountController.deleteAccount);

module.exports = router;