import dotenv from "dotenv";
dotenv.config(); // ensures .env is loaded whenever this file runs

import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI|| "";
const DB_NAME = process.env.DB_NAME || "resoursemanagement";

console.log("Loaded MONGO_URI:", MONGO_URI);
console.log("Loaded DB_NAME:", DB_NAME);

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default connectDB;





// import mongoose from "mongoose";
// import dotenv from "dotenv";
// dotenv.config();


// const MONGO_URI=process.env.MONGO_URI || "";

// console.log("MONGO_URI:", process.env.MONGO_URI);
// console.log("DB_NAME:", process.env.DB_NAME);


// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(MONGO_URI, {
//       dbName: process.env.DB_NAME || "resoursemanagement",
//     });

//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error("MongoDB connection error: ", error);
//     process.exit(1); // Stop the server if DB fails
//   }
// };

// export default connectDB;
