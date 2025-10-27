# Code Review AI Backend

A Go-based REST API backend for an AI-powered code review assistant with user authentication and OpenAI integration.

## Features

- User authentication (register/login) with JWT tokens
- Secure password hashing with bcrypt
- Chat functionality with OpenAI GPT-4o for code reviews
- Conversation history persistence
- User isolation - users can only access their own conversations
- PostgreSQL database for data persistence

## Architecture

The backend follows a clean layered architecture:

- **Service Layer**: Handles HTTP request/response marshaling and JSON serialization
- **Handler Layer**: Contains business logic and validation
- **Repository Layer**: Database operations and data access
- **Middleware Layer**: Authentication and request processing

## API Endpoints

### Authentication

#### Register
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

#### Login
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

### Chat (Requires Authentication)

#### Send Message
```
POST /api/v1/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "conversation_id": "string (optional)",
  "message": "string"
}
```

## Setup

### Prerequisites

- Go 1.25.1 or higher
- PostgreSQL database
- OpenAI API key

### Database Setup

1. Create a PostgreSQL database
2. Run the schema from `db/schema.sql`

### Configuration

Update `config.yaml` with your settings:

```yaml
env: development

db:
  host: localhost
  port: 5432
  user: your_user
  password: your_password
  name: code_review
  ssl_mode: disable

server:
  port: "8080"

credentials:
  openai_key: "your-openai-api-key"
  jwt_secret: "your-jwt-secret"
```

### Running

```bash
go build -o bin/server ./main.go
./bin/server
```

## Technologies

- Go 1.25.1
- Chi Router
- PostgreSQL
- OpenAI Go SDK
- JWT for authentication
- Bcrypt for password hashing

