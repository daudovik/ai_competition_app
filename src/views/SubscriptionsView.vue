<script setup>
import { onMounted } from 'vue'
import {
  RefreshCcw,
  AlertCircle,
  Pause,
  XCircle,
  CheckCircle2,
  Tv,
  Music,
  Cloud,
  Code2,
  Package,
  Dumbbell,
  BookOpen,
  Gamepad2,
  Briefcase,
  Bot,
  Globe,
} from 'lucide-vue-next'
import { useSubscriptions } from '@/composables/useSubscriptions.mjs'
import { Card, CardContent } from '@/components/ui/card/index.js'
import { Badge } from '@/components/ui/badge/index.js'
import { Skeleton } from '@/components/ui/skeleton/index.js'

const { subscriptions, loading, error, monthlyTotal, activeCount, fetchSubscriptions } =
  useSubscriptions()

onMounted(fetchSubscriptions)

/**
 * Formats an amount with currency.
 * @param {number} amount
 * @param {string} [currency]
 * @returns {string}
 */
function formatAmount(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

/**
 * Formats next billing date.
 * @param {string} dateStr
 * @returns {string}
 */
function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const datePart = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${datePart} · ${hours}:${minutes}`
}

/**
 * Returns badge variant based on subscription status.
 * @param {string} [status]
 * @returns {string}
 */
function statusVariant(status) {
  if (status === 'active') return 'success'
  if (status === 'paused') return 'warning'
  if (status === 'cancelled') return 'destructive'
  return 'secondary'
}

/**
 * Returns a readable billing cycle label.
 * @param {string} [cycle]
 * @returns {string}
 */
function cycleLabel(cycle) {
  if (cycle === 'yearly') return '/yr'
  if (cycle === 'weekly') return '/wk'
  return '/mo'
}

/**
 * Returns a Lucide icon component based on the subscription title.
 * @param {string} title
 * @returns {import('vue').Component}
 */
function getSubIcon(title = '') {
  const t = title.toLowerCase()
  if (/netflix|disney|hulu|hbo|youtube|prime video|apple tv|peacock/.test(t)) return Tv
  if (/spotify|apple music|tidal|deezer|soundcloud|music/.test(t)) return Music
  if (/dropbox|google drive|icloud|onedrive|storage|cloud/.test(t)) return Cloud
  if (/github|gitlab|linear|notion|jira|confluence|figma|vercel|code/.test(t)) return Code2
  if (/claude|chatgpt|openai|gemini|copilot|ai|bot/.test(t)) return Bot
  if (/amazon|prime|shop|store/.test(t)) return Package
  if (/gym|fitness|health|sport|peloton/.test(t)) return Dumbbell
  if (/kindle|audible|book|course|udemy|masterclass|duolingo|learning/.test(t)) return BookOpen
  if (/game|gaming|playstation|xbox|steam|nintendo|ea play/.test(t)) return Gamepad2
  if (/microsoft|office|google workspace|slack|zoom|teams/.test(t)) return Briefcase
  return Globe
}

/**
 * Returns a consistent avatar color for the name.
 * @param {string} name
 * @returns {string}
 */
function avatarColor(name = '') {
  const colors = [
    'bg-violet-100 text-violet-700',
    'bg-blue-100 text-blue-700',
    'bg-rose-100 text-rose-700',
    'bg-amber-100 text-amber-700',
    'bg-emerald-100 text-emerald-700',
    'bg-sky-100 text-sky-700',
    'bg-pink-100 text-pink-700',
  ]
  const idx = name.charCodeAt(0) % colors.length
  return colors[idx]
}
</script>

<template>
  <div class="px-4 py-4 space-y-4">
    <!-- Summary cards -->
    <div class="grid grid-cols-2 gap-3">
      <Card class="bg-gradient-to-br from-violet-600 to-purple-700 border-0 text-white">
        <CardContent class="pt-4 pb-4">
          <p class="text-xs text-white/70">Monthly Cost</p>
          <p class="text-xl font-bold mt-1">{{ formatAmount(monthlyTotal) }}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="pt-4 pb-4">
          <p class="text-xs text-muted-foreground">Active</p>
          <p class="text-xl font-bold mt-1 text-foreground">{{ activeCount }}</p>
          <p class="text-xs text-muted-foreground">of {{ subscriptions.length }}</p>
        </CardContent>
      </Card>
    </div>

    <!-- Error state -->
    <div
      v-if="error"
      class="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
    >
      <AlertCircle :size="16" />
      <span>{{ error }}</span>
      <button class="ml-auto underline text-xs" @click="fetchSubscriptions">Retry</button>
    </div>

    <!-- Loading skeletons -->
    <template v-if="loading">
      <div v-for="n in 5" :key="n">
        <div class="flex items-center gap-3 px-1 py-2">
          <Skeleton class="w-10 h-10 rounded-full flex-none" />
          <div class="flex-1 space-y-2">
            <Skeleton class="h-4 w-1/2" />
            <Skeleton class="h-3 w-1/3" />
          </div>
          <div class="space-y-1">
            <Skeleton class="h-4 w-16" />
            <Skeleton class="h-3 w-12" />
          </div>
        </div>
      </div>
    </template>

    <!-- Empty state -->
    <div
      v-else-if="!error && subscriptions.length === 0"
      class="flex flex-col items-center justify-center py-16 text-muted-foreground"
    >
      <RefreshCcw :size="40" class="mb-3 opacity-30" />
      <p class="text-sm">No subscriptions found</p>
    </div>

    <!-- Subscription list -->
    <div v-else class="space-y-2">
      <div
        v-for="sub in subscriptions"
        :key="sub.id"
        class="flex items-center gap-3 px-3 py-3 rounded-xl border border-border/60 bg-card hover:bg-muted/30 transition-colors"
      >
        <!-- Avatar -->
        <div
          :class="['w-10 h-10 rounded-full flex items-center justify-center flex-none', avatarColor(sub.name)]"
        >
          <component :is="getSubIcon(sub.name)" :size="18" />
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5">
            <p class="text-sm font-medium text-foreground truncate">{{ sub.name }}</p>
            <!-- Status icon -->
            <CheckCircle2
              v-if="sub.status === 'active' || !sub.status"
              :size="13"
              class="text-emerald-500 flex-none"
            />
            <Pause v-else-if="sub.status === 'paused'" :size="13" class="text-amber-500 flex-none" />
            <XCircle v-else-if="sub.status === 'cancelled'" :size="13" class="text-rose-500 flex-none" />
          </div>
          <div class="flex items-center gap-1.5 mt-0.5">
            <Badge :variant="statusVariant(sub.status)" class="text-[10px] py-0 px-1.5">
              {{ sub.status ?? 'active' }}
            </Badge>
            <span v-if="sub.next_billing_date" class="text-xs text-muted-foreground">
              Next: {{ formatDate(sub.next_billing_date) }}
            </span>
          </div>
        </div>

        <!-- Amount -->
        <div class="flex flex-col items-end flex-none">
          <span class="text-sm font-semibold text-foreground">
            {{ formatAmount(sub.amount, sub.currency) }}
          </span>
          <span class="text-xs text-muted-foreground">{{ cycleLabel(sub.billing_cycle) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
