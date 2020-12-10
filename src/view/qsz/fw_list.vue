<template>
  <Row :gutter="32">
    <Col span="32">
      <Form>
        <Form-item>
          <Form inline>
            <Form-item>
              <Select
                clearable
                placeholder="服务分类"
                @on-change="searchManage"
                v-model="searchList.searchCondition.serviceType"
                class="search_item"
              >
                <Option
                  v-for="item in viewData.fwList"
                  :value="item.id"
                  :key="item.id"
                  >{{ item.name }}</Option
                >
              </Select>
            </Form-item>
            <Form-item>
              <Button style="margin-right: 10px" @click="searchPageReturn">
                <Icon size="20" type="ios-search" />
              </Button>
              <Button icon="md-add" @click="showAdd()">增加</Button>
            </Form-item>
            <Modal
              :mask-closable="false"
              width="400"
              v-model="viewData.modalSiteDeleteImg"
              @on-ok="delImg(viewData.delInd)"
            >
              <span style="color: red">是否删除该图片</span>
            </Modal>
            <Modal
              :mask-closable="false"
              width="400"
              v-model="viewData.modalDelete"
              @on-ok="onDeleteBtn"
            >
              确认删除
              <span style="color: red">{{ viewData.Delete.serviceName }}</span>
              服务项目吗？
              <!-- <p>(*删除后将会把服务项目下的所有需求隐藏！)</p> -->
            </Modal>
            <Modal
              v-model="viewData.modalAdd"
              title="添加服务项目"
              :mask-closable="false"
              @on-ok="onAddBtn"
              width="35"
              @on-cancel="onModelCancel"
            >
              <Form :label-width="80">
                <Form-item class="form_item" label="服务项目名:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Add.serviceName"
                    type="text"
                    :maxlength="30"
                    placeholder="服务项目名"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="服务单位:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Add.unit"
                    type="text"
                    :maxlength="10"
                    placeholder="服务单位"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="服务价格:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Add.servicePrice"
                    type="text"
                    :maxlength="10"
                    placeholder="服务价格"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="服务类型:">
                  <Select
                    placeholder="服务类型"
                    v-model="viewData.Add.serviceType"
                    class="search_item"
                  >
                    <Option
                      v-for="item in viewData.fwList"
                      :value="item.id"
                      :key="item.id"
                      >{{ item.name }}</Option
                    >
                  </Select>
                </Form-item>
                <Form-item class="form_item" label="服务备注:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Add.tips"
                    type="text"
                    :maxlength="50"
                    placeholder="服务备注"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="排序序号:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Add.listOrder"
                    type="text"
                    :maxlength="4"
                    placeholder="排序序号"
                  ></Input>
                </Form-item>
                <Form-item
                  style="margin-top: -15px; padding-right: 10px"
                  label="服务详情图："
                >
                  <div>
                    <Button class="choice_img">
                      <Icon type="ios-cloud-upload-outline"></Icon>上传图片
                      <input
                        multiple
                        class="ImgC"
                        type="file"
                        name="avatar"
                        accept="image/gif, image/jpeg, image/jpg, image/png"
                        @change="changeImage($event)"
                        ref="avatarInput"
                      />
                      <input
                        style="display: none"
                        type="file"
                        name="avatar"
                        accept="image/gif, image/jpeg, image/jpg, image/png"
                        @change="changeImage1($event)"
                        ref="avatarInput1"
                      />
                    </Button>
                  </div>
                </Form-item>
                <Form-item class="img_container">
                  <div
                    v-for="(item, index) in viewData.Img"
                    :key="index"
                    style="position: relative; margin: 0 1%; display: flex"
                  >
                    <img
                      @click="changeImg(index)"
                      :src="item"
                      style="width: 110px; height: 110px"
                    />
                    <Icon
                      @click="delImg(index)"
                      size="18"
                      style="position: absolute; top: 5px; right: 5px"
                      type="md-close-circle"
                    />
                  </div>
                </Form-item>
              </Form>
            </Modal>
            <Modal
              clearable
              v-model="viewData.modalEdit"
              title="编辑服务项目"
              :mask-closable="false"
              @on-ok="onEditBtn"
              width="35"
              @on-cancel="onModelCancel"
            >
              <Form :label-width="80">
                <Form-item class="form_item" label="服务项目名:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Edit.serviceName"
                    type="text"
                    :maxlength="30"
                    placeholder="服务项目"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="服务单位:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Edit.unit"
                    type="text"
                    :maxlength="10"
                    placeholder="服务单位"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="服务价格:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Edit.servicePrice"
                    type="text"
                    :maxlength="10"
                    placeholder="服务价格"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="服务类型:">
                  <Select
                    placeholder="服务类型"
                    v-model="viewData.Edit.serviceType"
                    class="search_item"
                  >
                    <Option
                      v-for="item in viewData.fwList"
                      :value="item.id"
                      :key="item.id"
                      >{{ item.name }}</Option
                    >
                  </Select>
                </Form-item>
                <Form-item class="form_item" label="服务备注:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Edit.tips"
                    type="text"
                    :maxlength="50"
                    placeholder="服务备注"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="排序序号:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Edit.listOrder"
                    type="text"
                    :maxlength="4"
                    placeholder="排序序号"
                  ></Input>
                </Form-item>
                <Form-item
                  style="margin-top: -15px; padding-right: 10px"
                  label="服务详情图："
                >
                  <div>
                    <Button class="choice_img">
                      <Icon type="ios-cloud-upload-outline"></Icon>上传图片
                      <input
                        multiple
                        class="ImgC"
                        type="file"
                        name="avatar"
                        accept="image/gif, image/jpeg, image/jpg, image/png"
                        @change="changeImage($event)"
                        ref="avatarInput"
                      />
                      <input
                        style="display: none"
                        type="file"
                        name="avatar"
                        accept="image/gif, image/jpeg, image/jpg, image/png"
                        @change="changeImage1($event)"
                        ref="avatarInput1"
                      />
                    </Button>
                  </div>
                </Form-item>
                <Form-item class="img_container">
                  <div
                    v-for="(item, index) in viewData.Img"
                    :key="index"
                    style="position: relative; margin: 0 1%; display: flex"
                  >
                    <img
                      @click="changeImg(index)"
                      :src="item"
                      style="width: 110px; height: 110px"
                    />
                    <Icon
                      @click="showDelImg(index)"
                      size="18"
                      style="position: absolute; top: 5px; right: 5px"
                      type="md-close-circle"
                    />
                  </div>
                </Form-item>
              </Form>
            </Modal>
          </Form>
          <Form-item style="padding-top: 10px">
            <i-table
              border
              :columns="searchList.columns"
              :data="searchList.pageData.content"
            ></i-table>
            <Page
              style="padding-top: 10px"
              :total="searchList.pageData.total"
              :current="searchList.searchCondition.page"
              :page-size="10"
              @on-change="onPageChange"
              size="small"
              show-total
            ></Page>
          </Form-item>
        </Form-item>
      </Form>
    </Col>
  </Row>
