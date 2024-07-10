const User = require("../models/auth.model");
const Notification = require("../models/notification.model");
const cloudinary = require('cloudinary').v2;
const Post = require('../models/post.model');


const createPost= async (req, res) =>{
          try {
                    const {text} = req.body;
                    let {img} = req.body;
                    const userId = req.user._id;

                    const user= await User.findById(userId);

                    if(!user) return res.status(400).json({message: 'User not found'});

                    if(!text && !img) return res.status(400).json({message: "Post must have text and img"});

                    if(img){
                              const uploadResponse = await cloudinary.uploader.upload(img);
                              img= uploadResponse.secure_url;
                    }

                    const newPost = new Post({
                              user:userId,
                              text,
                              img
                    })

                    await newPost.save();

                    res.status(201).json(newPost);


          } catch (error) {
                    res.status(500).json({message: error.message});
                    console.log(error.message);
          }
}

const deletePost= async (req, res) =>{
          try {
                    const post= await Post.findById(req.params.id);
                    if(!post){
                              return res.status(400).json({message: "post not founded"});
                    }

                    if(post.user.toString() !== req.user._id.toString()){
                              return res.status(400).json({message: "You can not delete this post"});
                    }

                    if(post.img){
                              const img= post.img.split('/').pop().split('.')[0];
                              await cloudinary.uploader.destroy(img);
                    }

                    await Post.findByIdAndDelete(req.params.id);

                    res.status(200).json({message: "Post deleted successfully"});

          } catch (error) {
                    res.status(500).json({message: error.message});
                    console.log(error.message);
          }
}

const commentOnPost= async (req, res) =>{
          try {
                    const {text} = req.body;
                    const userId = req.user._id;
                    const postId = req.params.id;
          
                    if(!text) return res.status(400).json({message: "Comment must have text"});
          
                    const post = await Post.findById(postId);
          
                    if(!post) return res.status(400).json({message: "Post not found"});
          
                    const comment = {
                              user: userId,
                              text
                    }
          
                    post.comments.push(comment);
          
                    await post.save();
          
                    res.status(200).json(post); 
          } catch (error) {
                    res.status(500).json({message: error.message});
                    console.log(error.message);
          }

}

const likeOrUnlikePost= async (req, res) =>{
          try {
                   const userId= req.user._id;
                   const postId= req.params.id;
                   
                   const post = await Post.findById(postId);
                   if(!post) return res.status(400).json({message: "post not Found"});

                   const isLiked = post.likes.includes(userId);

                   if(isLiked){
                            await Post.updateOne({_id: postId}, {$pull: {likes: userId}});
                            await User.updateOne({_id: userId}, {$pull: {likedPosts: postId}});
                            const updateLikes= await post.likes.filter((id) => id.toString() !== userId.toString());
                            res.status(200).json(updateLikes);
                   }else{
                              post.likes.push(userId);
                              await post.save();
                              await User.updateOne({_id: userId}, {$push: {likedPosts: postId}});
                              const notification = new Notification({
                                        from: userId,
                                        to: post.user,
                                        type: "like"
                              })

                              await notification.save();
                              res.status(200).json(post.likes);
                   }
                   
          } catch (error) {
                    console.log(error.message);
                    res.status(500).json({message: error.message});
          }
}

const getAllPosts= async (req, res) =>{
          try {
                    const post = await Post.find().sort({createdAt: -1}).populate({
                              path: 'user',
                              select : '-password'
                    }).populate({
                              path: 'comments.user',
                              select: '-password'
                    });
                    if(!post){
                              return res.status(400).json([]);
                    }
                    res.status(200).json(post);
          } catch (error) {
               console.log(error.message);
               res.status(500).json({message: error.message});     
          }
}

const getLikedPosts = async (req, res) =>{
          try {
                    const userId = req.user._id;
                    const user = await User.findById(userId);

                    if(!user) return res.status(400).json({message: 'user not found'});

                    const likedPosts = await Post.find({_id: {$in: user.likedPosts}}).populate({
                              path: 'user',
                              select: '-password'
                    }).populate({
                              path: 'comments.user',
                              select: '-password',
                    })

                    res.status(200).json(likedPosts);

          } catch (error) {
                    console.log(error.message);
                    res.status(500).json({message: error.message});
          }
}

const getFollowingPosts= async (req, res) =>{
          try {
                    const userId = req.user._id;
                    const user= await User.findById(userId);
                    if(!user) return res.status(400).json({message: 'user not found'});

                    const following= user.followings;

                    const followingPosts =await Post.find({user: {$in: following}}).sort({createdAt: -1}).populate({
                              path: 'user',
                              select: '-password'
                    }).populate({
                              path: 'comments.user',
                              select: '-password'
                    });

                    res.status(200).json(followingPosts);

          } catch (error) {
                 console.log(error.message);
                 res.status(500).json({message: error.message});   
          }
}

const getUserPosts= async (req, res) =>{
          try {
                    const {username} = req.params;
                    const user= await User.findOne({username});
                    if(!user) return res.status(400).json({message: 'user not found'});

                    const posts= await Post.find({user: user._id}).sort({createdAt: -1}).populate({
                              path: 'user',
                              select: '-password'
                    }).populate({
                              path: 'comments.user',
                              select: '-password'
                    })

                    res.status(200).json(posts);

          } catch (error) {
                    console.log(error.message);
                    res.status(500).json({message: error.message});
          }
}

module.exports= {
          createPost,
          deletePost,
          commentOnPost,
          likeOrUnlikePost,
          getAllPosts,
          getLikedPosts,
          getFollowingPosts,
          getUserPosts
}