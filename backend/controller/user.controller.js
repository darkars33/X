const bcrypt = require('bcryptjs/dist/bcrypt');
const User = require('./../models/auth.model');
const Notification = require('./../models/notification.model');
const cloudinary = require('cloudinary').v2;

const getUserProfile = async (req, res) => {
          const {username}= req.params;

          try {
                    const user= await User.findOne({username}).select('-password');
                    if(!user) return res.status(400).json({msg: "User not found"});
                    res.status(200).json({
                              username: user.username,
                              fullName: user.fullName,
                              email: user.email,
                    });
          } catch (error) {
                    res.status(500).json({msg: error.message});
                    console.log(error.message);
          }
}

const followUnfollowUser = async (req, res) =>{
          try {
                    const {id} = req.params;
                    const userToModify = await User.findById(id);
                    const currentUser= await User.findById(req.user.id);

                    if(id === req.user.id) return res.status(400).json({msg: "You can't follow yourself"});

                    if (!userToModify || !currentUser) return res.status(400).json({msg: "User not found"});

                    const isFollowing= currentUser.followings.includes(id);

                    if(isFollowing){
                              await User.findByIdAndUpdate(id, ({$pull: {followers: req.user.id}}))
                              await User.findByIdAndUpdate(req.user.id, ({$pull: {followings: id}}));
                              res.status(200).json({message: "user unFollowed successfully"});
                    }else{
                              await User.findByIdAndUpdate(id, ({$push: {followers: req.user.id}}));
                              await User.findByIdAndUpdate(req.user.id, {$push: {followings: id}});

                              const notification = new Notification({
                                        type: 'follow',
                                        from: req.user.id,
                                        to: userToModify._id
                              })

                              await notification.save();

                              res.status(200).json({message: "user followed successfully"});
                    }

          } catch (error) {
                    res.status(500).json({msg: error.message});
                    console.log(error.message);
          }
}

const getSuggestedUsers= async (req, res) =>{
          try {
                    const userId= req.user._id;
                    const userFollowedByMe = await User.findById(userId).select('followings');

                    const users= await User.aggregate([
                              {
                                        $match:{
                                                  _id: {$ne: userId}
                                        },
                              },
                              {$sample: {size: 10}},
                    ]);

                    const filteredUsers= users.filter((user) => !userFollowedByMe.followings.includes(user._id));
                    const suggestedUsers= filteredUsers.slice(0,4);

                    suggestedUsers.forEach((user) => (user.password = null));

                    res.status(200).json(suggestedUsers);

          } catch (error) {
                    res.status(500).json({message: error.message});
                    console.log(error.message);
          }
}

const updateUser= async (req, res) =>{
          const {fullName, email, username, currentPassword, newPassword, bio, link} = req.body;
          let {profileImg, coverImg} = req.body;

          const userId = req.user._id;

          try {
                    let user= await User.findById(userId);
                    if(!user) return res.status(400).json({message: "user not found"});

                    if((!newPassword && currentPassword) || (newPassword && currentPassword)){
                              return res.status(500).json({message: "Please provide both current and new password"});
                    }

                    if(currentPassword && newPassword){
                              const isMatch= await bcrypt.compare(currentPassword, user.password);
                              if(!isMatch) return res.status(400).json({message: "current password is incorrect!"});

                              if(newPassword.length < 6){
                                        return res.status(400).json({message: "new Password must be greater than 6"});
                              }

                              const salt= bcrypt.genSalt(10);
                              user.password = await bcrypt.hash(newPassword, salt);
                    }

                    if(profileImg){
                              if(user.profileImg){
                                        await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
                              }
                              const uploadedResponse= await cloudinary.uploader(profileImg);
                              profileImg= uploadedResponse.secure_url;
                    }

                    if(coverImg){
                              if(user.coverImg){
                                        await cloudinary.uploader.destroy(user.coverImg.split("/".pop().split(".")[0]));
                              }
                              const uploadedResponse= await cloudinary.uploader(coverImg);
                              coverImg= uploadedResponse.secure_url;
                    }

                    user.fullName = fullName || user.fullName;
                    user.username= username || user.username;
                    user.email= email || user.email;
                    user.bio= bio || user.bio;
                    user.link= link || user.link;
                    user.profileImg= profileImg || user.profileImg;
                    user.coverImg= coverImg || user.coverImg;

                    user= await user.save();

                    user.password=null;

                    res.status(500).json(user);

          } catch (error) {
                    res.status(500).json({message: error.message});
                    console.log(error.message);
          }
}

module.exports= {
          getUserProfile,
          followUnfollowUser,
          getSuggestedUsers,
          updateUser
}