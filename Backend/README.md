# Backend

## Required Packages

- express
- mongoose
- jsonwebtoken
- bcrypt
- express-validator
- redis
- dotenv
- cors

## Endpoints

### User Registration

- **URL:** `/users/register`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Responses:**
  - `201 Created`: User registered successfully.
  - `400 Bad Request`: Validation errors.
  - `409 Conflict`: User already exists.

### User Login

- **URL:** `/users/login`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Responses:**
  - `200 OK`: User logged in successfully.
  - `400 Bad Request`: Validation errors.
  - `401 Unauthorized`: Invalid email or password.

### User Profile

- **URL:** `/users/profile`
- **Method:** `GET`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Responses:**
  - `200 OK`: User profile retrieved successfully.
  - `401 Unauthorized`: Token is missing or invalid.

### User Logout

- **URL:** `/users/logout`
- **Method:** `GET`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Responses:**
  - `200 OK`: User logged out successfully.
  - `401 Unauthorized`: Token is missing or invalid.


  "@google/generative-ai": "^0.21.0",
    "bcrypt": "^5.1.1",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "express-validator": "^7.2.1",
    "ioredis": "^5.4.2",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.9.5",
    "morgan": "^1.10.0",
    "socket.io": "^4.8.1"