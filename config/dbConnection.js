const mongoose = require("mongoose");
module.exports = () => {
	const url = process.env.DATABASE.replace(
		"<PASSWORD>",
		process.env.DATABASE_PASSWORD
	);
	mongoose
		.connect(url, {
			dbName: "E-Commerce",
		})
		.then(() => console.log("DB connection successful"));
};
