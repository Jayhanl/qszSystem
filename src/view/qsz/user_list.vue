<template>
  <Row :gutter="32">
    <Col span="24">
      <Form>
        <Form-item>
          <Form inline>
            <!-- <Form-item>
              <Input
                class="search_item"
                type="text"
                v-model="searchList.searchCondition.contactName"
                clearable
                placeholder="姓名"
              ></Input>
              <Select
                clearable
                placeholder="状态"
                @on-change="searchManage"
                v-model="searchList.searchCondition.registerStatus"
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
                placeholder="身份"
                @on-change="searchManage"
                v-model="searchList.searchCondition.role"
                class="search_item"
              >
                <Option
                  v-for="item in viewData.roleList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </Form-item> -->
            <Form-item>
              <Button style="margin-right:10px" @click="searchPageReturn">
                <Icon size="18" type="ios-search" />
              </Button>
              <!-- <Button icon="md-add" @click="showCollect()">增加</Button> -->
            </Form-item>

            <Modal
              title="查看用户信息详情"
              width="55"
              :styles="{top: '70px'}"
              v-model="viewData.modalDetail"
            >
              <div class="order_info">
                <h3>用户信息</h3>
                <Row>
                  <Col span="10">用户id: {{viewData.Detail.userId}}</Col>
                  <Col span="10">加入时间: {{viewData.Detail.createTime}}</Col>
                  <!-- <Col span="10">用户状态: {{viewData.Detail.vipLevel?'VIP':'普通用户'}}</Col> -->
                </Row>
                <Row>
                  <Col span="10">姓名: {{viewData.Detail.contactName}}</Col>
                  <Col span="10">联系电话: {{viewData.Detail.contactMobile}}</Col>
                </Row>
                <h4>地址: {{viewData.Detail.contactAddr}}</h4>
                <!-- <Row>
                  <Col span="10">汽车外部清洗优惠券: {{viewData.Detail.carDiscountNum}}</Col>
                </Row>
                <Row>
                  <Col span="10">2小时保洁优惠券: {{viewData.Detail.cleanDiscountNum}}</Col>
                  <Col span="10">照明安装优惠券: {{viewData.Detail.illDiscountNum}}</Col>
                </Row> -->
                <!-- <Row>
                  <Col span="10">充值VIP次数: {{viewData.Detail.vipCount}}</Col>
                </Row> -->
              </div>
            </Modal>
            <Modal
              :mask-closable="false"
              width="400"
              v-model="viewData.modalDelete"
              @on-ok="onDeleteBtn"
            >
              确认删除id为：
              <span style="color:red">{{viewData.Delete.userId}}</span>
              的信息吗？
            </Modal>
          </Form>
          <Form-item style="padding-top: 10px;">
            <i-table border :columns="searchList.columns" :data="searchList.pageData.content"></i-table>
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
export default {
  data () {
    return {
      fileName: '',
      uploadFile: {},
      searchList: {
        Info: [],
        columns: [
          {
            title: '用户ID',
            align: 'center',
            key: 'userId',
            width: 120
          },
          {
            title: '姓名',
            align: 'center',
            key: 'contactName'
          },
          {
            title: '联系电话',
            align: 'center',
            key: 'contactMobile'
          },
          {
            title: '推荐人编号',
            align: 'center',
            key: 'referrerEmployeeId',
            render (h, parmas) {
              return h('span', parmas.row.referrerEmployeeId || '无')
            }
          },
          // {
          //   title: '照明安装优惠券',
          //   align: 'center',
          //   key: 'illDiscountNum'
          // },
          // {
          //   title: '2小时保洁优惠券',
          //   align: 'center',
          //   key: 'cleanDiscountNum'
          // },
          // {
          //   title: '汽车外部清洗优惠券',
          //   align: 'center',
          //   key: 'carDiscountNum'
          // },
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
                        this.showDetail(params.row)
                      }
                    }
                  },
                  '详情'
                )
              ])
            }
          }
        ],
        data: [],
        pageData: {
          content: [],
          total: 0,
          pageNum: 1
        },
        searchCondition: {
          page: 1,
          limit: 10
        },
        pageData1: {
          content: [],
          total: 0,
          pageNum: 1
        },
        searchCondition1: {
          page: 1,
          limit: 8
        },
        pageSizeOpts: [1, 5, 10, 20, 30, 40]
      },
      viewData: {
        modalPay: false,
        modalCollect: false,
        modalDelete: false,
        modalDetail: false,
        Confirm: '',
        Detail: {},
        Delete: {},
        statusList: [
          {
            value: 0,
            label: '未注册'
          },
          {
            value: 1,
            label: '注册中'
          },
          {
            value: 2,
            label: '已通过'
          },
          {
            value: -1,
            label: '审核失败'
          }
        ]
      }
    }
  },
  methods: {
    showImg (ad_picture_url) {
      this.$Modal.info({
        title: '预览图片',
        closable: true,
        content: `<br /><img style="width: 100%" src=${[ad_picture_url]} />`
      })
    },
    onDeleteBtn () {
      axios
        .delete('/qsz_pf/user/delete', {
          data: {
            userId: this.viewData.Delete.userId
          }
        })
        .then(res => {
          this.$Message.success('删除成功!')
          this.searchManage()
        })
    },
    showDetail (row) {
      this.viewData.modalDetail = true
      this.viewData.Detail = row
      this.viewData.userId = row.userId
    },
    onModelCancel () {
      this.searchManage()
    },
    searchPageReturn () {
      this.searchList.searchCondition.page = 1
      this.searchManage()
      this.$Message.success('搜索完成!')
    },
    onPageChange (pageNum) {
      this.searchList.searchCondition.page = pageNum
      this.searchManage()
    },
    searchManage () {
      axios
        .get('/qsz_pf/user/list', {
          params: {
            page: this.searchList.searchCondition.page,
            contactName: this.searchList.searchCondition.contactName,
            registerStatus: this.searchList.searchCondition.registerStatus,
            role: this.searchList.searchCondition.role
          }
        })
        .then(res => {
          this.searchList.pageData.content = res.data.data
          this.searchList.pageData.total = res.data.total
        })
    },
    searchDetail () {
      axios
        .get('/qsz_pf/user/personal_detail', {
          params: {
            userId: this.viewData.Detail.userId,
            role: this.viewData.Detail.role
          }
        })
        .then(res => {
          this.viewData.Detail = res.data
        })
    }
  },
  created () {
    this.searchManage()
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
  padding: 10px 18px;
}

.btnR span {
  display: flex;
  line-height: 20px;
  padding-left: 5px;
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
