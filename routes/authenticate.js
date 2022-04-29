// IMPORTS THIRD PARTY MODULES
const router = require("express").Router();
const passport = require("passport");
const path = require("path");

const { isAuthenticated, isNotAuthenticated } = require(path.join(
	"..",
	"middlewares",
	"authentication",
));

// ROUTES SETTUP
router.get("/signin", isNotAuthenticated, (req, res) => {
	return res.render("signin", {
		username: req.flash("username"),
		password: req.flash("password"),
		errorMessage: req.flash("errorMessage"),
		successMessage: req.flash("successMessage"),
	});
});

router.post(
	"/signin",
	isNotAuthenticated,
	passport.authenticate("local", {
		successRedirect: "/products",
		failureRedirect: "/authenticate/signin",
		failureFlash: true,
	}),
);

router.get("/signout", isAuthenticated, (req, res) => {
	req.logOut();
	req.flash("successMessage", "Signed out successfully");
	res.redirect("/authenticate/signin");
});

module.exports = router;
