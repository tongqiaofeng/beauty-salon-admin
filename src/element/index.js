// 导入自己需要的组件
import {
  Form,
  FormItem,
  Select,
  Option,
  Input,
  Button,
  Upload,
  Container,
  Aside,
  Backtop,
  Col,
  Row,
  Pagination,
  Tooltip,
  Dialog,
  RadioGroup,
  Radio,

  Message,
  MessageBox,
  Notification,
} from 'element-ui'
const element = {
  install: function (Vue) {
    Vue.use(Form)
    Vue.use(FormItem)
    Vue.use(Select)
    Vue.use(Option)
    Vue.use(Input)
    Vue.use(Button)
    Vue.use(Upload)
    Vue.use(Container)
    Vue.use(Aside)
    Vue.use(Backtop)
    Vue.use(Col)
    Vue.use(Row)
    Vue.use(Pagination)
    Vue.use(Tooltip)
    Vue.use(Dialog)
    Vue.use(RadioGroup)
    Vue.use(Radio)

    Vue.prototype.$message = Message;
    Vue.prototype.$confirm = MessageBox.confirm;
    Vue.prototype.$alert = MessageBox.alert;
    Vue.prototype.$notify = Notification;
  }
}
export default element