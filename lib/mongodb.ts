import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env")
}

async function dbConnect() {
  try {
    const opts = {
      bufferCommands: false,
    }

    if (mongoose.connection.readyState !== 1) {
      console.log("Connecting to MongoDB...")
      await mongoose.connect(MONGODB_URI as string, opts)
      console.log("Connected to MongoDB")
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error)
    throw error
  }
}

export default dbConnect
