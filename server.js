// IMPORTS
const http = require("http");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const path = require("path");

//
const { isAuthenticated } = require("./middlewares/authentication");

// DATABASE
let { bids, products, users } = require("./database");

// ROUTES
const indexRoute = require(path.join(__dirname, "routes", "index"));

// INIT PASSPORT
const InitPassport = require(path.join(__dirname, "config", "InitPassport"));
InitPassport(passport);

// INIT SERVER
const server = express();
const httpServer = http.Server(server);
const io = require("socket.io")(httpServer, { cors: { origin: "*" } });

// MIDDLEWARES & SETTINGS
server.set("view engine", "ejs");
server.use(flash());
server.use(express.static(path.join(__dirname, "static")));
server.use(express.urlencoded({ extended: false }));
server.use(
	session({
		secret: process.env.SESSION_SECRET_KEY || "$tracker_SECRET_KEY",
		resave: false,
		saveUninitialized: false,
	}),
);
server.use(passport.initialize());
server.use(passport.session());

// ROUTES
server.get("/", (req, res) => {
	res.redirect("/products");
});

server.get("/products/:id/bids", (req, res) => {
	let { id } = req.params;
	let product = products.find((product) => product.id === parseInt(id));

	if (product == null) {
		req.flash("errorMessage", "Product Not Found...");

		return res.redirect("/products");
	}

	let productsBids = bids
		.filter((bid) => bid.productId === product.id)
		.map((bid) => {
			let user = users.find((user) => user.username === bid.userId);
			let object = {
				user,
				price: bid.price,
			};
			return object;
		})
		.reverse();
	res.send(productsBids);
});

server.post("/products/:id/bids", isAuthenticated, (req, res) => {
	const { id } = req.params;
	const { raiseTo } = req.body;

	let productIndex = products.findIndex(
		(product) => product.id === parseInt(id),
	);

	if (productIndex == -1) {
		req.flash("errorMessage", "Product Not Found...");

		return res.redirect("/products");
	}

	let product = products[productIndex];

	if (product.soldTo != null) {
		req.flash("errorMessage", "Product already sold...");

		return res.redirect("/products");
	}

	if (new Date(product.endDateTime).getTime() < Date.now()) {
		if (product.soldTo == null) {
			let productBids = bids.filter((bid) => bid.productId == product.id);
			let maximumBid = productBids.reduce((prev, current) => {
				return prev.price > current.price ? prev : current;
			});

			products[productIndex].soldTo = maximumBid.userId;
		}

		req.flash("errorMessage", "Bidding over...");

		return res.redirect("/products");
	}

	let productBids = bids.filter((bid) => bid.productId === parseInt(id));

	bigger = true;
	if (productBids.length !== 0) {
		for (let bid of bids) {
			if (bid.price >= raiseTo) {
				bigger = false;
				break;
			}
		}
	} else if (product.startingPrice > parseFloat(raiseTo)) {
		bigger = false;
	}

	if (bigger == false) {
		req.flash("errorMessage", "You must offer more...");

		return res.redirect(`/products/${id}`);
	}

	let bid = {
		id: Date.now(),
		productId: product.id,
		userId: req.user.username,
		datetime: Date.now(),
		price: parseFloat(raiseTo),
	};

	bids.push(bid);

	let productsBids = bids
		.filter((bid) => bid.productId === product.id)
		.map((bid) => {
			let user = users.find((user) => user.username === bid.userId);
			let object = {
				user,
				price: bid.price,
			};
			return object;
		})
		.reverse();

	io.emit(`bid:${id}`, productsBids);
	res.redirect(`/products/${id}`);
});

server.use("/", indexRoute);

server.use((req, res) => {
	res.render("error", { errorMessage: "404 Not Found!" });
});

// LISTENING TO PORT
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server started on port ${PORT}...`));

io.on("connection", (socket) => {
	console.log(`user connected: ${socket.id}`);
});
