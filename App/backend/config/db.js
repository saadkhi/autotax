import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Support both MONGO_URI and DATABASE_URL environment variables
    const mongoURI = process.env.MONGO_URI || process.env.DATABASE_URL;
    
    if (!mongoURI) {
      console.error("ERROR: MONGO_URI or DATABASE_URL is not defined in environment variables.");
      console.error("Please add MONGO_URI or DATABASE_URL to your .env file at the project root.");
      process.exit(1);
    }
    
    // Remove quotes if present (common in .env files)
    const cleanURI = mongoURI.replace(/^['"]|['"]$/g, '');
    
    await mongoose.connect(cleanURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;