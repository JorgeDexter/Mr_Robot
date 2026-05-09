# Surveillance Analytics Backend

Standalone Node.js backend — Fastify, Socket.io, Redis Pub/Sub, PostgreSQL.

## Quick Start (Docker)

```bash
cd backend
docker-compose up --build
```

Server starts at `http://localhost:3001`.

## Quick Start (Local)

Requires Redis and PostgreSQL running locally.

```bash
cd backend
npm install
cp .env .env.local   # edit connection strings if needed
npm run dev
```

## REST API

| Method | Endpoint            | Description                         |
|--------|---------------------|-------------------------------------|
| GET    | `/`                 | Service info + route map            |
| GET    | `/status`           | Health check + service connectivity |
| GET    | `/analytics`        | Full analytics snapshot             |
| POST   | `/detect`           | Submit face detection event         |
| POST   | `/privacy/enable`   | Enable privacy mode                 |
| POST   | `/privacy/disable`  | Disable privacy mode                |

### POST /detect body

```json
{
  "camera_id": "cam_lobby_01",
  "confidence": 0.92,
  "bbox": { "x": 120, "y": 80, "w": 200, "h": 200 },
  "metadata": { "label": "person_A" }
}
```

## WebSocket Events (Socket.io)

Connect to `ws://localhost:3001`.

| Event              | Direction     | Description                      |
|--------------------|---------------|----------------------------------|
| face_detected      | server→client | New face detection               |
| tracking_alert     | server→client | High-confidence / perimeter alert|
| privacy_enabled    | server→client | Privacy mode turned on           |
| analytics_update   | server→client | Updated analytics counters       |
| camera_connected   | server→client | Camera status change             |
| subscribe_camera   | client→server | Join a camera-specific room      |
| request_status     | client→server | Request current analytics        |

## Demo Mode

Set `DEMO_MODE=true` in `.env` to emit fake surveillance events every 3 seconds — no real cameras needed.

## Architecture

```
backend/
├── src/
│   ├── routes/          # Fastify route registrations
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic + DB/Redis
│   ├── sockets/         # Socket.io handlers + demo emitter
│   ├── middleware/       # Rate limit configs
│   ├── analytics/       # Aggregation queries
│   ├── config/          # Centralized config from env
│   └── utils/           # Logger
│   └── app.js           # Fastify app builder
├── server.js            # Entry point
├── Dockerfile
├── docker-compose.yml
└── .env
```
