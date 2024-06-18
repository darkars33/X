const express = require('express');
const authRoutes= require('./routes/auth.route');
const userRoutes= require('./routes/user.route');
const dotenv= require('dotenv');
const db = require('./db/db');
const cookieParser = require('cookie-parser');


const app= express();
const PORT= 3000;
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.get('/', (req, res)=>{
          res.send('hello form server');
})

app.listen(PORT, () => {
          db();
          console.log(`server is running on port ${PORT}`)
});