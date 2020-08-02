<template>
  <div class="data_grid">
    <div class="item">
      <Icon style="padding:0 20px" size="50" type="ios-contacts-outline" />
      <div class="info">
        <span>用户总数</span>
        <span>{{dataList.allUser}}</span>
      </div>
    </div>
    <div class="item">
      <Icon style="padding:0 20px" size="50" type="ios-contacts" />
      <div class="info">
        <span>已注册用户</span>
        <span>{{dataList.registerUser}}</span>
      </div>
    </div>
    <div class="item">
      <Icon style="padding:0 20px" size="50" type="ios-people-outline" />
      <div class="info">
        <span>合伙人</span>
        <span>{{dataList.partner}}</span>
      </div>
    </div>
    <div class="item">
      <Icon style="padding:0 20px" size="50" type="ios-people" />
      <div class="info">
        <span>员工</span>
        <span>{{dataList.employee}}</span>
      </div>
    </div>
    <div class="item">
      <Icon style="padding:0 20px" size="50" type="md-clipboard" />
      <div class="info">
        <span>订单总数</span>
        <span>{{dataList.allOrder}}</span>
      </div>
    </div>
    <div class="item">
      <Icon style="padding:0 20px" size="50" type="md-checkmark-circle-outline" />
      <div class="info">
        <span>已完成订单</span>
        <span>{{dataList.doneOrder}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  data () {
    return {
      dataList: {}
    }
  },
  methods: {
    searchManage () {
      axios.get('/qsz_pf/data/home').then((res) => {
        console.log(res.data)
        this.dataList = res.data
      })
    }
  },
  created () {
    this.searchManage()
  }
}
</script>
<style>
.data_grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 250px);
  grid-auto-rows: 100px;
  grid-gap: 20px;
  padding: 20px;
}
.data_grid .item {
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 2px solid #eee;
  font-size: 18px;
  background-color: #fff;
  border-radius: 20px;
}
.data_grid .item .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
