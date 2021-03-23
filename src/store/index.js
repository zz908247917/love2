//第一步：安装vuex

//第二步：引入并声明使用vuex
import vue from 'vue'
import Vuex from 'vuex'
vue.use(Vuex)

import home from './home'
import user from './user'
import search from './search'
import detail from './detail'
import shopcart from './shopcart'

//存储数据的地方
const state = {}
//直接改变数据的地方
const mutations = {}
//和vue组件用户交互、通知mutation修改数据
//action对象当中的方法，就是vue和vuex交互的桥梁  后期是在vue当中 dispatch
const actions = {}
//getters是为了简化数据的操作而出现的，请求回来的数据，有点复杂，我们可以通过这个额简化
const getters = {}

//第三步：往外暴露一个store对象
const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  // 合并小的store
  modules:{
    home,
    user,
    search,
    detail,
    shopcart
  }
})

export default store 

//第四步：讲store对象配置注册到vue

