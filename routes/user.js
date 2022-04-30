// IMPORTS THIRD PARTY MODULES
const router = require("express").Router();
const path = require("path");

// DATABASE
let { products, bids, users } = require(path.join(__dirname, "..", "database"));

router.get("/products", (req, res) => {
	let biddingOverProducts = products.filter(
		(product) => new Date(product.endDateTime).getTime() < Date.now(),
	);

	let owned = [];

	biddingOverProducts.forEach((product) => {
		let productBids = bids.filter((bid) => bid.productId === product.id);

		if (productBids.length != 0) {
			const maximumBid = productBids.reduce((prev, current) => {
				return prev.price > current.price ? prev : current;
			});

			if (maximumBid.userId === req.user.username) {
				owned.push(product);
			}
		}
	});

	res.render("user/products/index", {
		products: owned,
		user: req.user,
	});
});

module.exports = router;
