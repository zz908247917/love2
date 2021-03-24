import { reqTradeInfo, reqUserAddressList } from "@/api"

//trade模块的小store
const state = {
    tradeInfo: {},
    userAddressList: []
}
const mutations = {
    RECEIVE_TRADEINFO(state, tradeInfo) {
        state.tradeInfo = tradeInfo
    },
    RECEIVE_USERADDRESSLIST(state, userAddressList) {
        state.userAddressList = userAddressList
    }
}
const actions = {
    async getTradeInfo({ commit }) {
        const result = await reqTradeInfo()
        if (result.code === 200) {
            commit('RECEIVE_TRADEINFO', result.data)
        }
    },
    async getUserAddressList({ commit }) {
        const result = await reqUserAddressList()
        if (result.code === 200) {
            commit('RECEIVE_USERADDRESSLIST', result.data)
        }
    },

}

const getters = {
    detailArrayList(state) {
        return state.tradeInfo.detailArrayList || []
    }
}
export default {
    state,
    mutations,
    actions,
    getters
}