const mongoose = require('mongoose')

const url = process.env.MONGO_URI
const connectToDB = async () => {
    try {
        await mongoose.connect(url)
        console.log("Database Connected Successfully")
    } catch (err) {
        console.log("Failed to Connect database.Error: " + err)
        process.exit(1)
    }
}

module.exports = connectToDB