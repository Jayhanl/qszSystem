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
                v-model="searchList.searchCondition.orderCode"
                clearable
                placeholder="订单ID"
              ></Input>
              <Date-picker
                class="search_item"
                type="date"
                placeholder="预约日期"
                @on-change="
                  (datetime) => {
                    this.searchList.searchCondition.yyDate = datetime
                  }
                "
                v-model="searchList.searchCondition.yyDate"
              ></Date-picker>
              <Input
                class="search_item"
                type="text"
                v-model="searchList.searchCondition.contactMobile"
                clearable
                placeholder="联系电话"
              ></Input>
              <Select
                clearable
                placeholder="订单状态"
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
              <Select
                clearable
                placeholder="时间排序"
                @on-change="searchManage"
                v-model="searchList.searchCondition.order"
                class="search_item"
              >
                <Option value="yyDateDesc">预约日期从近到远</Option>
                <Option value="yyDateAsc">预约日期从远到近</Option>
              </Select>
              <input
                style="display: none"
                class="ImgC"
                type="file"
                merchantName="avatar"
                accept="image/gif, image/jpeg, image/jpg, image/png"
                @change="changeImage($event)"
                ref="avatarInput"
              />
            </Form-item>
            <Form-item>
              <Button style="margin-right: 10px" @click="searchPageReturn">
                <Icon size="18" type="ios-search" />
              </Button>
              <Button
                type="warning"
                style="margin-right: 10px"
                @click="showExcel"
                >导出Excel</Button
              >
            </Form-item>
            <Modal
              :mask-closable="false"
              title="导出excel"
              width="400"
              v-model="viewData.modalExcel"
              @on-ok="onExcel()"
            >
              <div>不选则默认今天</div>
              <Date-picker
                class="search_item"
                placeholder="开始日期"
                type="date"
                @on-change="
                  (datetime) => {
                    this.viewData.Confirm.startDate = datetime
                  }
                "
                v-model="viewData.Confirm.startDate"
              ></Date-picker>
              <Date-picker
                style="margin-top: 10px"
                class="search_item"
                type="date"
                placeholder="结束日期"
                @on-change="
                  (datetime) => {
                    this.viewData.Confirm.endDate = datetime
                  }
                "
                v-model="viewData.Confirm.endDate"
              ></Date-picker>
            </Modal>
            <Modal
              :mask-closable="false"
              width="400"
              :title="viewData.fileName"
              v-model="viewData.modalDown"
            >
              <a ref="file" :href="viewData.file" :download="viewData.fileName"
                >点此下载excel</a
              >
            </Modal>

            <Modal
              v-model="viewData.modalEdit"
              title="编辑订单"
              :mask-closable="false"
              @on-ok="onEditBtn"
              width="35"
              @on-cancel="onModelCancel"
            >
              <Form :label-width="80">
                <Form-item class="form_item" label="联系人:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Edit.contactName"
                    type="text"
                    :maxlength="20"
                    placeholder="联系人"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="联系电话:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Edit.contactMobile"
                    type="text"
                    :maxlength="11"
                    placeholder="联系电话"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="订单价格:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Edit.orderPrice"
                    type="text"
                    :maxlength="20"
                    placeholder="订单价格"
                  ></Input>
                </Form-item>
                <!-- <Form-item class="form_item" label="服务时长:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Edit.serviceNum"
                    type="text"
                    :maxlength="20"
                    placeholder="服务时长"
                  ></Input>
                </Form-item> -->
                <Form-item class="form_item" label="预约日期:">
                  <Date-picker
                    style="width: 200px"
                    type="date"
                    placeholder="预约日期"
                    @on-change="
                      (datetime) => {
                        this.viewData.Edit.yyDate = datetime
                      }
                    "
                    v-model="viewData.Edit.yyDate"
                  ></Date-picker>
                </Form-item>
                <Form-item class="form_item" label="预约时间:">
                  <InputNumber
                    :max="20"
                    :min="9"
                    v-model="viewData.Edit.yyTime"
                  ></InputNumber>
                </Form-item>
                <Form-item class="form_item" label="选择社区:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Sq.name"
                    disabled
                    placeholder="请选择社区"
                  ></Input>
                  <Button
                    type="success"
                    style="margin-left: 10px"
                    @click="showSq"
                    >选择</Button
                  >
                </Form-item>
                <Form-item class="form_item" label="楼层单元:">
                  <Input
                    style="width: 300px"
                    v-model="viewData.Edit.addr"
                    type="textarea"
                    :rows="2"
                    :maxlength="200"
                    placeholder="请填写所在小区的楼层单元"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="订单备注:">
                  <Input
                    style="width: 300px"
                    v-model="viewData.Edit.orderExplain"
                    type="textarea"
                    :rows="4"
                    :maxlength="500"
                    placeholder="订单备注"
                  ></Input>
                </Form-item>
              </Form>
            </Modal>
            <Modal
              :mask-closable="false"
              title="选择社区"
              width="60"
              v-model="viewData.modalSq"
            >
              <Select
                clearable
                class="search_item"
                v-model="searchList.searchCondition2.province"
                placeholder="请选择省份"
                @on-change="changeProvince"
              >
                <Option
                  v-for="item in provinceArr"
                  :key="item.value"
                  :value="item.label"
                  >{{ item.label }}</Option
                >
              </Select>
              <Select
                clearable
                class="search_item"
                v-model="searchList.searchCondition2.city"
                placeholder="请选择城市"
                @on-change="changeCity"
              >
                <Option
                  v-for="item in citiesArr"
                  :key="item.value"
                  :value="item.label"
                  >{{ item.label }}</Option
                >
              </Select>
              <Select
                clearable
                class="search_item"
                v-model="searchList.searchCondition2.county"
                placeholder="请选择区县"
                @on-change="searchPageReturn2"
              >
                <Option
                  v-for="item in countyArr"
                  :key="item.value"
                  :value="item.label"
                  >{{ item.label }}</Option
                >
              </Select>
              <Button style="margin-right: 10px" @click="searchPageReturn2">
                <Icon size="20" type="ios-search" />
              </Button>
              <i-table
                border
                :columns="searchList.columns2"
                :data="searchList.pageData2.content"
              ></i-table>
              <Page
                style="padding-top: 10px"
                :total="searchList.pageData2.total"
                :current="searchList.searchCondition2.page"
                :page-size="10"
                @on-change="onPageChange2"
                size="small"
                show-total
              ></Page>
            </Modal>
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
                  <span style="color: red; font-size: 22px">取消</span> 订单id：
                  <span style="color: red; font-size: 22px">{{
                    viewData.Confirm.orderCode
                  }}</span>
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
              title="受理确认"
              width="400"
              v-model="viewData.modalTogo"
              @on-ok="onTogo()"
            >
              确认受理订单id：
              <span style="color: red">{{ viewData.Confirm.orderCode }}</span>
              吗？
            </Modal>
            <Modal
              :mask-closable="false"
              title="完成确认"
              width="400"
              v-model="viewData.modalPass"
              @on-ok="onDone()"
            >
              确认已完成订单id：
              <span style="color: red">{{ viewData.Confirm.orderCode }}</span>
              吗？
            </Modal>
            <Modal
              :mask-closable="false"
              width="400"
              v-model="viewData.modalDelete"
              @on-ok="onDeleteBtn"
            >
              确认删除订单id为：
              <span style="color: red">{{ viewData.Delete.orderCode }}</span>
              的订单吗？
            </Modal>
            <Modal
              title="查看订单信息详情"
              width="55"
              :styles="{ top: '70px' }"
              v-model="viewData.modalDetail"
            >
              <div class="order_info">
                <h3>订单信息</h3>
                <Row>
                  <Col span="10">订单id: {{ viewData.Detail.orderCode }}</Col>
                  <Col span="10"
                    >订单状态: {{ viewData.Detail.statusChina }}</Col
                  >
                </Row>
                <Row>
                  <Col span="10"
                    >创建时间: {{ viewData.Detail.createTime }}</Col
                  >
                  <Col span="10"
                    >下单时间:
                    {{
                      viewData.Detail.userId === 0
                        ? '后台创建订单'
                        : viewData.Detail.payTime
                    }}</Col
                  >
                </Row>
                <h3>服务信息</h3>
                <Row>
                  <Col span="10"
                    >客户姓名: {{ viewData.Detail.contactName }}</Col
                  >
                  <Col span="10"
                    >联系电话: {{ viewData.Detail.contactMobile }}</Col
                  >
                </Row>
                <Row>
                  <Col span="10">客户Id: {{ viewData.Detail.userId }}</Col>
                </Row>
                <h4>详细地址: {{ viewData.Detail.contactAddr }}</h4>
                <h4>订单备注: {{ viewData.Detail.orderExplain }}</h4>
                <Row
                  v-for="item in viewData.Detail.serviceList"
                  :key="item.serviceId"
                >
                  <Col span="10">服务名: {{ item.serviceName }}</Col>
                  <Col span="10"
                    >单位: {{ item.num ? item.num + item.unit : '不限时' }}</Col
                  >
                </Row>
                <Row>
                  <Col span="10">预约日期: {{ viewData.Detail.yyDate }}</Col>
                  <Col span="10">预约时间: {{ viewData.Detail.yyTime }} 点</Col>
                </Row>
              </div>
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
import city from '@/libs/city'

