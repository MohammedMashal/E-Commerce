const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

dotenv.config({ path: "config.env" });

const AppError = require("./utils/appError");
const errorHandler = require("./controllers/errorController");
const categoryRouter = require("./routes/categoryRouter");
const subCategoryRouter = require("./routes/subCategoryRouter");
const brandRouter = require("./routes/brandRouter");
const productRouter = require("./routes/productRouter");
const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");
const reviewRouter = require("./routes/reviewRouter");
const wishlistRouter = require("./routes/wishlistRouter");
const cartRouter = require("./routes/cartRouter");
const orderRouter = require("./routes/orderRouter");

const app = express();


if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.json({ limit: "20kb" }));

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 50, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
});

// Apply the rate limiting middleware to all requests.
app.use("/api", limiter);
// To remove data using these defaults:
// app.use(mongoSanitize());

// app.use(xss);
// Apply prevent parameter pollution
app.use(hpp());

app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/subcategories", subCategoryRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);

app.all("*splat", (req, res, next) => {
	next(new AppError(`Can't find this route : ${req.originalUrl}`, 404));
});

app.use(errorHandler);

module.exports = app;
