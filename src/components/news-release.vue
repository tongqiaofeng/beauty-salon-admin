<template>
  <div class="news-release-container" id="news-container">
    <!-- <h1>新闻发布</h1> -->
    <div v-if="newsSelect == 0">
      <div style="display: flex; justify-content: space-between;" id="obj">
        <el-select v-model="newsType" @change="newsTypeChange">
          <el-option value="所有分类目录"></el-option>
          <el-option
            v-for="item in articleTypeList"
            :key="item.id"
            :label="item.name.cn"
            :value="item.id"
          >
            {{ item.name.cn }}
          </el-option>
        </el-select>
        <el-button type="primary" class="button-style" @click="addNews"
          >增加新闻</el-button
        >
      </div>
      <div v-if="articleList.length == 0" style="text-align: center;">
        {{ articleMsg }}
      </div>
      <div v-else>
        <table class="borrow-table">
          <tr>
            <th>文章标题</th>
            <th>文章类型</th>
            <!-- <th>文章内容</th> -->
            <th>创建时间</th>
            <th>操作</th>
          </tr>
          <tr v-for="(article, index) in articleList" :key="article.id">
            <td class="td-title">
              <a
                :href="
                  '../#/details?select=' + article.type + '&id=' + article.id
                "
                target="_blank"
                class="overflow-style"
                >{{ article.title.cn }}</a
              >
            </td>
            <td>{{ article.name.cn }}</td>
            <td>{{ article.createTime }}</td>
            <td>
              <el-tooltip
                class="item"
                effect="light"
                content="修改查看新闻"
                placement="top-end"
              >
                <img
                  src="../assets/imgs/update.png"
                  style="margin-left: 30px;cursor:pointer;"
                  @click="updateNews(article, index)"
                />
              </el-tooltip>
              <el-dialog
                title="修改查看新闻"
                v-if="indexNow == article.id"
                :visible.sync="dialogUpdateNewsVisible"
                center
                :close-on-press-escape="false"
                :close-on-click-modal="false"
                :modal-append-to-body="false"
              >
                <el-form label-width="120px">
                  <el-form-item label="文章类型：">
                    <el-radio-group v-model="type" size="small">
                      <el-radio
                        v-for="(article, index) in articleTypeList"
                        :key="index"
                        :label="article.id"
                        border
                      >
                        {{ article.name.cn }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="语言类型：">
                    <el-radio-group v-model="langType" @change="langChange">
                      <el-radio
                        v-for="(lan, index) in langList"
                        :key="index"
                        :label="lan.label"
                        >{{ lan.value }}</el-radio
                      >
                    </el-radio-group>
                  </el-form-item>
                  <div v-if="langType == 'cn'">
                    <el-form-item label="文章标题：">
                      <el-input
                        v-model="title.cn"
                        style="width: 60%;"
                      ></el-input>
                    </el-form-item>
                  </div>
                  <div v-if="langType == 'en'">
                    <el-form-item label="文章标题：">
                      <el-input
                        v-model="title.en"
                        style="width: 60%;"
                      ></el-input>
                    </el-form-item>
                  </div>
                  <div v-if="langType == 'hk'">
                    <el-form-item label="文章标题：">
                      <el-input
                        v-model="title.hk"
                        style="width: 60%;"
                      ></el-input>
                    </el-form-item>
                  </div>
                  <div v-if="langType == 'kh'">
                    <el-form-item label="文章标题：">
                      <el-input
                        v-model="title.kh"
                        style="width: 60%;"
                      ></el-input>
                    </el-form-item>
                  </div>
                  <el-form-item label="文章正文：" id="releaseCon">
                    <AddRelease
                      v-if="dialogUpdateNewsVisible == true"
                      :key="timer"
                      @editorCon="editorCon"
                      :editorDadContent="editorContent"
                    >
                    </AddRelease>
                  </el-form-item>
                  <el-form-item label="图片/视频：">
                    <!-- <el-input type="textarea" style="width: 60%;"></el-input> -->
                    <div style="display:flex;">
                      <div class="upload-imgs">
                        <div class="add">
                          <div id="previewImg">
                            <form
                              enctype="multipart/form-data"
                              style="width:100px;height:100px;"
                            >
                              <input
                                @change="inputChange($event)"
                                type="file"
                                name="upload-images"
                                accept="image/*"
                                class="inputUpload"
                                multiple
                              />
                              <i class="el-icon-plus addIcon"></i>
                            </form>
                          </div>
                          <div style="position:relative;display:flex;">
                            <div style="margin-left:10px;position:relative;">
                              <span
                                v-if="imgSrcs !== ''"
                                class="spanStyle"
                                @click="delImage"
                                >x</span
                              >
                              <img
                                v-if="imgSrcs !== ''"
                                :src="img + imgSrcs"
                                width="100px"
                                height="100px"
                                style="border-radius:5px;object-fit:cover;"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </el-form-item>
                </el-form>
                <div slot="footer">
                  <el-button
                    class="button-style"
                    @click="dialogUpdateNewsVisible = false"
                    >取 消</el-button
                  >
                  <el-button
                    class="button-style"
                    type="primary"
                    @click="updateNewsSure"
                    >确 定</el-button
                  >
                </div>
              </el-dialog>
              <el-tooltip
                class="item"
                effect="light"
                content="删除新闻"
                placement="top-end"
              >
                <img
                  src="../assets/imgs/delete.png"
                  style="margin-left: 30px;cursor:pointer;"
                  @click="delNews(article.id)"
                />
              </el-tooltip>
              <el-dialog
                title="删除新闻"
                :visible.sync="dialogDelNewsVisible"
                center
                :close-on-press-escape="false"
                :close-on-click-modal="false"
                :modal-append-to-body="false"
              >
                <div style="text-align: center;">
                  <p>确定删除？删除后不可更改</p>
                </div>
                <div slot="footer">
                  <el-button
                    class="button-style"
                    @click="dialogDelNewsVisible = false"
                    >取 消</el-button
                  >
                  <el-button
                    class="button-style"
                    type="primary"
                    @click="delNewsSure"
                    >确 定
                  </el-button>
                </div>
              </el-dialog>
            </td>
          </tr>
        </table>

        <div style="width: 100%;height: 50px;">
          <div style="margin:15px 0;position:absolute;right:6%;">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="page"
              layout="total, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="back-img" @click="newsSelect = 0">
        <div>
          <img src="../assets/imgs/goback.png" />
        </div>
        <span class="font">返回</span>
      </div>
      <el-form label-width="120px">
        <el-form-item label="文章类型：">
          <el-radio-group v-model="type" size="small">
            <el-radio
              v-for="(article, index) in articleTypeList"
              :key="index"
              :label="article.id"
              border
            >
              {{ article.name.cn }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="语言类型：">
          <el-radio-group v-model="langType">
            <el-radio
              v-for="(lan, index) in langList"
              :key="index"
              :label="lan.label"
              >{{ lan.value }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <div v-if="langType == 'cn'">
          <el-form-item label="文章标题：">
            <el-input v-model="title.cn" style="width: 60%;"></el-input>
          </el-form-item>
        </div>
        <div v-if="langType == 'en'">
          <el-form-item label="文章标题：">
            <el-input v-model="title.en" style="width: 60%;"></el-input>
          </el-form-item>
        </div>
        <div v-if="langType == 'hk'">
          <el-form-item label="文章标题：">
            <el-input v-model="title.hk" style="width: 60%;"></el-input>
          </el-form-item>
        </div>
        <div v-if="langType == 'kh'">
          <el-form-item label="文章标题：">
            <el-input v-model="title.kh" style="width: 60%;"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="文章正文：" id="releaseCon">
          <AddRelease
            v-if="newsSelect == 1"
            ref="addRelease"
            @editorCon="editorCon"
          ></AddRelease>
        </el-form-item>
        <el-form-item label="图片/视频：">
          <!-- <el-input type="textarea" style="width: 60%;"></el-input> -->
          <div style="display:flex;">
            <div class="upload-imgs">
              <div class="add">
                <div id="previewImg">
                  <form
                    enctype="multipart/form-data"
                    style="width:100px;height:100px;"
                  >
                    <input
                      @change="inputChange($event)"
                      type="file"
                      name="upload-images"
                      accept="image/*"
                      class="inputUpload"
                      multiple
                    />
                    <i class="el-icon-plus addIcon"></i>
                  </form>
                </div>
                <div style="position:relative;display:flex;">
                  <div style="margin-left:10px;position:relative;">
                    <span
                      v-if="imgSrcs !== ''"
                      class="spanStyle"
                      @click="delImage"
                      >x</span
                    >
                    <img
                      v-if="imgSrcs !== ''"
                      :src="img + imgSrcs"
                      width="100px"
                      height="100px"
                      style="border-radius:5px;object-fit:cover;"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div
        style="margin-right: 100px;display: flex; justify-content: flex-end;"
      >
        <el-button type="primary" class="button-style" @click="submitNews"
          >提 交</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import AddRelease from "./add-release.vue";

import { quillEditor } from "vue-quill-editor"; //调用编辑器
import * as Quill from "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

export default {
  data() {
    return {
      img: this.$store.state.baseUrl,
      newsType: "所有分类目录",
      articleList: [],
      articleMsg: "数据加载中...",
      total: 0,
      page: 1,
      pageNum: 10,
      articleTypeList: [],
      type: "",
      title: {
        cn: "",
        en: "",
        hk: "",
        kh: "",
      },
      imgSrcs: "",
      content: {
        cn: "",
        en: "",
        hk: "",
        kh: "",
      },
      newsSelect: 0,
      newsId: "",
      dialogUpdateNewsVisible: false,
      editorContent: "",
      langType: "cn",
      langTypeCh: [],
      langList: [
        {
          label: "cn",
          value: "中文简体",
        },
        {
          label: "hk",
          value: "中文繁体",
        },
        {
          label: "en",
          value: "英语",
        },
        {
          label: "kh",
          value: "柬埔寨",
        },
      ],
      newsContainer: {},
      showComponentFlag: true,
      timer: null,
      indexNow: 0,
      delId: "",
      dialogDelNewsVisible: false,
    };
  },
  components: {
    AddRelease,
  },
  created() {
    this.getArticleTypeGet();
    this.getArticleList();
  },
  methods: {
    // 删除新闻
    delNews(id) {
      this.delId = id;
      this.dialogDelNewsVisible = true;
    },
    // 确定删除
    delNewsSure() {
      this.$axios
        .post(this.img + "/articleDelete", {
          id: this.delId,
        })
        .then((res) => {
          console.log("删除新闻");
          console.log(res);
          this.$message.success({
            message: "删除成功",
            showClose: true,
            duration: 2000,
          });
          this.dialogDelNewsVisible = false;
          this.getArticleList();
        })
        .catch((err) => {
          console.log(err);
          this.$message.error({
            message: err.data.message,
            showClose: true,
            duration: 2000,
          });
        });
    },
    // 修改查看新闻
    updateNews(item, index) {
      this.indexNow = item.id;
      console.log(this.indexNow);
      console.log(item.id);
      console.log("数据111111111111111111111111111");
      console.log(item);
      this.langTypeCh = [];
      this.dialogUpdateNewsVisible = true;
      this.newsContainer = item;
      this.newsId = item.id;
      this.type = item.type;
      this.langType = "cn";
      // this.title = item.title;
      // this.content = item.content;
      // this.editorContent = item.content.cn;
      this.langChange();
      this.imgSrcs = "";
      if (item.img == "" || item.img == null) {
        this.imgSrcs = "";
      } else {
        this.imgSrcs = item.img;
      }
    },
    // 语言变化
    langChange() {
      console.log(this.newsContainer);
      this.timer = new Date().getTime();
      console.log(this.langTypeCh);
      console.log(this.langType);

      if (this.langTypeCh.indexOf(this.langType) === -1) {
        console.log("777777777777777777");
        this.langTypeCh.push(this.langType);
        this.content.cn = this.newsContainer.content.cn;
        this.title.cn = this.regStr(this.newsContainer.title.cn);
        this.content.en = this.newsContainer.content.en;
        this.title.en = this.regStr(this.newsContainer.title.en);
        this.content.hk = this.newsContainer.content.hk;
        this.title.hk = this.regStr(this.newsContainer.title.hk);
        this.content.kh = this.newsContainer.content.kh;
        this.title.kh = this.regStr(this.newsContainer.title.kh);

        switch (this.langType) {
          case "cn":
            this.editorContent = this.newsContainer.content.cn;
            break;
          case "en":
            this.editorContent = this.newsContainer.content.en;
            break;
          case "hk":
            this.editorContent = this.newsContainer.content.hk;
            break;
          case "kh":
            this.editorContent = this.newsContainer.content.kh;
            break;
        }
      } else {
        console.log("888888888888888888888");
        console.log(this.content);
        console.log(this.title);
        this.content.cn = this.content.cn;
        this.title.cn = this.title.cn;
        this.content.en = this.content.en;
        this.title.en = this.title.en;
        this.content.hk = this.content.hk;
        this.title.hk = this.title.hk;
        this.content.kh = this.content.kh;
        this.title.kh = this.title.kh;
        switch (this.langType) {
          case "cn":
            this.editorContent = this.content.cn;
            break;
          case "en":
            this.editorContent = this.content.en;
            break;
          case "hk":
            this.editorContent = this.content.hk;
            break;
          case "kh":
            this.editorContent = this.content.kh;
            break;
        }
      }
      console.log("kkkkkkkkkkkkkkkkkkkkkk");
      console.log(this.content);
      console.log(this.editorContent);
    },
    // 确定修改
    updateNewsSure() {
      this.$axios
        .post(this.img + "/articleSave", {
          id: this.newsId,
          type: this.type,
          title: this.title,
          content: this.content,
          img: this.imgSrcs,
        })
        .then((res) => {
          console.log("修改新闻");
          console.log(res);
          this.$message.success({
            message: "新闻动态修改成功",
            showClose: true,
            duration: 2000,
          });
          this.dialogUpdateNewsVisible = false;
          this.getArticleList();
        })
        .catch((err) => {
          console.log("res");
          this.$message.error({
            message: err.data.message,
            showClose: true,
            duration: 2000,
          });
        });
    },
    // 新增新闻
    addNews() {
      this.newsSelect = 1;
      this.type = "";
      this.langType = "cn";
      this.title = {
        cn: "",
        en: "",
        hk: "",
        kh: "",
      };
      this.imgSrcs = "";
      this.content = {
        cn: "",
        en: "",
        hk: "",
        kh: "",
      };
      this.$nextTick(() => {
        this.$refs.addRelease.editorContent = "";
      });
    },
    // 确定增加新闻
    submitNews() {
      if (this.type == "") {
        this.$message.error({
          message: "请选择文章类型",
          showClose: true,
          duration: 2000,
        });
      } else {
        this.$axios
          .post(this.img + "/articleSave", {
            type: this.type,
            title: this.title,
            content: this.content,
            img: this.imgSrcs,
          })
          .then((res) => {
            console.log("发布新闻");
            console.log(res);
            this.$message.success({
              message: "新闻动态发布成功",
              showClose: true,
              duration: 2000,
            });
            this.newsSelect = 0;
            this.getArticleList();
          })
          .catch((err) => {
            console.log("res");
            this.$message.error({
              message: err.data.message,
              showClose: true,
              duration: 2000,
            });
            this.newsSelect = 0;
          });
      }
    },
    // 删除图片
    delImage(index) {
      this.imgSrcs = "";
    },
    // 上传图片
    inputChange(e) {
      let file = e.target.files[0];
      let that = this;
      if (file === undefined) {
        return;
      }
      if (file.size / 1024 > 1025) {
        // 文件大于1M（根据需求更改），进行压缩上传
        this.photoCompress(
          file,
          {
            // 调用压缩图片方法
            quality: 0.7,
          },
          function(base64Codes) {
            // console.log("压缩后：" + base.length / 1024 + " " + base);
            let bl = that.base64UrlToBlob(base64Codes);
            // file.append('file', bl, 'file_' + Date.parse(new Date()) + '.jpg') // 文件对象
            that.uploadLice(bl); // 请求图片上传接口
          }
        );
      } else {
        // 小于等于1M 原图上传
        this.uploadLice(file);
      }
    },
    // base64 转 Blob 格式 和file格式
    base64UrlToBlob(urlData) {
      let arr = urlData.split(","),
        mime = arr[0].match(/:(.*?);/)[1], // 去掉url的头，并转化为byte
        bstr = atob(arr[1]), // 处理异常,将ascii码小于0的转换为大于0
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      // 转blob
      // return new Blob([u8arr], {type: mime})
      let filename = Date.parse(new Date()) + ".jpg";
      // 转file
      return new File([u8arr], filename, {
        type: mime,
      });
    },
    /*压缩图片
      file：文件(类型是图片格式)，
      obj：文件压缩后对象width， height， quality(0-1)
      callback：容器或者回调函数
      */
    photoCompress(file, obj, callback) {
      let that = this;
      let ready = new FileReader();
      /* 开始读取指定File对象中的内容. 读取操作完成时,返回一个URL格式的字符串. */
      ready.readAsDataURL(file);
      ready.onload = function() {
        let re = this.result;
        that.canvasDataURL(re, obj, callback); // 开始压缩
      };
    },
    /* 利用canvas数据化图片进行压缩 */
    /* 图片转base64 */
    canvasDataURL(path, obj, callback) {
      let img = new Image();
      img.src = path;
      img.onload = function() {
        let that = this; // 指到img
        // 默认按比例压缩
        let w = that.width,
          h = that.height,
          scale = w / h;
        w = obj.width || w;
        h = obj.height || w / scale;
        let quality = 0.7; // 默认图片质量为0.7
        // 生成canvas
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        // 创建属性节点
        let anw = document.createAttribute("width");
        anw.nodeValue = w;
        let anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        // 铺底色
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(that, 0, 0, w, h);

        // 图像质量
        if (obj.quality && obj.quality >= 1 && obj.quality < 0) {
          quality = obj.quality;
        }
        // quality值越小，所绘制出的图像越模糊
        let base64 = canvas.toDataURL("image/jpeg", quality);
        // 回调函数返回base64的值
        callback(base64);
      };
    },
    //  返回file文件，调用接口执行上传
    uploadLice(file) {
      console.log(file);
      let formdata1 = new FormData(); //创建form对象
      formdata1.append("imgUrl", file); //通过append向form对象添加数据
      this.uploadImg(formdata1);
    },
    uploadImg(formdata) {
      this.$axios
        .post(this.$store.state.baseUrl + "/imgRecv", formdata)
        .then((res) => {
          if (res.status == 200) {
            this.$message.success({
              message: "图片上传成功",
              showClose: true,
              duration: 2000,
            });
          }
          console.log(res);
          console.log("赵钱孙李");
          this.imgSrcs = res.data.imgUrl;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error({
            message: err.data.message,
            showClose: true,
            duration: 2000,
          });
        });
    },
    // 正文内容
    editorCon(value) {
      console.log("新闻正文内容");
      console.log(value);
      switch (this.langType) {
        case "cn":
          this.content.cn = value;
          break;
        case "en":
          this.content.en = value;
          break;
        case "hk":
          this.content.hk = value;
          break;
        case "kh":
          this.content.kh = value;
          break;
      }
    },
    // 获取文章类型
    getArticleTypeGet() {
      this.$axios
        .post(this.$store.state.baseUrl + "/articleTypeGet")
        .then((res) => {
          console.log("文章类型");
          console.log(res);
          this.articleTypeList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取文章列表
    getArticleList() {
      this.articleList = [];
      this.articleMsg = "数据加载中...";
      this.$axios
        .post(this.img + "/articleList", {
          page: this.page,
          pageNum: this.pageNum,
          type: this.newsType == "所有分类目录" ? "" : this.newsType,
        })
        .then((res) => {
          console.log("文章列表");
          console.log(res);
          this.articleList = res.data.list;
          this.total = res.data.total;
          if (this.articleList.length == 0) {
            this.articleMsg = "啊哦~ 暂无数据...";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 根据文章类型获取列表
    newsTypeChange() {
      this.page = 1;
      this.getArticleList();
    },
    // 转码
    escapeStringHTML(str) {
      str = str.replace(/&lt;/g, "<");
      str = str.replace(/&gt;/g, ">");
      return str;
    },
    // 分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;

      // (function smoothscroll() {
      //   let currentScroll =
      //     document.documentElement.scrollTop || document.body.scrollTop;
      //   if (currentScroll > 0) {
      //     window.requestAnimationFrame(smoothscroll);
      //     window.scrollTo(0, currentScroll - currentScroll / 5);
      //   }
      // })();
      document.documentElement.scrollTop = document.body.scrollTop = 0;
      this.getArticleList();
    },
    regStr(value) {
      let str = value.replace(/<.*?>/gi, "");
      return str;
    },
  },
};
</script>

<style lang="scss" scoped>
.news-release-container {
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
    table-layout: fixed;

    th {
      height: 50px;
      line-height: 50px;
      background-color: #d7ebe7;
    }

    td {
      padding: 20px 10px;
      background-color: #f3fbf9;
      border-bottom: 1px solid #d7ebe7;
      word-break: break-all;

      p {
        font-size: 15px;
      }
    }

    td.td-title {
      width: 500px;
      padding-left: 15px;
      text-align: left;

      .overflow-style {
        display: block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        -moz-text-overflow: ellipsis;
        -webkit-text-overflow: ellipsis;
      }

      a {
        text-decoration: none;
        color: #000;
      }
    }
  }

  .borrow-table tr:hover > td {
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

  .back-img {
    width: 75px;
    height: 45px;
    margin-bottom: 20px;
    line-height: 45px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;

    div {
      margin-top: 5px;

      img {
        width: 30px;
        height: 25px;
      }
    }

    .font {
      font-size: 17px;
    }
  }

  .upload-imgs {
    width: 100%;
    margin-bottom: 10px;
    position: relative;
    display: flex;

    .add {
      width: 100px;
      height: 100px;
      position: relative;
      display: flex;

      .addIcon {
        width: 50px;
        height: 50px;
        position: absolute;
        top: 44.5%;
        left: 44%;
        z-index: 1;
      }

      .inputUpload {
        width: 100px;
        height: 100px;
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        opacity: 0;
        cursor: pointer;
        z-index: 999;
      }
    }

    .spanStyle {
      width: 15px;
      height: 15px;
      position: absolute;
      top: 1px;
      right: 1px;
      text-align: center;
      line-height: 0.8;
      background-color: rgb(221, 221, 221);
      color: rgb(255, 255, 255);
      border: 1px solid rgb(221, 221, 221);
      border-radius: 50%;
      z-index: 9;
      cursor: pointer;
    }

    #previewImg {
      width: 100px;
      height: 100px;
      position: relative;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
  }
}
</style>
<style lang="scss">
#news-container {
  #obj {
    .el-input__inner {
      height: 40px;
      border-radius: 5px;
    }

    .el-select .el-input__inner {
      cursor: pointer;
      padding-right: 0px;
    }
  }

  .el-radio.is-bordered.is-checked {
    border-color: #7f648e;
  }

  .el-radio__input.is-checked .el-radio__inner {
    border-color: #7f648e;
    background: #7f648e;
  }

  .el-radio__input.is-checked + .el-radio__label {
    color: #7f648e;
  }

  #releaseCon .el-form-item__content {
    line-height: 23px;
    position: relative;
    font-size: 14px;
  }
}
</style>
