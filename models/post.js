const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content :  {
        type: String,
        required: true
    },
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    //include the array of ids of al comments in this post schemma itself
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ]
},{
    timestamp : true
});
const Post = mongoose.model('post', postSchema);
module.exports = Post;