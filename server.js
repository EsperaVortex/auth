require('dotenv').config();

const express = require('express');
const connectToDB = require('./db/db');
const app = express();
const PORT = process.env.PORT;

const authRoutes = require('./routes/auth-routes')
const homeRoutes = require('./routes/home-routes')
const adminRoutes = require('./routes/admin-routes')
const uploadImageRoutes = require('./routes/image-routes')
const videoRoutes = require('./routes/video-routes')
//Connecting to database
connectToDB();

app.use(express.json());

//routes for login and registration
app.use('/api/auth', authRoutes)

//home routes
app.use('/api/home', homeRoutes)

//admin routes
app.use('/api/admin', adminRoutes)

//image routes
app.use('/api/image', uploadImageRoutes)

//video routes
app.use('/api/video', videoRoutes)
app.listen(PORT, () => {
    console.log("Server Running at PORT : " + PORT)
})
