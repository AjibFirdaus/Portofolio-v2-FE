# Portofolio-v2

## Overview
Portofolio-v2 is a modern web application designed to showcase personal and professional achievements. This project leverages cutting-edge web technologies to provide a seamless and interactive user experience. Users can update their information, including images, personal data, phone numbers, and more.

## Frontend

### Framework
- **React Vite**: A fast, opinionated build tool that leverages ES modules, providing a superior development experience and faster builds.

### Packages Used
- **axios**: A promise-based HTTP client for making requests to the backend.
- **daisyUI**: A plugin for Tailwind CSS that provides a set of customizable, accessible UI components.
- **socket.io-client**: A client-side library that enables real-time, bidirectional, and event-based communication with the backend.

## Backend

### Framework
- **Node.js Express**: A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

### Packages Used
- **prisma**: An ORM (Object-Relational Mapping) tool used to interact with the MySQL database seamlessly.
- **bcrypt**: A library to help hash passwords, ensuring secure storage of user credentials.
- **crypto-js**: A library for encrypting data, used here to encrypt JSON Web Tokens (JWT).
- **jsonwebtoken (JWT)**: A package to sign and verify JSON Web Tokens, used for managing user authentication and authorization.
- **express-rate-limit**: Middleware to protect the application from brute-force attacks by limiting repeated requests to public APIs.
- **helmet**: Middleware that helps secure Express applications by setting various HTTP headers.
- **socket.io**: A library that enables real-time, bidirectional, and event-based communication between the frontend and backend.

## Features
- **User Authentication**: Secure login and registration system with encrypted password storage and JWT-based session management.
- **Real-time Updates**: Real-time communication between the frontend and backend using Socket.io.
- **Rate Limiting**: Protection against brute-force attacks with rate limiting.
- **Secure Data Transfer**: Enhanced security for data transfer with Helmet.
- **User Profile Management**: Allows users to update their personal information, including images, personal data, and phone numbers.

## Installation and Setup

### Prerequisites
- Node.js (v20 or later)
- MySQL

