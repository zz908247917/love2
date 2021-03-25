//user模块的小store
import { reqPhoneCode } from '@/api'
import { reqUserRegister } from '@/api'
import { reqUserLogin } from '@/api'
import { reqGetUserInfo } from '@/api'
import { reqUserLogout } from '@/api'
import { getUserTempId } from '@/utils/userabout'
const state = {
    userTempId: getUserTempId(),
    code: '',
    token: localStorage.getItem('TOKEN_KEY'),
    userInfo: {}
}
const mutations = {
    RECEIVE_CODE(state, code) {
        state.code = code
    },
    RECEIVE_TOKEN(state, token) {
        state.token = token
    },
    RECEIVE_USERINFO(state, userInfo) {
        state.userInfo = userInfo
    },
    RESET_TOKEN(state) {
        state.token = ''
    },
    RESET_USERINFO(state) {
        state.userInfo = {}
        state.token = ''
    },
}
const actions = {
    async getCode({ commit }, phone) {
        const result = await reqPhoneCode(phone)
        if (result.code === 200) {
            commit('RECEIVE_CODE', result.deta)
            return result.data
        } else {
            return this.$message("请输入手机号");
        }
    },
    async userRegister({ commit }, userInfo) {
        const result = await reqUserRegister(userInfo)
        if (result.code === 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('failed'))
        }
    },
    async userLogin({ commit }, userInfo) {
        const result = await reqUserLogin(userInfo)
        if (result.code === 200) {
            commit('RECEIVE_TOKEN', result.data.token)
            localStorage.setItem('TOKEN_KEY', result.data.token)
            return 'ok'
        } else {
            return Promise.reject(new Error('failed'))
        }
    },
    async getUserInfo({ commit }) {
        const result = await reqGetUserInfo()
        if (result.code === 200) {
            commit('RECEIVE_USERINFO', result.data)
            return result.data.name
        } else {
            return Promise.reject(new Error('failed'))
        }
    },
    async resetToken({ commit }) {
        commit('RESET_TOKEN')
        localStorage.removeItem('TOKEN_KEY')
    },

    async userLogout({ commit }) {
        const result = await reqUserLogout()
        if (result.code === 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('failed'))

        }
    },
    async resetUserInfo({ commit }) {
        commit('RESET_USERINFO')
        localStorage.removeItem('RESET_USERINFO')

    }

}

const getters = {}
export default {
    state,
    mutations,
    actions,
    getters
}