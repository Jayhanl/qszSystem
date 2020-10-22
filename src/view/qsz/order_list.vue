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
                v-model="searchList.searchCondition.orderStatus"
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
              <Select
                clearable
                placeholder="是否使用优惠券"
                @on-change="searchManage"
                v-model="searchList.searchCondition.discountType"
                class="search_item"
              >
                <Option
                  v-for="item in viewData.yhqList"
                  :value="item.value"
                  :key="item.value"
                  >{{ item.label }}</Option
                >
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
              <Button type="success" style="margin-right: 10px" @click="showAdd"
                >创建订单</Button
              >
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
              v-model="viewData.modalAdd"
              title="创建订单"
              :mask-closable="false"
              @on-ok="onAddBtn"
              width="35"
              @on-cancel="onModelCancel"
            >
              <Form :label-width="80">
                <Form-item class="form_item" label="联系人:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Add.contactName"
                    type="text"
                    :maxlength="20"
                    placeholder="联系人"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="联系电话:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Add.contactMobile"
                    type="text"
                    :maxlength="11"
                    placeholder="联系电话"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="订单价格:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Add.orderPrice"
                    type="text"
                    :maxlength="20"
                    placeholder="订单价格"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="服务时长:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Add.serviceNum"
                    type="text"
                    :maxlength="20"
                    placeholder="服务时长"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="预约日期:">
                  <Date-picker
                    style="width: 200px"
                    type="date"
                    placeholder="预约日期"
                    @on-change="
                      (datetime) => {
                        this.viewData.Add.yyDate = datetime
                      }
                    "
                    v-model="viewData.Add.yyDate"
                  ></Date-picker>
                </Form-item>
                <Form-item class="form_item" label="预约时间:">
                  <InputNumber
                    :max="20"
                    :min="9"
                    v-model="viewData.Add.yyTime"
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
                    v-model="viewData.Add.addr"
                    type="textarea"
                    :rows="2"
                    :maxlength="200"
                    placeholder="请填写所在小区的楼层单元"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="订单备注:">
                  <Input
                    style="width: 300px"
                    v-model="viewData.Add.orderExplain"
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
                @on-change="searchManage2"
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
              title="修改订单备注"
              width="500"
              v-model="viewData.modalRemark"
              @on-ok="onRemark()"
            >
              <Form :label-width="80">
                <Form-item class="form_item" label="订单备注:">
                  <Input
                    style="width: 300px"
                    v-model="viewData.Confirm.orderExplain"
                    type="textarea"
                    :row="4"
                    :maxlength="500"
                    placeholder="请输入订单备注"
                  ></Input>
                </Form-item>
              </Form>
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
                    viewData.Confirm.orderId
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
              title="上门确认"
              width="400"
              v-model="viewData.modalTogo"
              @on-ok="onTogo()"
            >
              确认订单id：
              <span style="color: red">{{ viewData.Confirm.orderId }}</span>
              已上门吗？
            </Modal>
            <Modal
              :mask-closable="false"
              title="到达确认"
              width="400"
              v-model="viewData.modalArrive"
              @on-ok="onArrive()"
            >
              确认订单id：
              <span style="color: red">{{ viewData.Confirm.orderId }}</span>
              已到达吗？
            </Modal>
            <Modal
              :mask-closable="false"
              title="完成确认"
              width="400"
              v-model="viewData.modalPass"
              @on-ok="onDone()"
            >
              确认已完成订单id：
              <span style="color: red">{{ viewData.Confirm.orderId }}</span>
              吗？
            </Modal>
            <Modal
              :mask-closable="false"
              title="派遣订单确认"
              width="400"
              v-model="viewData.modalDispatch1"
              @on-ok="onDispatch()"
            >
              确认派遣订单给员工：
              <span style="color: red">{{ viewData.Confirm.name }}</span>
              吗？
            </Modal>
            <Modal
              :mask-closable="false"
              :title="'订单：' + viewData.Dispatch.orderId + '派遣'"
              width="60"
              v-model="viewData.modalDispatch"
            >
              <Form>
                <Form-item>
                  <Input
                    class="search_item"
                    type="text"
                    v-model="searchList.searchCondition1.name"
                    clearable
                    placeholder="姓名"
                  ></Input>
                  <Select
                    clearable
                    placeholder="是否空闲"
                    @on-change="searchManage"
                    v-model="searchList.searchCondition1.isFree"
                    class="search_item"
                  >
                    <Option
                      v-for="item in viewData.statusList1"
                      :value="item.value"
                      :key="item.value"
                      >{{ item.label }}</Option
                    >
                  </Select>
                  <Select
                    clearable
                    placeholder="员工身份"
                    @on-change="searchManage"
                    v-model="searchList.searchCondition1.role"
                    class="search_item"
                  >
                    <Option
                      v-for="item in viewData.roleList"
                      :value="item.value"
                      :key="item.value"
                      >{{ item.label }}</Option
                    >
                  </Select>
                  <Select
                    clearable
                    placeholder="派单模式"
                    @on-change="searchManage"
                    v-model="searchList.searchCondition1.orderModel"
                    class="search_item"
                  >
                    <Option
                      v-for="item in viewData.pdList"
                      :value="item.value"
                      :key="item.value"
                      >{{ item.label }}</Option
                    >
                  </Select>
                  <Button style="margin-right: 10px" @click="searchPageReturn1">
                    <Icon size="18" type="ios-search" />
                  </Button>
                </Form-item>
                <Form-item style="padding-top: 10px">
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
              :mask-closable="false"
              width="400"
              v-model="viewData.modalDelete"
              @on-ok="onDeleteBtn"
            >
              确认删除订单id为：
              <span style="color: red">{{ viewData.Delete.orderId }}</span>
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
                  <Col span="10">订单id: {{ viewData.Detail.orderId }}</Col>
                  <Col span="10"
                    >订单状态: {{ viewData.Detail.orderStatusChina }}</Col
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
                  <Col span="10"
                    >优惠券: {{ viewData.Detail.discountTypeChina }}</Col
                  >
                </Row>
                <h4>详细地址: {{ viewData.Detail.contactAddr }}</h4>
                <h4>订单备注: {{ viewData.Detail.orderExplain }}</h4>
                <Row
                  v-for="item in viewData.Detail.serviceList"
                  :key="item.serviceId"
                >
                  <Col span="10">服务名: {{ item.serviceName }}</Col>
                  <Col span="10">单位: {{ item.num? item.num + item.unit : '不限时'}}</Col>
                </Row>
                <Row>
                  <Col span="10">预约日期: {{ viewData.Detail.yyDate }}</Col>
                  <Col span="10">预约时间: {{ viewData.Detail.yyTime }} 点</Col>
                </Row>
                <div
                  v-if="
                    viewData.Detail.employeeId !== 0 &&
                    viewData.Detail.orderStatus !== 0 &&
                    viewData.Detail.orderStatus !== 1
                  "
                >
                  <h3>
                    员工信息
                    <Button
                      style="margin-left: 10px"
                      type="primary"
                      @click="showEmployee"
                      >员工详情</Button
                    >
                  </h3>
                  <Row>
                    <Col span="10"
                      >员工编号: {{ viewData.Detail.employeeId }}</Col
                    >
                    <Col span="10">员工姓名: {{ viewData.Detail.name }}</Col>
                  </Row>
                  <h3>员工上传照片</h3>
                  <Row>
                    <Col span="4">订单到达照片</Col>
                    <Col span="18">
                      <img
                        :src="viewData.Detail.arriveImg"
                        class="img_item"
                        preview="0"
                        preview-text="订单到达照片"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col span="4">订单完成照片</Col>
                    <Col span="18">
                      <img
                        :src="viewData.Detail.doneImg"
                        class="img_item"
                        preview="1"
                        preview-text="订单完成照片"
                      />
                    </Col>
                  </Row>
                </div>
              </div>
            </Modal>
            <Modal
              title="查看员工信息详情"
              width="55"
              :styles="{ top: '70px' }"
              v-model="viewData.modalEmployee"
            >
              <div class="order_info">
                <h3>用户信息</h3>
                <Row>
                  <Col span="10">用户id: {{ viewData.Employee.id }}</Col>
                  <Col span="10">身份: {{ viewData.Employee.roleChina }}</Col>
                </Row>
                <Row>
                  <Col span="10">姓名: {{ viewData.Employee.name }}</Col>
                  <Col span="10"
                    >账号(电话): {{ viewData.Employee.account }}</Col
                  >
                </Row>
                <Row>
                  <Col span="10">性别: {{ viewData.Employee.idcGender }}</Col>
                  <Col span="10">身份证号: {{ viewData.Employee.idcId }}</Col>
                </Row>
                <h4>身份证地址: {{ viewData.Employee.idcAddr }}</h4>
                <Row>
                  <Col span="10"
                    >审核状态: {{ viewData.Employee.statusChina }}</Col
                  >
                  <Col span="10"
                    >接单模式: {{ viewData.Employee.orderModelChina }}</Col
                  >
                </Row>
                <Row>
                  <Col span="10"
                    >加入时间: {{ viewData.Employee.createTime }}</Col
                  >
                  <Col span="10"
                    >邀请码: {{ viewData.Employee.empInvCode }}</Col
                  >
                </Row>
                <Row v-if="viewData.Employee.role === 2">
                  <Col span="10"
                    >合伙人期限: {{ viewData.Employee.payRentDate }}</Col
                  >
                </Row>
                <h3>钱包信息</h3>
                <Row>
                  <Col span="10"
                    >推广收入: {{ viewData.Employee.awardTotal }}元</Col
                  >
                  <Col span="10"
                    >订单总收入: {{ viewData.Employee.earningTotal }}元</Col
                  >
                </Row>
                <Row>
                  <Col span="10">余额: {{ viewData.Employee.balance }}元</Col>
                  <Col span="10"
                    >可提现金额: {{ viewData.Employee.desirableBalance }}元</Col
                  >
                </Row>
                <div v-if="viewData.Employee.isMainland">
                  <h3>身份证照片</h3>
                  <Row>
                    <Col span="4">身份证人像面</Col>
                    <Col span="18">
                      <img
                        :src="viewData.Employee.idcFront"
                        class="img_item"
                        preview="3"
                        preview-text="身份证人像面"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col span="4">身份证国徽面</Col>
                    <Col span="18">
                      <img
                        :src="viewData.Employee.idcBack"
                        class="img_item"
                        preview="4"
                        preview-text="身份证国徽面"
                      />
                    </Col>
                  </Row>
                </div>
                <div v-else-if="viewData.Employee.selfie">
                  <Row>
                    <Col span="4">本人真实照片</Col>
                    <Col span="18">
                      <img
                        :src="viewData.Employee.selfie"
                        class="img_item"
                        preview="5"
                        preview-text="本人真实照片"
                      />
                    </Col>
                  </Row>
                </div>
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
            key: 'orderId'
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
            title: '优惠券',
            align: 'center',
            key: 'discountTypeChina'
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
                    on: {
                      click: () => {
                        this.showRemark(params.row)
                      }
                    }
                  },
                  '修改备注'
                )
              ]
              if (params.row.orderStatus === 0) {
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
              }
              if (params.row.orderStatus === 1) {
                arr.push(
                  h(
                    'Button',
                    {
                      props: {
                        type: 'warning',
                        size: 'small'
                      },
                      style: {
                        marginRight: '15px'
                      },
                      on: {
                        click: () => {
                          this.showDispatch(params.row)
                        }
                      }
                    },
                    '派遣员工'
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
                    '取消'
                  )
                )
              } else if (params.row.orderStatus === 2) {
                arr.push(
                  h(
                    'Button',
                    {
                      props: {
                        type: 'primary',
                        size: 'small'
                      },
                      on: {
                        click: () => {
                          this.showTogo(params.row)
                        }
                      }
                    },
                    '上门'
                  )
                )
              } else if (params.row.orderStatus === 3) {
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
                          this.showArrive(params.row)
                        }
                      }
                    },
                    '到达'
                  )
                )
              } else if (params.row.orderStatus === 4) {
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
        columns1: [
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
            title: '空闲状态',
            align: 'center',
            key: 'freeStatus'
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
                      type: 'success',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.showDispatch1(params.row)
                      }
                    }
                  },
                  '确认派遣'
                )
              ]
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
        Sq: {},
        modalAdd: false,
        modalSq: false,
        modalDelete: false,
        modalDetail: false,
        modalRemark: false,
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
            label: '待接单'
          },
          {
            value: 2,
            label: '待上门'
          },
          {
            value: 3,
            label: '待到达'
          },
          {
            value: 4,
            label: '待完成'
          },
          {
            value: 5,
            label: '待用户评价'
          },
          {
            value: 6,
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
        statusList1: [
          {
            value: 0,
            label: '工作中'
          },
          {
            value: 1,
            label: '空闲中'
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
        ],
        yhqList: [
          {
            value: 0,
            label: '未使用'
          },
          {
            value: 1,
            label: '使用优惠券'
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
    onRemark () {
      if (!this.viewData.Confirm.orderExplain) {
        this.$Message.error('订单备注不能为空')
        return false
      }
      axios
        .put(
          '/qsz_pf/order/update',
          qs.stringify({
            id: this.viewData.Confirm.id,
            orderExplain: this.viewData.Confirm.orderExplain
          })
        )
        .then((response) => {
          this.viewData.Confirm = {}
          this.$Message.success('操作成功!')
          this.searchManage()
        })
    },
    onAddBtn () {
      const sq = this.viewData.Sq
      this.$Message.warning('上传中，请稍后...')
      axios
        .post(
          '/qsz_pf/order/create',
          qs.stringify({
            serviceNum: this.viewData.Add.serviceNum,
            contactName: this.viewData.Add.contactName,
            contactMobile: this.viewData.Add.contactMobile,
            contactAddr: sq.province + ',' + sq.city + ',' + sq.county + ',' + sq.name + ',' + this.viewData.Add.addr,
            lat: sq.lat,
            lng: sq.lng,
            yyDate: this.viewData.Add.yyDate,
            yyTime: this.viewData.Add.yyTime,
            orderPrice: this.viewData.Add.orderPrice,
            orderExplain: this.viewData.Add.orderExplain
          })
        )
        .then((response) => {
          this.viewData.Sq = {}
          this.viewData.Add = {}
          this.searchManage()
          this.$Message.success('添加成功!')
        })
    },
    onTogo (status) {
      axios
        .put(
          '/qsz_pf/order/to_go',
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
    onDispatch (status) {
      axios
        .post(
          '/qsz_pf/order/distribute',
          qs.stringify({
            id: this.viewData.Dispatch.id,
            employeeId: this.viewData.Confirm.id
          })
        )
        .then((response) => {
          this.viewData.modalDispatch = false
          this.viewData.Confirm = {}
          this.viewData.Dispatch = {}
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
    showRemark (row) {
      this.viewData.modalRemark = true
      this.viewData.Confirm = row
      this.viewData.id = row.id
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
            orderId: this.searchList.searchCondition.orderId,
            contactMobile: this.searchList.searchCondition.contactMobile,
            yyDate: this.searchList.searchCondition.yyDate,
            order: this.searchList.searchCondition.order,
            orderStatus: this.searchList.searchCondition.orderStatus,
            discountType: this.searchList.searchCondition.discountType
          }
        })
        .then((res) => {
          this.searchList.pageData.content = res.data.data
          this.searchList.pageData.total = res.data.total
        })
    },
    searchManage1 () {
      axios
        .get('/qsz_pf/employee/work_list', {
          params: {
            page: this.searchList.searchCondition1.page,
            name: this.searchList.searchCondition1.name,
            orderModel: this.searchList.searchCondition1.orderModel,
            isFree: this.searchList.searchCondition1.isFree,
            role: this.searchList.searchCondition1.role
          }
        })
        .then((res) => {
          this.searchList.pageData1.content = res.data.data
          if (res.data.data.length === 0) {
            this.$Message.error('没有更多数据了')
          }
          this.searchList.pageData1.total = res.data.total
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
