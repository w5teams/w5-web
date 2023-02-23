<template>
<a-layout-content>
    <div class="header_div">
        <a-select show-search :filter-option="onFilterOption" default-value="all" style="width: 120px" @change="onSelect" class="align">
            <a-select-option value="all">全部</a-select-option>
            <a-select-option value="0">待审核</a-select-option>
            <a-select-option value="1">审计通过</a-select-option>
            <a-select-option value="2">审计拒绝</a-select-option>
        </a-select>

        <a-input-search placeholder="请输入剧本/审核人" style="width: 200px" @search="onSearch" class="align" />
    </div>
    <a-table rowKey="id" :columns="columns" :data-source="data" :loading="loading" :pagination="pagination">
        <span slot="avatar" slot-scope="text">
            <div class="tableAvatar" v-html="text"></div>
        </span>

        <span slot="nick_name" slot-scope="text">
            <b>{{ text }}</b>
        </span>

        <a-tag slot="name" slot-scope="text" color="#cf3f3d">
            {{ text }}
        </a-tag>

        <span slot="update_time" slot-scope="text">
            {{Dayjs(text).subtract(8, 'hour').format('YYYY-MM-DD HH:mm:ss')}}
        </span>

        <span slot="create_time" slot-scope="text">
            {{Dayjs(text).subtract(8, 'hour').format('YYYY-MM-DD HH:mm:ss')}}
        </span>

        <div slot="status" slot-scope="text">
            <a-tag slot="name" color="#888888" v-if="text===0">
                待审计
            </a-tag>
            <a-tag slot="name" color="#499b34" v-else-if="text===1">
                审计通过
            </a-tag>
            <a-tag slot="name" color="#761b1b" v-else-if="text===2">
                审计拒绝
            </a-tag>
        </div>

        <span slot="action" slot-scope="text, record">
            <a-tooltip placement="top" v-if="record.status==0">
                <template slot="title">
                    <span>审计</span>
                </template>
                <a-icon class="pointer" type="audit" @click="onShowAudit(record.id, record.workflow_uuid, record.only_id, record.audit_app, record.start_app)" />
            </a-tooltip>

            <a-tooltip placement="top" v-else-if="record.status==1">
                <template slot="title">
                    <span>审计通过</span>
                </template>
                <a-icon class="pointer" type="check-circle" style="color: #3ac119;" />
            </a-tooltip>

            <a-tooltip placement="top" v-else-if="record.status==2">
                <template slot="title">
                    <span>审计拒绝</span>
                </template>
                <a-icon class="pointer" type="close-circle" style="color: #bb1515;" />
            </a-tooltip>

        </span>
    </a-table>

    <a-modal title="审计执行日志" cancelText="拒绝" okText="通过" :maskClosable="false" :width="800" :visible="visible_audit_log" @cancel="onCloseShow">
        <slot slot="footer">
            <a-button type="danger" @click="onAuditUpdate(2)">
                拒绝
            </a-button>
            <a-button type="primary" @click="onAuditUpdate(1)">
                通过
            </a-button>
        </slot>
        <div id="report">
            <a-row :gutter="16" class="report" style="margin: auto;">

                <a-col :span="24" v-for="(item,index) in log_data" :key="index" class="div2">
                    <a-descriptions :column="1" bordered size="small">
                        <div slot="title">
                            <span class="title">
                                <span class="jing">{{index+1}}、</span>{{item.app_name}}
                            </span>
                            <span v-if="item.app_name!='开始' && item.app_name!='结束' && item.app_name!='用户输入' && item.app_name!='WebHook' && item.app_name!='定时器' && item.app_name!='人工审计'" class="desc">
                                {{item.args.description}}
                            </span>
                        </div>
                        <a-descriptions-item label="UUID">
                            <b>{{item.app_uuid}}</b>
                        </a-descriptions-item>
                        <a-descriptions-item label="动作" v-if="item.app_name!='开始' && item.app_name!='结束' && item.app_name!='用户输入' && item.app_name!='WebHook' && item.app_name!='定时器' && item.app_name!='人工审计'">
                            <b>{{item.args.action_name}}</b>
                        </a-descriptions-item>
                        <a-descriptions-item label="参数" v-if="item.app_name!='开始' && item.app_name!='结束' && item.app_name!='用户输入' && item.app_name!='WebHook' && item.app_name!='定时器' && item.app_name!='人工审计'">
                            <div v-for="(i,key,index) in item.args" :key="index" class="args_list">
                                <div v-if="key!='action' && key!='action_name' && key!='description' && key!='node_name'">
                                    <div class="args_title"><span class="jing">|</span> {{key}}</div>
                                    <div>{{i}}</div>
                                </div>
                            </div>
                        </a-descriptions-item>
                        <a-descriptions-item label="状态">
                            <a-tag v-if="item.status==0" color="#469823">正常</a-tag>
                            <a-tag v-if="item.status==1" color="#9e8c0a">警告</a-tag>
                            <a-tag v-if="item.status==2" color="#9c5656">错误</a-tag>
                            <a-tag v-if="item.status==3" color="#bf0c0c">危险</a-tag>
                        </a-descriptions-item>
                        <a-descriptions-item label="结果" v-if="item.app_name!=='用户输入' && item.app_name!=='WebHook'">
                            <pre v-html="item.html" style="white-space: pre-wrap; word-wrap: break-word;"></pre>
                        </a-descriptions-item>
                        <a-descriptions-item label="输入" v-else>
                            <pre v-html="item.html" style="white-space: pre-wrap; word-wrap: break-word;"></pre>
                        </a-descriptions-item>
                        <a-descriptions-item label="执行时间">
                            {{Dayjs(item.create_time).subtract(8, 'hour').format('YYYY-MM-DD HH:mm:ss')}}
                        </a-descriptions-item>
                    </a-descriptions>
                </a-col>
            </a-row>
        </div>
    </a-modal>
