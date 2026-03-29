<script setup lang="ts">
import { computed } from "vue";
import { Plane, ArrowRight, Mountain, Gauge, Activity, Zap, Thermometer } from "lucide-vue-next";

import type { Flight } from "@/types/entities";

import type { TelemetryStatus } from "@/constants";

import { useFlightTelemetryWS } from "@/composables/actions";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import StatusBadge from "@/components/elements/StatusBadge.vue";
import MetricDataItem from "@/components/listings/MetricDataItem.vue";

const props = defineProps<{
  flight: Flight;
}>();

const { status: connectionStatus, data: telemetry } = useFlightTelemetryWS(props.flight.id);

const status = computed(
  () =>
    (connectionStatus.value === "CONNECTING" || telemetry.value === null
      ? "WAITING"
      : telemetry.value.status) satisfies TelemetryStatus,
);
</script>

<template>
  <Card
    class="group relative overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
  >
    <!-- Status indicator bar -->
    <div
      class="absolute inset-x-0 top-0 h-0.5 transition-colors duration-500"
      :class="{
        'bg-muted': status === 'WAITING' || status === 'CLOSED',
        'bg-emerald-500': status === 'VALID',
        'bg-amber-500': status === 'CORRUPTED',
        'bg-red-500': status === 'ERROR',
      }"
    />

    <CardHeader class="flex-row items-start justify-between space-y-0 pb-3">
      <div class="flex items-center gap-3">
        <div class="flex size-10 items-center justify-center rounded-lg bg-primary/5 text-primary">
          <Plane class="size-5" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-base font-semibold tracking-tight">{{ flight.flightNumber }}</h3>
          </div>
          <div class="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <span class="font-medium">{{ flight.origin }}</span>
            <ArrowRight class="size-3" />
            <span class="font-medium">{{ flight.destination }}</span>
          </div>
          <p class="mt-0.5 text-xs text-muted-foreground/50">{{ flight.model }}</p>
        </div>
      </div>
      <StatusBadge :status="status" />
    </CardHeader>

    <Separator />

    <CardContent class="pt-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <MetricDataItem
          label="Altitude"
          :value="telemetry?.data?.altitude"
          unit="m"
          :icon="Mountain"
          :min="9000"
          :max="12000"
        />
        <MetricDataItem
          label="Speed"
          :value="telemetry?.data?.speed"
          unit="m/s"
          :icon="Gauge"
          :min="220"
          :max="260"
        />
        <MetricDataItem
          label="Acceleration"
          :value="telemetry?.data?.acceleration"
          unit="m/s²"
          :icon="Activity"
          :min="-2"
          :max="2"
        />
        <MetricDataItem
          label="Thrust"
          :value="telemetry?.data?.thrust"
          unit="N"
          :icon="Zap"
          :min="0"
          :max="200000"
        />
        <div class="md:col-span-2">
          <MetricDataItem
            label="Temperature"
            :value="telemetry?.data?.temperature"
            unit="°C"
            :icon="Thermometer"
            :min="-50"
            :max="50"
          />
        </div>
      </div>
    </CardContent>
  </Card>
</template>
