const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: [true, 'Username is already taken'],
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: [true, 'Email already exists'],
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })


module.exports = mongoose.model("User", UserSchema);