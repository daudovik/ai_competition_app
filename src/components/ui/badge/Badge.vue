<script setup>
import { computed } from 'vue'
import { cn } from '@/lib/utils.js'

/**
 * @typedef {'default'|'secondary'|'destructive'|'outline'|'success'|'warning'} BadgeVariant
 */

const props = defineProps({
  variant: {
    type: String,
    /** @type {BadgeVariant} */
    default: 'default',
  },
  class: { type: String, default: '' },
})

const variantClasses = {
  default: 'border-transparent bg-primary text-primary-foreground',
  secondary: 'border-transparent bg-secondary text-secondary-foreground',
  destructive: 'border-transparent bg-destructive text-destructive-foreground',
  outline: 'text-foreground',
  success: 'border-transparent bg-emerald-100 text-emerald-700',
  warning: 'border-transparent bg-amber-100 text-amber-700',
}

const classes = computed(() =>
  cn(
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    variantClasses[props.variant] ?? variantClasses.default,
    props.class
  )
)
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
