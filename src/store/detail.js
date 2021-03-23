//detail模块的小store
import {reqGoodsDetailInfo} from '@/api'
const state = {
  goodsDetailInfo:{}
}
const mutations = {
  RECEIVE_GOODSDETAILINFO(state,goodsDetailInfo){
    state.goodsDetailInfo = goodsDetailInfo
  }
}
const actions = {
  async getGoodsDetailInfo({commit},skuId){
    const result = await reqGoodsDetailInfo(skuId)
    if(result.code === 200){
      commit('RECEIVE_GOODSDETAILINFO',result.data)
    }
  }
  // getGoodsDetailInfo({commit},skuId){
  //   reqGoodsDetailInfo(skuId).then((result) => {
  //     if(result.code === 200){
  //       commit('RECEIVE_GOODSDETAILINFO',result.data)
  //     }
  //   }).catch((error) => {
  //     alert('qwdradwd')
  //   })
  // }

}
const getters = {
  categoryView(state){
    return state.goodsDetailInfo.categoryView || {}
  },
  // 数据没回来之前，state.goodsDetailInfo是一个空对象，那么计算出来的skuInfo就是undefined
  // undefined被捞到vue当中就很可能出问题，所以我们必须避免出现undefined，因此|| {}
  skuInfo(state){
    return state.goodsDetailInfo.skuInfo || {}
  },
  spuSaleAttrList(state){
    return state.goodsDetailInfo.spuSaleAttrList || []
  }
}
export default {
  state,
  mutations,
  actions,
  getters
}