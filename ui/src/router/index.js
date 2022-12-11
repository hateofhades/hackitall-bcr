import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MapComp from '../components/Map.vue'
import TermsAndConditions from '../components/TermsAndConditions.vue'
import CanceledAppointment from '../components/Canceled.vue'
import DoneAppoinment from '../components/DoneAppointment.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/map',
    name: 'map',
    component: MapComp
  },
  {
    path: '/termsandc',
    name: 'tc',
    component: TermsAndConditions
  },
  {
    path: '/canceled',
    name: 'tc',
    component: CanceledAppointment
  },
  {
    path: '/done',
    name: 'tc',
    component: DoneAppoinment
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
