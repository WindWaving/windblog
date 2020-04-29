<template>
  <div class="update-article">
    <el-form class="updateform" ref="form" label-width="80px">
      <el-form-item label="标题">
        <el-input v-model="curArticle.title"></el-input>
      </el-form-item>
      <el-form-item label="标签">
        <el-checkbox-group v-model="checkboxes">
          <el-checkbox v-for="tag in checkboxes" :key="tag" :label="tag" name="type"></el-checkbox>
          <el-button class="addTag" @click="onAddTag">新建标签</el-button>
          <span v-if="checkboxes.length>=3" class="warn">*最多可添加三个标签</span>
          <el-form v-if="isAddTag">
            <el-form-item label="标签名称">
              <el-input v-model="addLabelname"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="handleAddTag">添加</el-button>
            </el-form-item>
          </el-form>
        </el-checkbox-group>
      </el-form-item>
      <div id="editor-main">
        <le-editor v-model="curArticle.content" :hljs-css="hljsCss"></le-editor>
      </div>
      <el-form-item class="btn-box">
        <el-button type="primary" @click="onSubmit">上传</el-button>
        <el-button @click="goBack">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      hljsCss: 'agate',
      value: '',
      curArticle: {},
      isAddTag: false,
      addLabelname: '',
      checkboxes: [],
      isNew: true
    }
  },
  computed: mapState({
    isEdit: state => state.isEdit
  }),
  methods: {
    ...mapMutations({
      setIsEdit: 'setIsEdit'
    }),
    onSubmit () {
      if (this.curArticle.title.length === 0 || this.curArticle.content.length === 0) {
        this.$message.error('没有填写标题或内容')
        return false
      }
      this.curArticle.date = new Date()
      this.curArticle.tags = []
      if (this.checkboxes.length > 0) {
        this.checkboxes.map(label => {
          this.curArticle.tags.push({labelname: label})
        })
      }
      if (this.isNew) {
        this.$store.dispatch('postArticleAsync', this.curArticle)
          .then(res => {
            if (!res.data.err) {
              this.$message({
                message: '保存文章成功',
                type: 'success'
              })
              this.$router.go(-1)
            } else {
              this.$message.error('保存失败:' + res.data.info)
            }
          })
      } else {
        this.$store.dispatch('updateArticleAsync', this.curArticle)
          .then(res => {
            console.log(res)
            if (!res.data.err) {
              this.$message({
                message: '修改文章成功',
                type: 'success'
              })
              this.$router.push('/admin')
            } else {
              this.$message.error('修改失败:' + res.info)
            }
          })
      }
    },
    onAddTag () {
      if (this.checkboxes.length < 3) {
        this.isAddTag = true
      } else {
        this.isAddTag = false
      }
    },
    handleAddTag () {
      if (this.addLabelname.length > 0) {
        this.checkboxes.push(this.addLabelname)
        this.addLabelname = ''
        this.isAddTag = false
      }
    },
    goBack () {
      this.$confirm('离开页面将会放弃所有修改, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.go(-1)
      }).catch(() => {
      })
    }
  },
  created () {
    this.setIsEdit(true)
    this.curArticle = this.$route.params.article
    if (this.curArticle) {
      this.curArticle.tags.map(val => {
        this.checkboxes.push(val.labelname)
      })
      this.isNew = false
    } else {
      this.curArticle = {
        title: '',
        author: this.$session.get('blog-user'),
        date: '',
        content: '',
        tags: [],
        clickTimes: 0
      }
      this.isNew = true
    }
  },
  beforeDestroy () {
    this.setIsEdit(false)
  }
}
</script>

<style lang="stylus" scoped>
.update-article .updateform {
  display: flex;
  flex-direction: column;
  justify-content: center;

  #editor-main {
    color: #2c3e50;
    width: 100%;
    height: 600px;
  }

  .addTag {
    margin-left: 2rem;
  }

  .warn {
    color: red;
    font-size: 0.8rem;
    margin-left 1rem
  }

  .btn-box {
    text-align: right;
    margin: 3rem 0;
  }
}
</style>
