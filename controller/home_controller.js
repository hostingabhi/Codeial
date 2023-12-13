const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req, res) {
    try {
        const posts = await Post.find({})
                .sort('-createAt')
                .populate('user')
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'user'
                    },
                    populate:{
                        path: 'likes'
                    }
                }).populate('likes').exec();

            const users = await User.find({}); // Fetch users using await
            
            return res.render('home', {
                title: "Codeial | Home",
                posts: posts,
                all_users: users
            });
    } catch (err) {
        console.error("Error fetching posts:", err);
        return res.status(500).send("Internal Server Error");
    }
};
