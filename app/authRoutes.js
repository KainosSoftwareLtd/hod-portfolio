var express     = require('express');
var passport    = require('passport');
var router      = express.Router();

router.get('/login',
    passport.authenticate('azuread-openidconnect', { 
        failureRedirect: '/authError'
    }),
    function (req, res) {
        res.redirect('/');
    }
);

/* Accept login request */
router.post('/auth/openid/return',
    passport.authenticate('azuread-openidconnect', { 
        failureRedirect: '/authError'
    }),
    function (req, res) {
        res.redirect('/');
    }
);

/* Logout */
router.get('/logout', function (req, res) {
    req.session.destroy(function(err) {
        var postLogoutRedirectUri = req.protocol + "://" + req.get('host');
        req.logOut();
        res.redirect('https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri='+postLogoutRedirectUri);
    });
});

//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/auth/openid/return',
    passport.authenticate('azuread-openidconnect', { 
        failureRedirect: '/authError'
    }),
    function (req, res) {
        req.flash('success', 'Welcome, ' + req.user.name.givenName);
        res.redirect(req.session.returnTo || '/'); // returnTo is set by connect-ensure-login
    }
);

module.exports = router;