export default {
  data () {
    return {
      provinceArr: city,
      citiesArr: [],
      countyArr: [],
      citiesArr1: [],
      countyArr1: [],
      searchList: {
        carList: [],
        categoryList: [],
        columns: [
          {
            title: '订单Id',
            align: 'center',
            key: 'orderCode'
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
            title: '服务',
            align: 'center',
            key: 'serviceItem'
          },
          {
            title: '预约日期',
            align: 'center',
            key: 'yyDate'
          },
          {
            title: '预约时间',
            align: 'center',
            key: 'yyTime'
          },
          {
            title: '订单价格',
            align: 'center',
            key: 'orderPrice',
            render (h, params) {
              return h('span', params.row.orderPrice + '元')
            }
          },
          {
            title: '订单状态',
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
            width: 180,
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
                //   h(
                //     'Button',
                //     {
                //       props: {
                //         type: 'primary',
                //         size: 'small'
                //       },
                //       on: {
                //         click: () => {
                //           this.showEdit(params.row)
                //         }
                //       }
                //     },
                //     '编辑'
                //   )
              ]
              if (params.row.status === 0) {
                arr.push(
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
                    '取消'
                  )
                )
              } else if (params.row.status === 1) {
                arr.push(
                  h(
                    'Button',
                    {
                      props: {
                        type: 'warning',
                        size: 'small'
                      },
                      on: {
                        click: () => {
                          this.showTogo(params.row)
                        }
                      }
                    },
                    '受理'
                  )
                )
              } else if (params.row.status === 2) {
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
                    '完成'
                  )
                )
              }
              return h('div', arr)
            }
          }
        ],
        columns2: [
          {
            title: '社区Id',
            align: 'center',
            key: 'id'
          },
          {
            title: '社区名',
            align: 'center',
            key: 'name'
          },
          {
            title: '省份',
            align: 'center',
            key: 'province'
          },
          {
            title: '城市',
            align: 'center',
            key: 'city'
          },
          {
            title: '县区',
            align: 'center',
            key: 'county'
          },
          {
            title: '经度',
            align: 'center',
            key: 'lat'
          },
          {
            title: '纬度',
            align: 'center',
            key: 'lng'
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
                      type: 'success',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.onSq(params.row)
                      }
                    }
                  },
                  '选择'
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
          totalPages: 0
        },
        searchCondition: {
          page: 1,
          size: 5,
          role: 4
        },
        pageData1: {
          content: [],
          pageNum: 1,
          numberOfElements: 0,
          total: 0,
          totalPages: 0
        },
        searchCondition1: {
          page: 1,
          size: 5,
          isFree: 1
        },
        pageData2: {
          content: [],
          pageNum: 1,
          numberOfElements: 0,
          total: 0,
          totalPages: 0
        },
        searchCondition2: {
          page: 1,
          size: 5
        },
        pageSizeOpts: [1, 5, 10, 20, 30, 40]
      },
      viewData: {
        file: '',
        fileName: '',
        dateNow: '',
        goodsIId: '',
        Detail: '',
        Employee: {},
        Delete: {},
        Confirm: {},
        Dispatch: {},
        Add: {},
        Edit: {},
        Sq: {},
        modalAdd: false,
        modalCancel: false,
        modalCancelEmp: false,
        modalSq: false,
        modalDelete: false,
        modalDetail: false,
        modalEdit: false,
        modalEmployee: false,
        modalDispatch: false,
        modalDispatch1: false,
        modalRefuse: false,
        modalExcel: false,
        modalDown: false,
        modalPass: false,
        modalTogo: false,
        modalArrive: false,
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
            label: '待完成'
          },
          {
            value: 3,
            label: '已完成'
          },
          {
            value: -1,
            label: '已取消'
          },
          {
            value: -2,
            label: '退款中'
          }
        ],
        statusList1: [
          {
            value: 0,
            label: '工作中'
          },
          {
            value: 1,
            label: '空闲中'
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
    onPageChange (pageNum) {
      this.searchList.searchCondition.page = pageNum
      this.searchManage()
    },
    onPageChange1 (pageNum) {
      this.searchList.searchCondition1.page = pageNum
      this.searchManage1()
    },
    onPageChange2 (pageNum) {
      this.searchList.searchCondition2.page = pageNum
      this.searchSq()
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
          '/qsz_pf/order/cancel',
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
    onSq (row) {
      this.viewData.Sq = row
      this.viewData.modalSq = false
    },
    onEditBtn () {
      const sq = this.viewData.Sq
      this.$Message.warning('上传中，请稍后...')
      axios
        .put(
          '/qsz_pf/order/update',
          qs.stringify({
            id: this.viewData.Edit.id,
            // serviceNum: this.viewData.Edit.serviceNum,
            contactName: this.viewData.Edit.contactName,
            contactMobile: this.viewData.Edit.contactMobile,
            contactAddr:
              sq.province +
              ',' +
              sq.city +
              ',' +
              sq.county +
              ',' +
              sq.name +
              ',' +
              this.viewData.Edit.addr,
            lat: sq.lat,
            lng: sq.lng,
            yyDate: this.formatTime(this.viewData.Edit.yyDate, 'year'),
            yyTime: this.viewData.Edit.yyTime,
            orderPrice: this.viewData.Edit.orderPrice,
            orderExplain: this.viewData.Edit.orderExplain
          })
        )
        .then((response) => {
          this.viewData.Sq = {}
          this.viewData.Edit = {}
          this.searchManage()
          this.$Message.success('编辑成功!')
        })
    },
    onTogo (status) {
      axios
        .put(
          '/qsz_pf/order/accept',
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
    onArrive (status) {
      axios
        .put(
          '/qsz_pf/order/arrive',
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
    onDone (status) {
      axios
        .put(
          '/qsz_pf/order/done',
          qs.stringify({
            id: this.viewData.Confirm.id,
            recycleGoods: ''
          })
        )
        .then((response) => {
          this.viewData.Confirm = {}
          this.$Message.success('操作成功!')
          this.searchManage()
        })
    },
    onExcel () {
      const startDate = this.viewData.Confirm.startDate || this.viewData.dateNow
      const endDate = this.viewData.Confirm.endDate || this.viewData.dateNow
      axios
        .post(
          '/qsz_pf/order/download_excel',
          qs.stringify({
            startDate: startDate,
            endDate: endDate
          })
        )
        .then((res) => {
          this.viewData.file =
            'data:application/vnd.ms-excel;base64,' + res.data.file
          this.viewData.fileName = `${startDate}至${endDate}的订单列表`
          this.viewData.modalDown = true
          // this.viewData.modalExcel = false
        })
    },
    onModelCancel () {
      this.searchManage()
    },
    showDetail (row) {
      this.viewData.modalDetail = true
      this.viewData.Detail = row
      this.viewData.id = row.id
      this.searchDetail()
    },
    showEdit (row) {
      this.viewData.modalEdit = true
      this.viewData.Edit = row
      const addr = row.contactAddr.split(',')
      this.viewData.Sq = {
        province: addr[0],
        city: addr[1],
        county: addr[2],
        name: addr[3],
        lat: row.lat,
        lng: row.lng
      }
      this.viewData.Edit.addr = addr[4]
    },
    showCancel (row) {
      this.viewData.Confirm = row
      this.viewData.modalCancelEmp = true
    },
    showSq (row) {
      this.viewData.modalSq = true
      this.viewData.id = row.id
      this.searchSq()
    },
    showEmployee () {
      this.viewData.modalEmployee = true
      this.searchDetailE()
    },
    showAdd (item) {
      this.viewData.Confirm = item
      this.viewData.modalAdd = true
    },
    showPass (item) {
      this.viewData.Confirm = item
      this.viewData.modalPass = true
    },
    showTogo (item) {
      this.viewData.Confirm = item
      this.viewData.modalTogo = true
    },
    showArrive (item) {
      this.viewData.Confirm = item
      this.viewData.modalArrive = true
    },
    showDispatch (item) {
      this.viewData.Dispatch = item
      this.searchManage1()
      this.viewData.modalDispatch = true
    },
    showDispatch1 (item) {
      this.viewData.Confirm = item
      this.searchManage1()
      this.viewData.modalDispatch1 = true
    },
    showRefuse (item) {
      this.viewData.Confirm = item
      this.viewData.modalRefuse = true
    },
    showExcel (item) {
      const date = new Date()
      this.viewData.dateNow =
        date.getFullYear() +
        '-' +
        ((date.getMonth() + 1).toString().length === 1 ? '0' : '') +
        (date.getMonth() + 1) +
        '-' +
        date.getDate()
      console.log(this.viewData.dateNow)
      this.viewData.Confirm = {}
      this.viewData.modalExcel = true
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
    searchPageReturn1 () {
      this.searchList.searchCondition1.page = 1
      this.searchManage1()
      this.$Message.success('搜索完成!')
    },
    searchPageReturn2 () {
      this.searchList.searchCondition2.page = 1
      this.searchSq()
      this.$Message.success('搜索完成!')
    },
    searchManage () {
      axios
        .get('/qsz_pf/order/list', {
          params: {
            page: this.searchList.searchCondition.page,
            orderCode: this.searchList.searchCondition.orderCode,
            contactMobile: this.searchList.searchCondition.contactMobile,
            yyDate: this.searchList.searchCondition.yyDate,
            order: this.searchList.searchCondition.order,
            status: this.searchList.searchCondition.status
          }
        })
        .then((res) => {
          this.searchList.pageData.content = res.data.data
          this.searchList.pageData.total = res.data.total
        })
    },
    searchSq () {
      axios
        .get('/qsz_pf/housing/list', {
          params: {
            page: this.searchList.searchCondition2.page,
            province: this.searchList.searchCondition2.province || '广东省',
            city: this.searchList.searchCondition2.city || '广州市',
            county: this.searchList.searchCondition2.county || '海珠区'
          }
        })
        .then((response) => {
          this.searchList.pageData2.content = response.data.data
          this.searchList.pageData2.total = response.data.total
        })
    },
    searchDetail () {
      axios
        .get('/qsz_pf/order/detail', {
          params: {
            id: this.viewData.id
          }
        })
        .then((res) => {
          this.viewData.Detail = res.data
          this.$previewRefresh()
        })
    },
    searchDetailE () {
      axios
        .get('/qsz_pf/employee/detail', {
          params: {
            id: this.viewData.Detail.employeeId
          }
        })
        .then((res) => {
          this.viewData.Employee = res.data
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
