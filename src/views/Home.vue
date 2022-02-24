<template>
  <div class="container" id="container-home">
    <el-container class="container">
      <el-aside class="aside" style="width:324px;height: 100%;position: fixed;left: 0;">
        <div class="aside-container">
          <div style="width: 203px;margin: 0 auto;">
            <img src="../assets/imgs/logo_white.png" class="logoImg" />
            <p
              style="width: 180px;margin: 0 auto;padding-bottom: 30px;font-size: 21px;color: #fff;border-bottom:1px solid #f1f1f1;">
            </p>
          </div>
          <ul class="person-ul">
            <li class=" li-selected-background"
              :style="{backgroundImage: 'url(' + (selected == 1 ? coverImgUrl : baseImg) + ')', backgroundSize:'contain'}">
              <p class="my-purchase icon" style="margin: 0;text-align: left;color: #7f648e;"
                :style="{color: selected == 1 ? '#7f648e' : '#fff'}" @click="selected1">
                预约处理</p>
            </li>
            <li class=" li-selected-background"
              :style="{backgroundImage: 'url(' + (selected == 2 ? coverImgUrl : baseImg) + ')', backgroundSize:'contain'}">
              <p class="my-purchase icon" style="margin: 0;text-align: left;color: #7f648e;"
                :style="{color: selected == 2 ? '#7f648e' : '#fff'}" @click="selected2">
                预约列表</p>
            </li>
            <li class=" li-selected-background"
              :style="{backgroundImage: 'url(' + (selected == 3 ? coverImgUrl : baseImg) + ')', backgroundSize:'contain'}">
              <p class="my-purchase icon" style="margin: 0;text-align: left;color: #7f648e;"
                :style="{color: selected == 3 ? '#7f648e' : '#fff'}" @click="selected3">
                新闻发布</p>
            </li>
          </ul>
        </div>
      </el-aside>
      <el-container class="main" style="margin-left:324px;">
        <el-backtop>
          <img src="../assets/imgs/top.png" class="radius" />
        </el-backtop>
        <el-col :span="24" class="main-top">
          <el-row>
            <div class="main-top-right">
              <div style="display: flex;">
                <div class="right-div">
                  <span class="span1">Hi，{{userNick}}</span>
                </div>
                <div class="cut-off-rule"></div>
                <div @click="logOut" class="loginoutDiv">
                  <div style="margin-top: 3px;">
                    <img src="../assets/imgs/logOut.png" style="width: 20px;height: 20px;" />
                  </div>
                  <span class="loginout">退出登录</span>
                </div>
              </div>
            </div>
          </el-row>
        </el-col>
        <el-col :span="24" class="main-container">
          <!-- 预约处理 -->
          <AppointmentDealUn v-if="selected == 1" ref="appointmentDealUn"></AppointmentDealUn>
          <!-- 预约列表 -->
          <AppointmentDealCompleted v-if="selected == 2" ref="appointmentDealCompleted"></AppointmentDealCompleted>
          <!-- 新闻发布 -->
          <NewsRelease v-if="selected == 3" ref="newsRelease"></NewsRelease>
        </el-col>
      </el-container>
    </el-container>
  </div>
