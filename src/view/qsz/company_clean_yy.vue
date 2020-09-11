<template>
  <Row :gutter="32">
    <Col span="24">
      <Form>
        <Form-item>
          <Form inline>
            <Form-item>
              <Button style="margin-right:10px" @click="searchPageReturn">
                <Icon size="18" type="ios-search" />
              </Button>
            </Form-item>
            <Modal
              :mask-closable="false"
              title="取消确认"
              width="400"
              v-model="viewData.modalDelete"
              @on-ok="onDeleteBtn"
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
              v-model="viewData.modalConfirm"
              @on-ok="onConfirmBtn"
            >
              <Form :label-width="80">
                <Form-item class="form_item">
                  确认完成id为：
                  <span style="color:red">{{viewData.Confirm.id}}</span>
                  的预约吗？
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

export default {
  data () {
    return {
      fileName: '',
      uploadFile: {},
      searchList: {
        Info: [],
        columns: [
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
                          this.showConfirm(params.row)
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
                          this.showDelete(params.row)
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
        data: [],
        pageData: {
          content: [],
          pageNum: 1,
          total: 0
        },
        searchCondition: {
          page: 1,
          size: 5
        },
        pageSizeOpts: [1, 5, 10, 20, 30, 40]
      },
      viewData: {
        Add: {
          categoryName: '',
          listorder: ''
        },
        Edit: {
          categoryName: '',
          listorder: ''
        },
        Confirm: {},
        modalConfirm: false,
        modalDelete: false
      }
    }
  },
  methods: {
    onDeleteBtn () {
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
          this.searchManage()
        })
    },
    onModelCancel () {
      this.searchManage()
    },
    showEdit (item) {
      this.viewData.Edit = item
      this.viewData.modalEdit = true
    },
    showConfirm () {
      this.viewData.Confirm = item
      this.viewData.modalConfirm = true
    },
    showDelete (item) {
      this.viewData.Confirm = item
      this.viewData.modalDelete = true
    },
    onConfirmBtn () {
      axios
        .put('/qsz_pf/demand_order/done_short_item', {
          id: this.viewData.Confirm.id
        })
        .then((response) => {
          this.$Message.success('操作成功!')
          this.searchManage()
        })
    },
    searchPageReturn () {
      this.searchList.searchCondition.page = 1
      this.searchManage()
      this.$Message.success('搜索完成!')
    },
    onPageChange (pageNum) {
      this.searchList.searchCondition.page = pageNum
      this.searchManage()
    },
    searchManage () {
      axios
        .get('/qsz_pf/demand_order/yy_list', {
          params: {
            page: this.searchList.searchCondition.page
          }
        })
        .then((res) => {
          this.searchList.pageData.content = res.data.data
          this.searchList.pageData.total = res.data.total
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
</style>
