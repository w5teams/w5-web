<template>
<a-layout-content>
    <div class="header_div">
        <a-select show-search :filter-option="onFilterOption" default-value="0" style="width: 120px" @change="onSelect" class="align">
            <a-select-option value="0">全部</a-select-option>
            <a-select-option v-for="(item, index) in type_data" :key="index" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
        <a-input-search placeholder="请输入剧本名称" style="width: 200px" @search="onSearch" class="align" />
        <a-dropdown>
            <a-menu slot="overlay" @click="handleMenuClick">
                <a-menu-item key="1">
                    <a-icon type="upload" /> 本地导入
                </a-menu-item>
                <a-menu-item key="2">
                    <a-icon type="cloud-upload" /> 云端导入
                </a-menu-item>
            </a-menu>
            <a-button type="primary" icon="plus-circle" class="align btn_add" @click="tzAddPlayBook">创建剧本
                <a-icon type="down" />
            </a-button>
        </a-dropdown>
    </div>
    <a-table rowKey="id" :columns="columns" :data-source="data" :loading="loading" :pagination="pagination">
        <a-tag slot="type" slot-scope="text" color="#3b9c30" style="padding-top: 4px;line-height: 17px;" v-if="text.timer_app!=''">
            <a-tooltip placement="top">
                <template slot="title">
                    <span>定时器剧本</span>
                </template>
                <alarm-clock theme="outline" size="14" fill="#fff" />
            </a-tooltip>
        </a-tag>
        <a-tag slot="type" slot-scope="text" color="#53b0b5" style="padding-top: 4px;line-height: 17px;" v-else-if="text.webhook_app!=''">
            <a-tooltip placement="top">
                <template slot="title">
                    <span>WebHook剧本</span>
                </template>
                <ring theme="outline" size="14" fill="#fff" />
            </a-tooltip>
        </a-tag>
        <a-tag slot="type" slot-scope="text" color="#b628da" style="padding-top: 4px;line-height: 17px;" v-else-if="text.input_app!=''">
            <a-tooltip placement="top">
                <template slot="title">
                    <span>用户输入剧本</span>
                </template>
                <textx theme="outline" size="14" fill="#fff" />
            </a-tooltip>
        </a-tag>
        <a-tag slot="type" color="#355070" style="padding-top: 4px;line-height: 17px;" v-else>
            <a-tooltip placement="top">
                <template slot="title">
                    <span>普通剧本</span>
                </template>
                <connection-point theme="outline" size="14" fill="#fff" />
            </a-tooltip>
        </a-tag>

        <span slot="thumbnail" slot-scope="text,record">
            <!-- <img v-if="record.thumbnail" class="thumbnail" :src="record.thumbnail" /> -->
            <div v-if="record.thumbnail" class="thumbnail" :style="`background-color:#202020;background-image:url(${record.thumbnail});background-repeat:no-repeat;background-position: inherit;
    background-size: cover;
    height: 100px;border-radius: 5px;`">

            </div>
            <div v-else class="thumbnail">
                暂无缩略图
            </div>
        </span>

        <a-tag slot="type_name" slot-scope="text" color="#cf3f3d">
            {{ text }}
        </a-tag>

        <span slot="name" slot-scope="text,record">
            <!-- <a-tooltip placement="top"> -->
            <!-- <template slot="title"> -->
            <!-- <span>查看剧本执行统计数据</span> -->
            <!-- </template> -->
            <!-- <span class="playbook_name" @click="tzStatistics(record.uuid)"> -->
            <!-- <span class="playbook_name"> -->
            <!-- <a-icon type="bar-chart" /> -->
            <b> {{ text }}</b>
            <!-- </span> -->
            <!-- </a-tooltip> -->
        </span>

        <a-tag slot="nick_name" slot-scope="text" color="blue">
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
                    <a-popconfirm title="是否要删除该剧本?" ok-text="是" cancel-text="否" @confirm="del(record.uuid)">
                        <a-icon class="pointer" type="delete" />
                    </a-popconfirm>
                </a-tooltip>

                <span>|</span>

                <a-tooltip placement="top">
                    <template slot="title">
                        <span>编辑</span>
                    </template>
                    <a-icon class="pointer" type="form" @click="tzUpdatePlayBook(record.uuid)" />
                </a-tooltip>

                <span>|</span>

                <a-tooltip placement="top">
                    <template slot="title">
                        <span>导出</span>
                    </template>
                    <a-icon class="pointer" type="cloud-download" @click="onDown(record.uuid)" />
                </a-tooltip>
            </a-space>
        </span>
    </a-table>

    <a-modal title="云端导入" cancelText="关闭" okText="导入" :width="600" :visible="visible_input_url" @ok="onSaveUrlInput" @cancel="onCloseUrlInput">
        <a-row :gutter="16">
            <a-col :span="24">
                <a-input v-model="input_url" placeholder="请输入 W5 JSON 地址">
                    <a-icon slot="prefix" type="global" />
                </a-input>
            </a-col>
        </a-row>
    </a-modal>

    <input style="display: none;" type="file" @change="upload_json" ref="inputer" accept="application/json">
</a-layout-content>
</template>

<script>
import {
    AlarmClock,
    Text as Textx,
    Ring,
    ConnectionPoint
} from '@icon-park/vue';

const columns = [{
        title: "缩略图",
        key: "thumbnail",
        scopedSlots: {
            customRender: "thumbnail",
        },
        width: 200,
    }, {
        title: "类型",
        key: "type",
        scopedSlots: {
            customRender: "type",
        },
        width: 60,
    }, {
        title: "分类",
        dataIndex: "type_name",
        key: "type_name",
        scopedSlots: {
            customRender: "type_name",
        },
        width: 116,
    }, {
        title: "剧本名称",
        dataIndex: "name",
        key: "name",
        scopedSlots: {
            customRender: "name",
        },
        width: 260,
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
        title: "创建人",
        dataIndex: "nick_name",
        key: "nick_name",
        scopedSlots: {
            customRender: "nick_name",
        },
        width: 90,
    },
    {
        title: "更新时间",
        key: "update_time",
        dataIndex: "update_time",
        scopedSlots: {
            customRender: "update_time",
        },
        width: 190,
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
        width: 80,
    },
    {
        title: "操作",
        key: "action",
        scopedSlots: {
            customRender: "action",
        },
        width: 116,
    }
];

export default {
    name: "workflowHome",
    components: {
        AlarmClock,
        Textx,
        Ring,
        ConnectionPoint
    },
    data() {
        return {
            columns,
            loading: false,
            visible_input_url: false,
            data: [],
            so_text: "",
            select_type: "0",
            type_data: [],
            input_url: "",
            pagination: {
                total: 0,
                defaultPageSize: 10,
                showTotal: total => `共 ${total} 条数据`,
                showSizeChanger: true,
                pageSizeOptions: ['10', '15', '20', '50', '100'],
                onShowSizeChange: this.onPageShowSizeChange,
                onChange: this.onPageChange
            },
            curr_page: 1,
            curr_page_size: 10
        };
    },
    mounted() {
        this.onLoad();
    },
    methods: {
        onPageShowSizeChange(current, pageSize) {
            this.curr_page = current;
            this.curr_page_size = pageSize;
            this.onLoad(this.so_text, this.select_type, current, pageSize);
        },
        onPageChange(page, pageSize) {
            this.curr_page = page;
            this.curr_page_size = pageSize;
            this.onLoad(this.so_text, this.select_type, page, pageSize);
        },
        onLoad(keywords = "", type = "0", page = 1, page_count = 10) {
            this.loading = true;
            this.onSelectType();
            this.$http
                .post("/api/v1/w5/get/workflow/list", {
                    keywords: keywords,
                    type: type,
                    page: page,
                    page_count: page_count
                })
                .then((res) => {
                    if (res.code == 0) {
                        this.data = res.data.list;
                        this.pagination.total = res.data.total_count;
                        this.loading = false;
                    } else {
                        this.$message.error(res.msg);
                        this.loading = false;
                    }
                });
        },
        onSaveUrlInput() {
            this.$http
                .post("/api/v1/w5/get/workflow/import_url", {
                    url: this.input_url
                })
                .then((res) => {
                    if (res.code == 0) {
                        let data = res.data.data;
                        this.addPlayBook(data);
                        this.onCloseUrlInput();
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        onCloseUrlInput() {
            this.visible_input_url = false;
        },
        onDown(uuid) {
            this.$http
                .post("/api/v1/w5/post/workflow/detail", {
                    uuid: uuid
                })
                .then((res) => {
                    if (res.code == 0) {
                        let workflow_name = res.data.name;
                        let work_remarks = res.data.remarks;
                        var data;
                        var app_data;
                        var local_var_data;
                        var controller_data;

                        if (res.data.flow_json.trim() === "") {
                            data = {
                                nodes: [],
                                edges: []
                            }
                        } else {
                            data = JSON.parse(res.data.flow_json);
                        }

                        if (res.data.flow_data === "none" || res.data.flow_data.trim() === "" || res.data.flow_data.trim() === "{}") {
                            app_data = {}
                        } else {
                            app_data = JSON.parse(res.data.flow_data);
                        }

                        let start_app = res.data.start_app;
                        let end_app = res.data.end_app;
                        let input_app = res.data.input_app;
                        let webhook_app = res.data.webhook_app;
                        let timer_app = res.data.timer_app;
                        let for_list = res.data.for_list;
                        let if_list = res.data.if_list;
                        let audit_list = res.data.audit_list;

                        if (res.data.local_var_data === "none" || res.data.local_var_data.trim() === "" || res.data.local_var_data.trim() === "[]") {
                            local_var_data = []
                        } else {
                            local_var_data = JSON.parse(res.data.local_var_data);
                        }

                        if (res.data.controller_data === "none" || res.data.controller_data.trim() === "" || res.data.controller_data.trim() === "{}") {
                            controller_data = {}
                        } else {
                            controller_data = JSON.parse(res.data.controller_data);
                        }

                        var file_name;

                        if (work_remarks.trim() == "") {
                            file_name = workflow_name;
                        } else {
                            file_name = workflow_name + "-" + work_remarks;
                        }

                        let content = {
                            name: workflow_name,
                            remarks: work_remarks,
                            start_app: start_app,
                            end_app: end_app,
                            input_app: input_app,
                            webhook_app: webhook_app,
                            timer_app: timer_app,
                            for_list: for_list,
                            if_list: if_list,
                            audit_list: audit_list,
                            flow_json: data,
                            flow_data: app_data,
                            local_var_data: local_var_data,
                            controller_data: controller_data,
                            grid_type: res.data.grid_type,
                            edge_marker: res.data.edge_marker,
                            edge_color: res.data.edge_color,
                            edge_connector: res.data.edge_connector,
                            edge_router: res.data.edge_router,
                            thumbnail: res.data.thumbnail
                        }

                        let ele = document.createElement('a');
                        ele.download = file_name + ".json";
                        ele.style.display = 'none';
                        let blob = new Blob([JSON.stringify(content)], {
                            type: 'application/json'
                        })
                        ele.href = URL.createObjectURL(blob);
                        document.body.appendChild(ele);
                        ele.click();
                        document.body.removeChild(ele);
                    } else {
                        this.$message.error(res.msg);
                    }
                });

        },
        handleMenuClick(e) {
            if (e.key == 1) {
                this.$refs.inputer.click()
            } else if (e.key == 2) {
                this.visible_input_url = true;
            }
        },
        upload_json(e) {
            let input = e.target;
            let reader = new FileReader()
            reader.readAsText(input.files[0], 'utf8')
            reader.onload = () => {
                try {
                    let data_list = JSON.parse(reader.result);
                    this.addPlayBook(data_list);
                } catch (e) {
                    console.log(e)
                    this.$message.error("导入失败，请检测 W5 JSON 文件是否正确");
                    return false;
                }
            }
        },
        addPlayBook(data_list) {
            if (
                !data_list.hasOwnProperty("name") ||
                !data_list.hasOwnProperty("remarks") ||
                !data_list.hasOwnProperty("start_app") ||
                !data_list.hasOwnProperty("end_app") ||
                !data_list.hasOwnProperty("input_app") ||
                !data_list.hasOwnProperty("webhook_app") ||
                !data_list.hasOwnProperty("timer_app") ||
                !data_list.hasOwnProperty("flow_json") ||
                !data_list.hasOwnProperty("flow_data") ||
                !data_list.hasOwnProperty("controller_data") ||
                !data_list.hasOwnProperty("local_var_data") ||
                !data_list.hasOwnProperty("grid_type") ||
                !data_list.hasOwnProperty("edge_marker") ||
                !data_list.hasOwnProperty("edge_color") ||
                !data_list.hasOwnProperty("edge_connector") ||
                !data_list.hasOwnProperty("edge_router") ||
                !data_list.hasOwnProperty("for_list") ||
                !data_list.hasOwnProperty("if_list") ||
                !data_list.hasOwnProperty("audit_list") ||
                !data_list.hasOwnProperty("thumbnail")
            ) {
                this.$message.error("非法格式,请检查是否为 W5 SOAR 专用 JSON 文件");
                return false;
            }

            let nodes = data_list.flow_json.cells;

            for (let index = 0; index < nodes.length; index++) {
                if (nodes.shape === "html") {
                    let img_url = nodes[index].data.icon;
                    let path = img_url.replace(/^http:\/\/[^/]+/, "").replace(/^https:\/\/[^/]+/, "");
                    let new_img_url = this.BaseURL + path;
                    nodes[index].data.icon = new_img_url
                }
            }

            this.$http
                .post("/api/v1/w5/post/workflow/add", {
                    type: 1,
                    name: data_list.name,
                    remarks: data_list.remarks,
                    start_app: data_list.start_app,
                    end_app: data_list.end_app,
                    input_app: data_list.input_app,
                    webhook_app: data_list.webhook_app,
                    timer_app: data_list.timer_app,
                    for_list: data_list.for_list,
                    if_list: data_list.if_list,
                    audit_list: data_list.audit_list,
                    flow_json: JSON.stringify(data_list.flow_json),
                    flow_data: JSON.stringify(data_list.flow_data),
                    controller_data: JSON.stringify(data_list.controller_data),
                    local_var_data: JSON.stringify(data_list.local_var_data),
                    grid_type: data_list.grid_type,
                    edge_marker: data_list.edge_marker,
                    edge_color: data_list.edge_color,
                    edge_connector: data_list.edge_connector,
                    edge_router: data_list.edge_router,
                    thumbnail: data_list.thumbnail
                })
                .then((res) => {
                    if (res.code == 0) {
                        let uuid = res.data.uuid;
                        this.$router.push({
                            name: "WorkflowEdit",
                            params: {
                                uuid: uuid
                            }
                        });
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        onSelectType() {
            this.$http
                .post("/api/v1/w5/get/type/list", {
                    type: 1,
                })
                .then((res) => {
                    if (res.code == 0) {
                        this.type_data = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        del(uuid) {
            this.$http
                .post("/api/v1/w5/post/workflow/del", {
                    uuid: uuid,
                })
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success("删除成功");
                        this.onLoad(this.so_text, this.select_type, this.curr_page, this.curr_page_size);
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        onSearch(value) {
            this.so_text = value;
            this.onLoad(this.so_text, this.select_type);
        },
        onSelect(value) {
            this.select_type = value;
            this.onLoad(this.so_text, this.select_type);
        },
        tzAddPlayBook() {
            this.$http
                .post("/api/v1/w5/post/workflow/add", {
                    type: 0
                })
                .then((res) => {
                    if (res.code == 0) {
                        let uuid = res.data.uuid;
                        this.$router.push({
                            name: "WorkflowEdit",
                            params: {
                                uuid: uuid
                            }
                        });
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        tzUpdatePlayBook(uuid) {
            this.$router.push({
                name: "WorkflowEdit",
                params: {
                    uuid: uuid
                }
            });
        },
        tzStatistics(uuid) {
            this.$router.push({
                name: "StatisticsHome",
                params: {
                    uuid: uuid
                }
            });
        },
        onSwitch(bool, id) {
            var status = 1;
            if (bool) {
                status = 0
            }

            this.$http
                .post("/api/v1/w5/post/workflow/status", {
                    id: id,
                    status: status
                })
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success("操作成功");
                        this.onLoad(this.so_text, this.select_type, this.curr_page, this.curr_page_size);
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

    .thumbnail {
        border: 1px solid #dbdbdb;
        width: auto;
        height: 100px;
        border: 1px solid #dbdbdb;
        text-align: center;
        color: #727272;
        line-height: 100px;
        font-size: 12px;
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

    .thumbnail {
        border: 1px solid #4c4c4c;
        width: auto;
        height: 100px;
        border: 1px solid #4c4c4c;
        text-align: center;
        color: #727272;
        line-height: 100px;
        font-size: 12px;
    }
}

.playbook_name {
    cursor: pointer;
}
</style>
