<template>
  <div>
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      style="margin-top:20px;"
    >
      <!-- 重置会看 el-form-item 组件元素的 prop 上是否指定了字段名 指定了才会重置生效 -->
      <el-form-item prop="cardNum">
        <el-input
          v-model="searchMap.cardNum"
          placeholder="会员卡号"
          style="width:200px;"
        ></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input
          v-model="searchMap.name"
          placeholder="会员名称"
          style="width:200px;"
        ></el-input>
      </el-form-item>
      <el-form-item prop="payType" style="width:100px;">
        <el-select v-model="searchMap.payType" placeholder="支付类型">
          <el-option
            v-for="option in payTypeOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="birthday">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="searchMap.birthday"
          type="date"
          placeholder="出生日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button @click="restForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据列表 -->
    <el-table :data="list"  height="380" style="width: 100%">
      <el-table-column type="index" label="序号" width="60"> </el-table-column>
      <el-table-column prop="cardNum" label="会员卡号"> </el-table-column>
      <el-table-column prop="name" label="会员姓名" width="90">
      </el-table-column>
      <el-table-column prop="birthday" label="会员生日"> </el-table-column>
      <el-table-column prop="phone" label="手机号码"> </el-table-column>
      <el-table-column prop="integral" label="可用积分"> </el-table-column>
      <el-table-column prop="money" label="开卡金额"> </el-table-column>
      <el-table-column prop="payType" label="支付类型">
        <template slot-scope="scope">
          <span>{{ scope.row.payType | payTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="会员地址"> </el-table-column>
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
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[20, 15, 10, 5]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 弹出新增窗口
  title 窗口的标题
   -->
    <el-dialog title="会员编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        :model="pojo"
        ref="pojoForm"
        label-width="100px"
        label-positon="right"
        style="width:400px;"
      >
        <el-form-item label="会员卡号" prop="cardNum">
          <el-input v-model="pojo.cardNum"></el-input>
        </el-form-item>
        <el-form-item label="会员姓名" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="会员生日" prop="birthday">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="pojo.birthday"
            type="date"
            placeholder="会员生日"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="pojo.phone"></el-input>
        </el-form-item>
        <el-form-item label="开卡金额" prop="money">
          <el-input v-model="pojo.money"></el-input>
        </el-form-item>
        <el-form-item label="可用积分" prop="integral">
          <el-input v-model="pojo.integral"></el-input>
        </el-form-item>
        <el-form-item label="支付类型" prop="payType">
          <el-select
            v-model="pojo.payType"
            placeholder="支付类型"
            style="with:100px;"
          >
            <el-option
              v-for="option in payTypeOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员地址" prop="address">
          <el-input type="textarea" v-model="pojo.address"></el-input>
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
import memberApi from "../../api/member";

const payTypeOptions = [
  { type: "1", name: "现金" },
  { type: "2", name: "微信" },
  { type: "3", name: "支付宝" },
  { type: "4", name: "银行卡" }
];

export default {
  data() {
    return {
      list: [],
      total: 0, //总记录数
      currentPage: 1, //当前页码
      pageSize: 10, //每页显示条数
      searchMap: {
        cardNum: "",
        name: "",
        payType: "",
        birthday: ""
      }, //条件查询绑定的值
      payTypeOptions,
      dialogFormVisible: false, //弹框 默认不弹出
      pojo: {
        id: null,
        cardNum: "",
        name: "",
        birthday: "",
        phone: "",
        money: "",
        integral: "",
        payType: "",
        address: ""
      }, //提交的对象
      rules: {
        cardNum: [
          {
            required: true,
            message: "卡号不能为空",
            trigger: "change"
          }
        ],
        name: [
          {
            required: true,
            message: "姓名不能为空",
            trigger: "change"
          }
        ],
        payType: [
          {
            required: true,
            message: "支付类型不能为空",
            trigger: "change"
          }
        ]
      }
    };
  },

  created() {
    this.fetchData();
  },

  methods: {
    // 当前每页显示条数 改变后 触发  val是最新的每页显示条数
    handleSizeChange(val) {
      console.log(val);
      this.pageSize = val;
      this.fetchData();
    },
    // 当前页码被改变后 触发
    handleCurrentChange(val) {
      console.log(val);
      this.currentPage = val;
      this.fetchData();
    },
    fetchData() {
      memberApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const resp = response.data;
          console.log(resp);
          this.list = resp.data.rows;
          this.total = resp.data.total;
        });
    },
    //打开编辑窗口
    handleEdit(id) {
      this.handleAdd();
      memberApi.getById(id).then(response => {
        const resp = response.data;
        if (resp.flag) {
          this.pojo = resp.data;
          console.log(this.pojo);
        }
      });
    },
    handleDelete(id) {
      console.log("删除", id);
      this.$confirm("确认删除这条记录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          console.log("确认");
          memberApi.deleteById(id).then(response => {
            const resp = response.data;
            this.$message({
              type: resp.flag ? "success" : "error",
              message: resp.message
            });
            if (resp.flag) {
              this.fetchData();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    restForm(formName) {
      // 重置会看 el-form-item 组件元素的 prop 上是否指定了字段名 指定了才会重置生效
      this.$refs[formName].resetFields();
    },
    addData(formname) {
      this.$refs[formname].validate(valid => {
        if (valid) {
          //提交表单
          console.log("addData");
          memberApi.add(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              // 新增成功 刷新列表数据
              this.fetchData();
              this.dialogFormVisible = false; //关闭窗口
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
    updateData(formname) {
      console.log("updateData");
      this.$refs[formname].validate(valid => {
        if (valid) {
          //提交表单
          memberApi.updated(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              // 新增成功 刷新列表数据
              this.fetchData();
              this.dialogFormVisible = false; //关闭窗口
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
    handleAdd() {
      // this.pojo = {};
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        //异步事件
        this.$refs["pojoForm"].resetFields();
      });
    }
  },
  filters: {
    payTypeFilter(type) {
      const payObj = payTypeOptions.find(obj => obj.type === type);
      return payObj ? payObj.name : null;
    }
  }
};
</script>
