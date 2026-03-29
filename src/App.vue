<script setup lang="ts">
import { Toaster } from "vue-sonner";
import "vue-sonner/style.css";

import DashboardView from "@/views/Dashboard.vue";
</script>

<template>
  <Toaster richColors />
  <DashboardView />
</template>

<style scoped></style>
