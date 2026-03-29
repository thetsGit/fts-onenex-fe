<script setup lang="ts">
type Props = {
  label: string;
  value?: number | null;
  unit: string;
  icon: any;
  min?: number;
  max?: number;
};

const props = defineProps<Props>();

const formatValue = (value: Props["value"]) => {
  if (!value) return "—";

  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const getValueColor = (value: Props["value"]) => {
  if (!value || props.min === undefined || props.max === undefined) return "";

  const range = props.max - props.min;
  const extremeLow = props.min + range * 0.1;
  const extremeHigh = props.max - range * 0.1;

  // Highlight the value if it is extreme
  if (value < extremeLow || value > extremeHigh) return "text-amber-600 dark:text-amber-400";

  return "text-foreground";
};
</script>

<template>
  <div
    class="group flex items-start gap-2.5 rounded-lg bg-muted/50 px-3 py-2.5 transition-colors hover:bg-muted"
  >
    <div
      class="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground shadow-sm ring-1 ring-border/50"
    >
      <component :is="icon" class="size-3.5" />
    </div>
    <div class="min-w-0 flex-1">
      <p class="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
        {{ label }}
      </p>
      <p class="mt-0.5 truncate text-sm font-semibold tabular-nums" :class="getValueColor(value)">
        {{ formatValue(value) }}
        <span class="text-[10px] font-normal text-muted-foreground/50">{{ unit }}</span>
      </p>
    </div>
  </div>
</template>
