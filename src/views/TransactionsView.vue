<script setup>
import { onMounted, computed } from 'vue'
import {
  AlertCircle,
  Coffee,
  Utensils,
  Tv,
  Code2,
  Car,
  ShoppingBag,
  Dumbbell,
  Plane,
  Gamepad2,
  Music,
  BookOpen,
  Receipt,
  ArrowLeftRight,
} from 'lucide-vue-next'
import { useTransactions } from '@/composables/useTransactions.mjs'
import { Card, CardContent } from '@/components/ui/card/index.js'
import { Badge } from '@/components/ui/badge/index.js'
import { Skeleton } from '@/components/ui/skeleton/index.js'

const { transactions, loading, error, totalSpent, fetchTransactions } = useTransactions()

onMounted(fetchTransactions)

/**
 * Formats an amount with currency symbol.
 * @param {number} amount
 * @param {string} [currency]
 * @returns {string}
 */
function formatAmount(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(Math.abs(amount))
}

/**
 * Formats an ISO date string to a readable short form.
 * @param {string} dateStr
 * @returns {string}
 */
function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const datePart = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${datePart} · ${hours}:${minutes}`
}

/**
 * Returns a Lucide icon component based on the transaction title.
 * @param {string} title
 * @returns {import('vue').Component}
 */
function getTxIcon(title = '') {
  const t = title.toLowerCase()
  if (/coffee|latte|cappuccino|espresso|tea/.test(t)) return Coffee
  if (/sandwich|lunch|dinner|breakfast|food|meal|burger|pizza|restaurant|eat|sushi|kebab/.test(t)) return Utensils
  if (/netflix|youtube|spotify|disney|hulu|prime|hbo|streaming|tv|movie|film|cinema/.test(t)) return Tv
  if (/claude|code|github|notion|software|app|dev|pro|saas|subscription|tech/.test(t)) return Code2
  if (/uber|lyft|taxi|car|ride|transport|bolt|grab/.test(t)) return Car
  if (/amazon|shop|store|buy|mall|market|ikea/.test(t)) return ShoppingBag
  if (/gym|fitness|health|sport|dumbbell|crossfit/.test(t)) return Dumbbell
  if (/flight|travel|hotel|booking|airbnb|ticket/.test(t)) return Plane
  if (/game|gaming|playstation|xbox|steam|nintendo/.test(t)) return Gamepad2
  if (/music|apple music|tidal|deezer/.test(t)) return Music
  if (/book|kindle|audible|course|udemy|learning/.test(t)) return BookOpen
  return Receipt
}

/**
 * Returns a consistent background color class from the name.
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

const summaryLabel = computed(() => formatAmount(totalSpent.value))
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Summary card — fixed, never scrolls -->
    <div class="flex-none px-4 pt-4 pb-3">
      <Card class="bg-gradient-to-br from-violet-600 to-purple-700 border-0 text-white">
        <CardContent class="pt-4">
          <p class="text-sm text-white/70">Total Spent</p>
          <p class="text-3xl font-bold mt-1">{{ summaryLabel }}</p>
          <p class="text-xs text-white/60 mt-1">{{ transactions.length }} transactions</p>
        </CardContent>
      </Card>
    </div>

    <!-- Scrollable list -->
    <div class="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
      <!-- Error state -->
      <div
        v-if="error"
        class="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
      >
        <AlertCircle :size="16" />
        <span>{{ error }}</span>
        <button class="ml-auto underline text-xs" @click="fetchTransactions">Retry</button>
      </div>

      <!-- Loading skeletons -->
      <template v-if="loading">
        <div v-for="n in 6" :key="n" class="flex items-center gap-3 px-1 py-2">
          <Skeleton class="w-10 h-10 rounded-full flex-none" />
          <div class="flex-1 space-y-2">
            <Skeleton class="h-4 w-3/4" />
            <Skeleton class="h-3 w-1/2" />
          </div>
          <Skeleton class="h-4 w-16" />
        </div>
      </template>

      <!-- Empty state -->
      <div
        v-else-if="!error && transactions.length === 0"
        class="flex flex-col items-center justify-center py-16 text-muted-foreground"
      >
        <ArrowLeftRight :size="40" class="mb-3 opacity-30" />
        <p class="text-sm">No transactions yet</p>
      </div>

      <!-- Transaction rows -->
      <template v-else>
        <div
          v-for="tx in transactions"
          :key="tx.id"
          class="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted/50 transition-colors"
        >
          <!-- Avatar -->
          <div
            :class="['w-10 h-10 rounded-full flex items-center justify-center flex-none', avatarColor(tx.title)]"
          >
            <component :is="getTxIcon(tx.title)" :size="18" />
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-foreground truncate">
              {{ tx.title ?? 'Unknown' }}
            </p>
            <div class="flex items-center gap-1.5 mt-0.5">
              <span class="text-xs text-muted-foreground">{{ formatDate(tx.date) }}</span>
              <Badge v-if="tx.category" variant="secondary" class="text-[10px] py-0 px-1.5">
                {{ tx.category }}
              </Badge>
            </div>
          </div>

          <!-- Amount -->
          <div class="flex-none">
            <span class="text-sm font-semibold text-foreground">
              -{{ formatAmount(tx.amount, tx.currency) }}
            </span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
