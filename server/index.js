const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const admin = require("firebase-admin");

const app = express();

const port = process.env.PORT || 3000;

// Firebase Admin - Load service account from env or file
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // For Vercel/production: parse from env variable
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (err) {
    console.error(
      "Failed to parse FIREBASE_SERVICE_ACCOUNT from env:",
      err.message
    );
    process.exit(1);
  }
} else {
  // For local development: load from file
  try {
    serviceAccount = require("./plantKey.json");
  } catch (err) {
    console.error(
      "plantKey.json not found and FIREBASE_SERVICE_ACCOUNT env var not set. Firebase auth disabled."
    );
    serviceAccount = null;
  }
}

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✅ Firebase Admin initialized");
} else {
  console.warn(
    "⚠️ Firebase Admin not initialized - set FIREBASE_SERVICE_ACCOUNT env var for auth"
  );
}

// Configure allowed frontend origins via env (comma-separated). Falls back to localhost and the previously used Netlify URL.
const FRONTEND_URLS =
  process.env.FRONTEND_URLS ||
  "http://localhost:5173,https://spontaneous-clafoutis-c5c9c8.netlify.app";
const allowedOrigins = FRONTEND_URLS.split(",").map((u) => u.trim());

console.log("Allowed origins:", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

app.use(express.json());

// MongoDB URI

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.5u4x9tc.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  },
});

// Token Verification Middleware

async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }
    const idToken = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
}

// Server functions

async function run() {
  try {
    // Attempt to connect to MongoDB and log helpful errors when env vars are missing
    if (!process.env.DB_USERNAME || !process.env.DB_PASSWORD) {
      console.error(
        "Missing DB credentials: set DB_USERNAME and DB_PASSWORD environment variables."
      );
    }

    try {
      await client.connect();
      console.log("✅ MongoDB Connected Successfully!");
    } catch (dbErr) {
      console.error("Failed to connect to MongoDB:", dbErr.message || dbErr);
      throw dbErr;
    }

    const db = client.db("car");
    const carsCollection = db.collection("car-plant");
    const bookingsCollection = db.collection("bookings");

    // Root

    app.get("/", (req, res) =>
      res.send("Car Rental Server Running Successfully!")
    );

    // Top Car

    app.get("/api/cars/top-rated", async (req, res) => {
      const cars = await carsCollection.find({}).limit(21).toArray();
      res.json(cars);
    });

    // Browse Cars

    app.get("/api/cars/top-browse", async (req, res) => {
      const cars = await carsCollection.find({}).limit(27).toArray();
      res.json(cars);
    });

    // My Listings

    app.get("/api/car/my-listings", verifyToken, async (req, res) => {
      const email = req.user.email;
      const cars = await carsCollection
        .find({ providerEmail: email })
        .toArray();
      res.json(cars);
    });

    // Add Car

    app.post("/api/cars", verifyToken, async (req, res) => {
      const car = req.body;
      car.providerEmail = req.user.email;
      car.status = "available";
      const result = await carsCollection.insertOne(car);
      res
        .status(201)
        .json({ message: "Car added successfully!", id: result.insertedId });
    });

    // Single Car

    app.get("/api/cars/:id", async (req, res) => {
      const car = await carsCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      if (!car) return res.status(404).json({ message: "Car not found" });
      res.json(car);
    });

    // Update Car

    app.put("/api/cars/:id", verifyToken, async (req, res) => {
      const carId = req.params.id;
      const email = req.user.email;
      const car = await carsCollection.findOne({ _id: new ObjectId(carId) });
      if (!car) return res.status(404).json({ message: "Car not found" });
      if (car.providerEmail !== email) {
        return res
          .status(403)
          .json({ message: "You are not authorized to update this car" });
      }
      const updatedCar = req.body;
      await carsCollection.updateOne(
        { _id: new ObjectId(carId) },
        { $set: updatedCar }
      );
      const refreshedCar = await carsCollection.findOne({
        _id: new ObjectId(carId),
      });
      res.json({ message: "Car updated successfully", car: refreshedCar });
    });

    // Delete Car

    app.delete("/api/cars/:id", verifyToken, async (req, res) => {
      const carId = req.params.id;
      const email = req.user.email;
      const car = await carsCollection.findOne({ _id: new ObjectId(carId) });
      if (!car) return res.status(404).json({ message: "Car not found" });
      if (car.providerEmail !== email) {
        return res
          .status(403)
          .json({ message: "You are not authorized to delete this car" });
      }
      await carsCollection.deleteOne({ _id: new ObjectId(carId) });
      res.json({ message: "Car deleted successfully" });
    });

    // Book a Car

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

    // Search Cars

    app.get("/api/cars/search", async (req, res) => {
      const q = req.query.q || "";
      const cars = await carsCollection
        .find({ name: { $regex: q, $options: "i" } })
        .toArray();
      res.json(cars);
    });

    console.log("✅ Server setup complete");
  } catch (error) {
    console.error("Server Error:", error);
  }
}

run().catch(console.error);

// Listen

app.listen(port, () => console.log(`✅ Server running on port ${port}`));
