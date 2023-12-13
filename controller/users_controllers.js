const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = async function (req, res) {
        const user = await User.findById(req.params.id)
        return res.render("user_profile",{
            title : 'User Profile',
            profile_user: user
        });
}

module.exports.update = async function (req, res) {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).send('User not found');
        }

        if (user.id != req.user.id) {
            return res.status(401).send('Unauthorized');
        }

        if (req.user.id == req.params.id) {
            User.uploadedAvatar(req, res, async function (err) {
                if (err) {
                    console.log('****Multer Error:', err);
                    return res.status(500).send('Error uploading avatar');
                }

                user.name = req.body.name;
                user.email = req.body.email;

                if (req.file) {
                    if (user.avatar) {
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }

                try {
                    await user.save();
                    return res.redirect('/');
                } catch (saveErr) {
                    console.log('Error saving user:', saveErr);
                    return res.status(500).send('Error saving user');
                }
            });
        } else {
            return res.status(401).send('Unauthorized');
        }
    } catch (err) {
        console.log('An error occurred:', err);
        return res.redirect('back');
    }
};


// render the sign up page
module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

// get the sign up data
module.exports.create = async function(req, res) {
    try {
        if (req.body.password != req.body.confirm_password) {
            return res.redirect('back');
        }

        const existingUser = await User.findOne({ email: req.body.email });

        if (!existingUser) {
            const newUser = await User.create(req.body);
            return res.redirect('/users/sign-in');
        } else {
            return res.redirect('back');
        }
    } catch (err) {
        console.log('An error occurred:', err);
        return res.redirect('back');
    }
};


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in SucessFully')
    res.redirect("/")
}

module.exports.destroySession = function(req, res){
    req.logout(function(err){
        if(err){
            return next(err)
        }
        req.flash('success', 'Logged Out SucessFully')
        return res.redirect("/")
    });
}