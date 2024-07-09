const express = require('express');
const dotenv= require('dotenv');
const db = require('./db/db');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');

const authRoutes= require('./routes/auth.route');
const userRoutes= require('./routes/user.route');
const postRoutes= require('./routes/post.route');
const notificationRoutes= require('./routes/notification.route');

const app= express();
const PORT= 3000;
dotenv.config();
cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET
})

app.use(cors({
          origin: '*',
          credentials: true,
}))
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/notification', notificationRoutes);

app.get('/', (req, res)=>{
          res.send('hello form server');
})

app.listen(PORT, () => {
          db();
          console.log(`server is running on port ${PORT}`)
});