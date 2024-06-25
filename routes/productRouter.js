const express = require("express");
const router = express.Router();
const productController = require("../controllers/productControllers");
const middleWare = require("../middleware/middleWare");
const multer = require("multer");

// Setup Multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Adjust path as needed
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               price:
 *                 type: number
 *               category_id:
 *                 type: string
 *             required:
 *               - name
 *               - description
 *               - image
 *               - price
 *               - category_id
 *     responses:
 *       201:
 *         description: Successfully created product
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Internal server error
 */
router.post(
  "/products",
  middleWare,
  upload.single("image"),
  productController.addProduct
);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retrieve all products
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Successfully retrieved products
 *       500:
 *         description: Internal server error
 */
router.get("/products", productController.getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Retrieve a product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved product
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get("/products/:id", productController.getProductById);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category_id:
 *                 type: string
 *             required:
 *               - name
 *               - description
 *               - price
 *               - category_id
 *     responses:
 *       200:
 *         description: Successfully updated product
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.put("/products/:id", middleWare, productController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to delete
 *     responses:
 *       200:
 *         description: Successfully deleted product
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.delete("/products/:id", middleWare, productController.deleteProduct);

/**
 * @swagger
 * /api/products/category/{id}:
 *   get:
 *     summary: Retrieve products by category ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category to filter products
 *     responses:
 *       200:
 *         description: Successfully retrieved products by category
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
router.get("/products/category/:id", productController.getProductsByCategory);

/**
 * @swagger
 * /api/products/name/{name}:
 *   get:
 *     summary: Retrieve products by name
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the product(s) to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved products by name
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/products/name/:name",

  productController.getProductsByName
);

/**
 * @swagger
 * /api/products/price/{min}/{max}:
 *   get:
 *     summary: Retrieve products by price range
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: min
 *         required: true
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: path
 *         name: max
 *         required: true
 *         schema:
 *           type: number
 *         description: Maximum price
 *     responses:
 *       200:
 *         description: Successfully retrieved products by price range
 *       404:
 *         description: No products found within the specified price range
 *       500:
 *         description: Internal server error
 */
router.get(
  "/products/price/:min/:max",

  productController.getProductsByPrice
);

module.exports = router;
