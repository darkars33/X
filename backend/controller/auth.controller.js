const User= require('./../models/auth.model');
const bcrypt= require('bcryptjs');

const signUp = async (req, res) =>{
          try {
                    const {username, fullName, password, email} = req.body;
                    
                    const emailRex= /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

                    if(!emailRex.test(email)){
                              res.status(400).json({message: "Invalid email format"});
                    }

                    const exitingUser= User.findOne({username});
                    if(exitingUser){
                              res.status(400).json({message: "Username already exists"});
                    }

                    const exitingUserEmail= User.findOne({email});
                    if(exitingUserEmail){
                              res.status(400).json({message: "Email already exists"});
                    }

                    const salt= bcrypt.genSaltSync(10);
                    const hashedPassword= await bcrypt.hashSync(password, salt);

                    const newUser= new User({
                              username,
                              fullName,
                              email,
                              password: hashedPassword,
                    })

                    if(newUser){
                              await newUser.save();

                              res.status(201).json({
                                        id: newUser._id,
                                        username: newUser.username,
                                        fullName: newUser.fullName,
                                        email: newUser.email,
                                        password: newUser.password,
                                        followers: newUser.followers,
                                        following: newUser.following,
                                        profileImg: newUser.profileImg,
                                        coverImg: newUser.coverImg,
                              })
                    }else{
                              res.status(400).json({message: "Invalid data"});
                    }


          } catch (error) {
                    res.status(5000).json({message: error.message});
                    console.log(error.message);
          }
}

const logIn =  (req, res) =>{
          res.json({
                    message: 'Hello from server'
          })
}

const logOut =  (req, res) =>{
          res.json({
                    message: 'Hello from server'
          })
}

module.exports = {
          signUp,
          logIn,
          logOut
}