const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const admin = require("firebase-admin");
const serviceAccount = require("./plantKey.json");

const app = express();

// Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://car-rental-plantform.netlify.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

// MongoDB
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.5u4x9tc.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  },
});

// Token Verify
async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const idToken = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    req.user = { uid: decodedToken.uid, email: decodedToken.email };
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
}

async function run() {
  try {
    const db = client.db("car");
    const carsCollection = db.collection("car-plant");
    const bookingsCollection = db.collection("bookings");

    // Root
    app.get("/", (req, res) =>
      res.send("Car Rental Server Running Successfully!")
    );

    // Top Cars
    app.get("/api/cars/top-rated", async (req, res) => {
      const cars = await carsCollection.find({}).limit(21).toArray();
      res.json(cars);
    });

    // Browse cars
    app.get("/api/cars/top-browse", async (req, res) => {
      const cars = await carsCollection.find({}).limit(27).toArray();
      res.json(cars);
    });

    // My listings
    app.get("/api/car/my-listings", verifyToken, async (req, res) => {
      const cars = await carsCollection
        .find({ providerEmail: req.user.email })
        .toArray();
      res.json(cars);
    });

    // Add car
    app.post("/api/cars", verifyToken, async (req, res) => {
      const car = req.body;
      car.providerEmail = req.user.email;
      car.status = "available";

      const result = await carsCollection.insertOne(car);
      res.status(201).json({
        message: "Car added successfully",
        id: result.insertedId,
      });
    });

    // Single car
    app.get("/api/cars/:id", async (req, res) => {
      const car = await carsCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      if (!car) return res.status(404).json({ message: "Car not found" });
      res.json(car);
    });

    // Update car
    app.put("/api/cars/:id", verifyToken, async (req, res) => {
      const carId = req.params.id;
      const email = req.user.email;

      const car = await carsCollection.findOne({ _id: new ObjectId(carId) });
      if (!car) return res.status(404).json({ message: "Car not found" });

      if (car.providerEmail !== email) {
        return res.status(403).json({
          message: "You are not authorized to update this car",
        });
      }

      await carsCollection.updateOne(
        { _id: new ObjectId(carId) },
        { $set: req.body }
      );

      const updated = await carsCollection.findOne({
        _id: new ObjectId(carId),
      });

      res.json({ message: "Car updated successfully", car: updated });
    });

    // Delete car
    app.delete("/api/cars/:id", verifyToken, async (req, res) => {
      const carId = req.params.id;

      const car = await carsCollection.findOne({ _id: new ObjectId(carId) });
      if (!car) return res.status(404).json({ message: "Car not found" });

      if (car.providerEmail !== req.user.email) {
        return res.status(403).json({
          message: "You are not authorized to delete this car",
        });
      }

      await carsCollection.deleteOne({ _id: new ObjectId(carId) });
      res.json({ message: "Car deleted successfully" });
    });

    // Book car
    app.post("/api/cars/:id/book", verifyToken, async (req, res) => {
      const carId = req.params.id;

      const car = await carsCollection.findOne({ _id: new ObjectId(carId) });
      if (!car) return res.status(404).json({ message: "Car not found" });
      if (car.status === "booked")
        return res.status(400).json({ message: "Car already booked" });

      await bookingsCollection.insertOne({
        carId: car._id,
        userEmail: req.user.email,
        providerEmail: car.providerEmail,
        bookedAt: new Date(),
      });

      await carsCollection.updateOne(
        { _id: new ObjectId(carId) },
        { $set: { status: "booked" } }
      );

      res.json({ message: "Car booked successfully!" });
    });

    // Search
    app.get("/api/cars/search", async (req, res) => {
      const q = req.query.q || "";
      const cars = await carsCollection
        .find({ name: { $regex: q, $options: "i" } })
        .toArray();
      res.json(cars);
    });

    console.log("Server setup complete ✔");
  } catch (err) {
    console.error("Error:", err);
  }
}

run();

// ❗ NO app.listen() for Vercel
module.exports = app;
