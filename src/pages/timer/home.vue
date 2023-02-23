<template>
<a-layout-content>
    <div class="header_div">
        <a-input-search placeholder="请输入关键字" style="width: 200px" @search="onSearch" class="align" />
        <a-button type="primary" :loading="startPaueLoading" icon="play-circle" class="align btn_add" style="background-color: #469824;border-color: #469824;margin-left:10px;" @click="onStartPause('all','start')">
            启动全部
        </a-button>
        <a-button type="primary" :loading="startPaueLoading" icon="pause-circle" class="align btn_add" @click="onStartPause('all','pause')">
            停止全部
        </a-button>
    </div>
    <a-table rowKey="id" :columns="columns" :data-source="data" :loading="loading" :pagination="pagination">
        <span slot="name" slot-scope="text,record">
            <a-tooltip placement="top">
                <template slot="title">
                    <span>打开剧本</span>
                </template>
                <a-icon class="pointer" type="link" @click="onTz(record.uuid)" /> <b style="margin-left:5px;">{{ text }}</b>
            </a-tooltip>
        </span>

        <a-tag slot="type" slot-scope="text" color="#c63935" v-if="text=='cron'">
            执行计划
        </a-tag>
        <a-tag slot="type" slot-scope="text" color="#3356b9" v-else-if="text=='date'">
            定时执行
        </a-tag>
        <a-tag slot="type" slot-scope="text" color="#2d9bad" v-else-if="text=='interval'">
            间隔执行
        </a-tag>

        <a-tag slot="time" slot-scope="text,record" color="#cf3f3d">
            <a-tooltip placement="top" v-if="record.type=='cron'">
                <template slot="title">
                    <span v-if="String(record.start_date).trim()===''">开始时间：未设置</span>
                    <span v-else>开始时间：{{record.start_date}}</span>

                    <span v-if="String(record.end_date).trim()===''">结束时间：未设置</span>
                    <span v-else>结束时间：{{record.end_date}}</span>

                    <span>随机浮动时间：{{record.jitter}}</span>
                </template>
                {{ text }}
            </a-tooltip>
            <a-tooltip placement="top" v-if="record.type=='interval'">
                <template slot="title">
                    <span v-if="String(record.start_date).trim()===''">开始时间：未设置</span>
                    <span v-else>开始时间：{{record.start_date}}</span>

                    <span v-if="String(record.end_date).trim()===''">结束时间：未设置</span>
                    <span v-else>结束时间：{{record.end_date}}</span>

                    <span>随机浮动时间：{{record.jitter}}</span>
                </template>
                {{ text }}
                <span v-if="record.interval_type=='seconds'">秒钟</span>
                <span v-if="record.interval_type=='minutes'">分钟</span>
                <span v-if="record.interval_type=='hours'">小时</span>
                <span v-if="record.interval_type=='days'">天</span>
                <span v-if="record.interval_type=='weeks'">周</span>
            </a-tooltip>
            <a-tooltip placement="top" v-if="record.type=='date'">
                <template slot="title">
                    <span>指定时间执行，只执行一次</span>
                </template>
                {{ text }}
            </a-tooltip>
        </a-tag>

        <span slot="status" slot-scope="text,record">
            <span v-if="record.type=='cron'">
                <span v-if="String(record.end_date).trim()===''">
                    <a-tag v-if="text==0" color="#c63935">停止中...</a-tag>
                    <a-tag v-if="text==1" color="#469823">执行中...</a-tag>
                </span>
                <span v-else>
                    <span v-if="new Date(record.end_date).getTime()>=new Date().getTime()">
                        <a-tag v-if="text==0" color="#c63935">停止中...</a-tag>
                        <a-tag v-if="text==1" color="#469823">执行中...</a-tag>
                    </span>
                    <span v-else>
                        <a-tag color="#585858">已结束...</a-tag>
                    </span>
                </span>
            </span>
            <span v-if="record.type=='interval'">
                <span v-if="String(record.end_date).trim()===''">
                    <a-tag v-if="text==0" color="#c63935">停止中...</a-tag>
                    <a-tag v-if="text==1" color="#469823">执行中...</a-tag>
                </span>
                <span v-else>
                    <span v-if="new Date(record.end_date).getTime()>=new Date().getTime()">
                        <a-tag v-if="text==0" color="#c63935">停止中...</a-tag>
                        <a-tag v-if="text==1" color="#469823">执行中...</a-tag>
                    </span>
                    <span v-else>
                        <a-tag color="#585858">已结束...</a-tag>
                    </span>
                </span>
            </span>
            <span v-if="record.type=='date'">
                <span v-if="new Date(record.time).getTime()>=new Date().getTime()">
                    <a-tag v-if="text==0" color="#c63935">停止中...</a-tag>
                    <a-tag v-if="text==1" color="#469823">执行中...</a-tag>
                </span>
                <span v-else>
                    <a-tag color="#585858">已结束...</a-tag>
                </span>
            </span>
        </span>

        <div slot="create_time" slot-scope="text">
            {{Dayjs(text).subtract(8, 'hour').format('YYYY-MM-DD HH:mm:ss')}}
        </div>

        <div slot="update_time" slot-scope="text">
            {{Dayjs(text).subtract(8, 'hour').format('YYYY-MM-DD HH:mm:ss')}}
        </div>

        <div slot="action" slot-scope="text, record" style="text-align: center;">
            <span v-if="record.type=='date'">
                <span v-if="new Date(record.time).getTime()>=new Date().getTime()">
                    <a-tooltip placement="top" v-if="record.status==0">
                        <template slot="title">
                            <span>启动执行剧本</span>
                        </template>
                        <a-button size="small" shape="circle" type="primary" style="background-color: #469824;border-color: #469824;" icon="play-circle" :loading="startPaueLoading" @click="onStartPause(record.timer_uuid,'start')"></a-button>
                    </a-tooltip>

                    <a-tooltip placement="top" v-if="record.status==1">
                        <template slot="title">
                            <span>停止执行剧本</span>
                        </template>
                        <a-button size="small" shape="circle" type="primary" icon="pause-circle" :loading="startPaueLoading" @click="onStartPause(record.timer_uuid,'pause')"></a-button>
                    </a-tooltip>
                </span>
                <span v-else>
                    <a-tooltip placement="top">
                        <template slot="title">
                            <span>已经结束，无法操作</span>
                        </template>
                        <a-button size="small" shape="circle" type="primary" style="background-color: #469824;border-color: #469824;" icon="play-circle" :loading="startPaueLoading" disabled></a-button>
                    </a-tooltip>
                </span>
            </span>
            <span v-else>
                <a-tooltip placement="top" v-if="record.status==0">
                    <template slot="title">
                        <span>启动执行剧本</span>
                    </template>
                    <a-button size="small" shape="circle" type="primary" style="background-color: #469824;border-color: #469824;" icon="play-circle" :loading="startPaueLoading" @click="onStartPause(record.timer_uuid,'start')"></a-button>
                </a-tooltip>

                <a-tooltip placement="top" v-if="record.status==1">
                    <template slot="title">
                        <span>停止执行剧本</span>
                    </template>
                    <a-button size="small" shape="circle" type="primary" icon="pause-circle" :loading="startPaueLoading" @click="onStartPause(record.timer_uuid,'pause')"></a-button>
                </a-tooltip>
            </span>
        </div>
    </a-table>

