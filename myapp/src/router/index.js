import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import StartGame from '@/components/StartGame'
import Game from '@/components/Game'
import JoinGame from '@/components/JoinGame'
import VueSocketIO from 'vue-socket.io'

Vue.use(VueSocketIO, window.base_url)
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/StartGame',
      name: 'StartGame',
      component: StartGame
    },
    {
      path: '/JoinGame',
      name: 'JoinGame',
      component: JoinGame
    },{
      path: '/Game',
      name: 'Game',
      component: Game
    }
  ]
})
