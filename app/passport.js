'use strict';

/**
 * Configure passport for simple database authentication
 */
const passport = require('passport');
const config = require('./configAzureAD');
const log = require('./logger');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

var strategyConfig = {
  redirectUrl: config.creds.returnURL,
  realm: config.creds.realm,
  clientID: config.creds.clientID,
  clientSecret: config.creds.clientSecret,
  oidcIssuer: config.creds.issuer,
  identityMetadata: config.creds.identityMetadata,
  scope: config.creds.scope,
  skipUserProfile: config.creds.skipUserProfile,
  responseType: config.creds.responseType,
  responseMode: config.creds.responseMode,
  validateIssuer: config.creds.validateIssuer,
  passReqToCallback: config.creds.passReqToCallback,
  allowHttpForRedirectUrl: config.creds.allowHTTP
};

/**
 * Replaces the local-part of an email with asterisks except for the first and the last character
 * @param {any} email Email to mask
 * @returns Masked email
 */
function maskEmail(email) {
  return email.replace(/(?!^).(?=[^@]+@)/g, '*');
}

if (strategyConfig.loggingLevel) { log.levels("console", strategyConfig.loggingLevel); }

// array to hold logged in users
var users = [];

var findByEmail = function (upn, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.upn === upn) {
      return fn(user);
    }
  }
  return fn(null);
};


// Used by ADFS users
passport.use(new OIDCStrategy(strategyConfig,
  function (profile, done) {
    // Depending on the type of the account e.g. registered in live.com or kainos.com
    // user's email may be returned in "unique_name" field instead of "email"
    var email = profile._json.email || profile._json.unique_name
    if (!email) {
      return done(new Error("No email found"), null);
    }

    process.nextTick(function () {
      findByEmail(email, function (user) {
        if (!user) {
          users.push(profile);
          return done(null, profile);
        }
        return done(null, user);
      });
    });
  }
));

passport.serializeUser(function (user, done) {
  done(null, user.upn);
});

passport.deserializeUser(function (upn, done) {
  findByEmail(upn, function (user) {
    done(null, user);
  });
});
