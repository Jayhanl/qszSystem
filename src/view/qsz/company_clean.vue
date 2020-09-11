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
              <Input
                class="search_item"
                type="text"
                v-model="searchList.searchCondition.companyName"
                clearable
                placeholder="单位名称"
              ></Input>
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
              title="订单退出服务"
              width="400"
              v-model="viewData.modalAudit"
              @on-ok="onAuditBtn()"
            >
              <Form>
                <Form-item class="form_item">
                  确认同意订单id：
                  <span style="color:red">{{viewData.Confirm.orderId}}</span>
                  退出服务吗？
                </Form-item>
                <Form-item class="form_item" label="是否退还押金:">
                  <RadioGroup v-model="viewData.Confirm.isReturn">
                    <Radio :label="1">是</Radio>
                    <Radio :label="0">否</Radio>
                  </RadioGroup>
                </Form-item>
              </Form>
            </Modal>
            <Modal
              :mask-closable="false"
              title="订单受理"
              width="400"
              v-model="viewData.modalAccept"
              @on-ok="onAcceptBtn()"
            >
              <Form>
                <Form-item class="form_item">
                  确认受理订单id：
                  <span style="color:red">{{viewData.Confirm.orderId}}</span>
                  的订单吗？
                </Form-item>
              </Form>
            </Modal>
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
                <Form-item class="form_item" label="单位面积:">
                  <Input
                    class="search_item"
                    type="text"
                    v-model="viewData.Confirm.areaSize"
                    clearable
                    placeholder="留空则无需修改（平方米）"
                  ></Input>
                </Form-item>
              </Form>
            </Modal>
            <Modal
              :mask-closable="false"
              title="取消订单"
              width="400"
              v-model="viewData.modalRefuse"
              @on-ok="onCancelBtn()"
            >
              <Form :label-width="80">
                <Form-item class="form_item">
                  确认取消订单id：
                  <span style="color:red">{{viewData.Confirm.orderId}}</span>
                  的订单吗？
                </Form-item>
                <Form-item class="form_item" label="取消原因:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Confirm.reason"
                    type="text"
                    placeholder="请输入取消原因"
                  ></Input>
                </Form-item>
              </Form>
            </Modal>
            <Modal
              :mask-closable="false"
              title="取消预约"
              width="400"
              v-model="viewData.modalCancelYy"
              @on-ok="onCancelYyBtn"
            >
              <Form :label-width="80">
                <Form-item class="form_item">
                  确认取消id为：
                  <span style="color:red">{{viewData.Confirm.id}}</span>
                  的预约吗？
                </Form-item>
                <Form-item class="form_item" label="确认取消:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Confirm.reason"
                    type="text"
                    placeholder="请输入“确认取消”"
                  ></Input>
                </Form-item>
              </Form>
            </Modal>
            <Modal
              :mask-closable="false"
              title="完成预约"
              width="400"
              v-model="viewData.modalConfirmYy"
              @on-ok="onConfirmYyBtn"
            >
              <Form :label-width="80">
                <Form-item class="form_item">
                  确认完成id为：
                  <span style="color:red">{{viewData.Confirm.id}}</span>
                  的预约吗？
                </Form-item>
              </Form>
            </Modal>
            <Modal :mask-closable="false" width="400" v-model="viewData.modalDelete"></Modal>
            <Modal :mask-closable="false" :title="'订单预约列表'" width="80" v-model="viewData.modalYy">
              预约状态：
              <Select
                clearable
                placeholder="预约状态"
                @on-change="searchYy"
                v-model="searchList.searchCondition2.status"
                class="search_item"
              >
                <Option
                  v-for="item in viewData.yyList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
              <i-table
                style="margin-top: 10px"
                border
                :columns="searchList.columns2"
                :data="searchList.searchCondition2.content"
              ></i-table>
              <Page
                style="padding-top: 10px"
                :total="searchList.searchCondition2.total"
                :current="searchList.searchCondition2.page"
                :page-size="10"
                @on-change="onPageChange2"
                size="small"
                show-total
              ></Page>
            </Modal>
            <Modal
              :mask-closable="false"
              width="400"
              v-model="viewData.modalDelete"
              @on-ok="onDeleteBtn"
            ></Modal>
            <Modal :mask-closable="false" :title="'订单缴费列表'" width="80" v-model="viewData.modalFee">
              <i-table
                border
                :columns="searchList.columns1"
                :data="searchList.searchCondition1.content"
              ></i-table>
              <Page
                style="padding-top: 10px"
                :total="searchList.searchCondition1.total"
                :current="searchList.searchCondition1.page"
                :page-size="10"
                @on-change="onPageChange1"
                size="small"
                show-total
              ></Page>
            </Modal>
            <Modal title="查看订单详情" width="55" :styles="{top: '70px'}" v-model="viewData.modalDetail">
              <div class="order_info">
                <h3>订单信息</h3>
                <Row>
                  <Col span="10">订单id: {{viewData.Detail.orderDetail.orderId}}</Col>
                  <Col span="10">订单状态: {{viewData.Detail.orderDetail.orderStatusChina}}</Col>
                </Row>
                <Row>
                  <Col span="10">单位名称: {{viewData.Detail.orderDetail.companyName}}</Col>
                  <Col span="10">单位标签: {{viewData.Detail.orderDetail.tagName}}</Col>
                </Row>
                <Row>
                  <Col span="10">联系人: {{viewData.Detail.orderDetail.contactName}}</Col>
                  <Col span="10">联系电话: {{viewData.Detail.orderDetail.contactMobile}}</Col>
                </Row>
                <Row>
                  <Col span="10">单位平方: {{viewData.Detail.orderDetail.areaSize}} m²</Col>
                  <Col span="10">办公楼: {{viewData.Detail.orderDetail.buildingName}}</Col>
                </Row>
                <h4>单位地址: {{viewData.Detail.orderDetail.companyAddr}}</h4>
                <h4>可开发票金额: {{viewData.Detail.orderDetail.invoicePrice}}元</h4>
                <Row>
                  <Col span="10">保证金状态: {{viewData.Detail.orderDetail.invoicePrice}}</Col>
                  <Col span="10">保证金期限: {{viewData.Detail.orderDetail.agreementTime}}</Col>
                </Row>
                <Row>
                  <Col span="10">创建时间: {{viewData.Detail.orderDetail.createTime}}</Col>
                  <Col span="10">付款时间: {{viewData.Detail.orderDetail.payTime}}</Col>
                </Row>
                <Row>
                  <Col span="10">受理时间: {{viewData.Detail.orderDetail.acceptTime}}</Col>
                  <Col span="10">审核时间: {{viewData.Detail.orderDetail.auditTime}}</Col>
                </Row>
                <Row>
                  <Col
                    span="10"
                  >服务开始时间: {{viewData.Detail.orderDetail.startDate||viewData.Detail.orderDetail.orderStatusChina}}</Col>
                  <Col
                    span="10"
                  >服务结束时间: {{viewData.Detail.orderDetail.endDate||viewData.Detail.orderDetail.orderStatusChina}}</Col>
                </Row>
                <h3>项目信息</h3>
                <div v-for="item in viewData.Detail.itemList" :key="item.itemId">
                  <h3>{{item.itemName}}</h3>
                  <!-- <Row>
                    <Col span="10">项目ID: {{item.itemId}}</Col>
                    <Col span="10">项目名称: {{item.itemName}}</Col>
                  </Row>-->
                  <Row>
                    <Col span="10">短服务剩余次数: {{item.sResidualNum}}次</Col>
                    <Col span="10">长服务剩余次数: {{item.lResidualNum}}次</Col>
                  </Row>
                  <Row>
                    <Col span="10">每周服务次数: {{item.weekNum}}</Col>
                    <Col span="10">服务时间: 每周 {{item.serviceTime}}</Col>
                  </Row>
                  <h4 v-if="item.newServiceTime">新服务时间(下周生效): 每周 {{item.newServiceTime}}</h4>
                  <Row>
                    <Col span="10">项目开始时间: {{item.startDate}}</Col>
                    <Col span="10">项目结束时间: {{item.endDate}}</Col>
                  </Row>
                </div>
              </div>
            </Modal>
            <Modal
              title="查看缴费项目详情"
              width="55"
              :styles="{top: '70px'}"
              v-model="viewData.modalFeeDetail"
            >
              <div class="order_info">
                <div v-for="item in viewData.FeeDetail.itemList" :key="item.itemId">
                  <h3>{{item.itemName}}</h3>
                  <div v-if="viewData.FeeDetail.orderType === 2">
                    <Row>
                      <Col span="10">短服务剩余次数: {{item.sResidualNum}}次</Col>
                      <Col span="10">长服务剩余次数: {{item.lResidualNum}}次</Col>
                    </Row>
                    <Row>
                      <Col span="10">每周服务次数: {{item.weekNum}}</Col>
                      <Col span="10">服务时间: 每周 {{item.serviceTime}}</Col>
                    </Row>
                    <!-- <h4 v-if="item.newServiceTime">新服务时间(下周生效): 每周 {{item.newServiceTime}}</h4> -->
                    <Row>
                      <Col span="10">项目开始时间: {{item.startDate}}</Col>
                      <Col span="10">项目结束时间: {{item.endDate}}</Col>
                    </Row>
                  </div>
                  <div v-if="viewData.FeeDetail.orderType === 3">
                    <Row>
                      <Col span="10">付费价格: {{item.price}}元</Col>
                      <Col span="10">增加次数: {{item.addNum}}次</Col>
                    </Row>
                  </div>
                </div>
              </div>
            </Modal>
          </Form>
          <Form-item style="padding-top: 10px;">
            <i-table
              border
              :columns="searchList.columns"
              :data="searchList.searchCondition.content"
            ></i-table>
            <Page
              style="padding-top: 10px"
              :total="searchList.searchCondition.total"
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
            title: '办公楼',
            align: 'center',
            key: 'buildingName'
          },
          {
            title: '详细楼层/地址',
            align: 'center',
            key: 'companyAddr'
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
            title: '订单状态',
            align: 'center',
            key: 'orderStatusChina'
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
                          this.showAccept(params.row)
                        }
                      }
                    },
                    '受理订单'
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
                          this.showRefuse(params.row)
                        }
                      }
                    },
                    '取消订单'
                  )
                )
              } else if (params.row.orderStatus === 2) {
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
                        type: 'error',
                        size: 'small'
                      },
                      on: {
                        click: () => {
                          this.showRefuse(params.row)
                        }
                      }
                    },
                    '取消订单'
                  )
                )
              } else if (params.row.orderStatus === -3) {
                arr.push(
                  h(
                    'Button',
                    {
                      props: {
                        type: 'error',
                        size: 'small',
                        ghost: true
                      },
                      on: {
                        click: () => {
                          this.showAudit(params.row)
                        }
                      }
                    },
                    '同意退出服务'
                  )
                )
              }
              if (params.row.orderStatus >= 3) {
                arr.push(
                  h(
                    'Button',
                    {
                      props: {
                        type: 'success',
                        size: 'small',
                        ghost: true
                      },
                      on: {
                        click: () => {
                          console.log(this)
                          this.showFee(params.row)
                        }
                      }
                    },
                    '缴费列表'
                  ),
                  h(
                    'Button',
                    {
                      props: {
                        type: 'primary',
                        size: 'small'
                      },
                      on: {
                        click: () => {
                          this.showYy(params.row)
                        }
                      }
                    },
                    '预约列表'
                  )
                )
              }
              return h('div', arr)
            }
          }
        ],
        columns1: [
          {
            title: '缴费Id',
            align: 'center',
            key: 'orderId'
          },
          {
            title: '缴费类型',
            align: 'center',
            key: 'orderTypeChina'
          },
          {
            title: '缴费状态',
            align: 'center',
            key: 'orderStatusChina'
          },
          {
            title: '购买月数',
            align: 'center',
            key: 'buyMonth',
            render (h, params) {
              return h(
                'span',
                params.row.orderType === 1 ? params.row.buyMonth : '非主服务'
              )
            }
          },
          {
            title: '赠送月数',
            align: 'center',
            key: 'giveMonth',
            render (h, params) {
              return h(
                'span',
                params.row.orderType === 1 ? params.row.giveMonth : '非主服务'
              )
            }
          },
          {
            title: '创建时间',
            align: 'center',
            key: 'createTime'
          },
          {
            title: '付款时间',
            align: 'center',
            key: 'payTime'
          },
          {
            title: '推荐员工',
            align: 'center',
            key: 'referrerId'
          },
          {
            title: '操作',
            align: 'center',
            key: 'action',
            width: 160,
            render: (h, params) => {
              const arr = []
              if (params.row.itemList) {
                arr.push(
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
                          this.showFeeDetail(params.row)
                        }
                      }
                    },
                    '项目详情'
                  )
                )
              }
              return arr
            }
          }
        ],
        columns2: [
          {
            title: '预约ID',
            align: 'center',
            key: 'id',
            width: 120
          },
          {
            title: '项目名称',
            align: 'center',
            key: 'itemName'
          },
          {
            title: '下单时间',
            align: 'center',
            key: 'createTime'
          },
          {
            title: '预约服务时间',
            align: 'center',
            key: 'yyDate'
          },
          {
            title: '备注',
            align: 'center',
            key: 'remark'
          },
          {
            title: '预约状态',
            align: 'center',
            key: 'statusChina'
          },
          {
            title: '操作',
            key: 'action',
            width: 200,
            align: 'center',
            render: (h, params) => {
              if (params.row.status === 0) {
                return h('div', [
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
                          this.showConfirmYy(params.row)
                        }
                      }
                    },
                    '完成'
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
                          this.showCancelYy(params.row)
                        }
                      }
                    },
                    '取消'
                  )
                ])
              }
            }
          }
        ],
        searchCondition: {
          page: 1,
          total: 0,
          content: []
        },
        searchCondition1: {
          page: 1,
          total: 0,
          content: []
        },
        searchCondition2: {
          page: 1,
          total: 0,
          content: []
        }
      },
      viewData: {
        id: '',
        Detail: { orderDetail: {}, itemList: [] },
        FeeDetail: { itemList: [] },
        Delete: {},
        Confirm: {},
        modalDelete: false,
        modalCancelYy: false,
        modalConfirmYy: false,
        modalAudit: false,
        modalDetail: false,
        modalFeeDetail: false,
        modalRefuse: false,
        modalPass: false,
        modalAccept: false,
        modalFee: false,
        modalYy: false,
        yyList: [
          {
            value: 0,
            label: '待执行'
          },
          {
            value: 1,
            label: '已完成'
          },
          {
            value: -1,
            label: '已取消'
          }
        ],
        statusList: [
          {
            value: 0,
            label: '待付款'
          },
          {
            value: 1,
            label: '待受理'
          },
          {
            value: 2,
            label: '待审核'
          },
          {
            value: 3,
            label: '进行中'
          },
          {
            value: 4,
            label: '待续费'
          },
          {
            value: 5,
            label: '已过期'
          },
          {
            value: -1,
            label: '不通过'
          },
          {
            value: -2,
            label: '退款中'
          },
          {
            value: -3,
            label: '服务退出中'
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
    onPageChange1 (pageNum) {
      this.searchList.searchCondition1.page = pageNum
      this.searchFee()
    },
    onPageChange2 (pageNum) {
      this.searchList.searchCondition2.page = pageNum
      this.searchYy()
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
    onAuditBtn () {
      if (![0, 1].includes(this.viewData.Confirm.isReturn)) {
        this.$Message.error('请选择是否退款')
        return false
      }
      axios
        .put(
          '/qsz_pf/demand_order/audit',
          qs.stringify({
            id: this.viewData.Confirm.id,
            isReturn: this.viewData.Confirm.isReturn
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
      // this.viewData.Detail = row
      this.viewData.id = row.id
      this.searchDetail()
    },
    showFeeDetail (row) {
      this.viewData.modalFeeDetail = true
      if (row.orderType === 2) {
        for (let i = 0; i < row.itemList.length; i++) {
          row.itemList[i].serviceTime = row.itemList[i].serviceTime.join(',')
        }
      }
      this.viewData.FeeDetail = row
    },
    showAccept (item) {
      this.viewData.Confirm = item
      this.viewData.modalAccept = true
    },
    showAudit (item) {
      this.viewData.Confirm = item
      this.viewData.modalAudit = true
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
    showFee (item) {
      this.viewData.id = item.id
      this.searchFee()
      this.viewData.modalFee = true
    },
    showYy (item) {
      this.viewData.id = item.id
      this.searchYy()
      this.viewData.modalYy = true
    },
    onAcceptBtn (status) {
      axios
        .put('/qsz_pf/demand_order/accept', {
          id: this.viewData.Confirm.id
        })
        .then((response) => {
          this.viewData.Confirm = {}
          this.$Message.success('操作成功!')
          this.searchManage()
        })
    },
    onPassBtn (status) {
      axios
        .put('/qsz_pf/demand_order/pass', {
          id: this.viewData.Confirm.id,
          areaSize: this.viewData.Confirm.areaSize
        })
        .then((response) => {
          this.viewData.Confirm = {}
          this.$Message.success('操作成功!')
          this.searchManage()
        })
    },
    onCancelBtn (status) {
      if (!this.viewData.Confirm.reason) {
        this.$Message.error('请输入取消原因')
        return false
      }
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
    showConfirmYy (item) {
      this.viewData.Confirm = item
      this.viewData.modalConfirmYy = true
    },
    onCancelYyBtn () {
      if (this.viewData.Confirm.reason !== '确认取消') {
        this.$Message.error('请输入"确认取消"四个字')
        return
      }
      axios
        .put('/qsz_pf/demand_order/cancel_short_item', {
          id: this.viewData.Confirm.id
        })
        .then((response) => {
          this.$Message.success('操作成功!')
          this.searchYy()
        })
    },
    onConfirmYyBtn () {
      axios
        .put('/qsz_pf/demand_order/done_short_item', {
          id: this.viewData.Confirm.id
        })
        .then((response) => {
          this.$Message.success('操作成功!')
          this.searchYy()
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
            companyName: this.searchList.searchCondition.companyName,
            orderStatus: this.searchList.searchCondition.orderStatus
          }
        })
        .then((res) => {
          this.$previewRefresh()
          this.searchList.searchCondition.content = res.data.data
          this.searchList.searchCondition.total = res.data.total
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
    },
    searchFee () {
      axios
        .get('/qsz_pf/demand_order/pay_fee_list', {
          params: {
            page: this.searchList.searchCondition1.page,
            id: this.viewData.id
          }
        })
        .then((res) => {
          this.searchList.searchCondition1.content = res.data.data
          this.searchList.searchCondition1.total = res.data.total
        })
    },
    searchYy () {
      axios
        .get('/qsz_pf/demand_order/yy_list_by_order', {
          params: {
            page: this.searchList.searchCondition2.page,
            status: this.searchList.searchCondition2.status,
            id: this.viewData.id
          }
        })
        .then((res) => {
          this.searchList.searchCondition2.content = res.data.data
          this.searchList.searchCondition2.total = res.data.total
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
