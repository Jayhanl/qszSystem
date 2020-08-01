<template>
  <Row :gutter="32">
    <Col span="32">
      <Form>
        <Form-item>
          <Form inline>
            <Form-item>
              <Select
                clearable
                class="search_item"
                v-model="searchList.searchCondition.province"
                placeholder="请选择省份"
                @on-change="changeProvince"
              >
                <Option
                  v-for="item in provinceArr"
                  :key="item.value"
                  :value="item.label"
                >{{ item.label }}</Option>
              </Select>
              <Select
                clearable
                class="search_item"
                v-model="searchList.searchCondition.city"
                placeholder="请选择城市"
                @on-change="changeCity"
              >
                <Option
                  v-for="item in citiesArr"
                  :key="item.value"
                  :value="item.label"
                >{{ item.label }}</Option>
              </Select>
              <Select
                clearable
                class="search_item"
                v-model="searchList.searchCondition.county"
                placeholder="请选择区县"
                @on-change="searchManage"
              >
                <Option
                  v-for="item in countyArr"
                  :key="item.value"
                  :value="item.label"
                >{{ item.label }}</Option>
              </Select>
              <Button style="margin-right:10px" @click="searchPageReturn">
                <Icon size="20" type="ios-search" />
              </Button>
              <Button icon="md-add" @click="showAdd()">增加</Button>
            </Form-item>
            <Modal
              :mask-closable="false"
              width="400"
              v-model="viewData.modalDelete"
              @on-ok="onDeleteBtn"
            >
              确认删除
              <span style="color:red">{{viewData.Delete.name}}</span>
              社区吗？
              <!-- <p>(*将会把该社区下的所有订单删除！)</p> -->
            </Modal>
            <Modal
              v-model="viewData.modalAdd"
              title="添加社区"
              :mask-closable="false"
              @on-ok="onAddBtn"
              width="35"
              @on-cancel="onModelCancel"
            >
              <Form :label-width="80">
                <Form-item class="form_item" label="社区名:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Add.name"
                    type="text"
                    :maxlength="20"
                    placeholder="社区名"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="省份:">
                  <Select
                    clearable
                    class="search_item"
                    v-model="viewData.Add.province"
                    placeholder="请选择省份"
                    @on-change="changeProvince1"
                  >
                    <Option
                      v-for="item in provinceArr"
                      :key="item.value"
                      :value="item.label"
                    >{{ item.label }}</Option>
                  </Select>
                </Form-item>
                <Form-item class="form_item" label="城市:">
                  <Select
                    clearable
                    class="search_item"
                    v-model="viewData.Add.city"
                    placeholder="请选择城市"
                    @on-change="changeCity1"
                  >
                    <Option
                      v-for="item in citiesArr1"
                      :key="item.value"
                      :value="item.label"
                    >{{ item.label }}</Option>
                  </Select>
                </Form-item>
                <Form-item class="form_item" label="区县:">
                  <Select
                    clearable
                    class="search_item"
                    v-model="viewData.Add.county"
                    placeholder="请选择区县"
                  >
                    <Option
                      v-for="item in countyArr1"
                      :key="item.value"
                      :value="item.label"
                    >{{ item.label }}</Option>
                  </Select>
                </Form-item>
                <Form-item class="form_item" label="经度:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Add.lat"
                    type="text"
                    :maxlength="20"
                    placeholder="经度"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="纬度:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Add.lng"
                    type="text"
                    :maxlength="20"
                    placeholder="纬度"
                  ></Input>
                </Form-item>
              </Form>
            </Modal>
            <Modal
              clearable
              v-model="viewData.modalEdit"
              title="编辑社区"
              :mask-closable="false"
              @on-ok="onEditBtn"
              width="35"
              @on-cancel="onModelCancel"
            >
              <Form :label-width="80">
                <Form-item class="form_item" label="社区名:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Edit.name"
                    type="text"
                    placeholder="社区"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="省份:">
                  {{viewData.Edit.province}}
                  <Select
                    clearable
                    class="search_item"
                    v-model="viewData.Edit.province"
                    placeholder="请选择省份"
                    @on-change="changeProvince1"
                  >
                    <Option
                      v-for="item in provinceArr"
                      :key="item.value"
                      :value="item.label"
                    >{{ item.label }}</Option>
                  </Select>
                </Form-item>
                <Form-item class="form_item" label="城市:">
                  {{viewData.Edit.city}}
                  <Select
                    clearable
                    class="search_item"
                    v-model="viewData.Edit.city"
                    placeholder="请选择城市"
                    @on-change="changeCity1"
                  >
                    <Option
                      v-for="item in citiesArr1"
                      :key="item.value"
                      :value="item.label"
                    >{{ item.label }}</Option>
                  </Select>
                </Form-item>
                <Form-item class="form_item" label="区县:">
                  {{viewData.Edit.county}}
                  <Select
                    clearable
                    class="search_item"
                    v-model="viewData.Edit.county"
                    placeholder="请选择区县"
                  >
                    <Option
                      v-for="item in countyArr1"
                      :key="item.value"
                      :value="item.label"
                    >{{ item.label }}</Option>
                  </Select>
                </Form-item>
                <Form-item class="form_item" label="经度:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Edit.lat"
                    type="text"
                    :maxlength="20"
                    placeholder="经度"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="纬度:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Edit.lng"
                    type="text"
                    :maxlength="20"
                    placeholder="纬度"
                  ></Input>
                </Form-item>
              </Form>
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
        Info: [],
        columns: [
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
            title: '是否上架',
            align: 'center',
            key: 'action',
            render: (h, params) => {
              return h('i-switch', {
                props: {
                  value: params.row.status,
                  'false-value': 0,
                  'true-value': 1,
                  size: 'large'
                },
                slot: {},
                on: {
                  'on-change': (e) => {
                    axios
                      .put(
                        '/qsz_pf/housing/update_status',
                        qs.stringify({
                          id: params.row.id,
                          status: e
                        })
                      )
                      .then(() => {
                        this.$Message.success('操作成功!')
                      })
                      .catch(() => {
                        this.searchManage()
                      })
                  }
                }
              })
            }
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
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '15px'
                    },
                    on: {
                      click: () => {
                        this.showEdit(params.row)
                      }
                    }
                  },
                  '编辑'
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
                        this.showDelete(params.row)
                      }
                    }
                  },
                  '删除'
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
          totalPages: 0,
          size: 5,
          rankTime: ''
        },
        searchCondition: {
          page: 1,
          size: 5
        },
        pageSizeOpts: [1, 5, 10, 20, 30, 40]
      },
      viewData: {
        Add: {
          name: '',
          listOrder: ''
        },
        Edit: {
          name: '',
          listOrder: ''
        },
        ImgSrc: '',
        pList: [],
        modalEdit: false,
        modalAdd: false,
        modalDelete: false,
        Delete: ''
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
    changeProvince1 (val) {
      console.log(this.provinceArr)
      for (var i = 0; i < this.provinceArr.length; i++) {
        if (val === this.provinceArr[i].label) {
          this.citiesArr1 = this.provinceArr[i].children
          this.countyArr1 = []
        }
      }
    },
    changeCity1 (val) {
      for (var i = 0; i < this.citiesArr1.length; i++) {
        if (val === this.citiesArr1[i].label) {
          this.countyArr1 = this.citiesArr1[i].children
        }
      }
    },
    onPageChange (pageNum) {
      this.searchList.searchCondition.page = pageNum
      this.searchManage()
    },
    onDeleteBtn () {
      axios
        .delete('/qsz_pf/housing/delete', {
          data: {
            id: this.viewData.Delete.id
          }
        })
        .then((response) => {
          this.$Message.success('删除成功!')
          this.searchManage()
          this.searchPid()
        })
    },
    onAddBtn () {
      if (this.viewData.Add.name === '') {
        this.$Message.error('请输入社区名')
        return
      }
      this.$Message.warning('上传中，请稍后...')
      axios
        .post(
          '/qsz_pf/housing/create',
          qs.stringify({
            name: this.viewData.Add.name,
            province: this.viewData.Add.province,
            city: this.viewData.Add.city,
            county: this.viewData.Add.county,
            lat: this.viewData.Add.lat,
            lng: this.viewData.Add.lng
          })
        )
        .then((response) => {
          this.viewData.Add = {}
          this.searchManage()
          this.citiesArr1 = []
          this.countyArr1 = []
          this.$Message.success('添加成功!')
        })
    },
    onEditBtn () {
      if (this.viewData.Edit.name === '') {
        this.$Message.error('请输入社区名')
        return
      }
      this.$Message.warning('上传中，请稍后...')
      axios
        .put(
          '/qsz_pf/housing/update',
          qs.stringify({
            id: this.viewData.Edit.id,
            name: this.viewData.Edit.name,
            province: this.viewData.Edit.province,
            city: this.viewData.Edit.city,
            county: this.viewData.Edit.county,
            lat: this.viewData.Edit.lat,
            lng: this.viewData.Edit.lng
          })
        )
        .then((response) => {
          this.viewData.Edit = {}
          this.citiesArr1 = []
          this.countyArr1 = []
          this.searchManage()
          this.$Message.success('编辑成功!')
        })
        .catch(() => {
          this.searchManage()
        })
    },
    onModelCancel () {
      this.searchManage()
    },
    showAdd () {
      this.viewData.ImgSrc = ''
      this.viewData.modalAdd = true
    },
    showEdit (item) {
      this.viewData.ImgSrc = item.imageSrc
      this.viewData.Edit = item
      this.viewData.modalEdit = true
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
      console.log(this.searchList.searchCondition.pid)
      axios
        .get('/qsz_pf/housing/list', {
          params: {
            page: this.searchList.searchCondition.page,
            province: this.searchList.searchCondition.province || '广东省',
            city: this.searchList.searchCondition.city || '广州市',
            county: this.searchList.searchCondition.county || '海珠区'
          }
        })
        .then((response) => {
          this.searchList.pageData.content = response.data.data
          this.searchList.pageData.total = response.data.total
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
  padding: 10px 20px;
}

.btnR span {
  display: flex;
  line-height: 20px;
  padding-left: 5px;
}

.ImgC {
  opacity: 0;
  width: 120px;
  height: 32px;
  position: absolute;
  top: 0;
  left: 0;
}

.imgMax {
  max-width: 300px;
}
</style>
