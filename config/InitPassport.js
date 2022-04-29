// IMPORTS
const path = require("path");
const { users } = require(path.join(__dirname, "..", "database"));

const LocalStrategy = require("passport-local").Strategy;

module.exports = function InitPassport(passport) {
	passport.use(
		new LocalStrategy(
			{ usernameField: "username", passReqToCallback: true },
			async (req, username, password, done) => {
				try {
					let user = users.find((user) => user.username === username);
					if (user == null || user.password !== password) {
						return done(null, false, {
							errorMessage: req.flash(
								"errorMessage",
								"Incorrect username or password...",
							),
						});
					}
					return done(null, user);
				} catch (err) {
					return done(err);
				}
			},
		),
	);
	passport.serializeUser((user, done) => done(null, user));
	passport.deserializeUser(async (user, done) => {
		try {
			done(null, user);
		} catch (err) {
			done(err);
		}
	});
};
