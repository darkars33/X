const User = require("../models/auth.model");
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

module.exports= {
          createPost,
          deletePost
}