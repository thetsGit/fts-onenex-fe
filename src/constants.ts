export const API_URL = `${import.meta.env.VITE_API_URL}/api`;
export const WS_URL = `${import.meta.env.VITE_WS_URL}`;

/**
 * Telemetry
 */
export const STATUSES = ["WAITING", "VALID", "CORRUPTED", "ERROR", "CLOSED"] as const;
export type TelemetryStatus = (typeof STATUSES)[number];
