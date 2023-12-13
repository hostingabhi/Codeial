const Like = require("../models/like");
const Post = require("../models/post");
const Comment = require('../models/comment');

module.exports.toggleLike = async function(req,res){
    try{
        //likes/toggle/?id=abcdef&type=Post
        let likeable;
        let deleted = false;

        if(req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
        }else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        //check if a like alredy exists
        let existsingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        })
        //if like alredy exist then delete it
        if(existsingLike){
            likeable.likes.pull(existsingLike._id);
            likeable.save();

            existsingLike.remove();
            deleted = true;
        }else{
            //else make a new Like
            let newLike  = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });
            likeable.likes.push(newLike._id);
            likeable.save();
        }
        return res.json(200,{
            message: "Request sucessful",
            data:{
                deleted: deleted
            }
        })

    }catch(err){
        console.log(err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}