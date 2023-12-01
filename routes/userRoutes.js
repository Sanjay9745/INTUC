const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const userAuth = require('../middleware/userAuth');

router.get('/protected', userAuth, userController.protected);
router.get('/details', userAuth, userController.details);
router.get('/gallery', userController.getGallery);

router.post('/register', userController.register);
router.post('/login', userController.login);

//update
router.put('/update', userAuth, userController.update);

//delete

router.delete('/delete', userAuth, userController.deleteUser);

module.exports = router;