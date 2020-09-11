<template>
  <div>
    <div class="data_grid">
      <div class="item" :style="'border-left:8px solid '+colorList[0]">
        <Icon style="padding:0 20px" size="50" type="ios-contacts-outline" />
        <div class="info">
          <span>用户总数</span>
          <span class="num">{{dataList.allUser}}</span>
        </div>
      </div>
      <!-- <div class="item" :style="'border-left:8px solid '+colorList[1]">
      <Icon style="padding:0 20px" size="50" type="ios-contacts" />
      <div class="info">
        <span>已注册用户</span>
        <span class="num">{{dataList.registerUser}}</span>
      </div>
      </div>-->
      <div class="item" :style="'border-left:8px solid '+colorList[2]">
        <Icon style="padding:0 20px" size="50" type="ios-people-outline" />
        <div class="info">
          <span>合伙人</span>
          <span class="num">{{dataList.partner}}</span>
        </div>
      </div>
      <div class="item" :style="'border-left:8px solid '+colorList[3]">
        <Icon style="padding:0 20px" size="50" type="ios-people" />
        <div class="info">
          <span>员工</span>
          <span class="num">{{dataList.employee}}</span>
        </div>
      </div>
      <div class="item" :style="'border-left:8px solid '+colorList[4]">
        <Icon style="padding:0 20px" size="50" type="md-clipboard" />
        <div class="info">
          <span>订单总量</span>
          <span class="num">{{dataList.allOrder}}</span>
        </div>
      </div>
      <div class="item" :style="'border-left:8px solid '+colorList[5]">
        <Icon style="padding:0 20px" size="50" type="md-checkmark-circle-outline" />
        <div class="info">
          <span>已完成订单</span>
          <span class="num">{{dataList.doneOrder}}</span>
        </div>
      </div>
      <div class="item" :style="'border-left:8px solid '+colorList[1]">
        <Icon style="padding:0 20px" size="50" type="md-clipboard" />
        <div class="info">
          <span>今日订单量</span>
          <span class="num">{{dataList.todayOrder}}</span>
        </div>
      </div>
      <div class="item" :style="'border-left:8px solid '+colorList[6]">
        <Icon style="padding:0 20px" size="50" type="md-people" />
        <div class="info">
          <span>当前上班师傅人数</span>
          <span class="num">{{todayList.length}}</span>
        </div>
      </div>
      <div class="item" :style="'border-left:8px solid '+colorList[2]">
        <Icon style="padding:0 20px" size="50" type="md-people" />
        <div class="info">
          <span>当前空闲师傅人数</span>
          <span class="num">{{todayData.isFreeTotal}}</span>
        </div>
      </div>
    </div>
    <div class="rankCont">
      <div class="rankList">
        <div class="title">今日订单量排行榜</div>
        <div
          class="item"
          v-for="(item, index) in todayRank"
          :key="item.id"
          @click="showDetail(item.id)"
        >
          <div class="info">{{index+1+'、'+item.name}}</div>
          <div class="num">
            {{item.todayOrder}}
            <span style="font-size:12px">单</span>
          </div>
        </div>
      </div>
      <div class="rankList">
        <div class="title">空闲人数占比</div>
        <div style="text-align: center;">
          <Circle
            :size="250"
            :trail-width="4"
            :stroke-width="5"
            :percent="proportion"
            stroke-linecap="square"
            stroke-color="#43a3fb"
          >
            <div class="demo-Circle-custom">
              <h1>{{todayData.isFreeTotal}}</h1>
              <p>空闲人数</p>
              <span>
                总占人数
                <i>{{proportion}}%</i>
              </span>
            </div>
          </Circle>
        </div>
      </div>
      <div class="rankList" style="justify-items: end;">
        <div class="title">师傅区域分布</div>
        <div class="item" v-for="item in countyList" :key="item.id">
          <div class="info">{{item.text}}</div>
          <div class="num">
            {{countyTotal[item.id]}}
            <span style="font-size:12px">人</span>
          </div>
        </div>
      </div>
      <div class="rankList" style="justify-items: end;">
        <div class="title">订单总量排行榜</div>
        <div
          class="item"
          v-for="(item, index) in historyRank"
          :key="item.id"
          @click="showDetail(item.id)"
        >
          <div class="info">{{index+1+'、'+item.name}}</div>
          <div class="num">
            {{item.orderTotal}}
            <span style="font-size:12px">单</span>
          </div>
        </div>
      </div>
    </div>

    <Modal title="查看用户信息详情" width="55" :styles="{top: '70px'}" v-model="viewData.modalDetail">
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
          <Col span="10">身份证号: {{viewData.Detail.idcId}}</Col>
        </Row>
        <h4>身份证地址: {{viewData.Detail.idcAddr}}</h4>
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
            <img :src="viewData.Detail.idcFront" class="img_item" preview="0" preview-text="身份证人像面" />
          </Col>
        </Row>
        <Row>
          <Col span="4">身份证国徽面</Col>
          <Col span="18">
            <img :src="viewData.Detail.idcBack" class="img_item" preview="1" preview-text="身份证国徽面" />
          </Col>
        </Row>
      </div>
    </Modal>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  data () {
    return {
      dataList: {},
      todayData: {},
      todayList: {},
      todayRank: {},
      historyRank: {},
      colorList: [
        '#009DFA',
        '#00CCF8',
        '#55CE64',
        '#FFBC34',
        '#745AF3',
        '#F85975',
        '#00D1CE'
      ],
      countyList: [
        {
          text: '越秀区',
          id: 'yxq'
        },
        {
          text: '荔湾区',
          id: 'lwq'
        },
        {
          text: '海珠区',
          id: 'hzq'
        },
        {
          text: '天河区',
          id: 'thq'
        },
        {
          text: '白云区',
          id: 'byq'
        },
        {
          text: '黄埔区',
          id: 'hpq'
        },
        {
          text: '番禺区',
          id: 'pyq'
        },
        {
          text: '花都区',
          id: 'hdq'
        },
        {
          text: '南沙区',
          id: 'nsq'
        },
        {
          text: '增城区',
          id: 'zcq'
        },
        {
          text: '从化区',
          id: 'chq'
        },
        {
          text: '其他地区',
          id: 'qt'
        }
      ],
      countyTotal: {
        yxq: 0,
        lwq: 0,
        hzq: 0,
        thq: 0,
        byq: 0,
        hpq: 0,
        pyq: 0,
        hdq: 0,
        nsq: 0,
        zcq: 0,
        chq: 0,
        qt: 0
      },
      viewData: {
        modalDetail: false,
        Detail: {}
      }
    }
  },
  computed: {
    proportion () {
      return this.accMul(
        (this.todayData.isFreeTotal / this.todayList.length).toFixed(3),
        100
      )
    }
  },
  methods: {
    // 乘法
    accMul (arg1, arg2) {
      var m = 0
      var s1 = arg1.toString()
      var s2 = arg2.toString()
      try {
        m += s1.split('.')[1].length
      } catch (e) {}
      try {
        m += s2.split('.')[1].length
      } catch (e) {}
      return (
        (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
        Math.pow(10, m)
      )
    },
    showDetail (id) {
      console.log(id)
      this.viewData.modalDetail = true
      this.searchDetail(id)
    },
    searchDetail (id) {
      axios
        .get('/qsz_pf/employee/detail', {
          params: {
            id: id
          }
        })
        .then((res) => {
          this.$previewRefresh()
          this.viewData.Detail = res.data
        })
    },
    searchManage () {
      axios.get('/qsz_pf/data/home').then((res) => {
        console.log(res.data)
        this.dataList = res.data
      })
    },
    searchToday () {
      axios.get('/qsz_pf/data/working_emp').then((res) => {
        console.log(res.data)
        this.todayData.isFreeTotal = res.data.filter(
          (item) => item.isFree === 1
        ).length
        const list = res.data.forEach((element) => {
          switch (element.county) {
            case '越秀区':
              this.countyTotal.yxq++
              break
            case '荔湾区':
              this.countyTotal.lwq++
              break
            case '海珠区':
              this.countyTotal.hzq++
              break
            case '天河区':
              this.countyTotal.thq++
              break
            case '白云区':
              this.countyTotal.byq++
              break
            case '黄埔区':
              this.countyTotal.hpq++
              break
            case '番禺区':
              this.countyTotal.pyq++
              break
            case '花都区':
              this.countyTotal.hdq++
              break
            case '南沙区':
              this.countyTotal.nsq++
              break
            case '增城区':
              this.countyTotal.zcq++
              break
            case '从化区':
              this.countyTotal.chq++
              break
            default:
              this.countyTotal.qt++
              break
          }
        })
        this.todayList = res.data
        this.todayRank = res.data.slice(0, 10)
        this.historyRank = res.data.sort((a, b) => b.orderTotal - a.orderTotal)
      })
    }
  },
  created () {
    this.searchManage()
    this.searchToday()
    setInterval(this.searchManage, 21000)
    setInterval(this.searchToday, 31000)
  }
}
</script>
<style lang="less">
.data_grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 19%);
  grid-auto-rows: 120px;
  grid-gap: 20px 1%;
  /* padding: 20px; */
}
.data_grid .item {
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 2px solid #eee;
  font-size: 14px;
  background-color: #fff;
  border-radius: 10px;

  &:hover {
    background-color: #4ea3ee25;
    color: #fff;
    // .num {
    //   color: #fff!important;
    // }
  }
}
.data_grid .item .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.data_grid .item .info .num {
  color: #3998ea;
  font-size: 30px;
}

