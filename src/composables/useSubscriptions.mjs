import { ref, computed } from 'vue'

/**
 * @typedef {Object} Subscription
 * @property {string|number} id
 * @property {string} name
 * @property {number} amount
 * @property {string} currency
 * @property {string} [billing_cycle] - 'monthly' | 'yearly' | 'weekly'
 * @property {string} [status] - 'active' | 'paused' | 'cancelled'
 * @property {string} [next_billing_date]
 * @property {string} [category]
 * @property {string} [icon]
 */

/**
 * @typedef {Object} SubscriptionsState
 * @property {import('vue').Ref<Subscription[]>} subscriptions
 * @property {import('vue').Ref<boolean>} loading
 * @property {import('vue').Ref<string|null>} error
 * @property {import('vue').ComputedRef<number>} monthlyTotal
 * @property {import('vue').ComputedRef<number>} activeCount
 * @property {() => Promise<void>} fetchSubscriptions
 */

/**
 * Composable for fetching and managing subscription list.
 * @returns {SubscriptionsState}
 */
export function useSubscriptions() {
  /** @type {import('vue').Ref<Subscription[]>} */
  const subscriptions = ref([])

  /** @type {import('vue').Ref<boolean>} */
  const loading = ref(false)

  /** @type {import('vue').Ref<string|null>} */
  const error = ref(null)

  const monthlyTotal = computed(() =>
    subscriptions.value
      .filter((s) => s.status !== 'cancelled')
      .reduce((sum, s) => {
        const amount = s.amount ?? 0
        if (s.billing_cycle === 'yearly') return sum + amount / 12
        if (s.billing_cycle === 'weekly') return sum + amount * 4.33
        return sum + amount
      }, 0)
  )

  const activeCount = computed(
    () => subscriptions.value.filter((s) => s.status === 'active' || !s.status).length
  )

  /**
   * Fetches subscriptions from the API.
   * @returns {Promise<void>}
   */
  async function fetchSubscriptions() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch('https://ai-competition-backend.vercel.app/api/subscription/list')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const raw = Array.isArray(data) ? data : (data.data ?? data.subscriptions ?? [])
      subscriptions.value = raw.map((s) => ({
        ...s,
        id: s.id ?? s.uuid,
        name: s.name ?? s.title,
        billing_cycle: s.billing_cycle ?? s.interval,
        next_billing_date: s.next_billing_date ?? s.next_payment_date,
      }))
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load subscriptions'
    } finally {
      loading.value = false
    }
  }

  return { subscriptions, loading, error, monthlyTotal, activeCount, fetchSubscriptions }
}
