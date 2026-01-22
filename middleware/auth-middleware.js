const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization']

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access Denied. No Token Provided.'
        })
    }

    //decode
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decodedToken)

        req.userInfo = decodedToken;
        next();

    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Access Denied. No Token Provided.'
        })
    }
}

module.exports = authMiddleware