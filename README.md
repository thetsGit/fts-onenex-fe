# TeleFlight Frontend

Real-time flight telemetry monitoring dashboard built with Vue 3. Displays live flight data streamed from the backend via WebSocket connections.

## Overview

The dashboard fetches the flight list from the backend REST API, opens a WebSocket connection per flight, and displays live telemetry data (altitude, speed, acceleration, thrust, temperature) with connection status indicators.

### Data Flow

```
┌───────────────────────────────────────────────────┐
│  Dashboard loads                                  │
└──────────────────────┬────────────────────────────┘
                       │
                       ▼
┌───────────────────────────────────────────────────┐
│  Fetch flight list                                │
│  GET /api/flights                                 │
└──────────────────────┬────────────────────────────┘
                       │
                       ▼
┌───────────────────────────────────────────────────┐
│  Render flight cards                              │
│  Each card starts as WAITING                      │
└──────────────────────┬────────────────────────────┘
                       │
                       ▼
┌───────────────────────────────────────────────────┐
│  Open WebSocket per flight                        │
│  Connect to /telemetry                            │
└──────────────────────┬────────────────────────────┘
                       │
                       ▼
┌───────────────────────────────────────────────────┐
│  Subscribe to flight                              │
│  Send { action: "subscribe", flightId }           │
└──────────────────────┬────────────────────────────┘
                       │
                       ▼
┌───────────────────────────────────────────────────┐
│  Receive telemetry JSON                           │
│  Update card data + status badge        ◄─── repeats
└───────────────────────────────────────────────────┘
```

### Connection Statuses

| Status      | Badge           | Meaning                                           |
| ----------- | --------------- | ------------------------------------------------- |
| `WAITING`   | Gray            | WebSocket connected, awaiting first data          |
| `VALID`     | Green (pulsing) | Receiving valid telemetry data                    |
| `CORRUPTED` | Amber           | Received invalid packet (bad CRC or out-of-range) |
| `ERROR`     | Red             | Connection error or timeout                       |
| `CLOSED`    | Gray muted      | Connection closed, backend reconnecting           |

## Technology Choices

| Technology                  | Why                                                                                                        |
| --------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Vue 3 + Composition API** | Reactive composables map naturally to WebSocket data streams. Clean separation of telemetry logic from UI. |
| **TypeScript**              | Type safety across WebSocket message parsing and component props.                                          |
| **shadcn-vue (reka-ui)**    | Accessible, composable UI components with full styling control. Cards, badges, tooltips, skeletons.        |
| **Tailwind CSS 4**          | Utility-first styling with dark mode support. No custom CSS files to manage.                               |
| **VueUse**                  | `useWebSocket` composable handles connection lifecycle, auto-reconnect, and reactive data out of the box.  |
| **Lucide Vue**              | Consistent icon set — every metric, status, and action has a meaningful icon.                              |
| **vue-sonner**              | Lightweight toast notifications for user feedback (e.g. manual flight sync).                               |

## Project Structure

```
src/
├── views/
│   └── Dashboard.vue                   # Main dashboard page (flight list, loading, error states)
├── components/
│   ├── blocks/
│   │   └── FlightCard.vue              # Flight telemetry card (header + metrics grid)
│   ├── elements/
│   │   └── StatusBadge.vue             # Connection status pill with icon
│   ├── listings/
│   │   └── MetricDataItem.vue          # Single telemetry metric (icon, label, value, unit, tooltip)
│   └── ui/                             # shadcn-vue components (card, badge, skeleton, tooltip, etc.)
├── composables/
│   ├── actions/
│   │   └── useFlightTelemetryWS.ts     # WebSocket composable per flight
│   └── general/
│       └── useRequest.ts               # Generic async request composable
├── services/
│   ├── flights.ts                      # Flight list API calls
│   └── index.ts                        # Service barrel export
├── constants.ts                        # API/WS URLs, derived from env
├── lib/
│   └── utils.ts                        # Utility functions (cn, etc.)
├── types/
│   ├── api.ts                          # API response types
│   ├── entities.ts                     # Flight, TelemetryDetails types
│   └── telemetry.ts                    # WebSocket payload types
├── style.css                           # Global styles + Tailwind imports
├── App.vue                             # Root component
└── main.ts                             # App bootstrap
```

### Key Components

**`useFlightTelemetryWS`** — the core composable. Opens a WebSocket to the backend, sends a subscribe message for a specific flight, and returns reactive `status` and `telemetry` refs. Uses VueUse's `useWebSocket` with `autoReconnect` enabled. Raw JSON messages are parsed via a `computed` ref to maintain reactivity.

**`useRequest`** — generic composable for async API calls. Manages loading, error, and data states, and event based callbacks (e.g onSuccess). Used by the dashboard to fetch the flight list.

**`FlightCard`** — displays flight info (number, route, model), a status badge, and a grid of telemetry metrics. Each metric shows an icon, label, formatted value with units, and a tooltip with the full value on hover.

**`StatusBadge`** — color-coded pill with an icon per status. The VALID status badge pulses to indicate live data flow.

**`MetricDataItem`** — single telemetry reading. Values near range boundaries are highlighted in amber. Null values (no data yet) display as "—".

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) >= 24
- [pnpm](https://pnpm.io/) >= 10

> **Node version management:** This project includes a `.node-version` file. If you use [fnm](https://github.com/Schniz/fnm), it will automatically switch to the correct Node version when you enter the project directory. If you don't have a version manager set up, we recommend installing fnm — it's fast and works across all platforms.

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

### Install & Run

```bash
pnpm install

# Development
pnpm dev

# Production build
pnpm build

# Preview production build
pnpm preview
```

### Linting

```bash
pnpm lint:code      # ESLint + oxlint
pnpm lint:type      # TypeScript type checking (vue-tsc)
pnpm format         # Format with prettier
```

## CI/CD

### Git Hooks (pre-commit)

Pre-commit hooks via Husky run automatically before each commit:

- ESLint + oxlint code linting
- prettier formatting
- TypeScript type checking (vue-tsc)

### Continuous Integration

GitHub Actions runs on every pull request to `main`:

- Type checking
- Code linting
- Format checking

### Stable Releases

On merge to `main`, semantic-release automatically:

- Determines version bump (patch/minor/major)
- Generates release notes
- Creates a GitHub release with a version tag

### Continuous Deployment

Not implemented yet due to time constraints. Since the frontend is a static SPA after build, it can be deployed to Vercel or Cloudflare Pages. As an example setup:

- Merges to `staging` or `preview` branches could trigger automatic deployments to their respective environments
- Production deploys on `main` could leverage [manual workflow triggers](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow#defining-inputs-for-manually-triggered-workflows) for controlled releases
- Each environment would have its own set of environment variables pointing to the appropriate backend

## Assumptions

- Single page dashboard — no routing between views needed
- Backend is running and accessible at the configured `VITE_API_URL` / `VITE_WS_URL`
- Flight list is relatively small (rendered as a responsive card grid, no virtualization)
- WebSocket auto-reconnect handles brief backend restarts
- Default status for each flight is `WAITING` until the first WebSocket message arrives

## Known Limitations

- **No data history** — only displays the latest telemetry values, no charts or historical trends
- **No flight detail view** — all flights shown in a grid; no drill-down or expanded view
- **No offline support** — requires active backend connection
- **No virtualization** — large flight lists (100+) may impact rendering performance
- **No dark mode toggle** — follows system preference via Tailwind's dark mode
