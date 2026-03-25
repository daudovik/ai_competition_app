<script setup>
import { useRoute } from 'vue-router'
import { ArrowLeftRight, RefreshCcw } from 'lucide-vue-next'

const route = useRoute()
</script>

<template>
  <div class="flex flex-col h-dvh max-w-md mx-auto bg-background overflow-hidden">
    <!-- Header -->
    <header class="flex-none px-4 pt-10 pb-4 bg-background border-b border-border">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-muted-foreground">Pyypl Finance</p>
          <h1 class="text-xl font-bold text-foreground">
            {{ route.meta.title }}
          </h1>
        </div>
        <div class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
          <span class="text-primary font-bold text-sm">P</span>
        </div>
      </div>
    </header>

    <!-- Page content -->
    <main class="flex-1 overflow-y-auto">
      <RouterView />
    </main>

    <!-- Bottom navigation -->
    <nav class="flex-none border-t border-border bg-background pb-safe">
      <div class="flex">
        <RouterLink
          to="/transactions"
          class="flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors"
          :class="route.name === 'transactions'
            ? 'text-primary'
            : 'text-muted-foreground hover:text-foreground'"
        >
          <ArrowLeftRight
            :size="22"
            :stroke-width="route.name === 'transactions' ? 2.5 : 1.75"
          />
          <span :class="route.name === 'transactions' ? 'font-semibold' : ''">Transactions</span>
        </RouterLink>

        <RouterLink
          to="/subscriptions"
          class="flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors"
          :class="route.name === 'subscriptions'
            ? 'text-primary'
            : 'text-muted-foreground hover:text-foreground'"
        >
          <RefreshCcw
            :size="22"
            :stroke-width="route.name === 'subscriptions' ? 2.5 : 1.75"
          />
          <span :class="route.name === 'subscriptions' ? 'font-semibold' : ''">Subscriptions</span>
        </RouterLink>
      </div>
    </nav>
  </div>
</template>
