// server/routes/route.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


//routers auth
router.post('/signup', userController.signup);

router.post('/login', userController.login);


//router user crud
router.get('/user/:userId', userController.allowIfLoggedin, userController.getUser);

router.get('/users', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'), userController.getUsers);

router.put('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'profile'), userController.updateUser);

router.delete('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'profile'), userController.deleteUser);



//router Balances 
router.get('/basic', userController.basic);

router.get('/balances',  userController.allowIfLoggedin, userController.grantAccess('readOwn', 'balance')  ,userController.getBalance);

router.post('/balance', userController.allowIfLoggedin, userController.grantAccess('readOwn', 'balance'), userController.postBalance);

router.put('/balance/:balanceId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'profile'), userController.updateBalance);

router.delete('/balance/:balanceId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'profile'), userController.deleteBalance);


//test status api
router.get('/ping', userController.pingme);

//admin user role register
//router.post('/signupadmin', userController.grantAccess('readAny', 'profile'), userController.signupAdmin);
//router.post('/signupadmin', userController.grantAccess('readAny'), userController.signupAdmin);


module.exports = router;