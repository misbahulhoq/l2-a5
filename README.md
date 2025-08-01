# Ride Booking API

A secure, scalable, and role-based backend API for a ride-booking system, similar to Uber or Pathao. This project is built with Express.js, Mongoose, and TypeScript, focusing on a clean, modular architecture.

## Key Features

- **JWT-Based Authentication**: Secure login system for three distinct roles.
- **Role-Based Authorization**: Endpoints are protected, ensuring users can only access features permitted for their role.
- **Complete Ride Lifecycle**: Full logic for requesting, accepting, progressing, completing, and canceling rides.
- **Admin Management**: Admins have full oversight to manage users, drivers, and view all system data.

### Role-Specific Features

- **Riders can**:
  - Request a ride to a specific destination.
  - Cancel their ride requests.
  - View their complete ride history.
- **Drivers can**:
  - View and accept available ride requests.
  - Update the status of an active ride (`picked_up`, `in_transit`, `completed`).
  - Set their availability (`online`/`offline`).
  * View their ride history and total earnings.
- **Admins can**:
  - View all users, drivers, and rides in the system.
  - Approve or suspend driver accounts.
  - Block or unblock any user account.

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (local instance or a cloud service like MongoDB Atlas)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd ride-booking-api
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Environment Configuration

1.  Create a `.env` file in the root directory of the project.
2.  Copy the contents of `.env.example` into it and provide the necessary values.

**.env.example**

```env
# Port for the server
PORT=5000

# Your MongoDB connection string
DATABASE_URL=mongodb://localhost:27017/ride-booking-db

# JWT Configuration
JWT_SECRET=a_very_secret_and_long_string_for_production
JWT_EXPIRES_IN=1d

# Node environment
NODE_ENV=development
```

### Running the Application

- **For development (with hot-reloading):**
  ```bash
  npm run dev
  ```
- **To build for production:**
  ```bash
  npm run build
  ```
- **To run in production:**
  ```bash
  npm run start
  ```
- **To run tests:**
  ```bash
  npm test
  ```

---

## API Endpoints Summary

### Authentication

| Method | Endpoint              | Description                    | Protected By |
| :----- | :-------------------- | :----------------------------- | :----------- |
| `POST` | `/api/v1/auth/signup` | Register a new user or driver. | Public       |
| `POST` | `/api/v1/auth/login`  | Log in a user.                 | Public       |

### Users (Admin)

| Method  | Endpoint                   | Description                               | Protected By |
| :------ | :------------------------- | :---------------------------------------- | :----------- |
| `GET`   | `/api/v1/users`            | Get a list of all users.                  | Admin        |
| `PATCH` | `/api/v1/users/:id/status` | Block or unblock a specific user account. | Admin        |

### Drivers

| Method  | Endpoint                              | Description                                      | Protected By |
| :------ | :------------------------------------ | :----------------------------------------------- | :----------- |
| `PATCH` | `/api/v1/drivers/:id/approval-status` | (Admin) Approve or suspend a driver.             | Admin        |
| `PATCH` | `/api/v1/drivers/me/availability`     | (Driver) Set own availability to online/offline. | Driver       |
| `GET`   | `/api/v1/drivers/me/history`          | (Driver) Get own ride and earnings history.      | Driver       |

### Rides

| Method  | Endpoint                       | Description                                     | Protected By |
| :------ | :----------------------------- | :---------------------------------------------- | :----------- |
| `GET`   | `/api/v1/rides`                | (Admin) Get a list of all rides in the system.  | Admin        |
| `POST`  | `/api/v1/rides/request`        | (Rider) Request a new ride.                     | Rider        |
| `GET`   | `/api/v1/rides/my-history`     | (Rider) Get own ride history.                   | Rider        |
| `GET`   | `/api/v1/rides/available`      | (Driver) Get a list of available ride requests. | Driver       |
| `PATCH` | `/api/v1/rides/:rideId/accept` | (Driver) Accept a ride request.                 | Driver       |
| `PATCH` | `/api/v1/rides/:rideId/status` | (Driver) Update the status of an active ride.   | Driver       |
| `PATCH` | `/api/v1/rides/:rideId/cancel` | (Rider) Cancel a requested or accepted ride.    | Rider        |

---

## Technology Stack

- **Backend**: Node.js, Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcryptjs
- **Testing**: Jest, Supertest
