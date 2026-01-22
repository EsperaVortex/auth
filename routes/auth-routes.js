const express = require('express');
const { registerUser, loginUser, changePassword } = require('../controllers/authController');
const router = express.Router();
const authMiddleware = require('../middleware/auth-middleware')
//route for authentication and authorization
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/changePassword', authMiddleware, changePassword)
//export router always
module.exports = router