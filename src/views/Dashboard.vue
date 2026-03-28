<script setup lang="ts">
import { onMounted } from "vue";

import { getFlights } from "@/services";

import { useRequest } from "@/composables/general";

const { data: flights, execute, pending, error } = useRequest(getFlights);

onMounted(execute);
</script>

<template>
  <div class="min-h-screen bg-background p-6 md:p-10">
    <header class="mb-8 flex items-end justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">Flight telemetry</h1>
        <p class="mt-1 text-sm text-muted-foreground">Real-time monitoring dashboard</p>
      </div>
      <span v-if="!execute && !error" class="text-sm text-muted-foreground">
        {{ flights?.length }} active flight{{ flights?.length !== 1 ? "s" : "" }}
      </span>
    </header>

    <!-- Pending view -->
    <div v-if="pending" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="i in 3"
        :key="i"
        class="h-64 animate-pulse rounded-xl border border-border bg-muted/40"
      />
    </div>

    <!-- Error view -->
    <div
      v-else-if="error"
      class="flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 py-16"
    >
      <p class="text-sm text-destructive">{{ error }}</p>
      <button
        class="rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
        @click="execute"
      >
        Retry
      </button>
    </div>

    <!-- Flight list view -->
    <ul v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="flight in flights" :key="flight.id">{{ flight.flightNumber }}</li>
    </ul>
  </div>
</template>