</a-layout-content>
</template>

<script>
const columns = [{
        title: "剧本名称",
        dataIndex: "name",
        key: "name",
        scopedSlots: {
            customRender: "name",
        },
        width: 260
    },
    {
        title: "类型",
        dataIndex: "type",
        key: "type",
        scopedSlots: {
            customRender: "type",
        },
        width: 100
    },
    {
        title: "时间",
        dataIndex: "time",
        key: "time",
        scopedSlots: {
            customRender: "time",
        }
    },
    {
        title: "更新时间",
        key: "update_time",
        dataIndex: "update_time",
        scopedSlots: {
            customRender: "update_time",
        },
        width: 190
    },
    {
        title: "创建时间",
        key: "create_time",
        dataIndex: "create_time",
        scopedSlots: {
            customRender: "create_time",
        },
        width: 190
    },
    {
        title: "状态",
        key: "status",
        dataIndex: "status",
        scopedSlots: {
            customRender: "status",
        },
        width: 100
    },
    {
        title: "操作",
        key: "action",
        scopedSlots: {
            customRender: "action",
        },
        width: 60
    },
];
export default {
    name: 'timerHome',
    data() {
        return {
            columns,
            loading: false,
            data: [],
            so_text: "",
            startPaueLoading: false,
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
        }
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
        onLoad(keywords = "", page = 1, page_count = 10) {
            this.loading = true;
            this.$http
                .post("/api/v1/w5/get/timer/list", {
                    keywords: keywords,
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
        onStartPause(uuid, type) {
            this.startPaueLoading = true;

            this.$http
                .post("/api/v1/w5/post/timer/start_pause", {
                    uuid: uuid,
                    type: type
                })
                .then((res) => {
                    if (res.code == 0) {
                        this.onLoad();
                        this.startPaueLoading = false;
                    } else {
                        this.$message.error(res.msg);
                        this.startPaueLoading = false;
                    }
                }).catch((err) => {
                    this.startPaueLoading = false;
                });
        },
        onTz(uuid) {
            this.$router.push({
                name: "WorkflowEdit",
                params: {
                    uuid: uuid
                }
            });
        },
        onSearch(value) {
            this.so_text = value;
            this.onLoad(this.so_text);
        },
    },
}
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
