var util = require('util');
var OAuth2Strategy = require('passport-oauth2');
var InternalOAuthError = require('passport-oauth2').InternalOAuthError;

function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://www.changetip.com/o/authorize/';
  options.tokenURL = options.tokenURL || 'https://www.changetip.com/o/token/';

  OAuth2Strategy.call(this, options, verify);
  this.name = 'changetip';
}

util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.authenticate = function(req, options) {
  if (!options) options = {};

  var oldHint = options.loginHint;
  options.loginHint = req.query.login_hint;
  OAuth2Strategy.prototype.authenticate.call(this, req, options);
  options.loginHint = oldHint;
};

Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get('https://www.changetip.com/v2/me', accessToken, function (err, body, res) {
    if (err) return done(new InternalOAuthError('failed to fetch user profile', err));

    try {
      var json = JSON.parse(body);

      var profile = { provider: 'changetip' };
      profile.id           = json.id;
      profile.displayName  = json.username;
      profile.name         = json.full_name;
      profile.email        = json.email;
      profile.picture      = json.picture_url;

      profile._raw = body;
      profile._json = json;

      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
};

exports = module.exports = Strategy;
exports.Strategy = Strategy;
