# Job Application Tracker API

A dedicated RESTful API built to handle job applications, contact tracking, and interview/event scheduling.

## Tech Stack

- Node.js and Express: Server routing and building RESTful API endpoints.
- PostgreSQL: Storing data using SQL tables, primary and foreign keys, and structured schema design.
- Dotenv: Managing database credentials and local environments settings.
- Jest and Supertest: Unit and integration tests to verify API routes and database queries.

## Key Features and Backend Capabilities

- RESTful API Routes: Full CRUD (Create, Read, Update, Delete) operations for managing job applications, contacts and interviews/events.
- Relational Database Design: Uses PostgreSQL foreign keys to link application entries to specific contacts, notes and company data.
- Error Handling and Validation: Middleware to catch invalid requests, handle database errors, and return appropriate status codes.
- Integration Testing: Comprehensive test coverage using Jest and Supertest to validate requests, responses, and database queries.

## Project Structure

```job-tracker/
|-- backend/
    |-- middleware/
    |-- routes/
    |-- tests/
    |-- db.js
    |-- app.js
    |-- schema.sql
    |-- server.js
|-- frontend/
    |-- api.js
|-- expressError.js
|-- .env.example
|-- package.json
|-- README.md
```
