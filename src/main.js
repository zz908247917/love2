import Vue from 'vue'
// import App from './App.vue'

//@ 是目录src的绝对路径别名   webpack内部配置好的
// @想要后期有提示（联想） 必须配置jsconfig.json 
import App from '@/App'
import router from '@/router'
import store from '@/store'

import * as API from '@/api'

import "@/mock/mockServer" //引入mockserver模拟接口
import 'swiper/css/swiper.css'



// import '@/api'  //第一种测试

//第二种测试
// import {reqCategoryList} from '@/api'
// reqCategoryList()



//全局注册的组件， 当这个组件被很多个组件都要用到，那么就全局注册
import TypeNav from '@/components/TypeNav'
import SliderLoop from '@/components/SliderLoop'
import Pagination from '@/components/Pagination'
// Vue.component('TypeNav',TypeNav)
Vue.component(TypeNav.name, TypeNav)
Vue.component('SliderLoop', SliderLoop)
Vue.component('Pagination', Pagination)


Vue.config.productionTip = false

// var a = 100

new Vue({
    beforeCreate() {
        Vue.prototype.$bus = this //安装总线
        Vue.prototype.$API = API
    },
    render: h => h(App),
    store, //从今往后任意组件内部都可以通过$store获取到我们的store对象
    router,
    //你这样写以后，今后每个组件内部都能通过this.$router获取到路由器对象 
    //通过this.$route获取到当前的路由对象
}).$mount('#app')