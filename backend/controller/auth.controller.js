const User= require('./../models/auth.model');
const bcrypt= require('bcryptjs');
const generateTokenAndSetCookie= require('./../lib/utils/generateToken');

const signUp = async (req, res) =>{
          try {
                    const {username, fullName, password, email} = req.body;
                    
                    const emailRex= /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

                    if(!emailRex.test(email)){
                              res.status(400).json({message: "Invalid email format"});
                    }

                    const exitingUser= await User.findOne({username});
                    if(exitingUser){
                              res.status(400).json({message: "Username already exists"});
                    }

                    const exitingUserEmail= await User.findOne({email});
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
                              generateTokenAndSetCookie(newUser._id, res);
                              await newUser.save();

                              res.status(201).json({
                                        id: newUser._id,
                                        username: newUser.username,
                                        fullName: newUser.fullName,
                                        email: newUser.email,
                                        password: newUser.password,
                                        followers: newUser.followers,
                                        following: newUser.followings,
                                        profileImg: newUser.profileImg,
                                        coverImg: newUser.coverImg,
                              })
                    }else{
                              res.status(400).json({message: "Invalid data"});
                    }


          } catch (error) {
                    res.status(500).json({message: error.message});
                    console.log(error.message);
          }
}

const logIn = async(req, res) =>{
          try {
                 const {username, password} = req.body;
                 
                 const user= await User.findOne({username});
                 const isPasswordCorrect= await bcrypt.compare(password, user?.password || '');

                 if(!user || !isPasswordCorrect){
                    res.status(400).json({message: "Invalid username or password"});
                 }

                 generateTokenAndSetCookie(user._id, res);

                 res.status(200).json({
                    id: user._id,
                    username: user.username,
                    fullName: user.fullName,
                    email: user.email,
                    password: user.password,
                    followers: user.followers,
                    following: user.followings,
                    profileImg: user.profileImg,
                    coverImg: user.coverImg,
                 })


          } catch (error) {
                    res.status(500).json({message: error.message});
                    console.log(error.message);
          }
}

const logOut =  (req, res) =>{
          try {
                   res.cookie('jwt', '', {maxAge:0}) 
                   res.status(200).json({message: "Logged out successfully"});
          } catch (error) {
                    res.status(500).json({message: error.message});
                    console.log(error.message);
          }
}

const getMe= async(req, res) =>{
          try {
                    const user= await User.findById(req.user._id).select('-password');
                    res.status(200).json(user);
          } catch (error) {
                    res.status(500).json({message: error.message});
                    console.log(error.message);
          }
}

module.exports = {
          signUp,
          logIn,
          logOut,
          getMe
}