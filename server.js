const app = require("./app");
const dbConnection = require("./config/dbConnection");

const port = process.env.port || 8000;
dbConnection();
app.listen(8000, () => console.log(`app is running on port ${port}`));
