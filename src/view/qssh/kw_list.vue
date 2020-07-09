<template>
  <Row :gutter="32">
    <Col span="32">
      <Form>
        <Form-item>
          <Form inline>
            <Form-item>
              <Button icon="md-add" @click="showAdd()">增加</Button>
            </Form-item>
            <Modal
              :mask-closable="false"
              width="400"
              v-model="viewData.modalDelete"
              @on-ok="onDeleteBtn"
            >
              确认删除
              <span style="color:red">{{viewData.Delete.kName}}</span>
              关键词吗？
              <p>(*删除后将会把关键词下的所有需求隐藏！)</p>
            </Modal>
            <Modal
              v-model="viewData.modalAdd"
              title="添加关键词"
              :mask-closable="false"
              @on-ok="onAddBtn"
              width="35"
              @on-cancel="onModelCancel"
            >
              <Form :label-width="80">
                <Form-item class="form_item" label="关键词名:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Add.kName"
                    type="text"
                    :maxlength="20"
                    placeholder="关键词名"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="排序序号:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Add.listOrder"
                    type="text"
                    :maxlength="20"
                    placeholder="排序序号"
                  ></Input>
                </Form-item>
              </Form>
            </Modal>
            <Modal
              clearable
              v-model="viewData.modalEdit"
              title="编辑关键词"
              :mask-closable="false"
              @on-ok="onEditBtn"
              width="35"
              @on-cancel="onModelCancel"
            >
              <Form :label-width="80">
                <Form-item class="form_item" label="关键词名:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Edit.kName"
                    type="text"
                    placeholder="关键词"
                  ></Input>
                </Form-item>
                <Form-item class="form_item" label="排序序号:">
                  <Input
                    style="width: 200px"
                    v-model="viewData.Edit.listOrder"
                    type="text"
                    :maxlength="20"
                    placeholder="排序序号"
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
              :current="searchList.pageData.pageNum"
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
      searchList: {
        Info: [],
        columns: [
          {
            title: '关键词Id',
            align: 'center',
            key: 'id'
          },
          {
            title: '关键词名',
            align: 'center',
            key: 'kName'
          },
          {
            title: '排序序号',
            align: 'center',
            key: 'listOrder'
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
                  'on-change': e => {
                    axios
                      .put(
                        '/sjwh/qsh_keyword/update_status',
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
          kName: '',
          listOrder: ''
        },
        Edit: {
          kName: '',
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
    onPageChange (pageNum) {
      this.searchList.searchCondition.page = pageNum
      this.searchManage()
    },
    onDeleteBtn () {
      axios
        .delete('/sjwh/qsh_keyword/delete', {
          data: {
            id: this.viewData.Delete.id
          }
        })
        .then(response => {
          this.$Message.success('删除成功!')
          this.searchManage()
          this.searchPid()
        })
    },
    onAddBtn () {
      if (this.viewData.Add.kName === '') {
        this.$Message.error('请输入关键词名')
        return
      }
      this.$Message.warning('上传中，请稍后...')
      axios
        .post(
          '/sjwh/qsh_keyword/create',
          qs.stringify({
            kName: this.viewData.Add.kName,
            listOrder: this.viewData.Add.listOrder
          })
        )
        .then(response => {
          this.viewData.Add = {}
          this.searchManage()
          this.$Message.success('添加成功!')
        })
    },
    onEditBtn () {
      if (this.viewData.Edit.kName === '') {
        this.$Message.error('请输入关键词名')
        return
      }
      this.$Message.warning('上传中，请稍后...')
      axios
        .put(
          '/sjwh/qsh_keyword/update',
          qs.stringify({
            id: this.viewData.Edit.id,
            kName: this.viewData.Edit.kName,
            listOrder: this.viewData.Edit.listOrder
          })
        )
        .then(response => {
          this.viewData.Edit = {}
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
      axios
        .get('/sjwh/qsh_keyword/list', {
          params: {}
        })
        .then(response => {
          this.searchList.pageData.content = response.data
          // this.searchList.pageData.total = response.data.total
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
