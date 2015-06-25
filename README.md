# passport-changetip
ChangeTip Strategy for Passport.  Easily add ChangeTip login support to your
Node.JS application.

## Install
```bash
$ npm install passport-changetip
```

## Usage
First, [acquire a ChangeTip Application ID and Secret][register].  You'll then
need to configure your strategy:

```javascript
var ChangeTipStrategy = require('passport-changetip').Strategy;

passport.use(new ChangeTipStrategy({
    clientID: CHANGETIP_CLIENT_ID,
    clientSecret: CHANGETIP_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/changetip/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ changeTipID: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));
```

You can now add an authenticate endpoint, and authenticate individual endpoints:

```javascript
app.get('/auth/changetip', passport.authenticate('changetip'));

app.get('/auth/changetip/callback', passport.authenticate('changetip', { failureRedirect: '/login' }), function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('/');
});
```

[register]: https://www.changetip.com/o/applications/register/
