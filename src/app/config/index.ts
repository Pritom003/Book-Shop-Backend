import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT || 5000, // Default to 5000 if not defined
  DB_URL: process.env.DV_URI as string,
};