</template>
<script>
import axios from 'axios'
import qs from 'qs'

export default {
  data () {
    return {
      searchList: {
        Info: [],
        columns: [
          {
            title: '服务项目Id',
            align: 'center',
            key: 'id'
          },
          {
            title: '服务项目名',
            align: 'center',
            key: 'serviceName'
          },
          {
            title: '单位',
            align: 'center',
            key: 'unit'
          },
          {
            title: '服务价格',
            align: 'center',
            key: 'servicePrice',
            render: (h, params) => {
              return h('span', params.row.servicePrice + '元')
            }
          },
          {
            title: '服务类型',
            align: 'center',
            key: 'serviceType',
            render: (h, params) => {
              return h(
                'span',
                params.row.serviceType === 1 ? '家政清洁' : '钟点保姆'
              )
            }
          },
          {
            title: '服务备注',
            align: 'center',
            key: 'tips'
          },
          {
            title: '排序序号',
            align: 'center',
            key: 'listOrder'
          },
          {
            title: '是否上架',
            align: 'center',
            key: 'action',
            render: (h, params) => {
              return h('i-switch', {
                props: {
                  value: params.row.status,
                  'false-value': 0,
                  'true-value': 1,
                  size: 'large'
                },
                slot: {},
                on: {
                  'on-change': (e) => {
                    axios
                      .put(
                        '/qsz_pf/item/update_status',
                        qs.stringify({
                          id: params.row.id,
                          status: e
                        })
                      )
                      .then(() => {
                        this.$Message.success('操作成功!')
                      })
                      .catch(() => {
                        this.searchManage()
                      })
                  }
                }
              })
            }
          },
          {
            title: '操作',
            key: 'action',
            width: 200,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '15px'
                    },
                    on: {
                      click: () => {
                        this.showEdit(params.row)
                      }
                    }
                  },
                  '编辑'
                ),
                h(
                  'Button',
                  {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    style: {
                      marginRight: '15px'
                    },
                    on: {
                      click: () => {
                        this.showDelete(params.row)
                      }
                    }
                  },
                  '删除'
                )
              ])
            }
          }
        ],
        data: [],
        pageData: {
          content: [],
          pageNum: 1,
          numberOfElements: 0,
          total: 0,
          totalPages: 0,
          size: 5,
          rankTime: ''
        },
        searchCondition: {
          page: 1,
          size: 5
        },
        pageSizeOpts: [1, 5, 10, 20, 30, 40]
      },
      viewData: {
        Add: {
          serviceName: '',
          listOrder: ''
        },
        Edit: {
          serviceName: '',
          listOrder: ''
        },
        fwList: [],
        Img: [],
        delInd: '',
        pList: [],
        modalEdit: false,
        modalAdd: false,
        modalDelete: false,
        modalSiteDeleteImg: false,
        Delete: ''
      }
    }
  },
  methods: {
    // 图片操作
    changeImage (e) {
      const file = e.target.files
      const that = this
      const reader = new FileReader()
      if (that.viewData.Img.length + file.length > 10) {
        this.$Message.error('地点图只能上传10张图片！')
        this.$refs.avatarInput.value = ''
        return false
      }
      for (let i = 0; i < file.length; i++) {
        const reader = new FileReader()
        reader.readAsDataURL(file[i])
        reader.onload = function (e) {
          console.log(that.viewData.Img)
          that.viewData.Img.push(this.result)
        }
      }
    },
    changeImage1 (e) {
      const file = e.target.files[0]
      const reader = new FileReader()
      const that = this
      reader.readAsDataURL(file)
      reader.onload = function (e) {
        that.viewData.Img.splice(that.viewData.ImgId, 1, this.result)
      }
    },
    changeImg (index) {
      let img = this.viewData.Img[index]
      const find = this.viewData.Img[index].indexOf('https://')
      if (find === 0) {
        const ind = img.indexOf('?time=')
        img = img.substring(0, ind)
        this.viewData.ImgDel.push(img)
      }
      this.viewData.ImgId = index
      this.$refs.avatarInput1.value = ''
      this.$refs.avatarInput1.click()
    },
    delImg (index) {
      const img = this.viewData.Img[index]
      const find = img.indexOf('https://')
      if (find === 0) {
        this.onDeleteImg(img)
        // let ind = img.indexOf('?time=')
        // img = img.substring(0, ind)
        // this.viewData.ImgDel.push(img);
      }
      this.viewData.Img.splice(index, 1)
      this.$refs.avatarInput.value = ''
    },
    showDelImg (index) {
      this.viewData.delInd = index
      this.viewData.modalSiteDeleteImg = true
    },
    onDeleteImg (img) {
      axios
        .delete('/qsz_pf/item/delete_image', {
          data: {
            image_url: img,
            id: this.viewData.Edit.id
          }
        })
        .then((response) => {
          this.$Message.success('删除成功!')
          this.searchSite()
        })
    },
    onPageChange (pageNum) {
      this.searchList.searchCondition.page = pageNum
      this.searchManage()
    },
    onDeleteBtn () {
      axios
        .delete('/qsz_pf/item/delete', {
          data: {
            id: this.viewData.Delete.id
          }
        })
        .then((response) => {
          this.$Message.success('删除成功!')
          this.searchManage()
          this.searchPid()
        })
    },
    onAddBtn () {
      if (this.viewData.Add.serviceName === '') {
        this.$Message.error('请输入服务项目名')
        return
      }
      if (this.viewData.Img.length === 0) {
        this.$Message.error('请至少上传一张服务详情图')
        return
      }
      this.$Message.warning('上传中，请稍后...')
      axios
        .post(
          '/qsz_pf/item/create',
          qs.stringify({
            serviceName: this.viewData.Add.serviceName,
            servicePrice: this.viewData.Add.servicePrice,
            serviceType: this.viewData.Add.serviceType,
            tips: this.viewData.Add.tips || '',
            unit: this.viewData.Add.unit,
            listOrder: this.viewData.Add.listOrder,
            imageList: this.viewData.Img
          })
        )
        .then((response) => {
          this.viewData.Add = {}
          this.viewData.Img = []
          this.$refs.avatarInput.value = ''
          this.searchManage()
          this.$Message.success('添加成功!')
        })
    },
    onEditBtn () {
      if (this.viewData.Edit.serviceName === '') {
        this.$Message.error('请输入服务项目名')
        return
      }
      const Img = this.viewData.Img.filter(
        (item) => item.indexOf('https://') === -1
      )
      console.log(Img)
      this.$Message.warning('上传中，请稍后...')
      axios
        .put(
          '/qsz_pf/item/update',
          qs.stringify({
            id: this.viewData.Edit.id,
            serviceName: this.viewData.Edit.serviceName,
            servicePrice: this.viewData.Edit.servicePrice,
            serviceType: this.viewData.Edit.serviceType,
            tips: this.viewData.Edit.tips || '',
            unit: this.viewData.Edit.unit,
            listOrder: this.viewData.Edit.listOrder,
            imageList: Img.length === 0 ? '' : Img
          })
        )
        .then((response) => {
          this.viewData.Edit = {}
          this.viewData.Img = []
          this.$refs.avatarInput.value = ''
          this.searchManage()
          this.$Message.success('编辑成功!')
        })
        .catch(() => {
          this.searchManage()
        })
    },
    onModelCancel () {
      this.searchManage()
    },
    showAdd () {
      this.viewData.Img = []
      this.$refs.avatarInput.value = ''
      this.viewData.modalAdd = true
    },
    showEdit (item) {
      this.viewData.Img = item.imageList || []
      this.viewData.Edit = item
      this.viewData.modalEdit = true
    },
    showDelete (item) {
      this.viewData.Delete = item
      this.viewData.modalDelete = true
    },
    searchPageReturn () {
      this.searchList.searchCondition.page = 1
      this.searchManage()
      this.$Message.success('搜索完成!')
    },
    searchManage () {
      axios
        .get('/qsz_pf/item/list', {
          params: {
            page: this.searchList.searchCondition.page,
            serviceType: this.searchList.searchCondition.serviceType
          }
        })
        .then((response) => {
          this.searchList.pageData.content = response.data.data
          this.searchList.pageData.total = response.data.total
        })
    },
    searchManage1 () {
      axios.get('/qsz_pf/item_type/list').then((response) => {
        this.viewData.fwList = response.data.filter((item) => item.status)
      })
    }
  },
  created () {
    this.searchManage()
    this.searchManage1()
  }
}
</script>
<style>
.ivu-form-inline .ivu-form-item {
  margin-right: 0px !important;
}

.ivu-modal-confirm-body-icon {
  display: none;
}

.ivu-modal-confirm-body {
  padding-left: 0 !important;
  margin-top: 0 !important;
  padding-top: 0 !important;
}

.ivu-modal-confirm-footer {
  margin-top: 20px;
}

.ivu-form-item-content button[data-cmd='imageUpload'] {
  display: none !important;
  color: black !important;
}

.ivu-form-item-content button[data-cmd='imageByURL'] {
  display: none !important;
  color: black !important;
}

.ivu-form-item-content .fr-popup .fr-image-upload-layer {
  display: none !important;
}

.btnR {
  float: left;
  padding: 10px 20px;
}

.btnR span {
  display: flex;
  line-height: 20px;
  padding-left: 5px;
}

.ImgC {
  opacity: 0;
  width: 120px;
  height: 32px;
  position: absolute;
  top: 0;
  left: 0;
}

.imgMax {
  max-width: 300px;
}
.img_container {
  width: 100%;
}

.img_container .ivu-form-item-content {
  display: flex;
  flex-wrap: wrap;
}
</style>
