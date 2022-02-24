<template>
  <div class="appointment-deal-container">
    <!-- <span>预约处理</span> -->
    <div v-if="reserveFilterList.length == 0" style="text-align: center;">
      <p>{{reserveMsg}}</p>
    </div>
    <div v-else>
      <table class="borrow-table">
        <tr>
          <th>姓名</th>
          <th>联系方式</th>
          <th>提交时间</th>
          <th>咨询内容</th>
          <th>操作</th>
        </tr>
        <tr v-for="(item,index) in list" :key="index">
          <td>
            <p>{{item.name}}</p>
          </td>
          <td>
            <p>{{'+' + item.phoneNumber}}</p>
          </td>
          <td>
            <p>{{item.createTime}}</p>
          </td>
          <td>
            <p style="text-align: left;">{{item.content}}</p>
          </td>
          <td>
            <el-tooltip class="item" effect="light" content="处理该预约记录" placement="top-end">
              <img src="../assets/imgs/update.png" style="margin-left: 30px;cursor:pointer;"
                @click="reserveSave(item.id)" />
            </el-tooltip>
            <el-dialog title="处理该预约" :visible.sync="dialogReserveVisible" center :close-on-press-escape="false"
              :close-on-click-modal="false" :modal-append-to-body="false">
              <div>
                <el-form label-width="80px">
                  <el-form-item label="备注：">
                    <el-input type="textarea" style="width: 70%;" v-model="note"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <div slot="footer">
                <el-button class="button-style" @click="dialogReserveVisible = false">取 消</el-button>
                <el-button class="button-style" type="primary" @click="reserveSaveSure">确 定</el-button>
              </div>
            </el-dialog>
          </td>
        </tr>
      </table>
      <div style="width: 100%;height: 50px;">
        <div style="margin:15px 0;position:absolute;right:6%;">
          <el-pagination @current-change="handleCurrentChange" :current-page="page"
            layout="total, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        reserveList: [],
        reserveFilterList: [],
        reserveMsg: '数据加载中...',
        list: [],
        page: 1,
        pageNum: 10,
        total: 0,
        dialogReserveVisible: false,
        reserveId: '',
        note: '',

      }
    },
    created() {
      this.getReserveList()
    },
    methods: {
      getReserveList() {
        this.reserveList = [];
        this.reserveFilterList = [];
        this.reserveMsg = '数据加载中...';
        this.$axios.post(this.$store.state.baseUrl + '/reserveList').then(res => {
          console.log('预约列表');
          console.log(res);
          this.reserveList = res.data;
          console.log(this.reserveList);
          if (this.reserveList.length !== 0) {
            for (let i = 0; i < this.reserveList.length; i++) {
              if (this.reserveList[i].flag == 0) {
                this.reserveFilterList.push(this.reserveList[i]);
              }
            }
          }
          this.total = this.reserveFilterList.length;
          if (this.reserveFilterList.length == 0) {
            this.reserveMsg = '啊哦~ 暂无数据...'
          } else {
            this.getList()
          }
        }).catch(err => {
          console.log(err);
        })
      },
      // 处理该预约
      reserveSave(id) {
        this.reserveId = id;
        this.note = "";
        this.dialogReserveVisible = true;
      },
      // 确定处理
      reserveSaveSure() {
        this.$axios.post(this.$store.state.baseUrl + '/reserveSave', {
          id: this.reserveId,
          note: this.note
        }).then(res => {
          console.log('处理该预约');
          console.log(res);
          this.$message.success({
            message: '预约处理成功',
            showClose: true,
            duration: 2000
          });
          this.getReserveList();
          this.dialogReserveVisible = false;
        }).catch(err => {
          console.log(err);
          this.$message.error({
            message: err.data.message,
            showClose: true,
            duration: 2000
          });
          this.dialogReserveVisible = false;
        })
      },
      // 分页处理数据
      getList() {
        console.log('分页数据');
        this.list = [];
        this.total = this.reserveFilterList.length;
        console.log(this.reserveFilterList);
        // es6过滤得到满足搜索条件的展示数据list
        this.list = this.reserveFilterList.filter((item, index) =>
          index < this.page * this.pageNum && index >= this.pageNum * (this.page - 1)
        );
        console.log(this.list);
      },
      // 分页
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.page = val;

        document.documentElement.scrollTop = document.body.scrollTop = 0;
        this.getList();
        // (function smoothscroll() {
        //   let currentScroll =
        //     document.documentElement.scrollTop || document.body.scrollTop;
        //   if (currentScroll > 0) {
        //     window.requestAnimationFrame(smoothscroll);
        //     window.scrollTo(0, currentScroll - currentScroll / 5);
        //   }
        // })();
      },
    }
  }
</script>

<style lang="scss" scoped>
  .appointment-deal-container {
    width: 90%;
    margin: 0 auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 30px;

    .button-style {
      width: 150px;
      height: 45px;
      font-size: 15px;
    }

    .borrow-table {
      width: 100%;
      margin-top: 20px;

      th {
        height: 50px;
        line-height: 50px;
        background-color: #d7ebe7;
      }

      td {
        padding: 10px;
        background-color: #f3fbf9;
        border-bottom: 1px solid #d7ebe7;
        word-break: break-all;

        p {
          font-size: 15px;
        }
      }
    }

    .borrow-table tr:hover>td {
      background-color: #d7ebe7 !important;
    }

    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
    }

    tr {

      th,
      td {
        width: 20%;
        text-align: center;
      }
    }
  }
</style>