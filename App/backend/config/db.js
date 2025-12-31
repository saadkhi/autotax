import mongoose from "mongoose";

let retryCount = 0;
const MAX_RETRIES = 10;

const connectDB = async (isRetry = false) => {
  // Support both MONGO_URI and DATABASE_URL environment variables
  const mongoURI = process.env.MONGO_URI || process.env.DATABASE_URL;
  
  if (!mongoURI) {
    console.error("ERROR: MONGO_URI or DATABASE_URL is not defined in environment variables.");
    console.error("Please add MONGO_URI or DATABASE_URL to your .env file at the project root.");
    if (!isRetry) {
      process.exit(1);
    }
    return;
  }
  
  // Remove quotes if present (common in .env files)
  const cleanURI = mongoURI.replace(/^['"]|['"]$/g, '');
  
  // Set connection options
  const options = {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000,
  };

  try {
    await mongoose.connect(cleanURI, options);
    console.log("✅ MongoDB connected successfully");
    retryCount = 0; // Reset retry count on success
  } catch (error) {
    if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
      if (!isRetry) {
        console.error("\n❌ ERROR: Cannot connect to MongoDB server.");
        console.error("   MongoDB is not running or not accessible at the configured address.");
        console.error(`   Attempted to connect to: ${cleanURI.replace(/\/\/.*@/, '//***:***@')}`);
        console.error("\n📋 To fix this:");
        console.error("   1. Make sure MongoDB is installed on your system");
        console.error("   2. Start MongoDB service:");
        console.error("      - Linux: sudo systemctl start mongod");
        console.error("      - macOS: brew services start mongodb-community");
        console.error("      - Windows: net start MongoDB");
        console.error("   3. Or use MongoDB Atlas (cloud) and update your .env file");
        console.error("\n   The server will continue to retry connection in the background...\n");
      }
      
      // Retry connection with exponential backoff
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        const delay = Math.min(5000 * retryCount, 30000); // Max 30 seconds
        setTimeout(() => {
          console.log(`🔄 Retrying MongoDB connection (attempt ${retryCount}/${MAX_RETRIES})...`);
          connectDB(true);
        }, delay);
      } else {
        console.error(`\n⚠️  Maximum retry attempts (${MAX_RETRIES}) reached. MongoDB connection failed.`);
        console.error("   Please start MongoDB and restart the server.\n");
      }
    } else {
      console.error(`ERROR: ${error.message}`);
      if (!isRetry) {
        process.exit(1);
      }
    }
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected. Attempting to reconnect...');
  retryCount = 0;
  connectDB(true);
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

export default connectDB;