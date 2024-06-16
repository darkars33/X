const express = require('express');
const authRoutes= require('./routes/auth.route');
const dotenv= require('dotenv');
const db = require('./db/db');
dotenv.config();

const app= express();
const PORT= 3000;

app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res)=>{
          res.send('hello form server');
})

app.listen(PORT, () => {
          db();
          console.log(`server is running on port ${PORT}`)
});