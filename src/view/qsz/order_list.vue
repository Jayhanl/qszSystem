<template>
  <Row :gutter="32">
    <Col span="24">
    <Form>
      <Form-item>
        <Form inline>
          <Form-item>
            <Input class="search_item" type="text" v-model="searchList.searchCondition.orderId" clearable
              placeholder="订单ID"></Input>
            <Input class="search_item" type="text" v-model="searchList.searchCondition.contactName" clearable
              placeholder="客户姓名"></Input>
            <Select clearable placeholder="状态" @on-change="searchManage"
              v-model="searchList.searchCondition.orderStatus" class="search_item">
              <Option v-for="item in viewData.statusList" :value="item.value" :key="item.value">{{ item.label }}
              </Option>
            </Select>
            <input style="display:none" class="ImgC" type="file" merchantName="avatar"
              accept="image/gif, image/jpeg, image/jpg, image/png" @change="changeImage($event)" ref="avatarInput" />
          </Form-item>
          <Form-item>
            <Button style="margin-right:10px" @click="searchPageReturn">
              <Icon size="18" type="ios-search" />
            </Button>
          </Form-item>
          <Modal :mask-closable="false" title="取消确认" width="400" v-model="viewData.modalRefuse" @on-ok="oncancel()">
            <Form :label-width="80">
              <Form-item class="form_item" label="谨慎操作:">
                确认 <span style="color: red; font-size: 22px;">取消</span> 订单id：
                <span style="color:red;font-size: 22px;">{{viewData.Confirm.orderId}}</span>
                吗？
              </Form-item>
              <Form-item class="form_item" label="确认取消:">
                <Input style="width: 200px" v-model="viewData.Confirm.reason" type="text" placeholder="请输入确认取消"></Input>
              </Form-item>
            </Form>
          </Modal>
          <Modal :mask-closable="false" title="完成确认" width="400" v-model="viewData.modalPass" @on-ok="onDone()">
            确认已完成订单id：
            <span style="color:red">{{viewData.Confirm.orderId}}</span>
            吗？
          </Modal>
          <Modal :mask-closable="false" title="派遣确认" width="400" v-model="viewData.modalDispatch" @on-ok="onDispatch()">
            确认已派遣订单id：
            <span style="color:red">{{viewData.Confirm.orderId}}</span>
            吗？
          </Modal>
          <Modal :mask-closable="false" width="400" v-model="viewData.modalDelete" @on-ok="onDeleteBtn">
            确认删除订单id为：
            <span style="color:red">{{viewData.Delete.orderId}}</span>
            的订单吗？
          </Modal>
          <Modal title="查看订单信息详情" width="55" :styles="{top: '70px'}" v-model="viewData.modalDetail">
            <div class="order_info">
              <h3>订单信息</h3>
              <Row>
                <Col span="10">订单id: {{viewData.Detail.orderId}}</Col>
                <Col span="10">订单状态: {{viewData.Detail.orderStatusChina}}</Col>
              </Row>
              <Row>
                <Col span="10">服务1名: {{viewData.Detail.orderService}}</Col>
                <Col span="10">服务2名: {{viewData.Detail.orderServiceSec?viewData.Detail.orderServiceSec:'无'}}</Col>
              </Row>
              <h4>服务详情: {{viewData.Detail.orderExplain}}</h4>
              <Row>
                <Col span="10">客户姓名: {{viewData.Detail.contactName}}</Col>
                <Col span="10">联系电话: {{viewData.Detail.contactMobile}}</Col>
              </Row>
              <h4>地址: {{viewData.Detail.contactAddr}}</h4>
              <Row>
                <Col span="10">房号: {{viewData.Detail.houseNum}}</Col>
                <Col span="10">户型: {{viewData.Detail.houseSize}}</Col>
              </Row>
              <Row>
                <Col span="10">创建时间: {{viewData.Detail.createTime}}</Col>
                <Col span="10">是否收费: {{viewData.Detail.isNeedPay===1?'需收费':viewData.Detail.isNeedPay===2?'一项收费':'否'}}
                </Col>
              </Row>
            </div>
          </Modal>
        </Form>
        <Form-item style="padding-top: 10px;">
          <i-table border :columns="searchList.columns" :data="searchList.pageData.content"></i-table>
          <Page style="padding-top: 10px" :total="searchList.pageData.total" :current="searchList.searchCondition.page"
            :page-size="10" @on-change="onPageChange" size="small" show-total></Page>
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
        items: [{
          key: '',
          value: '',
          index: 1,
          status: 1
        }]
      },
      searchList: {
        carList: [],
        categoryList: [],
        columns: [{
          title: '订单Id',
          align: 'center',
          key: 'orderId'
        },
        {
          title: '是否收费',
          align: 'center',
          key: 'is_need_pay',
          render: (h, params) => {
            return h('span', params.row.isNeedPay === 1 ? '需收费' : params.row.isNeedPay === 2 ? '一项收费' : '否')
          }
        },
        {
          title: '服务1名',
          align: 'center',
          key: 'orderService'
        },
        {
          title: '服务2名',
          align: 'center',
          key: 'orderServiceSec',
          render: (h, params) => {
            return h('span', params.row.orderServiceSec ? params.row.orderServiceSec : '无')
          }
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
          title: '地址',
          align: 'center',
          key: 'contactAddr'
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
          title: '操作',
          key: 'action',
          width: 160,
          align: 'center',
          render: (h, params) => {
            const arr = [
              h(
                'Button', {
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
            if (params.row.orderStatus === 0) {
              arr.push(
                h(
                  'Button', {
                    props: {
                      type: 'warning',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.showDispatch(params.row)
                      }
                    }
                  },
                  '派遣'
                ),
                h(
                  'Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.showRefuse(params.row)
                      }
                    }
                  },
                  '取消'
                )
              )
            } else if (params.row.orderStatus === 1) {
              arr.push(
                h(
                  'Button', {
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
                  '完成'
                ),
                h(
                  'Button', {
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
                  '取消'
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
        modalDispatch: false,
        modalRefuse: false,
        modalPass: false,
        statusList: [{
          value: 0,
          label: '待派遣'
        },
        {
          value: 1,
          label: '待完成'
        },
        {
          value: 2,
          label: '已完成'
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
        .delete('/api/merchant/delete', {
          data: {
            logId: this.viewData.Delete.logId
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
          '/api/order/cancel',
          qs.stringify({
            logId: this.viewData.Confirm.logId
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
          '/api/order/done',
          qs.stringify({
            logId: this.viewData.Confirm.logId
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
          '/api/order/dispatch',
          qs.stringify({
            logId: this.viewData.Confirm.logId
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
      this.viewData.logId = row.logId
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
        .get('/api/order/list', {
          params: {
            page: this.searchList.searchCondition.page,
            orderId: this.searchList.searchCondition.orderId,
            contactName: this.searchList.searchCondition.contactName,
            orderStatus: this.searchList.searchCondition.orderStatus
          }
        })
        .then(res => {
          this.searchList.pageData.content = res.data.data
          this.searchList.pageData.total = res.data.total
        })
    },
    searchDetail () {
      axios
        .get('/api/order/detail', {
          params: {
            orderId: this.viewData.orderId
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
