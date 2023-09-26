--  Creating db wellnessDB --
-- CREATE DATABASE wellnessDB;

-- Use db wellnessDB --
-- USE wellnessDB;

-- See db in use --
-- SELECT DATABASE();


-- Create the wellnessDB_dev database
CREATE DATABASE IF NOT EXISTS wellnessDB_dev;
USE wellnessDB_dev;
-- Create the Users table
CREATE TABLE IF NOT EXISTS Users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    resetCode VARCHAR(255), -- nullable, since it won't always have a value
    resetCodeExpiresAt TIMESTAMP, -- nullable, since it won't always have a value
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Create the Conversations table
CREATE TABLE IF NOT EXISTS Conversations (
    conversationId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE
);
-- Create the Messages table
CREATE TABLE IF NOT EXISTS Messages (
    messageId INT AUTO_INCREMENT PRIMARY KEY,
    conversationId INT,
    userId INT,
    type ENUM('user', 'ai') NOT NULL,
    content TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (conversationId) REFERENCES Conversations(conversationId) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE SET NULL
);