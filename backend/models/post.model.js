const timespan = require('jsonwebtoken/lib/timespan');
const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
          user:{
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'User'
          },
          text:{
                    type: String,
          },
          img:{
                    type: String,
          },
          likes:[
                    {
                              type:mongoose.Schema.Types.ObjectId,
                              ref: 'User'
                    }
          ],
          comments:[
                    {
                              text:{
                                        type:String,
                                        ref:'User'
                              },
                              user:{
                                        type: mongoose.Schema.Types.ObjectId,
                                        ref:'User',
                                        required:true
                              }
                    }
          ]
},
{
          timestamps: true,
})

const Post = mongoose.model('Post', postSchema);

module.exports= Post;