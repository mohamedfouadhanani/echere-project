const router = require("express").Router();
const path = require("path");

let { products, bids } = require(path.join(__dirname, "..", "database"));

// IMPORT AUTHENTICATION MIDDLEWARES
const { isAuthenticated, isAdmin } = require(path.join(
	"..",
	"middlewares",
	"authentication",
));

router.get("/", (req, res) => {
	let filteredProducts = products.filter(
		(product) => new Date(product.endDateTime).getTime() >= Date.now(),
	);
	res.render("product/index", {
		user: req.user,
		products: filteredProducts,
		errorMessage: req.flash("errorMessage"),
		successMessage: req.flash("successMessage"),
	});
});

router.get("/create", isAuthenticated, isAdmin, (req, res) => {
	res.render("product/create", {
		title: "New Product",
		errorMessage: req.flash("errorMessage"),
		FormUrl: "/products/create",
		name: req.flash("name"),
		startingPrice: req.flash("startingPrice"),
		soldTo: req.flash("soldTo"),
		endDateTime: req.flash("endDateTime"),
		imageURL: req.flash("imageURL"),
	});
});

router.post("/create", isAuthenticated, isAdmin, (req, res) => {
	let { name, startingPrice, soldTo, endDateTime, imageURL } = req.body;
	if (new Date(endDateTime).getTime() < Date.now()) {
		req.flash("errorMessage", "Incorrect date...");
		req.flash("name", name);
		req.flash("startingPrice", startingPrice);
		req.flash("soldTo", soldTo);
		req.flash("endDateTime", endDateTime);
		req.flash("imageURL", imageURL);

		return res.redirect("/products/create");
	}
	const product = {
		id: Date.now(),
		name,
		startingPrice,
		soldTo: null,
		endDateTime,
		imageURL,
	};

	products.push(product);

	req.flash("errorMessage", "");
	req.flash("successMessage", "Product Created Successfully...");
	return res.redirect("/products");
});

router.get("/update/:id", isAuthenticated, isAdmin, (req, res) => {
	let { id } = req.params;

	const product = products.find((product) => product.id === parseInt(id));

	if (product == null) {
		req.flash("successMessage", "");
		req.flash("errorMessage", "Product Not Found...");

		return res.redirect("/products");
	} else {
		let { name, startingPrice, soldTo, endDateTime, imageURL } = product;
		return res.render("product/create", {
			title: "Update Product",
			errorMessage: req.flash("errorMessage"),
			FormUrl: `/products/update/${id}`,
			name,
			startingPrice,
			soldTo,
			endDateTime,
			imageURL,
		});
	}
});

router.post("/update/:id", isAuthenticated, isAdmin, (req, res) => {
	let { name, startingPrice, soldTo, endDateTime, imageURL } = req.body;
	let { id } = req.params;

	let productIndex = products.findIndex(
		(product) => product.id === parseInt(id),
	);

	if (productIndex == -1) {
		req.flash("errorMessage", `No product with id ${id}`);
		return res.redirect("/products");
	}

	if (new Date(endDateTime).getTime < Date.now()) {
		req.flash("errorMessage", "Incorrect date...");
		req.flash("name", name);
		req.flash("startingPrice", startingPrice);
		req.flash("soldTo", soldTo);
		req.flash("endDateTime", endDateTime);
		req.flash("imageURL", imageURL);

		return res.redirect(`/products/update/${id}`);
	}

	products[productIndex].name = name;
	products[productIndex].startingPrice = parseFloat(startingPrice);
	products[productIndex].soldTo =
		soldTo != null && soldTo != "" ? soldTo : null;
	products[productIndex].endDateTime = endDateTime;
	products[productIndex].imageURL = imageURL;

	req.flash("successMessage", `Product with id ${id} updated successfully`);
	res.redirect("/products");
});

router.get("/delete/:id", (req, res) => {
	let { id } = req.params;
	products = products.filter((product) => product.id !== parseInt(id));
	bids = bids.filter((bid) => bid.productId !== parseInt(id));
	res.redirect("/products");
});

router.get("/:id", isAuthenticated, (req, res) => {
	const { id } = req.params;
	let product = products.find((product) => product.id === parseInt(id));

	if (product == null) {
		req.flash("errorMessage", "Product Not Found...");

		return res.redirect("/products");
	}

	if (product.soldTo != null) {
		req.flash("errorMessage", "Product already owned...");

		return res.redirect("/products");
	}

	if (new Date(product.endDateTime).getTime() < Date.now()) {
		req.flash("errorMessage", "Bidding over...");

		return res.redirect("/products");
	}

	res.render("product/id", {
		product,
		FormUrl: `/products/${id}/bids`,
		errorMessage: req.flash("errorMessage"),
	});
});

module.exports = router;
