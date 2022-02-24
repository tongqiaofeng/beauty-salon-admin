<template>
  <div>
    <!--  新增时输入 -->
    <div class="add-release-container">
      <quill-editor v-model="editorContent" ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)"
        @focus="onEditorFocus($event)" @change="onEditorChange($event)">
      </quill-editor>
      <input style="position: fixed;left: -2000px;top: -2000px;" @change="handleAdd_quill_editor" id="input_hide"
        class="upload_input" type="file">
    </div>
    <!-- 从数据库读取展示 -->
    <!-- <div v-html="str" class="ql-editor">
      {{str}}
    </div> -->
  </div>
</template>
<script>
  import {
    quillEditor
  } from "vue-quill-editor"; //调用编辑器
  import * as Quill from 'quill';
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';
  import {
    addQuillTitle
  } from '../quill_title';

  import ImageResize from 'quill-image-resize-module'
  Quill.register('modules/imageResize', ImageResize)

  let fontSizeStyle = Quill.import('attributors/style/size')
  fontSizeStyle.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '22px', '24px', '26px', '32px', '48px']
  Quill.register(fontSizeStyle, true)
  let fonts = [false, 'SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'sans-serif']
  let Font = Quill.import('formats/font')
  Font.whitelist = fonts //将字体加入到白名单
  Quill.register(Font, true)

  const handlers = {
    shadeBox: null,
    // 添加工具方法
    sourceEditor: function () {
      // alert('我新添加的工具方法');
      const container = this.container;
      const firstChild = container.nextElementSibling.firstChild;

      // 在第一次点击源码编辑的时候，会在整个工具条上加一个div，层级比工具条高，再次点击工具条任意位置，就会退出源码编辑。可以在下面cssText里面加个背景颜色看看效果。

      if (!this.shadeBox) {
        let shadeBox = this.shadeBox = document.createElement('div');

        shadeBox.style.cssText =
          'position:absolute; top:0; left:0; width:100%; height:100%; cursor:pointer;';
        container.style.position = 'relative';
        container.appendChild(shadeBox);
        firstChild.innerText = firstChild.innerHTML;

        shadeBox.addEventListener('click', function () {
          this.style.display = 'none';
          firstChild.innerHTML = firstChild.innerText.trim();
        }, false);
      } else {
        this.shadeBox.style.display = 'block';
        firstChild.innerText = firstChild.innerHTML;
      }
    },
    'image': function (value) {
      if (value) {
        document.querySelector('#input_hide').click()
      } else {
        this.quill.format('image', false)
      }
    },
    'video': function (value) {
      if (value) {
        document.querySelector('#input_hide').click()
      } else {
        this.quill.format('video', false)
      }
    }
  };

  // 在使用的页面中初始化按钮样式
  const initButton = function () {
    // 样式随便改
    const sourceEditorButton = document.querySelector('.ql-sourceEditor');
    sourceEditorButton.style.cssText = 'font-size:18px';

    // 加了elementui的icon
    sourceEditorButton.classList.add('el-icon-edit-outline');
    // 鼠标放上去显示的提示文字
    sourceEditorButton.title = '源码编辑';
  };


  export default {
    components: {
      quillEditor
    },
    data() {
      return {
        editorContent: "",
        str: "",
        editorOption: {
          placeholder: "请在这里输入",
          modules: {
            clipboard: {
              matchVisual: false
            },
            toolbar: {
              container: [
                ['bold', 'italic', 'underline', 'strike'], //加粗，斜体，下划线，删除线
                ['blockquote', 'code-block'], //引用，代码块
                [{
                  'header': 1
                }, {
                  'header': 2
                }], // 标题，键值对的形式；1、2表示字体大小
                [{
                  'list': 'ordered'
                }, {
                  'list': 'bullet'
                }], //列表
                [{
                  'script': 'sub'
                }, {
                  'script': 'super'
                }], // 上下标
                [{
                  'indent': '-1'
                }, {
                  'indent': '+1'
                }], // 缩进
                [{
                  'direction': 'rtl'
                }], // 文本方向
                [{
                  'size': fontSizeStyle.whitelist
                }], // 字体大小
                [{
                  'header': [1, 2, 3, 4, 5, 6]
                }], //几级标题
                [{
                  'color': []
                }, {
                  'background': []
                }], // 字体颜色，字体背景颜色
                [{
                  'font': fonts
                }], //字体
                [{
                  'align': []
                }], //对齐方式
                ['clean'], //清除字体样式
                ['image', 'video'], //上传图片、上传视频
                ['sourceEditor'],
                // ['revoke'],
                // ['redo']
              ],
              handlers: handlers
            },
            imageResize: {
              displayStyles: {
                backgroundColor: 'black',
                border: 'none',
                color: 'white'
              },
              modules: ['Resize', 'DisplaySize', 'Toolbar']
            },
          },
        },
        uploadFileType: '',
        changeText: []
      }
    },
    props: ["editorDadContent"],
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill;
      },
    },

    mounted() {
      initButton();
      this.editorContent = this.editorDadContent;
      console.log(this.editorContent);

      // var revoke = document.querySelector('.quill-editor .ql-revoke') //获取元素
      // // console.log(revoke);
      // var redo = document.querySelector('.quill-editor .ql-redo')
      // var Front = document.createElement('i') //创建元素
      // var after = document.createElement('i')
      // Front.className = "iconfont icon-chexiao1" //新增class属性
      // after.className = "iconfont icon-zhongzuo"
      // revoke.appendChild(Front) //追加到元素中
      // redo.appendChild(after)

      // let revokebtn = document.getElementsByClassName('ql-remove')[0];
      // revokebtn.onclick = this.revokeClick;
      // let redobtn = document.getElementsByClassName('ql-redo')[0];
      // redobtn.onclick = this.nextClick;

      addQuillTitle();
    },
    methods: {
      // 富文本 上传图片
      handleAdd_quill_editor(e) {
        let file = e.target.files[0];
        console.log(file);
        this.uploadFileType = file.type;

        let that = this;
        if (file === undefined) {
          return
        }
        if (file.size / 1024 > 1025) { // 文件大于1M（根据需求更改），进行压缩上传
          this.photoCompress(file, { // 调用压缩图片方法
            quality: 0.7
          }, function (base64Codes) {
            // console.log("压缩后：" + base.length / 1024 + " " + base);
            let bl = that.base64UrlToBlob(base64Codes)
            // file.append('file', bl, 'file_' + Date.parse(new Date()) + '.jpg') // 文件对象
            that.uploadLice(bl) // 请求图片上传接口
          })
        } else { // 小于等于1M 原图上传
          this.uploadLice(file)
        }
      },
      // base64 转 Blob 格式 和file格式
      base64UrlToBlob(urlData) {
        let arr = urlData.split(','),
          mime = arr[0].match(/:(.*?);/)[1], // 去掉url的头，并转化为byte
          bstr = atob(arr[1]), // 处理异常,将ascii码小于0的转换为大于0
          n = bstr.length,
          u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        // 转blob
        // return new Blob([u8arr], {type: mime})
        let filename = Date.parse(new Date()) + '.jpg'
        // 转file
        return new File([u8arr], filename, {
          type: mime
        })
      },
      /*压缩图片
      file：文件(类型是图片格式)，
      obj：文件压缩后对象width， height， quality(0-1)
      callback：容器或者回调函数
      */
      photoCompress(file, obj, callback) {
        let that = this
        let ready = new FileReader()
        /* 开始读取指定File对象中的内容. 读取操作完成时,返回一个URL格式的字符串. */
        ready.readAsDataURL(file)
        ready.onload = function () {
          let re = this.result
          that.canvasDataURL(re, obj, callback) // 开始压缩
        }
      },
      /* 利用canvas数据化图片进行压缩 */
      /* 图片转base64 */
      canvasDataURL(path, obj, callback) {
        let img = new Image()
        img.src = path
        img.onload = function () {
          let that = this // 指到img
          // 默认按比例压缩
          let w = that.width,
            h = that.height,
            scale = w / h
          w = obj.width || w
          h = obj.height || (w / scale)
          let quality = 0.7 // 默认图片质量为0.7
          // 生成canvas
          let canvas = document.createElement('canvas')
          let ctx = canvas.getContext('2d')

          // 创建属性节点
          let anw = document.createAttribute('width')
          anw.nodeValue = w
          let anh = document.createAttribute('height')
          anh.nodeValue = h
          canvas.setAttributeNode(anw)
          canvas.setAttributeNode(anh)
          // 铺底色
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(that, 0, 0, w, h)

          // 图像质量
          if (obj.quality && obj.quality >= 1 && obj.quality < 0) {
            quality = obj.quality
          }
          // quality值越小，所绘制出的图像越模糊
          let base64 = canvas.toDataURL('image/jpeg', quality)
          // 回调函数返回base64的值
          callback(base64)
        }
      },
      //  返回file文件，调用接口执行上传
      uploadLice(file) {
        console.log(file)
        let formdata = new FormData(); //创建form对象
        formdata.append("imgUrl", file); //通过append向form对象添加数据
        this.uploadImg(formdata);
      },
      uploadImg(formdata) {
        let quill0 = this.$refs['myQuillEditor'].quill;

        // let config = {
        //   headers: {
        //     'Content-Type': 'multipart/form-data',
        //     'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwc3ciOiI1MDVkNjhhNzJhNWZkZTQyYWM3MzdlNjQyMTMxOGZiYyIsImlkIjoyOCwidXNlck5hbWUiOiJhZGExIn0.6PWOtXuf5L0exm4UjLQL5S7UhTQfm0ZO8vykJU-r75I'
        //   }
        // };

        this.$axios.post(this.$store.state.baseUrl + "/imgRecv", formdata)
          .then(res => {
            let pathUrl = this.$store.state.baseUrl + res.data.imgUrl;
            // 获取光标所在位置
            let length = quill0.getSelection().index;
            // 插入图片，res为服务器返回的图片链接地址
            if (this.uploadFileType.indexOf('image') !== -1) {
              quill0.insertEmbed(length, 'image', pathUrl);
            } else {
              quill0.insertEmbed(length, 'video', pathUrl);
            }
            // 调整光标到最后
            quill0.setSelection(length + 1);
          }).catch(err => {
            console.log(err);
          })
      },

      onEditorReady(editor) { // 准备编辑器
        // console.log(editor);
      },
      onEditorBlur() {}, // 失去焦点事件
      onEditorFocus() {}, // 获得焦点事件
      // 内容改变事件
      onEditorChange() {
        console.log(this.editorContent);
        this.$emit('editorCon', this.editorContent);
      },
    },

  }
</script>
<style lang="scss">
  .add-release-container {
    width: 80%;
  }

  .ql-toolbar.ql-snow .ql-formats {
    margin-right: 5px;
  }

  .ql-snow .ql-editor {
    height: 400px;
  }

  .ql-snow .ql-picker.ql-size {
    width: 65px;
  }
</style>