import { ref, computed } from 'vue'

/**
 * @typedef {Object} Transaction
 * @property {string|number} id
 * @property {string} description
 * @property {number} amount
 * @property {string} currency
 * @property {string} date
 * @property {string} [category]
 * @property {string} [type] - 'credit' | 'debit'
 * @property {string} [status]
 * @property {string} [merchant]
 */

/**
 * @typedef {Object} TransactionsState
 * @property {import('vue').Ref<Transaction[]>} transactions
 * @property {import('vue').Ref<boolean>} loading
 * @property {import('vue').Ref<string|null>} error
 * @property {import('vue').ComputedRef<number>} totalSpent
 * @property {() => Promise<void>} fetchTransactions
 */

/**
 * Composable for fetching and managing transaction list.
 * @returns {TransactionsState}
 */
export function useTransactions() {
  /** @type {import('vue').Ref<Transaction[]>} */
  const transactions = ref([])

  /** @type {import('vue').Ref<boolean>} */
  const loading = ref(false)

  /** @type {import('vue').Ref<string|null>} */
  const error = ref(null)

  const totalSpent = computed(() =>
    transactions.value.reduce((sum, t) => sum + Math.abs(t.amount), 0)
  )

  /**
   * Fetches transactions from the API.
   * @returns {Promise<void>}
   */
  async function fetchTransactions() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch('http://localhost:8088/api/transaction/list')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const raw = Array.isArray(data) ? data : (data.data ?? data.transactions ?? [])
      transactions.value = raw.map((t) => ({
        ...t,
        id: t.id ?? t.uuid,
        date: t.date ?? t.created_at,
      }))
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load transactions'
    } finally {
      loading.value = false
    }
  }

  return { transactions, loading, error, totalSpent, fetchTransactions }
}