</a-layout-content>
</template>

<script>
const columns = [{
        title: "剧本",
        dataIndex: "name",
        key: "name",
        scopedSlots: {
            customRender: "name",
        },
    },
    {
        title: "创建时间",
        key: "create_time",
        dataIndex: "create_time",
        scopedSlots: {
            customRender: "create_time",
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
    {
        title: "状态",
        key: "status",
        dataIndex: "status",
        scopedSlots: {
            customRender: "status",
        },
    },
    {
        title: "审核人",
        dataIndex: "avatar",
        key: "avatar",
        scopedSlots: {
            customRender: "avatar",
        },
        width: 80
    },
    {
        dataIndex: "nick_name",
        key: "nick_name",
        scopedSlots: {
            customRender: "nick_name",
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
    name: "auditHome",
    data() {
        return {
            columns,
            loading: false,
            so_text: "",
            data: [],
            log_data: [],
            id: 0,
            uuid: "",
            only_id: "",
            audit_app: "",
            start_app: "",
            visible_audit_log: false,
            select_type: "all",
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
        onLoad(keywords = "", select_type = "all", page = 1, page_count = 10) {
            this.loading = true;
            this.$http
                .post("/api/v1/w5/get/audit/list", {
                    keywords: keywords,
                    type: select_type,
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
        onSearch(value) {
            this.so_text = value;
            this.onLoad(this.so_text, this.select_type);
        },
        onSelect(value) {
            this.select_type = value;
            this.onLoad(this.so_text, this.select_type);
        },
        onCloseShow() {
            this.visible_audit_log = false;
        },
        onFilterOption(input, option) {
            return (
                option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
        },
        onReportLog(only_id) {
            this.$http
                .post("/api/v1/w5/get/report/log", {
                    only_id: only_id,
                })
                .then((res) => {
                    if (res.code == 0) {
                        this.log_data = res.data;
                        this.visible_audit_log = true;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        onShowAudit(id, uuid, only_id, audit_app, start_app) {
            this.id = id;
            this.uuid = uuid;
            this.only_id = only_id;
            this.audit_app = audit_app;
            this.start_app = start_app;
            this.onReportLog(only_id);
        },
        onAuditUpdate(status) {
            this.$http
                .post("/api/v1/w5/post/audit/update", {
                    id: this.id,
                    status: status,
                    user: this.$cookies.get("nick_name"),
                    workflow_uuid: this.uuid,
                    only_id: this.only_id,
                    audit_app: this.audit_app,
                    start_app: this.start_app
                })
                .then((res) => {
                    if (res.code == 0) {
                        this.onLoad(this.so_text, this.select_type, this.curr_page, this.curr_page_size);
                        this.visible_audit_log = false;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        }
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

.tableAvatar {
    width: 30px;
    border: 1px solid #fff;
    border-radius: 100%;
    height: 30px;
    padding: 2px;
}

.report {
    width: 90%;

    .header {
        text-align: center;

        .logo_title {
            font-weight: bold;
            font-size: 24px;
            margin-top: 35px;
        }

        .logo {
            width: 250px;
            margin-top: 180px;
        }
    }

    .div1 {
        margin-top: 150px;

        .title {
            font-size: 20px;
            font-weight: bold;

            .jing {
                margin-right: 10px;
                color: #cc403c;
            }
        }
    }

    .div2 {
        margin-top: 60px;

        .title {
            font-size: 20px;
            font-weight: bold;

            .jing {
                margin-right: 10px;
                color: #cc403c;
            }
        }

        .desc {
            font-weight: 400;
            margin-left: 10px;
            font-size: 14px;
            color: #565656;
        }

        .args_list {
            margin-bottom: 20px;

            .args_title {
                font-weight: bold;
                margin-bottom: 5px;

                .jing {
                    color: #cc403c;
                    margin-right: 5px;
                }
            }
        }

    }
}
</style>
