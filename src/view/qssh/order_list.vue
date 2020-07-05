<template>
  <Row :gutter="32">
    <Col span="24">
      <Form>
        <Form-item>
          <Form inline>
            <Form-item>
              <Input
                class="search_item"
                type="text"
                v-model="searchList.searchCondition.title"
                clearable
                placeholder="需求标题"
              ></Input>
              <Input
                class="search_item"
                type="text"
                v-model="searchList.searchCondition.contactMobile"
                clearable
                placeholder="联系电话"
              ></Input>
              <Select
                clearable
                placeholder="需求状态"
                @on-change="searchManage"
                v-model="searchList.searchCondition.status"
                class="search_item"
              >
                <Option
                  v-for="item in viewData.statusList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
              <Select
                clearable
                class="search_item"
                v-model="searchList.searchCondition.province"
                placeholder="请选择省份"
                @on-change="changeProvince"
              >
                <Option
                  v-for="item in provinceArr"
                  :key="item.value"
                  :value="item.label"
                >{{ item.label }}</Option>
              </Select>
              <Select
                clearable
                class="search_item"
                v-model="searchList.searchCondition.city"
                placeholder="请选择城市"
                @on-change="changeCity"
              >
                <Option
                  v-for="item in citiesArr"
                  :key="item.value"
                  :value="item.label"
                >{{ item.label }}</Option>
              </Select>
              <Select
                clearable
                class="search_item"
                v-model="searchList.searchCondition.county"
                placeholder="请选择区县"
                @on-change="searchSq"
              >
                <Option
                  v-for="item in countyArr"
                  :key="item.value"
                  :value="item.label"
                >{{ item.label }}</Option>
              </Select>
              <Select
                clearable
                class="search_item"
                v-model="searchList.searchCondition.housingId"
                placeholder="请选择社区"
                @on-change="searchManage"
              >
                <Option
                  v-for="item in viewData.sqList"
                  :key="item.id"
                  :value="item.id"
                >{{ item.name }}</Option>
              </Select>
            </Form-item>
            <Form-item>
              <Button style="margin-right:10px" @click="searchPageReturn">
                <Icon size="18" type="ios-search" />
              </Button>
            </Form-item>
            <Modal
              :mask-closable="false"
              title="取消确认"
              width="400"
              v-model="viewData.modalRefuse"
              @on-ok="oncancel()"
            >
              <Form :label-width="80">
                <Form-item class="form_item" label="谨慎操作:">
                  确认
                  <span style="color: red; font-size: 22px;">取消</span> 需求id：
                  <span style="color:red;font-size: 22px;">{{viewData.Confirm.id}}</span>
                  吗？
                </Form-item>
                <Form-item class="form_item" label="确认取消:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Confirm.reason"
                    type="text"
                    placeholder="请输入确认取消"
                  ></Input>
                </Form-item>
              </Form>
            </Modal>
            <Modal
              :mask-closable="false"
              width="400"
              v-model="viewData.modalDelete"
              @on-ok="onDeleteBtn"
            >
              确认删除需求id为：
              <span style="color:red">{{viewData.Delete.id}}</span>
              的需求吗？
            </Modal>
            <Modal
              title="查看需求信息详情"
              width="55"
              :styles="{top: '70px'}"
              v-model="viewData.modalDetail"
            >
              <div class="order_info">
                <h3>需求信息</h3>
                <Row>
                  <Col span="10">需求id: {{viewData.Detail.id}}</Col>
                  <Col span="10">需求状态: {{viewData.Detail.statusChina}}</Col>
                </Row>
                <Row>
                  <Col span="10">客户姓名: {{viewData.Detail.contactName}}</Col>
                  <Col span="10">联系电话: {{viewData.Detail.contactMobile}}</Col>
                </Row>
                <Row>
                  <Col span="10">截止时间: {{viewData.Detail.createTime}}</Col>
                  <Col span="10">创建时间: {{viewData.Detail.validTimeEnd}}</Col>
                </Row>
                <Row>
                  <Col span="10">社区: {{viewData.Detail.housingName}}</Col>
                  <Col span="10">需求标题: {{viewData.Detail.title}}</Col>
                </Row>
                <h4>需求内容: {{viewData.Detail.content}}</h4>
                <Row>
                  <Col span="20">
                    <img
                      v-for="(item,ind) in viewData.Detail.gallery"
                      :key="ind"
                      :src="item"
                      class="img_item"
                      preview="0"
                      preview-text="需求图"
                    />
                  </Col>
                </Row>
              </div>
            </Modal>
          </Form>
          <Form-item style="padding-top: 10px;">
            <i-table border :columns="searchList.columns" :data="searchList.pageData.content"></i-table>
            <Page
              style="padding-top: 10px"
              :total="searchList.pageData.total"
              :current="searchList.pageData.pageNum"
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
import city from '@/libs/city'

