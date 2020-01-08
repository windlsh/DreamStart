<template>
  <div>
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      style="margin-top:20px;"
    >
      <!-- 重置会看 el-form-item 组件元素的 prop 上是否指定了字段名 指定了才会重置生效 -->
      <el-form-item prop="username">
        <el-input
          v-model="searchMap.username"
          placeholder="账号"
          style="width:200px;"
        ></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input
          v-model="searchMap.name"
          placeholder="姓名"
          style="width:200px;"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button @click="$refs['searchForm'].resetFields()">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据列表 -->
    <el-table :data="list" height="380" style="width: 100%">
      <el-table-column type="index" label="序号" width="60"> </el-table-column>
      <el-table-column prop="username" label="账号"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="90"> </el-table-column>
      <el-table-column prop="age" label="年龄"> </el-table-column>
      <el-table-column prop="mobile" label="电话"> </el-table-column>
      <el-table-column prop="salary" label="薪酬"> </el-table-column>
      <el-table-column prop="entryDate" label="入职时间"> </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <el-dialog title="员工编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        :model="pojo"
        ref="pojoForm"
        label-width="100px"
        label-positon="right"
        style="width:400px;"
      >
        <el-form-item label="帐号" prop="username">
          <el-input v-model="pojo.username"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="pojo.age"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="pojo.mobile"></el-input>
        </el-form-item>
        <el-form-item label="薪酬" prop="salary">
          <el-input v-model="pojo.salary"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="entryDate">
          <el-date-picker
            style="width: 200px"
            value-format="yyyy-MM-dd"
            v-model="pojo.entryDate"
            placeholder="选择入职时间"
            type="date"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            pojo.id === null ? addData('pojoForm') : updateData('pojoForm')
          "
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import staffApi from "../../api/staff.js";

export default {
  data() {
    return {
      list: [],
      total: 0, //总记录数
      currentPage: 1, //当前页码
      pageSize: 10, //每页显示条数
      searchMap: {
        username: "",
        name: ""
      }, //条件查询绑定的值
      dialogFormVisible: false,
      pojo: {
        id: null,
        username: "",
        name: "",
        age: null,
        mobile: "",
        salary: "",
        entryDate: null
      },
      rules: {
        username: [
          { required: true, message: "帐号不能为空", trigger: "blur" }
        ],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }]
      }
    };
  },
  created() {
    this.fetchData();
  },

  methods: {
    // 页面刷新后 可选分页数据  当前页 每页的数据 查询条件
    fetchData() {
      staffApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          console.log(response.data);
          this.list = response.data.data.rows;
          this.total = response.data.data.total;
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    //点击新增 清除原来的表单数据和校验结果
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields();
      });
    },
    // 点击编辑 操作 根据row.id  查找
    handleEdit(id) {
      // console.log('编辑', id)
      // 清除原来的表单数据和校验结果
      this.handleAdd();
      staffApi.getById(id).then(response => {
        const resp = response.data;
        if (resp.flag) {
          this.pojo = resp.data;
        } else {
          //提示获取数据失败
          this.$message({
            message: resp.message,
            type: "warning"
          });
        }
      });
    },
    // 点击删除
    handleDelete(id) {
      console.log("删除", id);
      this.$confirm("确认删除这条记录吗?", "提示", {
        confirmButtonText: "确认",
        cancleButtonText: "取消"
      })
        .then(() => {
          staffApi.deleteById(id).then(response => {
            const resp = response.data;
            //提示更新失败
            this.$message({
              message: resp.message,
              type: resp.flag ? "success" : "error"
            });

            if (resp.flag) {
              // 删除成功,刷新数据
              this.fetchData();
            }
          });
        })
        .catch(() => {
          // 取消删除
        });
    },
    // 点击新增按钮 后确定进行的操作 添加 pojo
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //提交表单
          staffApi.add(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              this.$message({
                message: "新增成功, 初始密码为:123456",
                type: "warning"
              });
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: "warning"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 点击编辑按钮 后确定进行的操作 更新 pojo
    updatedData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 页面校验通过,才可发送请求进行更新
          staffApi.update(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              // 更新成功,刷新数据,关闭窗口
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              //提示更新失败
              this.$message({
                message: resp.message,
                type: "warning"
              });
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
