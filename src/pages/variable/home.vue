<template>
    <a-layout-content>
        <div class="header_div">
            <a-select show-search :filter-option="onFilterOption" default-value="0" style="width: 120px" @change="onSelect" class="align">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option v-for="(item, index) in type_data" :key="index" :value="item.id">{{ item.name }}</a-select-option>
            </a-select>
            <a-input-search placeholder="请输入名称" style="width: 200px" @search="onSearch" class="align" />
            <a-button type="primary" icon="plus-circle" class="align btn_add" @click="showAdd">
                添加
            </a-button>
        </div>
        <a-table rowKey="id" :columns="columns" :data-source="data" :loading="loading">
            <span slot="key" slot-scope="text">
                <b>{{ text }}</b>
            </span>

            <a-tag slot="type_name" slot-scope="text" color="#cf3f3d">
                {{ text }}
            </a-tag>

            <span slot="update_time" slot-scope="text">
                {{Dayjs(text).subtract(8, 'hour').format('YYYY-MM-DD HH:mm:ss')}}
            </span>

            <span slot="create_time" slot-scope="text">
                {{Dayjs(text).subtract(8, 'hour').format('YYYY-MM-DD HH:mm:ss')}}
            </span>

            <span slot="remarks" slot-scope="text">
                {{text}}
            </span>

            <div slot="status" slot-scope="text,record">
                <a-switch default-checked v-if="text===0" @click="onSwitch($event,record.id)">
                    <a-icon slot="checkedChildren" type="check" />
                    <a-icon slot="unCheckedChildren" type="close" />
                </a-switch>
                <a-switch v-else @click="onSwitch($event,record.id)">
                    <a-icon slot="checkedChildren" type="check" />
                    <a-icon slot="unCheckedChildren" type="close" />
                </a-switch>
            </div>

            <span slot="action" slot-scope="text, record">
                <a-space size="small">
                    <a-tooltip placement="left">
                        <template slot="title">
                            <span>删除</span>
                        </template>
                        <a-popconfirm title="是否要删除该变量?" ok-text="是" cancel-text="否" @confirm="del(record.id)">
                            <a-icon class="pointer" type="delete" />
                        </a-popconfirm>
                    </a-tooltip>

                    <span>|</span>

                    <a-tooltip placement="top">
                        <template slot="title">
                            <span>编辑</span>
                        </template>
                        <a-icon class="pointer" type="form" @click="showEdit(record.id, record.type_id, record.key, record.value,record.remarks)" />
                    </a-tooltip>
                </a-space>
            </span>
        </a-table>

        <a-drawer title="添加新变量" :width="400" :visible="visible_add" :body-style="{ paddingBottom: '80px' }" @close="onCloseAdd">
            <a-form :form="formAdd" layout="vertical" @submit="onAdd">
                <a-row :gutter="16">
                    <a-col :span="24">
                        <a-form-item label="分类">
                            <a-select show-search :filter-option="onFilterOption" v-decorator="[
                  'type',
                  {
                    rules: [{ required: true, message: '请选择分类' }],
                  },
                ]" placeholder="请选择分类">
                                <a-select-option v-for="(item, index) in type_data" :key="index" :value="item.id">{{ item.name }}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>

                    <a-col :span="24">
                        <a-form-item label="Key">
                            <a-input v-decorator="[
                  'keys',
                  {
                    rules: [
                      { required: true, message: '请输入变量 Key' },
                      { max: 20, message: 'Key 长度不能超过20位' },
                    ],
                  },
                ]" placeholder="请输入变量 Key" />
                        </a-form-item>
                    </a-col>

                    <a-col :span="24">
                        <a-form-item label="Value">
                            <a-input v-decorator="[
                  'values',
                  {
                    rules: [
                      { required: true, message: '请输入变量 Value' },
                      { max: 255, message: 'Value 长度不能超过255位' },
                    ],
                  },
                ]" placeholder="请输入变量 Value" />
                        </a-form-item>
                    </a-col>

                    <a-col :span="24">
                        <a-form-item label="备注">
                            <a-textarea v-decorator="[
                  'remarks',
                  {
                    rules: [
                      { required: false, message: '请输入备注' },
                      { max: 255, message: '备注长度不能超过255位' },
                    ],
                  },
                ]" placeholder="请输入备注" :rows="4" />
                        </a-form-item>
                    </a-col>
                </a-row>

                <div :style="{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
            zIndex: 1,
          }">
                    <a-button :style="{ marginRight: '8px' }" @click="onCloseAdd">关闭</a-button>
                    <a-button type="primary" html-type="submit" :loading="loadingAdd">
                        添加
                    </a-button>
                </div>
            </a-form>
        </a-drawer>

        <a-drawer title="更新变量信息" :width="400" :visible="visible_edit" :body-style="{ paddingBottom: '80px' }" @close="onCloseEdit">
            <a-form :form="formUpdate" layout="vertical" @submit="onUpdate">
                <a-row :gutter="16">
                    <a-col :span="24">
                        <a-form-item label="分类">
                            <a-select show-search :filter-option="onFilterOption" v-decorator="[
                  'type',
                  {
                    rules: [{ required: true, message: '请选择分类' }],
                  },
                ]" placeholder="请选择分类">
                                <a-select-option v-for="(item, index) in type_data" :key="index" :value="String(item.id)">{{ item.name }}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>

                    <a-col :span="24">
                        <a-form-item label="Key">
                            <a-input v-decorator="[
                  'keys',
                  {
                    rules: [
                      { required: true, message: '请输入变量 Key' },
                      { max: 20, message: 'Key 长度不能超过20位' },
                    ],
                  },
                ]" placeholder="请输入分类名称" />
                        </a-form-item>
                    </a-col>

                    <a-col :span="24">
                        <a-form-item label="Value">
                            <a-input v-decorator="[
                  'values',
                  {
                    rules: [
                      { required: true, message: '请输入变量 Value' },
                      { max: 255, message: 'Value 长度不能超过255位' },
                    ],
                  },
                ]" placeholder="请输入分类名称" />
                        </a-form-item>
                    </a-col>

                    <a-col :span="24">
                        <a-form-item label="备注">
                            <a-textarea v-decorator="[
                  'remarks',
                  {
                    rules: [
                      { required: false, message: '请输入备注' },
                      { max: 255, message: '备注长度不能超过255位' },
                    ],
                  },
                ]" placeholder="请输入备注" :rows="4" />
                        </a-form-item>
                    </a-col>
                </a-row>

                <div :style="{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
            zIndex: 1,
          }">
                    <a-button :style="{ marginRight: '8px' }" @click="onCloseEdit">关闭</a-button>
                    <a-button type="primary" html-type="submit" :loading="loadingUpdate">
                        更新
                    </a-button>
                </div>
            </a-form>
        </a-drawer>
    </a-layout-content>
