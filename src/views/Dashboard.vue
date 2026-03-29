<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onMounted } from "vue";
import { Plane, RefreshCw } from "lucide-vue-next";

import { getFlights } from "@/services";

import { useRequest } from "@/composables/general";

import { Skeleton } from "@/components/ui/skeleton";

import FlightCard from "@/components/blocks/FlightCard.vue";
import { toast } from "vue-sonner";

const {
  data: flights,
  execute: fetchFlights,
  pending,
  fetching: syncingFlights,
  error,
} = useRequest(getFlights);

onMounted(fetchFlights);

const manualFlightsSync = async () => {
  await fetchFlights(null);
  toast.success("Flights synced successfully.");
};
</script>

<template>
  <div class="min-h-screen bg-background">
    <header
      class="border-b border-border bg-background/80 px-6 py-4 backdrop-blur-sm md:px-10 sticky top-0 z-10 shadow-sm"
    >
      <div class="mx-auto flex max-w-7xl items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="flex size-9 items-center justify-center rounded-lg bg-amber-500 text-white">
            <Plane class="size-4" />
          </div>
          <div>
            <h1 class="text-lg font-semibold tracking-tight">
              Tele<span class="text-amber-500 ml-0.5">Flight</span>
            </h1>
            <p class="text-xs text-muted-foreground">24/7 Real-time flight monitoring</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <span v-if="!pending && !error" class="text-sm text-muted-foreground">
            {{ flights?.length }} flight{{ flights?.length !== 1 ? "s" : "" }}
          </span>
          <button
            class="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            :class="{ 'animate-spin': syncingFlights }"
            @click="manualFlightsSync"
            :disabled="syncingFlights"
          >
            <RefreshCw class="size-4" />
          </button>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-6 py-8 md:px-10">
      <!-- Pending - skeleton view -->
      <div v-if="pending" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="i in 3" :key="i" class="rounded-xl border border-border p-5">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <Skeleton class="size-10 rounded-lg" />
              <div>
                <Skeleton class="h-4 w-20" />
                <Skeleton class="mt-2 h-3 w-28" />
                <Skeleton class="mt-2 h-3 w-16" />
              </div>
            </div>
            <Skeleton class="h-5 w-16 rounded-full" />
          </div>
          <Skeleton class="mt-5 h-px w-full" />
          <div class="mt-4 grid grid-cols-2 gap-2">
            <Skeleton class="h-16 rounded-lg" />
            <Skeleton class="h-16 rounded-lg" />
            <Skeleton class="h-16 rounded-lg" />
            <Skeleton class="h-16 rounded-lg" />
            <Skeleton class="col-span-2 h-16 rounded-lg" />
          </div>
        </div>
      </div>

      <!-- Error view -->
      <div
        v-else-if="error"
        class="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-destructive/30 bg-destructive/5 py-20"
      >
        <div class="flex size-12 items-center justify-center rounded-full bg-destructive/10">
          <Plane class="size-5 text-destructive" />
        </div>
        <div class="text-center">
          <p class="text-sm font-medium text-destructive">Connection failed</p>
          <p class="mt-1 text-xs text-muted-foreground">{{ error }}</p>
        </div>
        <button
          class="mt-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          @click="fetchFlights"
        >
          Refresh
        </button>
      </div>

      <!-- Flight list view -->
      <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <FlightCard v-for="flight in flights" :key="flight.id" :flight="flight" />
      </div>
    </main>
  </div>
</template>
