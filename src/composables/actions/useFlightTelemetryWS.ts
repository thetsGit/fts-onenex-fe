import { computed } from "vue";
import { useWebSocket } from "@vueuse/core";

import type { Flight } from "@/types/entities";
import type { WSTelemetryResponse, WSTelemetrySubscribePayload } from "@/types/telemetry";

import { WS_URL } from "@/constants";

export const useFlightTelemetryWS = (flightId: Flight["id"]) => {
  const connection = useWebSocket<string>(`${WS_URL}/telemetry`, {
    autoReconnect: true,
    onConnected(ws) {
      ws.send(
        JSON.stringify({
          action: "subscribe",
          flightId: flightId,
        } satisfies WSTelemetrySubscribePayload),
      );
    },
    onDisconnected(ws, event) {
      console.log("Disconnected!", event.code);
    },
    onError(ws, event) {
      console.error("Error:", event);
    },
  });

  const data = computed(() =>
    connection.data.value ? (JSON.parse(connection.data.value) as WSTelemetryResponse) : null,
  );

  return { ...connection, data };
};
