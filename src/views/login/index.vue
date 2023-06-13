<template>
  <div>
    <div class="fbox">
      <p class="p1">
        欢迎登陆
        <span style="color: #03d9af; font-family: serif; font-weight: bold"
          >chat.mcweb.club</span
        >
      </p>
      <p class="p2">请选择用户登录：</p>
      <div class="midbox">
        <div
          class="mbox"
          :class="item.userId == userId ? 'mboxActive' : ''"
          v-for="(item, index) in userList"
          :key="index"
          @click="toUser(item)"
        >
          <img :src="item.photo" alt="" />
          <span>{{ item.name }}</span>
        </div>
        <div style="width: 90px"></div>
      </div>
      <el-button type="primary" :plain="!userId" @click="toLogin"
        >登录</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  components: {},
  data() {
    return {
      userList: [],
      userId: "",
    };
  },
  created() {
    this.userList = this.$user.getUserList();
  },
  methods: {
    toUser(e) {
      this.userId = e.userId;
    },
    toLogin() {
      if (!this.userId) {
        this.$message.warning("请选择要登陆的用户");
        return;
      }
      this.$unit.setLocalStorage("userId", this.userId);
      this.$router.push({
        name: "message",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.fbox {
  display: flex;
  flex-direction: column;
  padding: 50px 35px;
  .p1 {
    line-height: 50px;
    font-size: 28px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .p2 {
    color: #888;
    font-size: 14px;
  }

  .midbox {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-left: 12px;
    margin-bottom: 10px;
    .mbox {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 80px;
      background-color: #f1f1f1;
      margin-right: 12px;
      margin-bottom: 12px;
      padding: 10px;
      border-radius: 10px;
      font-size: 14px;
      line-height: 14px;
      color: #666;
      img {
        width: 50px;
        border-radius: 5px;
        margin-bottom: 5px;
        margin-top: 3px;
        border: 1px solid #fff;
      }
    }
    .mboxActive {
      background-color: #03d9af;
      color: #fff;
    }
  }
}
</style>
