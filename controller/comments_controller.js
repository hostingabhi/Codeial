const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const commentEmailWorker = require('../workers/comment_email_worker')
const queue = require('../config/kue');
const Like = require('../models/like');

module.exports.create = async function(req, res) {
    try {
        const post = await Post.findById(req.body.post);

        if (post) {
            const comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            await post.save();
            
            const populatedComment = await comment.populate('user', 'name email');
            // Populate the comment with user data
            let job = queue.create('emails', comment).save(function(err){
                if(err){
                    console.log('error in creating a Queue', err);
                    return;
                }
                console.log('job enqueued', job.id)
            });
            
            
            // commentsMailer.newComment(populatedComment);
            res.redirect('/');
        } else {
            res.status(404).send("Post not found");
        }
    } catch (err) {
        // Handle the error appropriately
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
};


module.exports.destroy = async function(req, res) {
    try {
        const comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id) {
            const postId = comment.post;

            await comment.deleteOne();

            await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });

            //destroy the associated likes for this comment
            await Like.deleteMany({likeable: comment._id, onModel:'Comment'});

            return res.redirect('back');
        } else {
            return res.redirect('back');
        }
    } catch (err) {
        // Handle the error appropriately
        console.error(err);
        return res.status(500).send("Internal Server Error");
    }
};