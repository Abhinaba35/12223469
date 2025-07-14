# URL Shortener Microservice

A robust HTTP URL Shortener Microservice built with Node.js and Express.js that provides core URL shortening functionality along with basic analytical capabilities.

## Features

- Create shortened URLs with optional custom shortcodes
- Automatic shortcode generation if not provided
- Configurable URL validity (defaults to 30 minutes)
- URL redirection with click tracking
- Comprehensive statistics and analytics
- Extensive logging integration with external logging service
- Robust error handling with appropriate HTTP status codes

## API Endpoints

### Create Short URL
- **Method:** POST
- **Route:** `/shorturls`
- **Request Body:**
```json
{
  "url": "https://very-very-very-long-and-descriptive-subdomain-that-goes-on-and-on.somedomain.com/additional/directory/levels/for/more/length/really-log-page",
  "validity": 30,
  "shortcode": "abcdl"
}
```
- **Response (201):**
```json
{
  "shortLink": "http://localhost:3000/abcdl",
  "expiry": "2025-01-01T06:30:00.000Z"
}
```

### Retrieve Short URL Statistics
- **Method:** GET
- **Route:** `/shorturls/:shortcode`
- **Response (200):**
```json
{
  "shortcode": "abcdl",
  "originalUrl": "https://example.com",
  "createdAt": "2025-01-01T06:00:00.000Z",
  "expiryTime": "2025-01-01T06:30:00.000Z",
  "totalClicks": 5,
  "isExpired": false,
  "validity": 30,
  "clickData": [
    {
      "timestamp": "2025-01-01T06:15:00.000Z",
      "referrer": "direct",
      "userAgent": "Mozilla/5.0...",
      "ip": "127.0.0.1"
    }
  ]
}
```

### URL Redirection
- **Method:** GET
- **Route:** `/:shortcode`
- **Response:** 302 Redirect to original URL

## Setup and Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
AUTH_TOKEN=your_auth_token_from_test_server
BASE_URL=http://localhost:3000
PORT=3000
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Environment Variables

- `AUTH_TOKEN`: Authorization token for the external logging service
- `BASE_URL`: Base URL for generating short links (default: http://localhost:3000)
- `PORT`: Server port (default: 3000)

## Dependencies

- **express**: Web framework for Node.js
- **axios**: HTTP client for making API requests to logging service
- **uuid**: For generating unique identifiers
- **cors**: Cross-Origin Resource Sharing middleware
- **dotenv**: Environment variable management

## Logging

The application uses a comprehensive logging middleware that sends logs to an external test server. All significant operations are logged with appropriate log levels:

- `info`: General information about operations
- `debug`: Detailed debugging information
- `warn`: Warning messages for non-critical issues
- `error`: Error messages for failed operations
- `fatal`: Critical system failures

## Error Handling

The API returns appropriate HTTP status codes and descriptive JSON responses:

- `200`: Success
- `201`: Created
- `302`: Redirect
- `400`: Bad Request (invalid input)
- `404`: Not Found (shortcode doesn't exist)
- `409`: Conflict (shortcode already exists)
- `500`: Internal Server Error

## Architecture

The microservice follows a modular architecture:

- `index.js`: Main application and route handlers
- `urlShortenerService.js`: Core business logic
- `loggingMiddleware.js`: External logging integration
- `logger.js`: Logging utility wrapper
- `package.json`: Project configuration and dependencies