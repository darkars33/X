const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
          username:{
                    type: String,
                    required: true,
                    unique: true
          },
          fullName:{
                    type: String,
                    required: true
          },
          password:{
                    type: String,
                    required: true,
                    minLength: 3
          },
          email:{
                    type:String,
                    required: true,
                    unique: true
          },
          followers:[
                    {
                              type: mongoose.Schema.Types.ObjectId,
                              ref: 'User',
                              default: []
                    }
          ],
          followings:[
                    {
                              type: mongoose.Schema.Types.ObjectId,
                              ref: 'User',
                              default: []
                    }
          ],
          profileImg:{
                    type: String,
                    default: ""
          },
          coverImg:{
                    type: String,
                    default:""
          },
          bio:{
                    type:String,
                    default:""
          },
          link:{
                    type: String,
                    default:""
          },
          likedPosts:[
                    {
                              type: mongoose.Schema.Types.ObjectId,
                              ref: 'Post',
                              default: []
                    },
          ],
},
{
          timestamps:true,
})

const User = mongoose.model('User', authSchema);

module.exports= User;