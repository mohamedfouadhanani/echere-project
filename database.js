let products = [
	{
		id: 1,
		name: "Akatsuki Poster",
		startingPrice: 1000,
		soldTo: null,
		endDateTime: "2022-05-05",
		imageURL: "https://wallpaper.dog/large/20495721.jpg",
	},
	{
		id: 2,
		name: "Sukuna Poster",
		startingPrice: 1200,
		soldTo: null,
		endDateTime: "2022-05-05",
		imageURL:
			"https://boutiquejujutsukaisen.com/wp-content/uploads/2021/06/poster-jujutsu-kaisen-sukuna-fond-rouge.jpg",
	},
];

let users = [
	{
		username: "admin",
		fullname: "Admin",
		password: "admin",
		isAdmin: true,
	},
	{
		username: "user1",
		fullname: "UserOne",
		password: "user1",
		isAdmin: false,
	},
	{
		username: "user2",
		fullname: "UserTwo",
		password: "user2",
		isAdmin: false,
	},
];

let bids = [];

module.exports = { products, users, bids };
