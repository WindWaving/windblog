<template>
  <div class="navbar">
    <div class="title">
      <h1>我的博客</h1>
    </div>
    <ul>
      <li>
        <router-link to="/">主页</router-link>
      </li>
      <li>
        <router-link to="/about">关于</router-link>
      </li>
      <li v-if="!isSignIn">
        <el-dropdown @command="handleLogin">
          <span class="el-dropdown-link">
            登录
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="regular">用户登录</el-dropdown-item>
            <el-dropdown-item command="super">管理员登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <ul>
          <li>
            <a @click="loginFormVisible = true,loginForm.role=0">用户登录</a>
          </li>
          <li>
            <a @click="loginFormVisible = true,loginForm.role=1">管理员登录</a>
          </li>
        </ul> -->
      </li>
      <li v-if="!isSignIn">
        <el-dropdown @command="handleRegister">
          <span class="el-dropdown-link">
            注册
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="regular">用户注册</el-dropdown-item>
            <el-dropdown-item command="super">管理员注册</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <ul>
          <li>
            <a @click="registerFormVisible = true,registerform.role=0">用户注册</a>
          </li>
          <li>
            <a @click="registerFormVisible = true,registerform.role=1">管理员注册</a>
          </li>
        </ul> -->
      </li>
      <li v-if="isSignIn&&!isEdit">
        <router-link to="/update-article">写文章</router-link>
      </li>
      <li v-if="isSignIn">
        <router-link to="/admin">管理</router-link>
      </li>
      <li v-if="isSignIn">{{this.$session.get('user-role')===1?'管理员':'用户'}}{{this.$session.get('blog-user')}}</li>
      <li v-if="isSignIn">
        <a @click="OnLogout">登出</a>
      </li>
      <li></li>
    </ul>

    <el-dialog title="注册" :visible.sync="registerFormVisible">
      <el-form :model="registerform">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="registerform.username" autocomplete="on" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input type="password" v-model="registerform.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth">
          <el-input type="password" v-model="registerform.repeat" placeholder="请再次输入密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="registerFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="OnUserRegister">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="登录" :visible.sync="loginFormVisible">
      <el-form :model="loginForm">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="loginForm.username" autocomplete="on" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="loginFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="OnUserLogin">登录</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import axios from 'axios'
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      registerFormVisible: false,
      loginFormVisible: false,
      registerform: {
        username: '',
        password: '',
        repeat: '',
        role: 0
      },
      loginForm: {
        username: '',
        password: '',
        role: 0
      },
      formLabelWidth: '120px'
    }
  },
  computed: mapState({
    isSignIn: state => state.isSignIn,
    isEdit: state => state.isEdit,
    baseUrl: state => state.baseUrl
  }),
  methods: {
    ...mapActions({
      loginAsync: 'loginAsync'
    }),
    handleRegister (command) {
      this.registerFormVisible = true
      if (command === 'regular') {
        this.registerform.role = 0
      } else {
        this.registerform.role = 1
      }
    },
    handleLogin (command) {
      this.loginFormVisible = true
      if (command === 'regular') {
        this.loginForm.role = 0
      } else {
        this.loginForm.role = 1
      }
    },
    OnUserRegister () {
      let { username, password, repeat, role } = this.registerform
      if (password !== repeat) {
        alert('两次密码不一致')
        return false
      }
      let payload = {
        url: 'register',
        data: {
          username: username,
          password: password,
          role: role
        }
      }
      this.loginAsync(payload).then(() => {
        if (this.isSignIn) {
          this.$session.start()
          this.$session.set('blog-user', username)
          this.$session.set('user-role', role)
          this.registerFormVisible = false
        } else {
          this.$message.error('注册失败')
        }
      })
    },
    OnUserLogin () {
      let { username, password, role } = this.loginForm
      let payload = {
        url: 'login',
        data: {
          username: username,
          password: password,
          role: role
        }
      }
      this.loginAsync(payload).then(() => {
        if (this.isSignIn) {
          this.$session.start()
          this.$session.set('blog-user', username)
          this.$session.set('user-role', role)
          this.loginFormVisible = false
        } else {
          this.$message.error('登录错误')
        }
      })
    },
    OnLogout () {
      this.$confirm('确定登出账户吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message('正在跳转至首页')
        setTimeout(() => {
          this.$session.destroy()
          this.$store.dispatch('logoutAsync')
          this.$router.push('/')
        }, 1500)
      }).catch(() => {})
    }
  }
}
</script>

<style lang="stylus" scoped>
.navbar {
  display: flex;
  margin: 1rem 5rem;
  border-bottom: 1px solid #efefef;

  .title {
    flex: 1;

    h1 {
      margin-left: 2rem;
      color: #333;
      font-weight: 400;
    }
  }

  ul {
    display: flex;
    align-items: center;

    li {
      list-style: none;
      margin-left: 1.5rem;

      a {
        font-size: 1rem;
        color: #333;
        text-decoration: none;
      }
    }
  }

  a:hover {
    cursor: pointer;
  }
   .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
}
</style>
