<template>
  <Row :gutter="32">
    <Col span="24">
      <Form>
        <Form-item>
          <Form inline>

            <Modal
              :mask-closable="false"
              width="400"
              v-model="viewData.modalDelete"
              @on-ok="onDeleteBtn"
            >
              确认删除id为：
              <span style="color: red">{{ viewData.Delete.userId }}</span>
              的信息吗？
            </Modal>
            <Modal
              v-model="viewData.modalAdd"
              title="生成二维码"
              :mask-closable="false"
              @on-ok="onAddBtn"
              width="35"
              @on-cancel="onModelCancel"
            >
              <Form :label-width="80">
                <Form-item class="form_item" label="生成数量:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Add.num"
                    type="number"
                    :maxlength="4"
                    placeholder="请输入正整数"
                  ></Input>
                </Form-item>
              </Form>
            </Modal>
          </Form>
          <Form-item style="padding-top: 10px">
            <Tabs v-model="viewData.tabId" @on-click="onTabs">
              <TabPane label="任务列表" name="0">
                <Button icon="md-add" @click="showAdd()">生成二维码</Button>
                <i-table
                  border
                  style="margin-top: 10px"
                  :columns="searchList.columns"
                  :data="searchList.pageData.content"
                ></i-table>
                <!-- <Page
                  style="padding-top: 10px"
                  :total="searchList.pageData.total"
                  :current="searchList.searchCondition.page"
                  :page-size="10"
                  @on-change="onPageChange"
                  size="small"
                  show-total
                ></Page> -->
              </TabPane>
              <TabPane label="二维码列表" name="1">
                <Input
                  class="search_item"
                  type="text"
                  v-model="searchList.searchCondition1.taskId"
                  clearable
                  placeholder="任务ID"
                ></Input>
                <Select
                  clearable
                  placeholder="状态"
                  @on-change="searchManage1"
                  v-model="searchList.searchCondition1.status"
                  class="search_item"
                >
                  <Option
                    v-for="item in viewData.statusList"
                    :value="item.value"
                    :key="item.value"
                    >{{ item.label }}
                  </Option>
                </Select>
                <Button style="margin-right: 10px" @click="searchPageReturn1">
                  <Icon size="18" type="ios-search" />
                </Button>

                <i-table
                  style="margin-top: 10px"
                  border
                  :columns="searchList.columns1"
                  :data="searchList.pageData1.content"
                ></i-table>
              </TabPane>
            </Tabs>
            <Page
              style="padding-top: 10px"
              :total="
                viewData.tabId == 0
                  ? searchList.pageData.total
                  : searchList.pageData1.total
              "
              :current="
                viewData.tabId == 0
                  ? searchList.pageData.page
                  : searchList.pageData1.page
              "
              :page-size="10"
              @on-change="viewData.tabId == 0 ? onPageChange : onPageChange1"
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
            title: 'id',
            align: 'center',
            key: 'id'
          },
          {
            title: '生成二维码数量',
            align: 'center',
            key: 'num'
          },
          {
            title: '生成时间',
            align: 'center',
            key: 'createTime'
          },
          {
            title: '状态',
            align: 'center',
            key: 'statusChina'
          },
          {
            title: '操作',
            key: 'action',
            width: 200,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                // h(
                //   'Button',
                //   {
                //     props: {
                //       type: 'primary',
                //       size: 'small',
                //     },
                //     style: {
                //       marginRight: '15px',
                //     },
                //     on: {
                //       click: () => {
                //         this.showDetail(params.row)
                //       },
                //     },
                //   },
                //   '详情'
                // ),
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
                        this.getDown(params.row)
                      }
                    }
                  },
                  '下载二维码压缩包'
                )
              ])
            }
          }
        ],
        columns1: [
          {
            title: '任务id',
            align: 'center',
            key: 'taskId'
          },
          {
            title: 'cdk',
            align: 'center',
            key: 'cdk'
          },
          {
            title: '生成时间',
            align: 'center',
            key: 'createTime'
          },
          {
            title: '状态',
            align: 'center',
            key: 'statusChina'
          },
          {
            title: '扫码用户id',
            align: 'center',
            key: 'userId',
            render (h, params) {
              return h(
                'span',
                params.row.userId === 0 ? '未兑换' : params.row.userId
              )
            }
          },
          {
            title: '扫码时间',
            align: 'center',
            key: 'useTime',
            render (h, params) {
              return h(
                'span',
                params.row.useTime ? params.row.useTime : '未兑换'
              )
            }
          }
        ],
        data: [],
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
        modalPay: false,
        modalCollect: false,
        modalDelete: false,
        modalDetail: false,
        modalAdd: false,
        Add: {},
        Confirm: '',
        Detail: {},
        Delete: {},
        statusList: [
          {
            value: 0,
            label: '未兑换'
          },
          {
            value: 1,
            label: '已兑换'
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
        .delete('/qsz_pf/user/delete', {
          data: {
            userId: this.viewData.Delete.userId
          }
        })
        .then((res) => {
          this.$Message.success('删除成功!')
          this.searchManage()
        })
    },
    showAdd () {
      this.viewData.ImgSrc = ''
      this.viewData.modalAdd = true
    },
    getDown (row) {
      axios
        .get('/qsz_pf/qr_task/download_zip', {
          params: {
            id: row.id
          }
        })
        .then((res) => {
          window.open(res.data.url)
          this.$Message.success('操作成功!')
        })
    },
    onAddBtn () {
      if (this.viewData.Add.num === '') {
        this.$Message.error('请输入需要生成二维码的数量')
        return
      }
      this.$Message.warning('上传中，请稍后...')
      axios
        .post('/qsz_pf/qr_task/create', {
          num: parseInt(this.viewData.Add.num)
        })
        .then((response) => {
          this.viewData.Add = {}
          this.searchManage()
          this.$Message.success('添加成功!')
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
      this.searchList.searchCondition.page = 1
      this.searchManage1()
      this.$Message.success('搜索完成!')
    },
    onPageChange (pageNum) {
      this.searchList.searchCondition.page = pageNum
      this.searchManage()
    },
    onPageChange1 (pageNum) {
      this.searchList.searchCondition.page1 = pageNum
      this.searchManage()
    },
    onTabs (e) {
      if (e == 0) {
        this.searchList.searchCondition.page = 0
        this.searchManage()
      } else {
        this.searchList.searchCondition1.page = 0
        this.searchManage1()
      }
    },
    searchManage () {
      axios
        .get('/qsz_pf/qr_task/list', {
          params: {
            page: this.searchList.searchCondition.page
          }
        })
        .then((res) => {
          this.searchList.pageData.content = res.data.data
          this.searchList.pageData.total = res.data.total
        })
    },
    searchManage1 (row) {
      axios
        .get('/qsz_pf/qr_task/cdk_list', {
          params: {
            page: this.searchList.searchCondition1.page,
            status: this.searchList.searchCondition1.status,
            taskId: this.searchList.searchCondition1.taskId
          }
        })
        .then((res) => {
          this.searchList.pageData1.content = res.data.data
          this.searchList.pageData1.total = res.data.total
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
