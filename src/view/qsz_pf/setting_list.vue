<template>
  <Row :gutter="32">
    <Col span="24">
      <Form inline>
        <Form-item>
          <Form-item>
            <Button style="margin-right:10px;" @click="searchManage">
              <Icon type="md-refresh" size="20" />&nbsp;&nbsp;刷新
            </Button>
            <Button @click="onShowEdit">
              <Icon type="ios-construct-outline" size="20" />&nbsp;&nbsp;修改设置
            </Button>
            <!-- <Button icon="md-arrow-round-down" @click="fileDown()">生成财务报表</Button> -->
          </Form-item>
          <!-- 编辑 -->
          <Modal
            v-model="viewData.modalEdit"
            title="确认修改"
            @on-ok="onEditActive"
            width="30"
            :mask-closable="false"
            @on-cancel="onModelCancel()"
          >是否确认修改本页所有的数据变动？</Modal>
          <!-- 用户端 -->
          <div class="price_container">
            <span>用户端:</span>
            <Form-item label="签到前x名送优惠券:">
              <Input
                style="width: 170px"
                v-model="viewData.Edit.signAwardNum"
                type="number"
                :maxlength="5"
                placeholder="请输入正数（名）"
              ></Input>
            </Form-item>
          </div>
          <!-- 师傅端 -->
          <div class="price_container">
            <span>师傅端:</span>
            <Form-item label="订单达到距离限制（km）:">
              <Input
                style="width: 170px"
                v-model="viewData.Edit.empArriveDistance"
                type="number"
                :maxlength="7"
                placeholder="请输入正数（km）"
              ></Input>
            </Form-item>
            <Form-item label="订单接单间隔限制（小时）:">
              <Input
                style="width: 170px"
                v-model="viewData.Edit.empReceiveTimeDiff"
                type="number"
                :maxlength="7"
                placeholder="请输入正数（小时）"
              ></Input>
            </Form-item>
            <Form-item label="合伙人每月租金（元）:">
              <Input
                style="width: 170px"
                v-model="viewData.Edit.empRentPrice"
                type="number"
                :maxlength="7"
                placeholder="请输入正数（元）"
              ></Input>
            </Form-item>
          </div>
          <!-- <div style="margin: 10px 20px;font-size:12px;display: flex;align-items: center;">
            <Icon type="ios-alert-outline" size="15" />当购买次数大于原价次数且小于9折次数时，信息打9折
          </div>-->
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
        data: [],
        pageData: {
          content: [],
          pageNum: 0,
          numberOfElements: 0,
          total: 0,
          totalPages: 0,
          size: 5
        },
        searchCondition: {
          page: 1,
          size: 5
        },
        pageSizeOpts: [1, 5, 10, 20, 30, 40]
      },
      viewData: {
        Edit: {},
        modalEdit: false
      }
    }
  },
  methods: {
    onShowEdit () {
      this.viewData.modalEdit = true
    },
    onEditActive () {
      const EditData = this.viewData.Edit
      axios
        .put(
          '/qsz_pf/setting/update',
          qs.stringify({
            empArriveDistance: EditData.empArriveDistance,
            empReceiveTimeDiff: EditData.empReceiveTimeDiff,
            empRentPrice: EditData.empRentPrice,
            signAwardNum: EditData.signAwardNum
          })
        )
        .then((response) => {
          this.searchManage()
          this.$Message.success('修改成功!')
        })
    },
    onModelCancel () {
      this.searchManage()
    },
    searchManage () {
      axios.get('/qsz_pf/setting/get').then((response) => {
        console.log(response)
        this.viewData.Edit = response.data
      })
    }
  },
  created () {
    this.searchManage()
  }
}
</script>
<style>
.price_container {
  margin-top: 30px;
  margin-right: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.price_container span {
  /* display: block; */
  margin-right: 20px;
  font-size: 20px;
}
.price_container .ivu-form-item-label{
    font-size: 13px;
}
.price_container .ivu-form-item-content {
  margin-right: 10px !important;
}
/* .ivu-form-inline .ivu-form-item{
    margin-r
  } */
</style>
