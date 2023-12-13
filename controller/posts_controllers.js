const post = require('../models/post')
const Comment = require('../models/comment');
const Like = require('../models/like');

module.exports.create = async function(req, res) {
    try {
        const newPost = await post.create({
            content: req.body.content,
            user: req.user._id
        });
        if(req.xhr){
            return res.status(200).json({
                date:{
                    post: post
                },
                message: "Post created!"
            });
        }
        req.flash('sucess','Post Published!');
        return res.redirect('back');
    } catch (err) {
        console.log('error in creating a post', err);
        // Handle the error appropriately, e.g., sending an error response
    }
}

module.exports.destroy = async function(req, res) {
    try {
        const postToDelete = await post.findById(req.params.id).exec();

        if (!postToDelete) {
            return res.redirect('back');
        }

        // Check if the user is the owner of the post
        if (postToDelete.user == req.user.id) {
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});
            await postToDelete.deleteOne();
            await Comment.deleteMany({ post: req.params.id }).exec();

            if(req.xhr){
                return res.status(200).json({ 
                    data:{
                        post_id: req.params.id
                    },
                    message: "Post Deleted"
                });
            }
            req.flash('sucess', 'Post and asssociated comments delete');

            return res.redirect('back');
        } else {
            req.flash('sucess', 'You cannot delete this post!');
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error',err);
        return res.redirect('back');
    }
}