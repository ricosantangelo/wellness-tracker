require('dotenv').config();


module.exports = {
  "development": {
    "username": process.env.DEV_DB_USER,
    "password": process.env.DEV_DB_PASSWORD, 
    "database": process.env.DEV_DB_NAME,
    "host": process.env.DEV_DB_HOST,
    "dialect": "mysql"
    // ... other configurations specific to development
  },
  "test": {
    "username": process.env.TEST_DB_USER,
    "password": process.env.TEST_DB_PASSWORD, 
    "database": process.env.TEST_DB_NAME,
    "host": process.env.TEST_DB_HOST,
    "dialect": "mysql"
    // ... other configurations specific to testing
  },
  "production": {
    "use_env_variable": "JAWSDB_URL",
    "dialect": "mysql",
    "dialectOptions": {
      "ssl": {
        "require": true,
        "rejectUnauthorized": false  // Consider obtaining a proper SSL certificate in production
      }
    }
    // ... other configurations specific to production
  }
};
