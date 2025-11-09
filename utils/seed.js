import mongoose from "mongoose";
import User from "../models/user.js";
import Album from "../models/album.js";

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Album.deleteMany({});
    console.log("Cleared existing data");

    // Create users
    const passwordHash1 = await User.hashPassword("password123");
    const user1 = await User.create({
      email: "joe@example.com",
      name: "Joe Doe",
      passwordHash: passwordHash1,
    });

    const passwordHash2 = await User.hashPassword("password456");
    const user2 = await User.create({
      email: "megan@example.com",
      name: "Megan Wall",
      passwordHash: passwordHash2,
    });

    console.log("Created users");

    // Create example albums with Joe ID
    await Album.create([
      {
        title: "IGOR",
        artist: "Tyler, The Creator",
        genre: ["Hip-Hop", "Rap"],
        year: 2019,
        listened: true,
        rating: 8.5,
        review: "woahhhhhh",
        userId: user1._id,
      },
      {
        title: "In search of...",
        artist: "N.E.R.D",
        genre: ["Rock", "Hip-Hop"],
        year: 2001,
        listened: false,
        userId: user1._id,
      },
      {
        title: "The Fat of the Land",
        artist: "The Prodigy",
        genre: ["Electronic", "Rock"],
        year: 1997,
        listened: true,
        rating: 9.0,
        review: "wowwwwww",
        userId: user1._id,
      },
    ]);

    // Create example albums with Megan ID
    await Album.create([
      {
        title: "Plastic Beach",
        artist: "Gorillaz",
        genre: ["Alternative", "Indie"],
        year: 2010,
        listened: true,
        rating: 3.0,
        review: "boooooo",
        userId: user2._id,
      },
      {
        title: "Wildflower",
        artist: "The Avalanches",
        genre: ["Electronic", "Indie"],
        year: 2016,
        listened: true,
        rating: 7.5,
        review: "pretty good",
        userId: user2._id,
      },
      {
        title: "Californication",
        artist: "Red Hot Chili Peppers",
        genre: ["Rock", "Funk"],
        year: 1991,
        listened: false,
        userId: user2._id,
      },
    ]);

    console.log("Created albums");
    console.log("\nSeed data added successfully!");
    console.log(`User 1 ID: ${user1._id}`);
    console.log(`User 2 ID: ${user2._id}`);

    await mongoose.connection.close();
    console.log("\nDatabase connection closed");
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
