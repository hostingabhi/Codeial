const User = require('../models/user');


module.exports.profile = async function (req, res) {
    return res.render("user_profile",{
        title : "This is user profile page"
    })
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

// // sign in and create a session for the user
// module.exports.createSession = async function (req, res) {
//     try {
//         const user = await User.findOne({ email: req.body.email });

//         if (user) {
//             // Handle password mismatch
//             if (user.password !== req.body.password) {
//                 return res.redirect('back');
//             }

//             // Handle session creation
//             res.cookie('user_id', user.id);
//             return res.redirect('/users/profile');
//         } else {
//             // Handle user not found
//             return res.redirect('back');
//         }
//     } catch (err) {
//         console.log('error in finding user in signing in', err);
//         return;
//     }
// };

// sign in and create a session for the user
module.exports.createSession = function(req, res){
    res.redirect("/")
}

module.exports.destroySession = function(req, res){
    req.logout(function(err){
        if(err){
            return next(err)
        }
        return res.redirect("/")
    });
}