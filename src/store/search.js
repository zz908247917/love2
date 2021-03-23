//search模块的小store
import {reqGoodsListInfo} from '@/api'
// state是初始化状态数据和为了以后保存回来的动态数据
// 当你刷新页面的时候，相当于项目重新启动，那么vuex所有的state都要重新初始化数据

// vuex和vue是两个独立的东西
// vuex内的数据，是不关心vue组件是否创建， 
// vuex的state和getters会自动执行 而mutations和actions是要和vue关联的

// 所以当用户在vue组件当中发请求数据回来之前，用户映射到组件内的数据，是初始化的state数据或者根据初始化的state数据计算而来的
const state = {
  goodsListInfo:{}
}
const mutations = {
  RECEIVE_GOODSLISTINFO(state,goodsListInfo){
    state.goodsListInfo = goodsListInfo
  }
}
const actions = {
  async getGoodsListInfo({commit},searchParams){
    const result = await reqGoodsListInfo(searchParams)
    if(result.code === 200){
      commit('RECEIVE_GOODSLISTINFO',result.data)
    }
  }
}

//当获取到的数据非常复杂，那么此时，可以使用getters把获取到的数据进行简化操作
//如果数据是对象，里面有很多数组，我们可以直接把这些数组计算出来，后期操作数组就可以直接从getters去获取
const getters = {
  attrsList(state){
    return state.goodsListInfo.attrsList || []
  },
  goodsList(state){
    return state.goodsListInfo.goodsList || []
  },
  trademarkList(state){
    return state.goodsListInfo.trademarkList || []
  }
}
export default {
  state,
  mutations,
  actions,
  getters
}