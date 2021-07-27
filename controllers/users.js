const User = require('../models/user');

module.exports.renderSignUpForm = (req, res) => {
    res.render('users/register');
};

module.exports.signUpNewUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
        });
        req.flash('success', 'Welcome to Yelp Camp!');
        res.redirect('/campgrounds');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    };
};

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
};

module.exports.loginUser = (req, res) => {
    req.flash('success', 'welcome back!');
    var redirectUrl;
    //checks if the returnTo store contains the pagination portion from the index page
    if (req.session.returnTo.includes("/campgrounds") && req.session.returnTo.includes("?page=")) {
        //if it does, find where the query string starts, then get the substring from before it.
        redirectUrl = req.session.returnTo.substring(0, req.session.returnTo.search("\\?page"));
    } else {
        //otherwise redirect login as normal.
        redirectUrl = req.session.returnTo || '/campgrounds';
    };

    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/');
};