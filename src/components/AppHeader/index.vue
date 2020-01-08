<template>
  <div class="header">
    <a href="#/">
      <img class="logo" src="@/assets/logo.png" width="25px" alt="vue" />
      <span class="company">会员管理系统</span>
    </a>
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        {{ user.name }}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-edit" command="a"
          >修改密码</el-dropdown-item
        >
        <el-dropdown-item icon="el-icon-switch-button" command="b"
          >退出登录</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 修改密码 -->
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="400px">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
        style="width:300px"
      >
        <el-form-item label="原密码" prop="oldPass">
          <el-input
            type="password"
            v-model="ruleForm.oldPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPass">
          <el-input
            type="password"
            v-model="ruleForm.newPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
          <el-button @click="$refs['ruleForm'].resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import passwordApi from "@/api/password.js";
export default {
  data() {
    const validateOldPass = (rule, value, callback) => {
      console.log(this.user.id);
      console.log(value);
      passwordApi.checkPwd(this.user.id, value).then(response => {
        const resp = response.data;
        if (resp.flag) {
          callback();
        } else {
          callback(new Error(resp.message));
        }
      });
    };
    // 校验密码是否一致
    const validateCheckPass = (rule, value, callback) => {
      if (value !== this.ruleForm.newPass) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      user: this.$store.state.user.user,
      dialogFormVisible: false,
      ruleForm: {
        oldPass: "",
        newPass: "",
        checkPass: ""
      },
      rules: {
        oldPass: [
          { required: true, message: "原密码不能为空", trigger: "blur" },
          { validator: validateOldPass, trigger: "blur" }
        ],
        newPass: [
          { required: true, message: "新密码不能为空", trigger: "blur" }
        ],
        checkPass: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { validator: validateCheckPass, trigger: "change" }
        ]
      }
    };
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case "a":
          this.handlePwd();
          break;
        case "b":
          this.handleLogout();
          break;
        default:
          break;
      }
    },
    handlePwd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["ruleForm"].resetFields();
      });
    },
    handleLogout() {
      // login(localStorage.getItem("lsh-msm-token")).then(response => {
      //   const resp = response.data;
      //   if (resp.flag) {
      //     //退出成功
      //     //清楚本地数据
      //     localStorage.removeItem("lsh-msm-user");
      //     localStorage.removeItem("lsh-msm-token");
      //     // 回到登录界面
      //     this.$router.push("/login");
      //   } else {
      //     this.$message({
      //       message: resp.message,
      //       type: "warning",
      //       duration: 500
      //     });
      //   }
      // });
      this.$store.dispatch("Logout").then(response => {
        if (response.flag) {
          // 回到登录界面
          this.$router.push("/login");
        } else {
          this.$message({
            message: response.message,
            type: "warning",
            duration: 500
          });
        }
      });
    },
    submitForm(formname) {
      this.$refs[formname].validate(valid => {
        if (valid) {
          passwordApi
            .updatePwd(this.user.id, this.ruleForm.checkPass)
            .then(response => {
              const resp = response.data;
              this.$message({
                message: resp.message,
                type: resp.flag ? "success" : "warning"
              });
              if (resp.flag) {
                this.handleLogout();
                this.dialogFormVisible = false;
              }
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style scoped>
.logo {
  vertical-align: middle;
  padding: 0px 10px 0px 40px;
}
.company {
  position: absolute;
  color: white;
}

/* 下拉菜单 */
.el-dropdown {
  float: right;
  margin-right: 40px;
}
.el-dropdown-link {
  color: white;
  cursor: pointer;
}
</style>
