# Lotus E-commerce Platform

## Prerequisites
- Node.js (v18+)
- .NET 8 SDK
- Docker & Docker Compose
- PostgreSQL (optional if running locally without Docker)
- Redis (optional if running locally without Docker)

## Project Structure
- `client/`: React Frontend (Vite + TypeScript + Tailwind)
- `server/`: ASP.NET Core 8 Backend (Clean Architecture)
  - `src/API`: Web API entry point
  - `src/Application`: Business logic and use cases
  - `src/Domain`: Enterprise logic and entities
  - `src/Infrastructure`: External concerns (Database, etc.)
- `docker-compose.yml`: Orchestration for local development

## Getting Started

### Using Docker (Recommended)
1. Run `docker-compose up --build`
2. Access Frontend: http://localhost:3000
3. Access API: http://localhost:5000/swagger

### Manual Setup

#### Backend
1. Navigate to `server/`
2. Run `dotnet restore`
3. Run `dotnet run --project src/API/LotusEcommerce.API.csproj`

#### Frontend
1. Navigate to `client/`
2. Run `npm install`
3. Run `npm run dev`
