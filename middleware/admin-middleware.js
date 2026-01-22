

const isAdminUser = (req, res, next) => {
    if (req.userInfo.role !== 'admin') {
        return res.status(500).json({
            success: false,
            messsage: 'Access Denied! Only Admin allowed'
        })
    }

    next();
}

module.exports = isAdminUser