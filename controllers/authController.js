const bcrypt = require('bcryptjs')
const User = require('../models/UserModel')
const jwt = require('jsonwebtoken')
//Register Controller
const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        //checking existing user
        const checkExistingUser = await User.findOne({ $or: [{ username }, { email }] })
        if (checkExistingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username already Exists with same email or username'
            })
        }

        //hash user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        //register user
        const registerNewUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user'
        })

        await registerNewUser.save();

        if (registerNewUser) {
            res.status(200).json({
                success: true,
                message: "Register Successfully"
            })
        } else {
            res.status(400).json({
                success: false,
                message: 'Failed to register. Please try again!!'
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message || 'Something Went Wrong. Please try again later'
        })
    }
}

//Login Controller
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        //find userexist or not
        const findUserExists = await User.findOne({ username: username });
        if (!findUserExists) {
            return res.status(500).json({
                success: false,
                message: "User with that username doesnot exist"
            })
        }

        //check if password is correct or not
        const isPasswordMatch = await bcrypt.compare(password, findUserExists.password)
        if (!isPasswordMatch) {
            return res.status(500).json({
                success: false,
                message: "Invalid Password!!"
            })
        }


        //create a user token
        const accessToken = jwt.sign({
            userId: findUserExists._id,
            username: findUserExists.username,
            role: findUserExists.role
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: '30m'
        })

        res.status(200).json({
            success: true,
            message: 'Logged in Successfully',
            accessToken
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message || 'Something went wrong please try again later'
        })
    }
}


const changePassword = async (req, res) => {
    try {
        const userId = req.userInfo.userId;

        //extract old and new password
        const { oldPassword, newPassword } = req.body;

        //find current logged in user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }


        //check if old password is correct
        const checkPassword = await bcrypt.compare(oldPassword, user.password);

        if (!checkPassword) {
            return res.status(404).json({
                success: false,
                message: "Old password doesnot match"
            })
        }

        //hash and store new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);


        user.password = hashedPassword;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password Changed Successfully"
        })


    } catch (error) {
        console.log(error.message);
        res.status(404).json({
            success: false,
            message: "Please try again failed to change password",
            error
        })
    }
}
//exporting
module.exports = {
    registerUser,
    loginUser,
    changePassword
}