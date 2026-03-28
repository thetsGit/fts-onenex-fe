import { type TelemetryStatus } from "@/constants";

import type { TelemetryDetails, Flight } from "./entities";

export type WSTelemetrySubscribePayload = {
  action: "subscribe";
  flightId: Flight["id"];
};

export type WSTelemetryResponse = {
  status: TelemetryStatus;
  data?: TelemetryDetails;
  message?: string;
};
