// Setup environment variables for tests before config.ts loads
process.env.PORT = '4000';
process.env.FAKE_STORE_BASE_URL = 'https://fakestoreapi.com';
process.env.EMAIL_PROVIDER = 'console';
process.env.FRONTEND_URL = 'http://localhost:5173';
