const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth-middleware')
const adminMiddleware = require('../middleware/admin-middleware')
router.get('/welcome', authMiddleware, adminMiddleware, (req, res) => {
    const { userId, username, role } = req.userInfo;
    res.json({
        message: 'Welcome to admin page',
        admin: {
            _id: userId,
            username,
            role
        }
    })
})

module.exports = router;