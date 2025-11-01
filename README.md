# Travel-Delite 🌍

A comprehensive travel booking API built with Express.js, TypeScript, and Prisma ORM.

## 🚀 Features

- **Experience Management**: Browse and view travel experiences
- **Booking System**: Create bookings with automatic slot management
- **Promo Code System**: Apply discount codes with automatic price calculation
- **Database Integration**: PostgreSQL with Prisma ORM
- **Type Safety**: Full TypeScript implementation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database
- **Git**

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ShauryaRahlon/Travel-Delite.git
cd Travel-Assign
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/travel_delite"
PORT=3000
```

### 4. Database Setup

```bash

npx prisma generate

npx prisma db push

npx prisma db seed
```

### 5. Start the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Documentation

### Base URL

```
http://localhost:3000
```

## Available Routes

### 1. **Health Check**

**GET** `/`

**Description**: Check if the server is running

**Response**:

```json
"Welcome to the Booklt API! 👋"
```

**Postman Test**:

- Method: `GET`
- URL: `http://localhost:4000/`

---

### 2. **Get All Experiences**

**GET** `/api/experiences`

**Description**: Retrieve all available travel experiences

**Response**:

```json
[
  {
    "id": "experience_id",
    "name": "Experience Name",
    "description": "Experience description",
    "price": 1500,
    "slots": [...]
  }
]
```

**Postman Test**:

- Method: `GET`
- URL: `http://localhost:3000/api/experiences`

---

### 3. **Get Experience by ID**

**GET** `/api/experiences/:id`

**Description**: Retrieve a specific experience by ID

**Response**:

```json
{
  "id": "experience_id",
  "name": "Experience Name",
  "description": "Experience description",
  "price": 1500,
  "slots": [...]
}
```

**Postman Test**:

- Method: `GET`
- URL: `http://localhost:3000/api/experiences/cmhcdbo8z0000y173vd3mqd6i`

---

### 4. **Validate Promo Code**

**POST** `/api/promo/validate`

**Description**: Validate a promo code and get discount details

**Request Body**:

```json
{
  "code": "SAVE10"
}
```

**Response (Valid Code)**:

```json
{
  "message": "Promo code applied successfully",
  "promoDetails": {
    "type": "percentage",
    "value": 10
  }
}
```

**Response (Invalid Code)**:

```json
{
  "message": "Promo code not found"
}
```

**Available Promo Codes**:

- `SAVE10` - 10% discount
- `FLAT100` - ₹100 off
- `WELCOME20` - 20% discount
- `FLAT50` - ₹50 off

**Postman Test**:

- Method: `POST`
- URL: `http://localhost:3000/api/promo/validate`
- Headers: `Content-Type: application/json`
- Body (raw JSON):

```json
{
  "code": "SAVE10"
}
```

---

### 5. **Create Booking**

**POST** `/api/bookings`

**Description**: Create a new booking with automatic promo code validation and price calculation

**Request Body**:

```json
{
  "experienceId": "cmhcdbo8z0000y173vd3mqd6i",
  "slotId": "cmhcdbo8z0001y173lqvnrfg8",
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "finalPrice": 1500,
  "promoCode": "SAVE10"
}
```

**Response (Success)**:

```json
{
  "id": "booking_id",
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "finalPrice": 1350,
  "promoCode": "SAVE10",
  "experienceId": "cmhcdbo8z0000y173vd3mqd6i",
  "slotId": "cmhcdbo8z0001y173lqvnrfg8",
  "promoDetails": {
    "type": "percentage",
    "value": 10
  },
  "originalPrice": 1500,
  "discountApplied": 150
}
```

**Response (Invalid Promo)**:

```json
{
  "message": "Invalid promo code"
}
```

**Response (Slot Full)**:

```json
{
  "message": "Slot is sold out or not found."
}
```

**Postman Test**:

- Method: `POST`
- URL: `http://localhost:3000/api/bookings`
- Headers: `Content-Type: application/json`
- Body (raw JSON):

```json
{
  "experienceId": "cmhcdbo8z0000y173vd3mqd6i",
  "slotId": "cmhcdbo8z0001y173lqvnrfg8",
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "finalPrice": 1500,
  "promoCode": "SAVE10"
}
```

## 🧪 Testing with Postman

### Complete Testing Flow:

1. **Start Server**: `npm run dev`
2. **Health Check**: `GET http://localhost:3000/`
3. **Browse Experiences**: `GET http://localhost:3000/api/experiences`
4. **Get Specific Experience**: `GET http://localhost:3000/api/experiences/{id}`
5. **Validate Promo**: `POST http://localhost:3000/api/promo/validate`
6. **Create Booking**: `POST http://localhost:3000/api/bookings`

### Important Notes for Testing:

- **Content-Type**: Always set `Content-Type: application/json` for POST requests
- **Valid IDs**: Use actual database IDs for `experienceId` and `slotId`
- **Promo Codes**: Use valid codes: `SAVE10`, `FLAT100`, `WELCOME20`, `FLAT50`
- **Email Format**: Use valid email format for `userEmail`

## 🗂️ Project Structure

```
src/
├── app.ts                          # Express app configuration
├── server.ts                       # Server entry point
├── db.ts                          # Database connection
├── types.d.ts                     # Type definitions
├── features/
│   ├── experiences/
│   │   ├── experience.controller.ts
│   │   └── experience.routes.ts
│   └── promo/
│       ├── promo.controller.ts
│       └── promo.routes.ts
├── Bookings/
│   ├── booking.controller.ts
│   └── booking.routes.ts
└── utils/
    └── promoCodes.ts              # Shared promo code logic
```

## 🔧 Scripts

- `npm run dev` - Start development server with auto-reload
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema changes to database
- `npx prisma db seed` - Seed database with initial data
- `npx prisma studio` - Open Prisma Studio (database GUI)

## 🚨 Troubleshooting

### Common Issues:

1. **404 Error**: Ensure server is running and using correct URLs
2. **Port 5000 Conflict**: macOS AirPlay uses port 5000, use port 3000 instead
3. **Database Connection**: Check `.env` file and PostgreSQL connection
4. **Import Errors**: Ensure all `.js` extensions are included in imports

### Error Responses:

- **400**: Bad Request (invalid input, validation errors)
- **404**: Not Found (invalid route, promo code, or resource)
- **500**: Internal Server Error (database issues, server problems)

---

Happy coding!
