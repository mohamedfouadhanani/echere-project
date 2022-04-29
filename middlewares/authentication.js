let isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash("errorMessage", "Please sign in...");
	res.redirect("/authenticate/signin");
};

let isNotAuthenticated = function (req, res, next) {
	if (!req.isAuthenticated()) {
		return next();
	}
	res.redirect("/products");
};

let isAdmin = function (req, res, next) {
	if (req.user.isAdmin) {
		return next();
	}
	return res.redirect("/products");
};

module.exports = { isAuthenticated, isNotAuthenticated, isAdmin };