</template>
<script>
  import AppointmentDealUn from '../components/appointment-deal-un.vue';
  import NewsRelease from '../components/news-release.vue';
  import AppointmentDealCompleted from '../components/appointment-deal-completed.vue';

  export default {
    components: {
      AppointmentDealUn,
      AppointmentDealCompleted,
      NewsRelease
    },
    data() {
      return {
        userNick: '',
        coverImgUrl: require('../assets/imgs/selected.png'),
        baseImg: '',
        selected: 1,

      };
    },
    created() {
      this.userNick = sessionStorage.getItem("nick");
    },
    mounted() {
      //防止页面后退
      this.keydown();
    },
    methods: {
      // 预约处理
      selected1() {
        this.selected = 1;
        this.$nextTick(() => {
          this.$refs.appointmentDealUn.page = 1;
          this.$refs.appointmentDealUn.getList();
        })
        this.backTop();
      },
      // 预约列表
      selected2() {
        this.selected = 2;
        this.$nextTick(() => {
          this.$refs.appointmentDealCompleted.page = 1;
          this.$refs.appointmentDealCompleted.getList();
        })
        this.backTop();
      },
      // 新闻发布
      selected3() {
        this.selected = 3;
        this.$nextTick(() => {
          this.$refs.newsRelease.newsSelect = 0;
        })
        this.backTop();
      },
      // 退出登录
      logOut() {
        this.$router.push('/');
        this.$store.dispatch('setToken', null);
      },

      // 页面回到顶部
      backTop() {
        let timer = null;
        cancelAnimationFrame(timer);
        timer = requestAnimationFrame(function fn() {
          var oTop = document.body.scrollTop || document.documentElement.scrollTop;
          if (oTop > 0) {
            document.body.scrollTop = document.documentElement.scrollTop = oTop - 100;
            timer = requestAnimationFrame(fn);
          } else {
            cancelAnimationFrame(timer);
          }
        });
      },
      // 阻止页面后退
      keydown() {
        console.log(window);
        window.document.onkeydown = function () {
          if (
            window.event.altKey &&
            (window.event.keyCode == 37 || window.event.keyCode == 39)
          ) {
            // alert("不准你使用ALT+方向键前进或后退网页！");
            event.returnValue = false;
          }
        };
      },
    }
  }
