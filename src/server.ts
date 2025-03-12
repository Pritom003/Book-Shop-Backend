import mongoose from 'mongoose';
// import { config } from 'dotenv';
import app from './app';
import config from './app/config';
// import config from './app/config';

// Main function to handle DB connection and app listening
async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.DB_URL);
    console.log('Connected to MongoDB');

    // Start the Express app
    app.listen(config.port, () => {
      console.log(`App listening on port ${config.port}`);
    });
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

main();
