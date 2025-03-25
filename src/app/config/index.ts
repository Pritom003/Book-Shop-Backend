import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  port: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  DB_URL: process.env.DV_URI || '',
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
  jwt_refresh_token_expires_in: process.env.jwt_refresh_secret,

  jwt_access_token_expires_in: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  sp_endpoint: process.env.SP_ENDPOINT,
  sp_username: process.env.SP_USERNAME,
  sp_password: process.env.SP_PASSWORD,
  sp_prefix: process.env.SP_PREFIX,
  sp_return_url: process.env.SP_RETURN_URL,
  reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
  email_user: process.env.EMAIL_PASSEMAIL_USER,
  email_pass: process.env.EMAIL_PASS,
};