.rankCont {
  margin-top: 40px;
  display: grid;
  /* grid-template-columns: repeat(auto-fill, 45%); */
  grid-template-columns: repeat(auto-fill, 24%);
  /* grid-gap: 20px 2%; */
  justify-content: space-around;
  /* grid-auto-rows: 120px; */
}
.rankCont .rankList {
  /* display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; */
  width: 400px;
  padding: 20px 0;
  background-color: #fff;
  font-size: 14px;
  border-radius: 5px;
}
.rankCont .rankList .title {
  margin-bottom: 10px;
  padding-bottom: 10px;
  padding-left: 20px;
  font-weight: bold;
  font-size: 16px;
  border-bottom: 1px solid #eee;
}
.rankCont .rankList .item {
  display: grid;
  grid-template-columns: 40% 60%;
  grid-auto-rows: 28px;
  padding: 0 20px;
  align-items: center;
  &:hover {
    background-color: #3998ea;
    color: #fff;
    border-radius: 6px;
    .num {
      color: #fff;
    }
  }
}
.rankCont .rankList .item .num {
  text-align: right;
  color: #3998ea;
  font-size: 18px;
}

.demo-Circle-custom {
  & h1 {
    color: #3f414d;
    font-size: 28px;
    font-weight: normal;
  }
  & p {
    color: #657180;
    font-size: 14px;
    margin: 10px 0 15px;
  }
  & span {
    display: block;
    padding-top: 15px;
    color: #657180;
    font-size: 14px;
    &:before {
      content: '';
      display: block;
      width: 50px;
      height: 1px;
      margin: 0 auto;
      background: #e0e3e6;
      position: relative;
      top: -15px;
    }
  }
  & span i {
    font-style: normal;
    color: #3f414d;
  }
}
.order_info .img_item {
  width: 70px;
  height: 70px;
  margin-right: 10px;
}
</style>
