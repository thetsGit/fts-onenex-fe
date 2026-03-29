<script setup lang="ts">
import { computed } from "vue";
import { Circle, AlertTriangle, XCircle, WifiOff, Radio, type LucideIcon } from "lucide-vue-next";

import { type TelemetryStatus } from "@/constants";

import { Badge } from "@/components/ui/badge";

const props = defineProps<{ status: TelemetryStatus }>();

const config = computed(() => {
  const map: Record<TelemetryStatus, { class: string; icon: LucideIcon; label: string }> = {
    WAITING: {
      class: "bg-muted text-muted-foreground border-transparent",
      icon: Circle,
      label: "Waiting",
    },
    VALID: {
      class:
        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
      icon: Radio,
      label: "Live",
    },
    CORRUPTED: {
      class:
        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
      icon: AlertTriangle,
      label: "Corrupted",
    },
    ERROR: {
      class:
        "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
      icon: XCircle,
      label: "Error",
    },
    CLOSED: {
      class: "bg-muted text-muted-foreground/60 border-transparent",
      icon: WifiOff,
      label: "Closed",
    },
  };
  return map[props.status];
});
</script>

<template>
  <Badge variant="outline" :class="['gap-1.5 px-2.5 py-0.5 text-[11px] font-medium', config.class]">
    <component :is="config.icon" :class="['size-3', status === 'VALID' && 'animate-pulse']" />
    {{ config.label }}
  </Badge>
</template>
