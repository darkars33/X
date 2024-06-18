const User = require('./../models/auth.model');

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
                              res.status(200).json({message: "user followed successfully"});
                    }

          } catch (error) {
                    res.status(500).json({msg: error.message});
                    console.log(error.message);
          }
}

module.exports= {
          getUserProfile,
          followUnfollowUser
}