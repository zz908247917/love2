//这个文件是所有的接口请求函数
//每个函数，里面都是通过axios往对应的接口发请求的
//以后，你想要哪个数据，就调用对应的这个接口请求函数就ok
//一共是多少个接口，就对应有多少个接口请求函数
import Ajax from './ajax'
import mockAjax from '@/api/mockAjax'

// axios是第三方插件，是原生XHR和promise封装的发送ajax的工具
// axios现在是市面上使用最频繁最火爆的发送ajax请求工具
// axios本身是一个函数，那么也就是函数对象。所以有两种用法（函数用法和对象用法）
// axios()和axios.get
// 使用的时候需要特别注意的就是axios发请求的三种参数
//先说函数用法
// 请求参数：params,query,body
// params:路径的一部分，只能在路径里面写
// query：不属于路径的部分，但是有两种写法：
//  1、可以在路径后面？分割 key=value&key=value
//  2、可以在配置项 params里面配置query参数
// body:这个请求体参数，一般只出现在post和put里面，需要在配置项data当中去配置（都是对象）
// axios({
//   // url:'http://localhost:8080/userinfo/1?username=zhaoliying'
//   url:'http://localhost:8080/userinfo/1',
//   method:'post',
//   params:{
//     //代表query参数
//     username:'zhaoliying'
//   },
//   data:{
//     //代表是body参数
//   }
// })

//请求获取三级分类列表数据
///api/product/getBaseCategoryList
//get
export const reqCategoryList = () => {
        return Ajax({
            url: '/product/getBaseCategoryList',
            // url:'',
            method: 'get'
        })
    }
    //第一种测试，需要把文件在main引入
    // reqCategoryList()


//请求获取模拟的banner数据

export const reqBannerList = () => {
    return mockAjax({
        url: '/banner',
        method: 'get'
    })
}


//请求获取模拟的floor数据

export const reqFloorList = () => {
    return mockAjax({
        url: '/floor',
        method: 'get'
    })
}


//请求获取search商品列表数据
// /api/list
// post

export const reqGoodsListInfo = (searchParams) => {
    return Ajax({
        url: '/list',
        method: 'post',
        data: searchParams
    })
}

// reqGoodsListInfo({}) //这里测试的时候，不能不传，最次得传个空的对象

//请求获取商品详情数据
///api/item/{ skuId }
//get

export const reqGoodsDetailInfo = (skuId) => {
    return Ajax({
        url: `/item/${ skuId }`,
        method: 'get'
    })
}


//请求添加购物车（或者修改购物车的数量）
///api/cart/addToCart/{ skuId }/{ skuNum }
//post

export const reqAddOrUpdateShopCart = (skuId, skuNum) => {
    return Ajax({
        url: `/cart/addToCart/${ skuId }/${ skuNum }`,
        method: 'post'
    })
}

//请求获取购物车列表数据
///api/cart/cartList
//get

export const reqShopCartList = () => {
    return Ajax({
        url: '/cart/cartList',
        method: 'get'
    })
}

// 请求修改购物车单个选中状态
///api/cart/checkCart/{skuId}/{isChecked}
//get

export const reqUpdateCartChecked = (skuId, isChecked) => {
    return Ajax({
        url: `/cart/checkCart/${skuId}/${isChecked}`,
        method: 'get'
    })
}


//请求修改购物车多个选中状态
///api/cart/batchCheckCart/{isChecked}
//post

export const reqUpdateCartCheckedAll = (isChecked, skuIds) => {
    return Ajax({
        url: `/cart/batchCheckCart/${isChecked}`,
        method: 'post',
        data: skuIds
    })
}


//请求删除单个购物车
// /api/cart/deleteCart/{skuId}
//delete

export const reqDeleteOneCart = (skuId) => {
    return Ajax({
        url: `/cart/deleteCart/${skuId}`,
        method: 'delete'
    })
}

//请求删除多个购物车
///api/cart/batchDeleteCart
//delete

export const reqDeleteAllCart = (skuIds) => {
    return Ajax({
        url: '/cart/batchDeleteCart',
        method: 'delete',
        data: skuIds
    })
}



// 请求获取验证码

export const reqPhoneCode = (phone) => {
    return Ajax({
        url: `/user/passport/sendCode/${phone}`,
        method: 'get',
    })
}


//请求注册用户

export const reqUserRegister = (userInfo) => {
    return Ajax({
        url: '/user/passport/register',
        method: 'post',
        data: userInfo,
    })
}

//登录

export const reqUserLogin = (userInfo) => {
    return Ajax({
        url: '/user/passport/login',
        method: 'post',
        data: userInfo,
    })
}


//获取登录人员信息根据token

export const reqGetUserInfo = () => {
    return Ajax({
        url: '/user/passport/auth/getUserInfo',
        method: 'get',
    })
}



// 退出登录

export const reqUserLogout = () => {
    return Ajax({
        url: '/user/passport/logout',
        method: 'get',
    })
}