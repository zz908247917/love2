<template>
  <div>
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <li class="with-x" v-if="searchParams.categoryName">
              {{ searchParams.categoryName
              }}<i @click="removeCategoryName">×</i>
            </li>
            <li class="with-x" v-if="searchParams.keyword">
              {{ searchParams.keyword }}<i @click="removeKeyword">×</i>
            </li>
            <li class="with-x" v-if="searchParams.trademark">
              {{ searchParams.trademark.split(":")[1]
              }}<i @click="removeTrademark">×</i>
            </li>

            <li
              class="with-x"
              v-for="(prop, index) in searchParams.props"
              :key="index"
            >
              {{ prop.split(":")[1] }}<i @click="removeProp(index)">×</i>
            </li>
          </ul>
        </div>

        <!--selector-->
        <SearchSelector
          @searchForTrademark="searchForTrademark"
          @searchForProps="searchForProps"
        />

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <!-- 
                  第一步：先把背景色搞定，根据数据的排序标志决定背景色在哪个动态绑定类
                  第二步：字体图标
                      用啥  iconfont
                      哪个字体图标应该出现
                      出现了字体图标是向上还是向下
                -->

                <li
                  :class="{ active: orderFlag === '1' }"
                >
                  <a href="javascript:;" @click="changeOrder('1')">
                    综合
                    <i
                      v-if="orderFlag === '1'"
                      class="iconfont"
                      :class="{
                        iconup: orderType === 'asc',
                        icondown: orderType === 'desc',
                      }"
                    ></i>
                  </a>
                </li>
                <li
                  :class="{ active: orderFlag === '2' }"
                >
                  <a href="javascript:;" @click="changeOrder('2')">
                    价格
                    <i
                      v-if="orderFlag === '2'"
                      class="iconfont"
                      :class="{
                        iconup: orderType === 'asc',
                        icondown: orderType === 'desc',
                      }"
                    ></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="goods-list">
            <ul class="yui3-g">
              <li
                class="yui3-u-1-5"
                v-for="(goods, index) in goodsList"
                :key="goods.id"
              >
                <div class="list-wrap">
                  <div class="p-img">
                    <router-link :to="'/detail/'+goods.id">
                      <img :src="goods.defaultImg"/>
                    </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{ goods.price }}</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <router-link :to="'/detail/'+goods.id">
                      {{ goods.title }}
                    </router-link>
                    <!-- <a target="_blank" href="item.html">{{ goods.title }}</a> -->
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                      >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 
            :currentPageNo="searchParams.pageNo"  传给分页器组件的当前页码，后面需要展示
            :total="goodsListInfo.total"  //传递给分页器组件的总条数，后面需要展示
            :pageSize="searchParams.pageSize" //传递给分页器组件的每页数量，后面你需要计算总页数
            :continueNo="5" //传递给分页器组件的连续页数，代表三点之前有几个按钮
          -->
          <Pagination
            :currentPageNo="searchParams.pageNo"
            :total="goodsListInfo.total"
            :pageSize="searchParams.pageSize"
            :continueNo="5"
            @changePageNo="changePageNo"
          ></Pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import SearchSelector from "./SearchSelector/SearchSelector";
