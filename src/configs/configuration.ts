import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  port: parseInt(process.env.PORT, 10) || 8000,

  database: {
    type: process.env.DB_TYPE || 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USERNAME || 'chatapp_user',
    password: process.env.DB_PASSWORD || 'chatapp_password_123',
    database: process.env.DB_NAME || 'chatapp',
  },

  access_token: {
    secret: process.env.JWT_ACCESS_TOKEN_SECRET || 'defaultSecretKey',
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '1800',
  },

  refresh_token: {
    secret: process.env.JWT_REFRESH_TOKEN_SECRET || 'defaultRefreshSecretKey',
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '25200',
  },

  apiKey: process.env.API_KEY || 'your-api-key',
}));