export default {
  data () {
    return {
      provinceArr: city,
      citiesArr: [],
      countyArr: [],
      searchList: {
        carList: [],
        categoryList: [],
        columns: [
          {
            title: '需求Id',
            align: 'center',
            key: 'id'
          },
          {
            title: '需求标题',
            align: 'center',
            key: 'title'
          },
          {
            title: '客户姓名',
            align: 'center',
            key: 'contactName'
          },
          {
            title: '联系电话',
            align: 'center',
            key: 'contactMobile'
          },
          {
            title: '社区',
            align: 'center',
            key: 'housingName'
          },
          {
            title: '截止日期',
            align: 'center',
            key: 'validTimeEnd'
          },
          {
            title: '需求状态',
            align: 'center',
            key: 'statusChina'
          },
          {
            title: '创建时间',
            align: 'center',
            key: 'createTime'
          },
          {
            title: '操作',
            key: 'action',
            width: 160,
            align: 'center',
            render: (h, params) => {
              const arr = [
                h(
                  'Button',
                  {
                    props: {
                      type: 'info',
                      size: 'small'
                    },
                    style: {
                      marginRight: '15px'
                    },
                    on: {
                      click: () => {
                        this.showDetail(params.row)
                      }
                    }
                  },
                  '详情'
                ),
                h(
                  'Button',
                  {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.showDelete(params.row)
                      }
                    }
                  },
                  '删除'
                )
              ]
              return h('div', arr)
            }
          }
        ],
        data: [],
        pageData: {
          content: [],
          pageNum: 1,
          numberOfElements: 0,
          total: 0,
          totalPages: 0
        },
        searchCondition: {
          page: 1,
          size: 5,
          role: 4
        },
        pageSizeOpts: [1, 5, 10, 20, 30, 40]
      },
      viewData: {
        goodsIId: '',
        Detail: '',
        Delete: {},
        Confirm: {},
        modalDelete: false,
        modalDetail: false,
        modalDispatch: false,
        modalRefuse: false,
        modalPass: false,
        sqList: {},
        statusList: [
          {
            value: 0,
            label: '进行中'
          },
          {
            value: -1,
            label: '已取消'
          },
          {
            value: -2,
            label: '已过期'
          }
        ]
      }
    }
  },
  methods: {
    changeProvince (val) {
      console.log(this.provinceArr)
      for (var i = 0; i < this.provinceArr.length; i++) {
        if (val === this.provinceArr[i].label) {
          this.citiesArr = this.provinceArr[i].children
          this.countyArr = []
        }
      }
    },
    changeCity (val) {
      for (var i = 0; i < this.citiesArr.length; i++) {
        if (val === this.citiesArr[i].label) {
          this.countyArr = this.citiesArr[i].children
        }
      }
    },
    showImg (ad_picture_url) {
      this.$Modal.info({
        title: '预览图片',
        closable: true,
        content: `<br /><img style="width: 100%" src=${[ad_picture_url]} />`
      })
    },
    onPageChange (pageNum) {
      this.searchList.searchCondition.page = pageNum
      this.searchManage()
    },
    onDeleteBtn () {
      axios
        .delete('/sjwh/demand/delete', {
          data: {
            id: this.viewData.Delete.id
          }
        })
        .then(res => {
          this.$Message.success('删除成功!')
          this.searchManage()
        })
    },
    oncancel () {
      if (this.viewData.Confirm.reason !== '确认取消') {
        this.$Message.error('请输入"确认取消"四个字')
        return false
      }
      axios
        .put(
          '/sjwh/demand/cancel',
          qs.stringify({
            id: this.viewData.Confirm.id
          })
        )
        .then(response => {
          this.viewData.Confirm = {}
          this.$Message.success('操作成功!')
          this.searchManage()
        })
    },
    onDone (status) {
      axios
        .put(
          '/sjwh/demand/done',
          qs.stringify({
            id: this.viewData.Confirm.id
          })
        )
        .then(response => {
          this.viewData.Confirm = {}
          this.$Message.success('操作成功!')
          this.searchManage()
        })
    },
    onDispatch (status) {
      axios
        .put(
          '/sjwh/demand/dispatch',
          qs.stringify({
            id: this.viewData.Confirm.id
          })
        )
        .then(response => {
          this.viewData.Confirm = {}
          this.$Message.success('操作成功!')
          this.searchManage()
        })
    },
    onModelCancel () {
      this.searchManage()
    },
    showDetail (row) {
      this.viewData.modalDetail = true
      this.viewData.Detail = row
      this.viewData.id = row.id
      this.$previewRefresh()
      // this.searchDetail()
    },
    showPass (item) {
      this.viewData.Confirm = item
      this.viewData.modalPass = true
    },
    showDispatch (item) {
      this.viewData.Confirm = item
      this.viewData.modalDispatch = true
    },
    showRefuse (item) {
      this.viewData.Confirm = item
      this.viewData.modalRefuse = true
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
        .get('/sjwh/demand/list', {
          params: {
            page: this.searchList.searchCondition.page,
            title: this.searchList.searchCondition.title,
            contactMobile: this.searchList.searchCondition.contactMobile,
            housingId: this.searchList.searchCondition.housingId,
            status: this.searchList.searchCondition.status
          }
        })
        .then(res => {
          this.searchList.pageData.content = res.data.data
          this.searchList.pageData.total = res.data.total
        })
    },
    searchDetail () {
      axios
        .get('/sjwh/demand/detail', {
          params: {
            id: this.viewData.id
          }
        })
        .then(res => {
          this.viewData.Detail = res.data
        })
    },
    searchSq () {
      console.log(this.searchList.searchCondition.pid)
      axios
        .get('/sjwh/housing/list', {
          params: {
            province: this.searchList.searchCondition.province || '广东省',
            city: this.searchList.searchCondition.city || '广州市',
            county: this.searchList.searchCondition.county || '海珠区'
          }
        })
        .then(response => {
          this.viewData.sqList = response.data.data
        })
    }
  },
  created () {
    this.searchManage()
    this.searchSq()
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

.btnR {
  float: left;
  padding: 10px 18px;
}

.btnR span {
  display: flex;
  line-height: 20px;
  padding-left: 5px;
}

.choice_img {
  width: 120px;
  position: relative;
}

.ImgC {
  opacity: 0;
  width: 120px;
  height: 32px;
  position: absolute;
  top: 0;
  left: 0;
}

.img_container {
  width: 100%;
}

.img_container .ivu-form-item-content {
  display: flex;
}

.ivu-input[disabled],
fieldset[disabled] .ivu-input {
  color: #0c0c0c !important;
}

.order_info {
  font-size: 18px;
  margin-left: 20px;
  color: #666;
}

.order_info h3 {
  margin: 10px 0;
  color: #222;
}

.order_info h4 {
  margin: 20px;
  font-weight: 1 !important;
}

.order_info .ivu-row {
  margin: 20px;
}

.order_info .order_item {
  border-bottom: 1px solid #eee;
}

.order_info .order_item .title {
  color: #333;
}

.order_info .img_item {
  width: 70px;
  height: 70px;
  margin-right: 10px;
}
</style>