export default {
  name: "Search",
  data() {
    return {
      //初始化的搜索参数对象，包含了后期所有的搜索条件，只不过初始化的时候大部分都是空的
      // 后期搜索，需要哪个条件，就把这个对象里面对应的条件修改过来，然后发请求都需要带上这个对象
      searchParams: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
        categoryName: "",
        keyword: "",
        props: [],
        trademark: "",

        order: "1:desc",
        //冒号前代表排序标志 冒号后代表排序类型
        //排序标志为1代表是按照综合排序，2代表价格排序
        //排序类型asc代表升序  desc代表降序

        pageNo: 1,
        pageSize: 2,
      },
    };
  },

  // 以后我们在beforeMount当中同步修改数据
  // mounted当中我们是做异步发送请求

  beforeMount() {
    // let {
    //   category1Id,
    //   category2Id,
    //   category3Id,
    //   categoryName,
    // } = this.$route.query;
    // let { keyword } = this.$route.params;

    // let obj = {
    //   ...this.searchParams,
    //   category1Id,
    //   category2Id,
    //   category3Id,
    //   categoryName,
    //   keyword,
    // };

    // this.searchParams = obj;
    this.handlerSearchParams();
  },
  mounted() {
    this.getGoodsListInfo();
  },

  methods: {
    getGoodsListInfo() {
      // dispatch在传参的时候只能传一个参数
      // 如果是多个参数要传，也只能封装在同一个对象去传

      //我们在这里请求的时候传递{}仅仅只是为了拿到测试数据，进行初始化数据展示，但是{}不是我们的搜索对象
      //也就是说传递空对象，并没有搜索的逻辑
      //而我们如果要有搜索的逻辑，必须发请求的时候都带上我们定义好的搜索参数searchParams，只不过一开始我们搜索条件也都是空的
      //和写空对象结果是一样的
      //后期搜索的时候，我们是需要修改这个搜索对象对应的搜索条件属性，然后再次发送请求，就可以搜索

      this.$store.dispatch("getGoodsListInfo", this.searchParams);
    },

    //处理路由当中的参数，赋值给searchParams
    handlerSearchParams() {
      let {
        category1Id,
        category2Id,
        category3Id,
        categoryName,
      } = this.$route.query;
      let { keyword } = this.$route.params;

      let obj = {
        ...this.searchParams,
        category1Id,
        category2Id,
        category3Id,
        categoryName,
        keyword,
      };

      //得把对象当中所有的空串属性干掉，否则这个数据也会传递，影响我们的带宽
      Object.keys(obj).forEach((item) => {
        if (obj[item] === "") {
          delete obj[item];
        }
      });

      this.searchParams = obj;
    },

    //删除面包屑当中的分类名称
    removeCategoryName() {
      this.searchParams.categoryName = undefined;
      //这样去发请求，我们只会发请求，而不会改变路径，导致数据是对的，但是路径是不对的
      // 因此我们不能这样去发请求，而是要想办法既能改变路径也能发请求
      // this.getGoodsListInfo()
      //从search再往search跳一次，只不过这一次跳只带原来的params参数，而把query参数干掉
      // this.$router.push({name:'search',params:this.$route.params})
      this.searchParams.pageNo = 1
      this.$router.replace({ name: "search", params: this.$route.params });
    },
    //删除面包屑当中的关键字
    removeKeyword() {
      this.searchParams.keyword = undefined;

      this.$bus.$emit("clearKeyword"); //谁发送数据谁$emit
      // this.getGoodsListInfo()
      // this.$router.push({name:'search',query:this.$route.query})
      this.searchParams.pageNo = 1

      this.$router.replace({ name: "search", query: this.$route.query });
    },

    //按照品牌搜索
    searchForTrademark(tm) {
      this.searchParams.trademark = `${tm.tmId}:${tm.tmName}`;
      this.searchParams.pageNo = 1

      this.getGoodsListInfo();
    },
    //删除面包屑当中的品牌
    removeTrademark() {
      this.searchParams.trademark = undefined;
      this.searchParams.pageNo = 1

      this.getGoodsListInfo();
    },

    //按照属性搜索
    searchForProps(attrValue, attr) {
      let prop = `${attr.attrId}:${attrValue}:${attr.attrName}`;

      //some和every
      //功能  参数  返回值
      //some
      // 功能：判断数组当中是不是有和我的条件一样的东西
      // 参数：和filter 一样
      // 返回值：返回布尔值  （如果有一项符合条件就为true,如果所有的都不符合条件才为false）

      //every
      //功能：判断数组当中是不是所有的都和我的条件一样
      //参数：和filter一样
      //返回值： 返回布尔值 （如果所有的都一样，那么返回true,只要有一个不符合条件为false）

      let isRepeat = this.searchParams.props.some((item) => item === prop);
      if (isRepeat) {
        return;
      }

      this.searchParams.props.push(prop);
      this.searchParams.pageNo = 1
      
      this.getGoodsListInfo();
    },

    //删除面包屑的属性重新发请求
    removeProp(index) {
      this.searchParams.props.splice(index, 1);
      this.searchParams.pageNo = 1
      this.getGoodsListInfo();
    },
    //点击综合或者价格排序
    changeOrder(orderFlag) {
      //先获取到原来的排序标志和排序类型
      // let originFlag = this.searchParams.order.split(":")[0];
      let originFlag = this.orderFlag;
      let originType = this.orderType;
      let newOrder = "";
      //判断这一次点击的标志是不是和原来的一样
      if (orderFlag === originFlag) {
        //代表点的是一样的
        newOrder = `${orderFlag}:${originType === "asc" ? "desc" : "asc"}`;
      } else {
        //代表点的是不一样的
        newOrder = `${orderFlag}:desc`;
      }
      this.searchParams.order = newOrder;
      this.searchParams.pageNo = 1
      this.getGoodsListInfo();
    },
    //点击分页器里面的页码和上一页下一页，重新发送请求
    changePageNo(page) {
      this.searchParams.pageNo = page;
      this.getGoodsListInfo();
    },
  },

  watch: {
    $route: {
      handler(newVal, oldVal) {
        this.handlerSearchParams();
        this.getGoodsListInfo();
      },
    },
  },

  computed: {
    ...mapGetters(["goodsList"]),
    ...mapState({
      goodsListInfo: (state) => state.search.goodsListInfo,
    }),
    //简化数据在模板当中的写法
    orderFlag(){
      return this.searchParams.order.split(":")[0];
    },
    orderType(){
      return this.searchParams.order.split(":")[1];
    }

  },

  components: {
    SearchSelector,
  },
};
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>