// IMPORT THIRD PARTY MODULES
const router = require("express").Router();
const path = require("path");

// ROUTE
const authenticateRoute = require(path.join(__dirname, "authenticate"));
const productRoute = require(path.join(__dirname, "product"));
const userRoute = require(path.join(__dirname, "user"));

// IMPORT AUTHENTICATION MIDDLEWARES
const { isAuthenticated, isNotAuthenticated } = require(path.join(
	"..",
	"middlewares",
	"authentication",
));

// ROUTES SETTUP
router.use("/authenticate", authenticateRoute);
router.use("/products", productRoute);
router.use("/user", isAuthenticated, userRoute);

module.exports = router;
