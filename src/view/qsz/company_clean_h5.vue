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
                v-model="searchList.searchCondition.orderId"
                clearable
                placeholder="订单ID"
              ></Input>
              <!-- <Input class="search_item" type="text" v-model="searchList.searchCondition.contactName" clearable
              placeholder="客户姓名"></Input>-->
              <Select
                clearable
                placeholder="状态"
                @on-change="searchManage"
                v-model="searchList.searchCondition.orderStatus"
                class="search_item"
              >
                <Option
                  v-for="item in viewData.statusList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </Form-item>
            <Form-item>
              <Button style="margin-right:10px" @click="searchPageReturn">
                <Icon size="18" type="ios-search" />
              </Button>
            </Form-item>
            <Modal
              :mask-closable="false"
              title="通过确认"
              width="400"
              v-model="viewData.modalPass"
              @on-ok="onPassBtn()"
            >
              <Form>
                <Form-item class="form_item">
                  确认通过订单id：
                  <span style="color:red">{{viewData.Confirm.orderId}}</span>
                  的审核吗？
                </Form-item>
                <Form-item class="form_item" label="服务开始日期:">
                  <Date-picker
                    class="search_item"
                    type="date"
                    placeholder="服务开始日期"
                    @on-change="(datetime) =>{ this.viewData.Confirm.startDate = datetime}"
                    v-model="viewData.Confirm.startDate"
                  ></Date-picker>
                </Form-item>
              </Form>
            </Modal>
            <Modal
              :mask-closable="false"
              title="拒绝确认"
              width="400"
              v-model="viewData.modalRefuse"
              @on-ok="onCancelBtn()"
            >
              <Form :label-width="80">
                <Form-item class="form_item">
                  确认拒绝订单id：
                  <span style="color:red">{{viewData.Confirm.orderId}}</span>
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
              width="400"
              v-model="viewData.modalDelete"
              @on-ok="onDeleteBtn"
            ></Modal>
            <Modal
              title="查看订单信息详情"
              width="55"
              :styles="{top: '70px'}"
              v-model="viewData.modalDetail"
            >
              <div class="order_info">
                <h3>订单信息</h3>
                <Row>
                  <Col span="10">订单id: {{viewData.Detail.orderId}}</Col>
                  <Col span="10">订单状态: {{viewData.Detail.orderStatusChina}}</Col>
                </Row>
                <Row>
                  <Col span="10">单位名称: {{viewData.Detail.companyName}}</Col>
                  <Col span="10">单位平方: {{viewData.Detail.areaSize}}平方</Col>
                </Row>
                <Row>
                  <Col span="10">联系人: {{viewData.Detail.contactName}}</Col>
                  <Col span="10">联系电话: {{viewData.Detail.contactMobile}}</Col>
                </Row>
                <h4>单位地址: {{viewData.Detail.companyAddr}}</h4>
                <Row></Row>
                <Row>
                  <Col
                    span="10"
                  >套餐类型: {{viewData.Detail.buyMonth===1?'月度套餐':viewData.Detail.buyMonth===6?'半年套餐':'月度套餐'}}</Col>
                  <Col span="10">服务天数: {{viewData.Detail.buyType === 1 ? '1个月30天' : '1个月4天'}}</Col>
                </Row>
                <Row>
                  <Col span="10">购买月数: {{viewData.Detail.buyMonth}}月</Col>
                  <Col span="10">订单金额: {{viewData.Detail.orderPrice}}元</Col>
                </Row>
                <Row>
                  <Col span="10">
                    是否开局发票:
                    <span style="color:#f40;">{{viewData.Detail.isNeedInvoice?'是':'否'}}</span>
                  </Col>
                  <Col span="10">创建时间: {{viewData.Detail.createTime}}</Col>
                </Row>
                <Row>
                  <Col span="10">付款时间: {{viewData.Detail.payTime}}</Col>
                  <Col span="10">审核时间: {{viewData.Detail.auditTime}}</Col>
                  <!-- <Col v-if="viewData.Detail.reason" span="10">拒绝原因: {{viewData.Detail.reason}}</Col> -->
                </Row>
                <Row>
                  <Col span="10">服务开始时间: {{viewData.Detail.startDate||'待审核'}}</Col>
                  <Col span="10">服务结束时间: {{viewData.Detail.endDate||'待审核'}}</Col>
                </Row>
              </div>
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
import qs from 'qs'
export default {
  data () {
    return {
      formDynamic: {
        index: 1,
        items: [
          {
            key: '',
            value: '',
            index: 1,
            status: 1
          }
        ]
      },
      searchList: {
        carList: [],
        categoryList: [],
        columns: [
          {
            title: '订单Id',
            align: 'center',
            key: 'orderId'
          },
          {
            title: '单位名称',
            align: 'center',
            key: 'companyName'
          },
          {
            title: '联系人',
            align: 'center',
            key: 'companyName'
          },
          {
            title: '联系电话',
            align: 'center',
            key: 'contactMobile'
          },
          {
            title: '套餐类型',
            align: 'center',
            render (h, params) {
              return h(
                'span',
                params.row.buyMonth === 1
                  ? '月度套餐'
                  : params.row.buyMonth === 6
                    ? '半年套餐'
                    : '月度套餐'
              )
            }
          },
          {
            title: '服务天数',
            align: 'center',
            key: 'buyType',
            render: (h, params) => {
              return h(
                'span',
                params.row.buyType === 1 ? '1个月30天' : '1个月4天'
              )
            }
          },
          {
            title: '订单价格',
            align: 'center',
            key: 'orderPrice'
          },
          {
            title: '订单状态',
            align: 'center',
            key: 'orderStatusChina'
          },
          {
            title: '创建时间',
            align: 'center',
            key: 'createTime'
          },
          {
            title: '支付时间',
            align: 'center',
            key: 'payTime'
          },
          {
            title: '服务开始时间',
            align: 'center',
            key: 'startDate'
          },
          {
            title: '服务结束时间',
            align: 'center',
            key: 'endDate'
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
                )
              ]
              if (params.row.orderStatus === 1) {
                arr.push(
                  h(
                    'Button',
                    {
                      props: {
                        type: 'success',
                        size: 'small'
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
        modalRefuse: false,
        modalPass: false,
        statusList: [
          {
            value: 0,
            label: '未付款'
          },
          {
            value: 1,
            label: '待审核'
          },
          {
            value: 2,
            label: '已通过'
          },
          {
            value: -1,
            label: '已取消'
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
    onPageChange (pageNum) {
      this.searchList.searchCondition.page = pageNum
      this.searchManage()
    },
    onDeleteBtn () {
      axios
        .delete('/qsz_pf/merchant/delete', {
          data: {
            id: this.viewData.Delete.id
          }
        })
        .then((res) => {
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
          '/qsz_pf/demand_order/cancel',
          qs.stringify({
            id: this.viewData.Confirm.id
          })
        )
        .then((response) => {
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
      // this.searchDetail()
    },
    showPass (item) {
      this.viewData.Confirm = item
      this.viewData.modalPass = true
    },
    showRefuse (item) {
      this.viewData.Confirm = item
      this.viewData.modalRefuse = true
    },
    showDelete (item) {
      this.viewData.Delete = item
      this.viewData.modalDelete = true
    },
    onPassBtn (status) {
      if (!this.viewData.Confirm.startDate) {
        this.$Message.error('请选择服务开始日期')
        return false
      }
      axios
        .put('/qsz_pf/demand_order/accept', {
          id: this.viewData.Confirm.id,
          startDate: this.viewData.Confirm.startDate
        })
        .then((response) => {
          this.viewData.Confirm = {}
          this.$Message.success('操作成功!')
          this.searchManage()
        })
    },
    onCancelBtn (status) {
      axios
        .put('/qsz_pf/demand_order/cancel', {
          id: this.viewData.Confirm.id,
          reason: this.viewData.Confirm.reason
        })
        .then((response) => {
          this.viewData.Confirm = {}
          this.$Message.success('操作成功!')
          this.searchManage()
        })
    },
    searchPageReturn () {
      this.searchList.searchCondition.page = 1
      this.searchManage()
      this.$Message.success('搜索完成!')
    },
    searchManage () {
      axios
        .get('/qsz_pf/demand_order/list', {
          params: {
            page: this.searchList.searchCondition.page,
            orderId: this.searchList.searchCondition.orderId,
            contactName: this.searchList.searchCondition.contactName,
            orderStatus: this.searchList.searchCondition.orderStatus
          }
        })
        .then((res) => {
          this.$previewRefresh()
          this.searchList.pageData.content = res.data.data
          this.searchList.pageData.total = res.data.total
        })
    },
    searchDetail () {
      axios
        .get('/qsz_pf/demand_order/detail', {
          params: {
            id: this.viewData.id
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
