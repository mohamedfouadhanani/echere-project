// IMPORTS THIRD PARTY MODULES
const router = require("express").Router();
const path = require("path");

// DATABASE
let { products } = require(path.join(__dirname, "..", "database"));

router.get("/products", (req, res) => {
	let userProducts = products.filter((product) => {
		return product.soldTo === req.user.id;
	});

	res.render("user/products/index", {
		products: userProducts,
		user: req.user,
	});
});

module.exports = router;
