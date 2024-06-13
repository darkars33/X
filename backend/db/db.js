const mongoose = require('mongoose');

const connectDB = async () =>{
          try {
                    mongoose.connect(process.env.MONGODB_URL).then(() => console.log('DB connected'));
          } catch (error) {
                    console.log(error.message);
          }
}

module.exports = connectDB;