import { createRouter, createWebHashHistory } from 'vue-router'
import TransactionsView from '@/views/TransactionsView.vue'
import SubscriptionsView from '@/views/SubscriptionsView.vue'

/** @type {import('vue-router').RouteRecordRaw[]} */
const routes = [
  {
    path: '/',
    redirect: '/transactions',
  },
  {
    path: '/transactions',
    name: 'transactions',
    component: TransactionsView,
    meta: { title: 'Transactions' },
  },
  {
    path: '/subscriptions',
    name: 'subscriptions',
    component: SubscriptionsView,
    meta: { title: 'Subscriptions' },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
