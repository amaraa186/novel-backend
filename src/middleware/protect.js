require("dotenv").config();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;

const User = require("../modules/User/User");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  //console.log('user_id = ' + id)
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

/**
 * Sign in using JWT token
 */

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findOne({ _id: jwt_payload.id });
      if (!user) {
        return done(null, false, { msg: "JWT token mismatch" });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

/**
 * Sign in using Email and Password.
 */
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username.toLowerCase() })
      .then((user) => {
        if (!user) {
          return done(null, false, { msg: `Username ${username} not found.` });
        }
        return user.comparePassword(password);
      })
      .then((isMatch) => {
        if (isMatch) {
          return done(null, user);
        }
        return done(null, false, { msg: "Invalid username or password." });
      })
      .catch((err) => done(err));
  })
);

exports.isAuthorized = (req, res, next) => {
  passport.authenticate("jwt", (err, user, info) => {
    if (err) return next(err);

    if (!user)
      return res.json({
        code: 1,
        message: info.msg ? info.msg : info.message,
      });

    req.user = user;
    next();
  })(req, res, next);
};

const checkAuthorization = (req, res, next, roles) => {
  if (roles.includes(req.user.role))
    return res.json({ code: 1, message: "Эрх тань хүрэхгүй байна." });

  return next();
};

exports.isAdmin = (req, res, next) =>
  checkAuthorization(req, res, next, ["reader", "translator"]);

exports.isTranslator = (req, res, next) =>
  checkAuthorization(req, res, next, ["reader"]);

/**
 * Sign in with Facebook.
 */
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_ID,
//       clientSecret: process.env.FACEBOOK_SECRET,
//       callbackURL: "/auth/facebook/callback",
//       profileFields: ["name", "email", "link", "locale", "timezone", "gender"],
//       passReqToCallback: true,
//     },
//     (req, accessToken, refreshToken, profile, done) => {
//       if (req.user) {
//         User.findOne({ facebook: profile.id }, (err, existingUser) => {
//           if (err) {
//             return done(err);
//           }
//           if (existingUser) {
//             req.flash("errors", {
//               msg: "There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.",
//             });
//             done(err);
//           } else {
//             User.findById(req.user.id, (err, user) => {
//               if (err) {
//                 return done(err);
//               }
//               user.facebook = profile.id;
//               user.tokens.push({ kind: "facebook", accessToken });
//               user.profile.name =
//                 user.profile.name ||
//                 `${profile.name.givenName} ${profile.name.familyName}`;
//               user.profile.gender = user.profile.gender || profile._json.gender;
//               user.profile.picture =
//                 user.profile.picture ||
//                 `https://graph.facebook.com/${profile.id}/picture?type=large`;
//               user.save((err) => {
//                 req.flash("info", { msg: "Facebook account has been linked." });
//                 done(err, user);
//               });
//             });
//           }
//         });
//       } else {
//         User.findOne({ facebook: profile.id }, (err, existingUser) => {
//           if (err) {
//             return done(err);
//           }
//           if (existingUser) {
//             return done(null, existingUser);
//           }
//           User.findOne(
//             { email: profile._json.email },
//             (err, existingEmailUser) => {
//               if (err) {
//                 return done(err);
//               }
//               if (existingEmailUser) {
//                 req.flash("errors", {
//                   msg: "There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.",
//                 });
//                 done(err);
//               } else {
//                 const user = new User();
//                 user.email = profile._json.email;
//                 user.facebook = profile.id;
//                 user.tokens.push({ kind: "facebook", accessToken });
//                 user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
//                 user.profile.gender = profile._json.gender;
//                 user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
//                 user.profile.location = profile._json.location
//                   ? profile._json.location.name
//                   : "";
//                 user.save((err) => {
//                   done(err, user);
//                 });
//               }
//             }
//           );
//         });
//       }
//     }
//   )
// );

/**
 * Sign in with Google.
 */
// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_ID,
//   clientSecret: process.env.GOOGLE_SECRET,
//   callbackURL: '/auth/google/callback',
//   passReqToCallback: true
// }, (req, accessToken, refreshToken, profile, done) => {
//   if (req.user) {
//     User.findOne({ google: profile.id }, (err, existingUser) => {
//       if (err) { return done(err); }
//       if (existingUser) {
//         req.flash('errors', { msg: 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
//         done(err);
//       } else {
//         User.findById(req.user.id, (err, user) => {
//           if (err) { return done(err); }
//           user.google = profile.id;
//           user.tokens.push({ kind: 'google', accessToken });
//           user.profile.name = user.profile.name || profile.displayName;
//           user.profile.gender = user.profile.gender || profile._json.gender;
//           user.profile.picture = user.profile.picture || profile._json.image.url;
//           user.save((err) => {
//             req.flash('info', { msg: 'Google account has been linked.' });
//             done(err, user);
//           });
//         });
//       }
//     });
//   } else {
//     User.findOne({ google: profile.id }, (err, existingUser) => {
//       if (err) { return done(err); }
//       if (existingUser) {
//         return done(null, existingUser);
//       }
//       User.findOne({ email: profile.emails[0].value }, (err, existingEmailUser) => {
//         if (err) { return done(err); }
//         if (existingEmailUser) {
//           req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.' });
//           done(err);
//         } else {
//           const user = new User();
//           user.email = profile.emails[0].value;
//           user.google = profile.id;
//           user.tokens.push({ kind: 'google', accessToken });
//           user.profile.name = profile.displayName;
//           user.profile.gender = profile._json.gender;
//           user.profile.picture = profile._json.image.url;
//           user.save((err) => {
//             done(err, user);
//           });
//         }
//       });
//     });
//   }
// }));
