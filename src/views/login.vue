<template>
  <div class="container-login-one">
    <div class="login-container-top">
      <img src="../assets/imgs/toptimeclub-01.png" />
      <p class="span1">美奈美颜后台管理系统</p>
    </div>
    <div class="login-container-main">
      <div class="login-bottom">
      </div>
      <div class="login-container" @keydown="keyLogin()">
        <div class="containter-center">
          <div class="login-top">
            <!-- <div>
              <span class="top-span">联通</span>
            </div> -->
            <!--  style="margin-top: 40px;" -->
            <div>
              <span class="top-span-login">登录</span>
            </div>
          </div>
          <div class="login-form">
            <div class="username" id="user">
              <p><img :src="usernameImg" style="width: 19px;height: 20px;" /></p>
              <input class="user-input" type="text" v-model="loginForm.user" placeholder="请输入用户名" autofocus="autofocus"
                prefix-icon="el-icon-s-custom" tabindex="1" auto-complete="on" @focus="usernameFocus($event)"
                @blur="usernameBlur($event)" />
            </div>
            <div class="password" id="psw">
              <p><img :src="passwordImg" style="width: 19px;height: 20px;" /></p>
              <input class="pass-input" type="password" v-model="loginForm.psw" placeholder="请输入密码"
                prefix-icon="el-icon-lock" tabindex="2" auto-complete="on" @focus="passwordFocus($event)"
                @blur="passwordBlur($event)" />
            </div>
          </div>
          <div class="login-button">
            <button @click="handleLogin" class="loginBtn">登录</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        loginForm: {
          user: "",
          psw: ""
        },
        usernameImg: require('../assets/imgs/user1.png'),
        passwordImg: require('../assets/imgs/psw1.png'),
      }
    },
    beforeRouteEnter: (to, from, next) => {
      // 组件内守卫
      // 已登录状态回到登录状态，即 登出
      next(vm => {
        vm.$store.dispatch('setToken', null)
      })
    },
    methods: {
      // 登录
      handleLogin() {
        if (this.loginForm.user == "" || this.loginForm.psw == "") {
          this.$message.warning({
            message: "用户名或密码不能为空 !",
            showClose: true,
            duration: 2000
          })
        } else {
          this.$axios.post(this.$store.state.baseUrl + '/adminLogin', {
            user: this.loginForm.user,
            psw: this.loginForm.psw
          }).then((res) => {
            console.log('登陆成功啦');
            console.log(res)
            this.$message.success({
              message: '登陆成功',
              showClose: true,
              duration: 2000
            });
            // 将用户昵称、用户角色和token等放入sessionStorage
            sessionStorage.setItem('nick', res.data.nick);
            // console.log(sessionStorage.getItem('nick'));
            sessionStorage.setItem('token', res.data.token);
            // console.log(sessionStorage.getItem('token'));

            // 将用户昵称、用户角色及token等放入vuex
            this.$store.dispatch('setNick', res.data.nick);
            this.$store.dispatch('setToken', res.data.token);

            this.$store.state.isLogin = true;
            console.log(this.$store.state.isLogin);

            this.$router.push('/home');
            // 页面回到顶部
            (function smoothscroll() {
              var currentScroll =
                document.documentElement.scrollTop || document.body.scrollTop;
              if (currentScroll > 0) {
                window.requestAnimationFrame(smoothscroll);
                window.scrollTo(0, currentScroll - currentScroll / 5);
              }
            })();
          }).catch((err) => {
            this.$message.error({
              message: err.data.message,
              showClose: true,
              duration: 2000
            });
            this.$store.dispatch('setToken', null);
            this.loginForm.password = "";
            // console.log(err);
            // console.log('fffffffff');
          })
        }

      },
      usernameFocus(e) {
        this.usernameImg = require('../assets/imgs/user-1.png');
        let user = document.getElementById("user");
        e.target.style.color = "#2e4d65";
        user.style.borderBottom = "2px solid #2e4d65";
      },
      usernameBlur(e) {
        this.usernameImg = require('../assets/imgs/user1.png');
        let user = document.getElementById("user");
        e.target.style.color = "#c8c8c8";
        user.style.borderBottom = "2px solid #c8c8c8";
      },
      passwordFocus(e) {
        this.passwordImg = require('../assets/imgs/psw-1.png');
        let psw = document.getElementById("psw");
        e.target.style.color = "#2e4d65";
        psw.style.borderBottom = "2px solid #2e4d65";
      },
      passwordBlur(e) {
        this.passwordImg = require('../assets/imgs/psw1.png');
        let psw = document.getElementById("psw");
        e.target.style.color = "#c8c8c8";
        psw.style.borderBottom = "2px solid #c8c8c8";
      },
      // 回车键登录
      keyLogin() {
        if (event.keyCode == 13) {
          this.handleLogin();
        }
      }
    },
  }
</script>
<style lang="scss" scoped>
  $height: 40px;

  .container-login-one {
    height: auto;

  }

  .login-container-top {
    padding-top: 80px;
    margin-left: 5%;
    display: flex;

    .span1 {
      height: 74px;
      line-height: 74px;
      margin: 0;
      margin-left: 20px;
      font-style: italic;
      font-size: 30px;
      font-weight: bold;
      color: #0c8563;
    }
  }

  .login-container-main {
    height: 590px;
    margin-top: 140px;
    display: flex;
    justify-content: space-between;
    background: url('../assets/imgs/background.png') no-repeat;

    .login-bottom {
      margin-left: 7%;
    }

    .login-container {
      width: 416px;
      height: 484px;
      margin-top: -70px;
      margin-right: 328px;

      .containter-center {
        padding: 62px 46px;
        border-radius: 16px;
        background-color: #fff;
        border: 1px solid #dedede;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }

      .login-top {

        .top-span {
          font-size: 30px;
          font-weight: bold;
          line-height: 30px;
          color: #0c8563;
        }

        .top-span-login {
          font-size: 26px;
          color: #000;
        }
      }

      .login-form {
        width: 100%;
        margin: 36px 0 50px;

        .username {
          width: 100%;
          display: flex;
          border-bottom: 2px solid #c8c8c8;

          p {
            margin: 0;
            margin-top: 10px;
          }
        }

        .user-input,
        .pass-input {
          width: 80%;
          height: $height;
          padding-left: 20px;
          border: 0;
          background: 0;
          outline: none;
          font-size: 16px;
          color: #fafafa;
        }

        .password {
          width: 100%;
          margin-top: 40px;
          display: flex;
          border-bottom: 2px solid #c8c8c8;

          p {
            margin: 0;
            margin-top: 3px;
          }
        }
      }

      .login-button {
        width: 100%;

        .loginBtn {
          width: 100%;
          height: 50px;
          font-size: 16px;
          color: #fff;
          background-color: #0c8563;
          border: 0;
          outline: none;
          border-radius: 50px;
          cursor: pointer;
        }
      }
    }
  }


  input::-webkit-input-placeholder {
    color: #e4e3e3;
  }

  input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #e4e3e3;
  }

  input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #e4e3e3;
  }

  input:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #e4e3e3;
  }

  .input-focus {
    border-bottom: 1px solid #0c8563;
    color: #0c8563;
  }

  .input-onblur {
    border-bottom: 1px solid #c8c8c8;
    color: #fafafa;
  }
</style>
<style lang="scss">
  input:-internal-autofill-selected {
    background-color: transparent !important;
    background-image: none !important;
    color: -internal-light-dark-color(black, white) !important;
  }
</style>