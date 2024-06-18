const User = require('./../models/auth.model');
const jwt= require('jsonwebtoken');

const protectRoute= async (req, res, next) =>{
          try {
                    const token= req.cookies.jwt;
                    if(!token){
                              return res.status(401).json({message: "You need to login first"});
                    }

                    const decode= jwt.verify(token, process.env.JWT_SECRET);
                    if(!decode){
                              return res.status(401).json({message: "Invalid token"});
                    }

                    const user= await User.findById(decode.userId).select('-password');

                    if(!user){
                              return res.status(404).json({message: "user not found"});
                    }

                    req.user= user;
                    next();

          } catch (error) {
                    res.status(500).json({message: error.message});
                    console.log(error.message);
          }
}

module.exports= protectRoute;