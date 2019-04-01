<script>
import utils from "u"
import { $ } from "u"
export default {
  created() {
    // utils.set('token','201807260101HappyBody_1287405630')
    // utils.set('token','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjg3NDA1NjMwIiwiZXhwIjoxNTM0MjI2OTEzfQ.O_kb899ZBDhzlh65XbdZSVc9fXuc6mGs2qe6fXGQVD0')
    

    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync("logs") || []
    logs.unshift(Date.now())
    wx.setStorageSync("logs", logs)
  }
}
</script>

<style lang="scss">
@import "./css/common";
</style>
