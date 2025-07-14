# URL Shortener Microservice

This is a simple and practical URL shortener service built with Node.js, Express, and MongoDB. It lets you create short links for long URLs, set expiry times, and track usage stats.

## Features

- Shorten any valid URL
- Custom or auto-generated shortcodes
- Set expiry time for each short URL (in minutes)
- Track total clicks and basic stats
- RESTful API endpoints

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- MongoDB (local or Atlas)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Abhinaba35/12223469.git
   cd 12223469
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   BASE_URL=http://localhost:3000
   ```

### Running the Service
Start the server in development mode:
```bash
npm run dev
```
Or in production mode:
```bash
npm start
```

## API Endpoints

### Create a Short URL
- **POST** `/shorturls`
- **Body:**
  ```json
  {
    "url": "https://example.com",
    "validity": 60,           
    "shortcode": "custom123" 
  }
  ```
- **Response:**
  ```json
  {
    "shortLink": "http://localhost:3000/abc123",
    "expiry": "2025-07-14T12:00:00.000Z"
  }
  ```

### Redirect to Original URL
- **GET** `/:shortcode`
- Redirects to the original URL if valid and not expired.

### Get Short URL Stats
- **GET** `/shorturls/:shortcode`
- Returns stats including total clicks, creation and expiry time.

## Notes
- The `.env` file is excluded from version control for security.
- All logs are handled via a custom logger and sent to a remote evaluation service.
