const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/register', authController.register );

router.post('/login', authController.login );

router.get('/logout', authController.logout) ;

router.post('/incrementBody', authController.incrementBody);
router.post('/decrementBody', authController.decrementBody);

router.post('/incrementMind', authController.incrementMind);
router.post('/decrementMind', authController.decrementMind);

router.post('/incrementSpirit', authController.incrementSpirit);
router.post('/decrementSpirit', authController.decrementSpirit);

module.exports = router;