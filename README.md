# Karate Sessions

A full-stack scheduling app for private karate training, built for the TeamLift internship challenge. Customers can book a session, while the coach can manage availability and review reservations.

**[Live demo](https://karate-sessions.vercel.app/)** · **[GitHub repository](https://github.com/dkaramanov11/scheduling-app)**

> The backend runs on Render's free tier and may take around 1–2 minutes to wake up after inactivity. If the initial request fails, wait briefly and refresh the page.

## The idea

I turned the general scheduling brief into a booking experience for a private karate coach. Karate is part of my own background, so I used it to guide the visual design, coach profile, training options, and AI feature.

The booking interface follows a simple flow: **choose a date → select a time → enter your details and confirm**. The coach workspace uses a similar calendar layout to keep both experiences consistent.

## Features

- **Session booking:** browse available dates and times, review session details, and book with a name and email.
- **Training preferences:** optionally choose Kihon, Kata, or Kumite and a beginner, intermediate, or advanced experience level.
- **Coach workspace:** review upcoming slots, filter by status and training focus, and inspect customer details for booked sessions.
- **Availability management:** create slots in a modal, cancel reservations to release their slots, and remove unbooked slots from the schedule.
- **Conflict prevention:** reject overlapping slots and unavailable bookings; adjacent time slots are allowed.
- **Google Calendar integration:** hide slots that overlap with the connected coach's calendar from public availability and mark them as busy in the coach workspace. Booking requests also check for calendar conflicts.
- **AI karate facts:** generate short English karate facts through a backend endpoint that calls Gemini, with request limits and error handling.
- **Responsive interface:** calendar-based layouts for desktop and mobile, loading and error states, and dismissible success notifications.

## Technology

| Area | Tools |
| --- | --- |
| Frontend | React, JavaScript, Vite, CSS |
| Backend | Java 21, Spring Boot, Spring Data JPA, Bean Validation, Lombok |
| Database | PostgreSQL, Flyway migrations |
| Integrations | Google Calendar API with OAuth 2.0, Gemini API |
| Deployment | Vercel frontend, Docker backend on Render, Neon PostgreSQL |

The frontend calls relative `/api` paths. Vite proxies these requests locally, while `frontend/vercel.json` forwards them to the hosted backend. API keys and database credentials stay on the backend.

## Run locally

### Requirements

- JDK 21, with `JAVA_HOME` pointing to the JDK.
- Node.js 22.12+ (or Node.js 20.19+), plus npm.
- PostgreSQL running locally, or a PostgreSQL connection you can access.

### 1. Clone the repository

```bash
git clone https://github.com/dkaramanov11/scheduling-app.git
cd scheduling-app
```

### 2. Configure the database

You can start the included development database from the repository root with `docker compose up -d postgres` (Docker required). It uses the local credentials in `compose.yaml`. Alternatively, create a PostgreSQL database and user yourself.

Provide these environment variables to the backend process, for example through IntelliJ's Run Configuration:

```text
DB_URL=jdbc:postgresql://localhost:5432/scheduling_db
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password
```

Use your own values. For a hosted database, use its JDBC URL and required SSL parameters. Flyway applies the database migrations when the backend starts; Hibernate validates the resulting schema.

### 3. Set the required encryption key

The current backend requires `GOOGLE_CALENDAR_ENCRYPTION_KEY` at startup, even before a calendar is connected. It must be Base64 encoding of 32 random bytes. Generate one in PowerShell:

```powershell
$keyBytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($keyBytes)
[Convert]::ToBase64String($keyBytes)
$rng.Dispose()
```

Store the output as `GOOGLE_CALENDAR_ENCRYPTION_KEY` in the backend environment and keep it private. Reuse it across restarts.

### 4. Start the backend

From `backend`, on Windows PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
```

On macOS or Linux:

```bash
sh mvnw spring-boot:run
```

The local backend listens on `http://localhost:8080` by default.

### 5. Start the frontend

In a second terminal:

```bash
cd frontend
npm ci
npm run dev
```

Open the local URL printed by Vite. Keep both processes running.

## Integration setup

### Gemini

To enable AI fact generation, set these backend environment variables and restart the backend:

```text
GEMINI_API_KEY=your_api_key
GEMINI_MODEL=your_supported_model_id
```

The hosted demo uses `gemini-3.5-flash-lite`. Model access and quotas depend on the Google AI project. The app also limits generation requests per backend instance. Without Gemini configuration, scheduling can still be used, but fact generation is unavailable.

### Google Calendar

**The current implementation requires a connected Google Calendar for the full availability and booking flow.** Complete this setup before testing reservations locally.

Calendar connection is deliberately restricted to a local setup endpoint. It is not a public login feature.

1. Enable the Google Calendar API in a Google Cloud project and create a Web application OAuth client.
2. Add `http://localhost:8080/api/google-calendar/callback` as an authorized redirect URI. If the OAuth app is in testing mode, add the coach's account as a test user.
3. Configure the backend with:

```text
SPRING_PROFILES_ACTIVE=local
GOOGLE_CALENDAR_CLIENT_ID=your_client_id
GOOGLE_CALENDAR_CLIENT_SECRET=your_client_secret
GOOGLE_CALENDAR_REDIRECT_URI=http://localhost:8080/api/google-calendar/callback
GOOGLE_CALENDAR_ENCRYPTION_KEY=your_application_compatible_encryption_key
```

Use the Base64-encoded 32-byte key generated above. OAuth client credentials and the encryption key belong only in the backend environment.

4. Start the backend and open `http://localhost:8080/api/google-calendar/connect` in your browser, then complete Google's consent flow.

Connection credentials are stored encrypted in the database. For the hosted demo, the connection was established locally against Neon using the same encryption key and OAuth client credentials as the hosted backend. Keep the encryption key stable so stored credentials remain readable.

Never commit real credentials or include them in frontend environment variables.

## Useful commands

From `frontend`:

```bash
npm run lint
npm run build
```

From `backend`, on Windows:

```powershell
.\mvnw.cmd test
```

Backend tests that start the application context require an accessible database and the appropriate environment configuration.

## AI tools used

I used **ChatGPT/Codex** during development for implementation guidance, UI ideas, debugging, and documentation, then integrated and checked the changes locally. AI image generation helped create the karate-themed artwork.

Separately, **Gemini** is part of the application itself: the backend calls it to generate the karate facts shown in the UI. Generated content should not be treated as an authoritative reference.

## Current limitations and next improvements

- **Coach authentication:** the management interface and APIs are currently part of an open demonstration. Authentication and authorization are needed before using real customer information or running this as a public booking service. Please use fictional data when trying the demo.
- **Cold-start handling:** improve request timeouts, retry behaviour for reads, and the initial loading experience when the free backend wakes up.
- **Code organisation:** continue extracting shared frontend logic into hooks and utilities and consolidate repeated styles.
- **Testing:** expand automated coverage for booking conflicts, cancellation, calendar failures, and the main frontend flows.
- **Integration resilience:** improve calendar connection monitoring and reconnection, and make AI quota handling more robust across backend restarts or multiple instances.

The current scope focuses on the booking flow, coach scheduling tools, and the two external integrations.
