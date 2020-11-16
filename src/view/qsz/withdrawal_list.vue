<template>
  <Row :gutter="32">
    <Col span="24">
      <Form>
        <Form-item>
          <Form inline>
            <Form-item>
              <Select
                clearable
                placeholder="提现状态"
                @on-change="searchManage"
                v-model="searchList.searchCondition.status"
                class="search_item"
              >
                <Option
                  v-for="item in viewData.statusList"
                  :value="item.value"
                  :key="item.value"
                  >{{ item.label }}</Option
                >
              </Select>
            </Form-item>
            <Form-item>
              <Button style="margin-right: 10px" @click="searchPageReturn">
                <Icon size="18" type="ios-search" />
              </Button>
              <!-- <Button icon="md-add" @click="showCollect()">增加</Button> -->
            </Form-item>
            <Modal
              :mask-closable="false"
              title="拒绝确认"
              width="400"
              v-model="viewData.modalRefuse"
              @on-ok="onAuditBtn(0)"
            >
              <Form :label-width="80">
                <Form-item class="form_item">
                  确认拒绝提现订单ID：
                  <span style="color: red">{{ viewData.Confirm.orderId }}</span>
                  的审核吗？
                </Form-item>
                <Form-item class="form_item" label="拒绝原因:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Confirm.reason"
                    type="text"
                    placeholder="请输入拒绝原因"
                  ></Input>
                </Form-item>
              </Form>
            </Modal>
            <Modal
              :mask-closable="false"
              title="通过确认"
              width="400"
              v-model="viewData.modalPass"
              @on-ok="onAuditBtn(1)"
            >
              确认通过提现订单ID：
              <span style="color: red">{{ viewData.Confirm.orderId }}</span>
              的审核吗？
            </Modal>

            <Modal
              title="查看用户信息详情"
              width="55"
              :styles="{ top: '70px' }"
              v-model="viewData.modalDetail"
            >
              <div class="order_info">
                <h3>用户信息</h3>
                <Row>
                  <Col span="10">用户id: {{ viewData.Detail.id }}</Col>
                  <Col span="10"
                    >加入时间: {{ viewData.Detail.createTime }}</Col
                  >
                  <!-- <Col span="10">用户状态: {{viewData.Detail.vipLevel?'VIP':'普通用户'}}</Col> -->
                </Row>
                <Row>
                  <Col span="10">姓名: {{ viewData.Detail.name }}</Col>
                  <Col span="10"
                    >联系电话: {{ viewData.Detail.contactMobile }}</Col
                  >
                </Row>
                <h4>地址: {{ viewData.Detail.contactAddr }}</h4>
                <!-- <Row>
                  <Col span="10">房号: {{viewData.Detail.houseNum}}</Col>
                  <Col span="10">户型: {{viewData.Detail.houseSize}}</Col>
                </Row>-->
                <Row>
                  <!-- <Col span="10">VIP过期时间: {{viewData.Detail.vipPastTime}}</Col> -->
                  <Col span="10"
                    >汽车外部清洗优惠券:
                    {{ viewData.Detail.carDiscountNum }}</Col
                  >
                </Row>
                <Row>
                  <Col span="10"
                    >2小时保洁优惠券:
                    {{ viewData.Detail.cleanDiscountNum }}</Col
                  >
                  <Col span="10"
                    >照明安装优惠券: {{ viewData.Detail.illDiscountNum }}</Col
                  >
                </Row>
                <!-- <Row>
                  <Col span="10">充值VIP次数: {{viewData.Detail.vipCount}}</Col>
                </Row>-->
              </div>
            </Modal>
            <Modal
              :mask-closable="false"
              width="400"
              v-model="viewData.modalDelete"
              @on-ok="onDeleteBtn"
            >
              确认删除id为：
              <span style="color: red">{{ viewData.Delete.id }}</span>
              的信息吗？
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
export default {
  data () {
    return {
      fileName: '',
      uploadFile: {},
      searchList: {
        Info: [],
        columns: [
          {
            title: '提现订单ID',
            align: 'center',
            key: 'orderId'
          },
          {
            title: '姓名',
            align: 'center',
            key: 'name'
          },
          {
            title: '账号(电话)',
            align: 'center',
            key: 'account'
          },
          {
            title: '提现金额',
            align: 'center',
            key: 'num',
            render: (h, params) => {
              return h('span', params.row.num + '元')
            }
          },
          {
            title: '申请时间',
            align: 'center',
            key: 'createTime'
          },
          {
            title: '提现类型',
            align: 'center',
            key: 'withdrawalType'
          },
          {
            title: '审核时间',
            align: 'center',
            key: 'auditTime'
          },
          {
            title: '审核状态',
            align: 'center',
            key: 'statusChina'
          },
          {
            title: '拒绝原因',
            align: 'center',
            key: 'result'
          },
          {
            title: '操作',
            key: 'action',
            width: 200,
            align: 'center',
            render: (h, params) => {
              const arr = []
              if (params.row.status === 0) {
                arr.push(
                  h(
                    'Button',
                    {
                      props: {
                        type: 'success',
                        size: 'small'
                      },
                      style: {
                        marginRight: '15px'
                      },
                      on: {
                        click: () => {
                          this.showPass(params.row)
                        }
                      }
                    },
                    '通过审核'
                  ),
                  h(
                    'Button',
                    {
                      props: {
                        type: 'warning',
                        size: 'small'
                      },
                      on: {
                        click: () => {
                          this.showRefuse(params.row)
                        }
                      }
                    },
                    '拒绝审核'
                  )
                )
              }
              return h('div', arr)
            }
          }
        ],
        pageData: {
          content: [],
          total: 0,
          pageNum: 1
        },
        searchCondition: {
          page: 1,
          limit: 10
        },
        pageSizeOpts: [1, 5, 10, 20, 30, 40]
      },
      viewData: {
        modalChecking: false,
        modalDelete: false,
        modalDetail: false,
        modalRefuse: false,
        modalPass: false,
        Confirm: {},
        Detail: {},
        Delete: {},
        statusList: [
          {
            value: 0,
            label: '待审核'
          },
          {
            value: 1,
            label: '已完成'
          },
          {
            value: -1,
            label: '已取消'
          },
          {
            value: -2,
            label: '不通过'
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
        .delete('/qsz_pf/wallet/delete', {
          data: {
            id: this.viewData.Delete.id
          }
        })
        .then((res) => {
          this.$Message.success('删除成功!')
          this.searchManage()
        })
    },
    showDetail (row) {
      this.viewData.modalDetail = true
      this.viewData.id = row.id
      this.searchDetail()
    },
    showChecking (row) {
      this.viewData.modalChecking = true
      this.viewData.Detail = row
      this.viewData.id = row.id
      this.searchChecking()
    },
    showPass (item) {
      this.viewData.Confirm = item
      this.viewData.modalPass = true
    },
    showRefuse (item) {
      this.viewData.Confirm = item
      this.viewData.modalRefuse = true
    },
    onAuditBtn (status) {
      axios
        .put('/qsz_pf/wallet/withdrawal_audit', {
          id: this.viewData.Confirm.id,
          isPass: status,
          reason: status ? '' : this.viewData.Confirm.reason
        })
        .then((response) => {
          this.viewData.Confirm = {}
          this.$Message.success('操作成功!')
          this.searchManage()
        })
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
        .get('/qsz_pf/wallet/withdrawal_list', {
          params: {
            page: this.searchList.searchCondition.page,
            name: this.searchList.searchCondition.name,
            account: this.searchList.searchCondition.account,
            orderModel: this.searchList.searchCondition.orderModel,
            status: this.searchList.searchCondition.status,
            role: this.searchList.searchCondition.role
          }
        })
        .then((res) => {
          this.searchList.pageData.content = res.data.data
          this.searchList.pageData.total = res.data.total
        })
    },
    searchDetail () {
      axios
        .get('/qsz_pf/wallet/detail', {
          params: {
            id: this.viewData.Detail.id
          }
        })
        .then((res) => {
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