</script>
<style lang="scss" scoped>
  .top-search-button {
    width: 80px;
    height: 40px;
    margin-top: 20px;
    background-color: #7f648e;
    color: #fff;
    outline: none;
    border: none;
    border-radius: 30px;
    cursor: pointer;
  }

  ul,
  li,
  a {
    margin: 0;
    padding: 0;
    text-decoration: none;
    list-style: none;
  }

  .aside {
    width: 324px;
    padding-top: 40px;
    padding-bottom: 30px;
    background: #7f648e;

    ul li {
      margin-top: 40px;
      list-style: none;
      cursor: pointer;
      color: #fff;
    }

    .aside-container {
      width: 100%;
      position: absolute;
      // padding-left: 10px;
      z-index: 999;
      text-align: center;

      .aside-top,
      .aside-top-admin {
        font-size: 28px;
        color: #fff;
        text-align: center;
        line-height: 36px;
      }

      .aside-top {
        padding: 0 60px;
      }

      .aside-top-admin {
        padding: 0 50px;
      }

      .person-ul {
        width: 100%;
        // margin-top: 30px;

        .li-selected-background {
          height: 76px;
          padding-left: 30px;
          padding-right: 30px;
          margin-top: 20px;
          margin-left: 30px;
          line-height: 76px;
          background: url('../assets/imgs/selected.png');
        }

        .icon {
          margin-right: 10px;
          font-size: 16px;
        }

        .icon-size {
          width: 21px;
          height: 20px;
        }

      }
    }
  }

  .logoImg {
    width: 100%;
    height: 50px;
  }

  .main {
    width: 89%;
    padding: 0;
    margin: 0;
    position: relative;

    .main-top {
      height: 80px;
      margin-bottom: 20px;
      position: fixed;
      top: 0;
      left: 324px;
      line-height: 80px;
      background-color: #fff;
      z-index: 9999;

      .main-top-left {
        position: absolute;
        top: 30px;
        left: 0;
        display: flex;
        line-height: 2;

        .first-fint-size {
          font-size: 18px;
        }

        .fint-size {
          font-size: 16px;
          color: #aaa;
        }
      }

      .main-top-right {
        width: 100%;
        height: 60px;
        position: relative;

        .loginout {
          margin-left: 5px;
          color: #000;
          font-size: 15px;
        }

        .right-div {
          // width: 200px;
          position: absolute;
          top: 0;
          right: 570px;
          height: 45px;
          line-height: 45px;
          margin-top: 15px;
          padding: 0;
          display: flex;
          justify-content: space-evenly;
          // cursor: pointer;

          .span1 {
            display: inline-block;
            font-size: 16px;
            color: #000;
            overflow: hidden;
            word-break: keep-all;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }

        .cut-off-rule {
          width: 2px;
          height: 26px;
          position: absolute;
          top: 27px;
          right: 530px;
          background-color: #f1f1f1;
        }

        .loginoutDiv {
          display: flex;
          line-height: 80px;
          position: absolute;
          top: 0;
          right: 405px;
          cursor: pointer;
        }

        .downbtn {
          width: 170px;
          padding: 10px 15px;
          position: absolute;
          top: 130%;
          right: 570px;
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 20px;
          // box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
          z-index: 999;

          .updateUl,
          .updateLi1 {
            margin: 0;
            padding: 0;
            list-style: none;
          }

          .updateLi1 {
            .updateP {
              text-align: center;
              color: #000;

              .update-nick-img {
                // width: 50px;
                height: 40px;
                margin: 0 auto;
                line-height: 40px;
                border-radius: 15px;
                display: flex;
                justify-content: space-around;

                span {
                  font-size: 15px;
                }
              }

              .nick-img {
                width: 70%;
                margin: 10px auto;
                border-bottom: 1px solid #c8c8c8;
              }

              .psw-img {
                width: 70%;
                margin: 2px auto;
              }
            }

            .update-nick {
              width: 70%;
              padding-left: 20px;
              border-radius: 5px;
              border: 1px solid #ddd;
              outline: none;
            }

            .updateP:hover {
              cursor: pointer;
            }
          }

          .update-nick {
            width: 70%;
            padding-left: 20px;
            border-radius: 5px;
            border: 1px solid #ddd;
            outline: none;
          }

          li {
            line-height: 30px;
            text-align: left;
            padding-left: 5px;
          }

          a:hover {
            text-decoration: underline;
            color: #f00;
          }

          a {
            display: block;
            color: black;
            width: 100%;
          }
        }
      }
    }

    .main-container {
      width: 100%;
      min-height: 900px;
      padding-bottom: 50px;
      margin-top: 80px;
      padding-top: 20px;
      background-color: #f1f9f7;
      z-index: 0;
    }

    .radius {
      width: 50px;
      height: 50px;
    }
  }
</style>
<style lang="scss">
  #container-home {
    .upload-imgs {
      margin: 20px 0;
    }

    .el-dialog {
      border-radius: 30px;
    }

    .el-button--primary {
      color: #fff;
      background-color: #7f648e !important;
      border-color: #7f648e !important;
    }

    .el-dialog__body {
      text-align: left;
    }

    .el-dialog--center .el-dialog__footer {
      text-align: right;
    }

    .el-button+.el-button {
      margin-left: 10%;
    }

    .el-form-item::after,
    .el-form-item::before {
      display: none;
      content: "";
    }

    .el-form-item__content::after,
    .el-form-item__content::before {
      display: none;
      content: "";
    }

    .el-input__suffix {
      width: 30%;
    }

    .el-input__inner {
      height: 40px;
      border-radius: 30px;
    }

    .el-pagination button:disabled {
      color: #c0c4cc;
      background-color: transparent;
      cursor: not-allowed;
    }

    div .el-pager li {
      background-color: transparent !important;
    }

    .el-pagination .btn-next,
    .el-pagination .btn-prev {
      background: center center no-repeat transparent;
      background-size: 16px;
      cursor: pointer;
      margin: 0;
      color: #303133;
    }

    .input-search {
      font-size: 16px;
    }

    .el-form-item__label {
      font-size: 15px;
      text-align: right;
    }

    .el-pagination__editor.el-input .el-input__inner {
      height: 28px;
    }

    .el-dialog__footer {
      padding: 10px 60px 30px;
    }

    .el-checkbox__label {
      font-size: 14px;
    }

    table>tr:hover>td {
      background-color: #d7ebe7 !important;
    }

    table>tr>th {
      height: 50px;
      line-height: 50px;
      background-color: #d7ebe7;
    }

    table>tr>td {
      background-color: #f3fbf9;
    }

    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
    }
  }
</style>