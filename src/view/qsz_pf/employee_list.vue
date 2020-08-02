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
                v-model="searchList.searchCondition.name"
                clearable
                placeholder="姓名"
              ></Input>
              <Input
                class="search_item"
                type="text"
                v-model="searchList.searchCondition.account"
                clearable
                placeholder="账号(手机)"
              ></Input>
              <Select
                clearable
                placeholder="员工状态"
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
                placeholder="员工身份"
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
              <Select
                clearable
                placeholder="派单模式"
                @on-change="searchManage"
                v-model="searchList.searchCondition.orderModel"
                class="search_item"
              >
                <Option
                  v-for="item in viewData.pdList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </Form-item>
            <Form-item>
              <Button style="margin-right:10px" @click="searchPageReturn">
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
                  确认拒绝用户id：
                  <span style="color:red">{{viewData.Confirm.id}}</span>
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
              确认通过用户id：
              <span style="color:red">{{viewData.Confirm.id}}</span>
              的审核吗？
            </Modal>

            <Modal
              :mask-closable="false"
              :title="viewData.Detail.name+'的考勤记录'"
              width="60"
              v-model="viewData.modalChecking"
              @on-ok="searchChecking()"
            >
              <Form>
                <Form-item>
                  <Date-picker
                    class="search_item"
                    type="date"
                    placeholder="查询日期"
                    @on-change="(datetime) =>{ this.searchList.searchCondition1.date = datetime}"
                    v-model="searchList.searchCondition.date"
                  ></Date-picker>
                  <Button style="margin-right:10px" @click="searchPageReturn1">
                    <Icon size="18" type="ios-search" />
                  </Button>
                </Form-item>
                <Form-item style="padding-top: 10px;">
                  <i-table
                    border
                    :columns="searchList.columns1"
                    :data="searchList.pageData1.content"
                  ></i-table>
                  <Page
                    style="padding-top: 10px"
                    :total="searchList.pageData1.total"
                    :current="searchList.searchCondition1.page"
                    :page-size="10"
                    @on-change="onPageChange1"
                    size="small"
                    show-total
                  ></Page>
                </Form-item>
              </Form>
            </Modal>

            <Modal
              title="查看用户信息详情"
              width="55"
              :styles="{top: '70px'}"
              v-model="viewData.modalDetail"
            >
              <div class="order_info">
                <h3>用户信息</h3>
                <Row>
                  <Col span="10">用户id: {{viewData.Detail.id}}</Col>
                  <Col span="10">身份: {{viewData.Detail.roleChina}}</Col>
                </Row>
                <Row>
                  <Col span="10">姓名: {{viewData.Detail.name}}</Col>
                  <Col span="10">账号(电话): {{viewData.Detail.account}}</Col>
                </Row>
                <Row>
                  <Col span="10">性别: {{viewData.Detail.idcGender}}</Col>
                  <Col span="10">身份证号: {{viewData.Detail.idcValidDate}}</Col>
                </Row>
                <h4>身份证地址: {{viewData.Detail.idcAddr}}</h4></h4>
                <Row>
                  <Col span="10">审核状态: {{viewData.Detail.statusChina}}</Col>
                  <Col span="10">接单模式: {{viewData.Detail.orderModelChina}}</Col>
                </Row>
                <Row>
                  <Col span="10">加入时间: {{viewData.Detail.createTime}}</Col>
                  <Col span="10">邀请码: {{viewData.Detail.empInvCode}}</Col>
                </Row>
                <Row v-if="viewData.Detail.role===2">
                  <Col span="10">合伙人期限: {{viewData.Detail.payRentDate}}</Col>
                </Row>
                <h3>钱包信息</h3>
                <Row>
                  <Col span="10">推广收入: {{viewData.Detail.awardTotal}}元</Col>
                  <Col span="10">订单总收入: {{viewData.Detail.earningTotal}}元</Col>
                </Row>
                <Row>
                  <Col span="10">余额: {{viewData.Detail.balance}}元</Col>
                  <Col span="10">可提现金额: {{viewData.Detail.desirableBalance}}元</Col>
                </Row>
                <h3>身份证照片</h3>
                <Row>
                  <Col span="4">身份证人像面</Col>
                  <Col span="18">
                    <img
                      :src="viewData.Detail.idcFront"
                      class="img_item"
                      preview="0"
                      preview-text="身份证人像面"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span="4">身份证国徽面</Col>
                  <Col span="18">
                    <img
                      :src="viewData.Detail.idcBack"
                      class="img_item"
                      preview="1"
                      preview-text="身份证国徽面"
                    />
                  </Col>
                </Row>
              </div>
            </Modal>
            <Modal
              :mask-closable="false"
              width="400"
              v-model="viewData.modalDelete"
              @on-ok="onDeleteBtn"
            >
              确认删除id为：
              <span style="color:red">{{viewData.Delete.id}}</span>
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
            title: '员工编号',
            align: 'center',
            key: 'id'
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
            title: '总收入',
            align: 'center',
            key: 'earningTotal'
          },
          {
            title: '可提现金额',
            align: 'center',
            key: 'desirableBalance'
          },
          {
            title: '邀请码',
            align: 'center',
            key: 'empInvCode'
          },
          {
            title: '状态',
            align: 'center',
            key: 'statusChina'
          },
          {
            title: '身份',
            align: 'center',
            key: 'roleChina'
          },
          {
            title: '派单模式',
            align: 'center',
            key: 'orderModelChina'
          },
          {
            title: '操作',
            key: 'action',
            width: 200,
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
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '15px'
                    },
                    on: {
                      click: () => {
                        this.showChecking(params.row)
                      }
                    }
                  },
                  '考勤'
                )
              ]
              if (params.row.status === 1) {
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
              } else
              if (params.row.status === -1) {
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
                  )
                )
              }
              return h('div', arr)
            }
          }
        ],
        columns1: [
          {
            title: '打卡温度',
            align: 'center',
            key: 'bodyTemp',
            render: (h, params) => {
              return h('span', params.row.bodyTemp + '°')
            }
          },
          {
            title: '身体状况',
            align: 'center',
            key: 'bodyStatus'
          },
          {
            title: '是否已阅承诺书',
            align: 'center',
            key: 'isAgree',
            render: (h, params) => {
              return h('span', params.row.isAgree ? '已阅并同意' : '未阅读')
            }
          },
          {
            title: '上班时间',
            align: 'center',
            key: 'startTime'
          },
          {
            title: '下班时间',
            align: 'center',
            key: 'endTime',
            render: (h, params) => {
              return h('span', params.row.endTime || '上班中')
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
        modalChecking: false,
        modalDelete: false,
        modalDetail: false,
        modalRefuse: false,
        modalPass: false,
        Confirm: {},
        Detail: {},
        Delete: {},
        roleList: [
          {
            value: 0,
            label: '未注册'
          },
          {
            value: 1,
            label: '公司员工'
          },
          {
            value: 2,
            label: '合伙人'
          }
        ],
        statusList: [
          {
            value: 0,
            label: '未注册'
          },
          {
            value: 1,
            label: '待审核'
          },
          {
            value: 2,
            label: '正常'
          },
          {
            value: -1,
            label: '审核不通过'
          }
        ],
        pdList: [
          {
            value: 1,
            label: '接收派单'
          },
          {
            value: 2,
            label: '直接受强制派单'
          },
          {
            value: 3,
            label: '不接受派单'
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
        .delete('/qsz_pf/employee/delete', {
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
        .put('/qsz_pf/employee/audit', {
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
    searchPageReturn1 () {
      this.searchList.searchCondition1.page = 1
      this.searchChecking()
      this.$Message.success('搜索完成!')
    },
    onPageChange (pageNum) {
      this.searchList.searchCondition.page = pageNum
      this.searchManage()
    },
    onPageChange1 (pageNum) {
      this.searchList.searchCondition1.page = pageNum
      this.searchChecking()
    },
    searchManage () {
      axios
        .get('/qsz_pf/employee/list', {
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
    searchChecking () {
      axios
        .get('/qsz_pf/employee/clock_log', {
          params: {
            page: this.searchList.searchCondition1.page,
            id: this.viewData.id,
            date: this.searchList.searchCondition1.date
          }
        })
        .then((res) => {
          this.searchList.pageData1.content = res.data.data
          this.searchList.pageData1.total = res.data.total
        })
    },
    searchDetail () {
      axios
        .get('/qsz_pf/employee/detail', {
          params: {
            id: this.viewData.id
          }
        })
        .then((res) => {
          this.viewData.Detail = res.data
          this.$previewRefresh()
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
