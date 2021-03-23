import { reqAddOrUpdateShopCart,reqDeleteAllCart,reqDeleteOneCart,reqShopCartList, reqUpdateCartChecked, reqUpdateCartCheckedAll } from "@/api"

//shopcart模块的小store
const state = {
  shopCartList:[]
}
const mutations = {
  RECEIVE_SHOPCARTLIST(state,shopCartList){
    state.shopCartList = shopCartList
  }
}
const actions = {
  // async函数说的是异步函数
  // async函数返回值是promise对象 不看return
  // 但是返回的promise对象是成功还是失败要看return
  // return的值，决定了这个promise成功还是失败
  // 非promise
  // 1、正常值   async函数返回的promise就是成功的，成功的结果就是返回的值 
  // 2、抛异常   async函数返回的promise就是失败的，失败的原因就是抛出的原因 throw new Error('')

  // promise
  // 1、成功的promise  async函数返回的promise也是成功的，成功的结果是return的promise成功的结果
  // 2、失败的promise  async函数返回的promise也是失败的，失败的原因是return的promise失败的原因

  async addOrUpdateShopCart({commit},{skuId,skuNum}){
    const result = await reqAddOrUpdateShopCart(skuId,skuNum)
    if(result.code === 200){
      return 'ok'
    }else{
      // return 'failde'
      return Promise.reject(new Error('failed'))
    }
  },

  async getShopCartList({commit}){
    const result = await reqShopCartList()
    if(result.code === 200){
      commit('RECEIVE_SHOPCARTLIST',result.data)
    }
  },

  async updateCartChecked({commit},{skuId,isChecked}){
    const result = await reqUpdateCartChecked(skuId,isChecked)
    if(result.code === 200){
      // 写不写return  要看请求后续根据请求成功或者失败是否有后续操作决定
      return 'ok'
    }else{
      return Promise.reject(new Error('failed'))
    }
  },

  async updateCartCheckedAll({commit},{isChecked,skuIds}){
    const result = await reqUpdateCartCheckedAll(isChecked,skuIds)
    if(result.code === 200){
      return 'ok'
    }else{
      return Promise.reject(new Error('failed'))
    }
  },

  async deleteOneCart({commit},skuId){
    const result = await reqDeleteOneCart(skuId)
    if(result.code === 200){
      return 'ok'
    }else{
      return Promise.reject(new Error('failed'))
    }
  },

  async deleteAllCart({commit},skuIds){
    const result = await reqDeleteAllCart(skuIds)
    if(result.code === 200){
      return 'ok'
    }else{
      return Promise.reject(new Error('failed')) 
    }
  }


}
const getters = {
  checkedNum(state){
    return state.shopCartList.reduce((prev,item) => { 
      prev += item.cartInfoList.reduce((prev1,item1) => {
        if(item1.isChecked){
          prev1 += item1.skuNum
        }
        return prev1
      },0)

      return prev
    },0)
  },

  allMoney(state){
    return state.shopCartList.reduce((prev,item) => { 
      prev += item.cartInfoList.reduce((prev1,item1) => {
        if(item1.isChecked){
          prev1 += item1.skuNum * item1.skuPrice
        }
        return prev1
      },0)

      return prev
    },0)
  },


}
export default {
  state,
  mutations,
  actions,
  getters
}