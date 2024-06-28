require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const categories = require("./routes/categoryRouter");
const userAuth = require("./routes/userAuth");
const products = require("./routes/productRouter");
const orders = require("./routes/orderRoter");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
const port = process.env.PORT || 8000;
// Serve static files from the 'uploads' directory
app.use(express.static("public"));
app.use("/api/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploads directory

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());
// add cores
app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Your API Documentation",
            version: "1.0.0",
            description: "API documentation for your application",
        },
        servers: [{ url: `http://localhost:${port}` }],
    },
    apis: ["./routes/*.js"], // Path to your API route files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error(err));

// Routes
app.use("/api", categories);
app.use("/api", userAuth);
app.use("/api", products);
app.use("/api", orders);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});