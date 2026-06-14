const express = require("express");
const mongoose = require("mongoose");

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// HOME → LOGIN PAGE
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

// MONGODB
mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

// ---------------- USER ----------------
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
const User = mongoose.model("User", userSchema);

// REGISTER
app.post("/register", async (req, res) => {
  await User.create(req.body);
  res.redirect("/login.html");
});

// LOGIN
app.post("/login", async (req, res) => {
  const user = await User.findOne(req.body);

  if (user) {
    res.redirect("/products.html");
  } else {
    res.send("Invalid Email or Password ❌");
  }
});

// ---------------- PRODUCTS ----------------
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String
});
const Product = mongoose.model("Product", productSchema);

// ADD PRODUCTS
app.get("/add-products", async (req, res) => {
  await Product.insertMany([
    { name: "Teddy 🧸", price: 500, image: "https://i.imgur.com/8Km9tLL.jpg" },
    { name: "Toy Car 🚗", price: 300, image: "https://i.imgur.com/5tj6S7Ol.jpg" },
    { name: "Doll 🎎", price: 700, image: "https://i.imgur.com/2DhmtJ4.jpg" }
  ]);
  res.send("Products Added ✅");
});

// GET PRODUCTS
app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ---------------- ORDERS ----------------
const orderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  paymentMethod: String,
  items: Array,
  total: Number,
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model("Order", orderSchema);

// SAVE ORDER
app.post("/save-order", async (req, res) => {
  const order = new Order(req.body);
  await order.save();
  res.json({ message: "Order Saved ✅" });
});

// GET ORDERS
app.get("/orders", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

// DELETE ORDER
app.delete("/delete-order/:id", async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

// START SERVER
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000 🚀");
});