</template>

<script>
const columns = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   key: "id",
    // },
    {
        title: "分类",
        dataIndex: "type_name",
        key: "type_name",
        scopedSlots: {
            customRender: "type_name",
        },
    },
    {
        title: "Key",
        dataIndex: "key",
        key: "key",
        scopedSlots: {
            customRender: "key",
        },
    },
    {
        title: "Value",
        dataIndex: "value",
        key: "value",
        scopedSlots: {
            customRender: "value",
        },
    },
    {
        title: "备注",
        dataIndex: "remarks",
        key: "remarks",
        scopedSlots: {
            customRender: "remarks",
        },
    },
    {
        title: "更新时间",
        key: "update_time",
        dataIndex: "update_time",
        scopedSlots: {
            customRender: "update_time",
        },
    },
    // {
    //     title: "创建时间",
    //     key: "create_time",
    //     dataIndex: "create_time",
    //     scopedSlots: {
    //         customRender: "create_time",
    //     },
    // },
    {
        title: "状态",
        key: "status",
        dataIndex: "status",
        scopedSlots: {
            customRender: "status",
        },
    },
    {
        title: "操作",
        key: "action",
        scopedSlots: {
            customRender: "action",
        },
        width: 60,
    },
];

export default {
    name: "variableHome",
    data() {
        return {
            columns,
            loading: false,
            data: [],
            type_data: [],
            formAdd: this.$form.createForm(this),
            visible_add: false,
            formUpdate: this.$form.createForm(this),
            visible_edit: false,
            key: 0,
            loadingUpdate: false,
            loadingAdd: false,
            so_text: "",
            select_type: 0,
        };
    },
    mounted() {
        this.onLoad();
    },
    methods: {
        onLoad(keywords = "", type = 0) {
            this.loading = true;
            this.$http
                .post("/api/v1/w5/get/variablen/list", {
                    type: type,
                    keywords: keywords,
                })
                .then((res) => {
                    if (res.code == 0) {
                        this.data = res.data;
                        this.onSelectType();
                        this.loading = false;
                    } else {
                        this.$message.error(res.msg);
                        this.loading = false;
                    }
                });
        },
        onSelectType() {
            this.$http
                .post("/api/v1/w5/get/type/list", {
                    type: 2,
                })
                .then((res) => {
                    if (res.code == 0) {
                        this.type_data = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        del(id) {
            this.$http
                .post("/api/v1/w5/post/variablen/del", {
                    id: id,
                })
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success("删除成功");
                        this.onLoad();
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        onAdd(e) {
            e.preventDefault();

            this.formAdd.validateFields((err, values) => {
                if (!err) {
                    this.loadingAdd = true;

                    this.$http
                        .post("/api/v1/w5/post/variablen/add", {
                            type_id: values.type,
                            key: values.keys,
                            value: values.values,
                            remarks: values.remarks,
                        })
                        .then((res) => {
                            if (res.code == 0) {
                                this.$message.success("添加成功");
                                this.loadingAdd = false;
                                this.onCloseAdd();
                                this.onLoad();
                            } else {
                                this.$message.error(res.msg);
                                this.loadingAdd = false;
                            }
                        });
                }
            });
        },
        onUpdate(e) {
            e.preventDefault();

            this.formUpdate.validateFields((err, values) => {
                if (!err) {
                    this.loadingUpdate = true;

                    this.$http
                        .post("/api/v1/w5/post/variablen/update", {
                            id: this.key,
                            type_id: values.type,
                            key: values.keys,
                            value: values.values,
                            remarks: values.remarks,
                        })
                        .then((res) => {
                            if (res.code == 0) {
                                this.$message.success("更新成功");
                                this.loadingUpdate = false;
                                this.onCloseEdit();
                                this.onLoad();
                            } else {
                                this.$message.error(res.msg);
                                this.loadingUpdate = false;
                            }
                        });
                }
            });
        },
        showEdit(key, type_id, keys, values, remarks) {
            setTimeout(() => {
                this.formUpdate.setFieldsValue({
                    type: String(type_id),
                    keys: keys,
                    values: values,
                    remarks: remarks
                });
            }, 100);

            this.key = key;

            this.visible_edit = true;
        },
        onCloseEdit() {
            this.visible_edit = false;
        },
        showAdd() {
            setTimeout(() => {
                this.formAdd.setFieldsValue({
                    keys: "",
                    values: "",
                    remarks: ""
                });
            }, 100);

            this.visible_add = true;
        },
        onCloseAdd() {
            this.visible_add = false;
        },
        onSearch(value) {
            this.so_text = value;
            this.onLoad(this.so_text, this.select_type);
        },
        onSelect(value) {
            this.select_type = value;
            this.onLoad(this.so_text, this.select_type);
        },
        onSwitch(bool, id) {
            var status = 1;
            if (bool) {
                status = 0
            }

            this.$http
                .post("/api/v1/w5/post/variablen/status", {
                    id: id,
                    status: status
                })
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success("操作成功");
                        this.onLoad();
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        onFilterOption(input, option) {
            return (
                option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
        },
    },
};
</script>

<style lang="less" scoped>
@import url("../../theme/style.less");

.pointer {
    cursor: pointer;
}

.center {
    text-align: center;
}

.bright {
    .header_div {
        width: 100%;
        background: #ffffff;
        margin-bottom: 10px;
        padding: 10px;
        border-radius: 8px;

        .align {
            vertical-align: middle;
        }

        .btn_add {
            float: right;
        }
    }

    .ant-table-wrapper {
        background: #fff;
        border-radius: 8px;
        padding: 5px 10px;

        /deep/ .ant-table-thead>tr>th {
            background: #fff;
        }
    }
}

.dark {
    .header_div {
        width: 100%;
        background: #202020;
        margin-bottom: 10px;
        padding: 10px;
        border-radius: 8px;

        .align {
            vertical-align: middle;
        }

        .btn_add {
            float: right;
        }
    }

    .ant-table-wrapper {
        background: #202020;
        border-radius: 8px;
        padding: 5px 10px;

        /deep/ .ant-table-thead>tr>th {
            background: #202020;
            border-bottom: 1px solid #303030;
        }
    }
}
</style>
