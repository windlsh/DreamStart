<template>
  <div class="login-container">
    <!-- ref 相当于 id 定位到 data():from   lable-width 标签宽度
            lable -显示名称
         -->
    <el-form
      ref="form"
      :rules="rules"
      :model="form"
      label-width="50px"
      class="login-form"
    >
      <h2 class="login-title">校企资源对接服务平台</h2>
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item class="login-button">
        <el-button type="primary" @click="submitForm('form')">登录</el-button>
        <el-button @click="register">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "change" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // alert("submit!");
          // login(this.form.username, this.form.password).then(response => {
          //   console.log(response);
          //   console.log(response.data);
          //   const resp = response.data;
          //   console.log(resp, resp.flag, resp.data.token);
          //   if (resp.flag) {
          //     getUserInfo(resp.data.token).then(response => {
          //       const respUser = response.data;
          //       console.log("userInfo", respUser.data);

          //       localStorage.setItem(
          //         "lsh-msm-user",
          //         JSON.stringify(respUser.data)
          //       );
          //       localStorage.setItem("lsh-msm-token", resp.data.token);
          //       this.$message({
          //         message: resp.message,
          //         type: "success"
          //       });
          //       this.$router.push("/");
          //     });
          //   } else {
          //     //未通过
          //     this.$message({
          //       message: resp.message,
          //       type: "warning"
          //     });
          //   }
          // });
          this.$store.dispatch("Login", this.form).then(response => {
            if (response.flag) {
              // console.log("home了吗");
              this.$router.push("/");
            } else {
              // console.log("fail pass");
              this.$message({
                message: response.message,
                type: "warning"
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    register() {
      alert("register!");
      console.log("register!");
    }
  }
};
</script>

<style scoped>
.login-form {
  width: 350px;
  margin: 300px auto;
  background-color: rgb(255, 255, 255, 0.8);
  padding: 28px;
  border-radius: 20px;
}
.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("../../assets/login.jpg") no-repeat;
}
.login-title {
  color: #303133;
  text-align: center;
}
.login-button {
  padding: 0 50px;
}
</style>
