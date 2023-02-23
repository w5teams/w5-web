<template>
<a-layout-content>
    <div class="header_div">
        <a-select v-if="type_show" show-search :filter-option="onFilterOption" default-value="0" style="width: 250px" @change="onSelect" class="align">
            <a-select-option value="0">全部</a-select-option>
            <a-select-option v-for="(item, index) in type_data" :key="index" :value="item.uuid">{{ item.name }}</a-select-option>
        </a-select>
        <a-input-search placeholder="请输入关键字" style="width: 200px" @search="onSearch" class="align" />

        <a-button v-if="switchType==1" type="primary" icon="file-pdf" class="align btn_add" @click="onSwitch(true)">
            切换报告
        </a-button>
        <a-button v-else-if="switchType==2" type="primary" icon="bug" class="align btn_add" @click="onSwitch(true)">
            切换日志
        </a-button>
    </div>
    <a-table rowKey="id" :columns="columns" :data-source="data" :loading="loading" :pagination="pagination">
        <span slot="name" slot-scope="text">
            <b>{{ text }}</b>
        </span>

        <span slot="app_name" slot-scope="text, record" v-if="text=='开始'">
            <a-avatar :size="22" style="margin-right:3px;" :src="BaseURL+'/app/basic/start.png'" />
            <a-tag color="#1863d4">{{ text }} </a-tag>
        </span>
        <span slot="app_name" slot-scope="text, record" v-else-if="text=='结束'">
            <a-avatar :size="22" style="margin-right:3px;" :src="BaseURL+'/app/basic/end.png'" />
            <a-tag color="#b92525">{{ text }} </a-tag>
        </span>
        <span slot="app_name" slot-scope="text, record" v-else-if="text=='定时器'">
            <a-avatar :size="22" style="margin-right:3px;" :src="BaseURL+'/app/basic/timer.png'" />
            <a-tag color="#3ca03b">{{ text }} </a-tag>
        </span>
        <span slot="app_name" slot-scope="text, record" v-else-if="text=='用户输入'">
            <a-avatar :size="22" style="margin-right:3px;" :src="BaseURL+'/app/basic/input.png'" />
            <a-tag color="#b628da">{{ text }} </a-tag>
        </span>
        <span slot="app_name" slot-scope="text, record" v-else-if="text=='WebHook'">
            <a-avatar :size="22" style="margin-right:3px;" :src="BaseURL+'/app/basic/webhook.png'" />
            <a-tag color="#53b0b5">{{ text }} </a-tag>
        </span>
        <span slot="app_name" slot-scope="text, record" v-else-if="text=='人工审计'">
            <a-avatar :size="22" style="margin-right:3px;" :src="BaseURL+'/app/basic/audit.png'" />
            <a-tag color="#fd973f">{{ text }} </a-tag>
        </span>
        <span slot="app_name" slot-scope="text, record" v-else-if="text==''">
            <a-avatar :size="22" style="margin-right:3px;" :src="BaseURL+'/app/basic/unknown.png'" />
            <a-tag color="#53b0b5">{{ text }} </a-tag>
        </span>
        <span slot="app_name" slot-scope="text, record" v-else>
            <a-avatar :size="22" style="margin-right:3px;" :src="BaseURL+'/app/'+JSON.parse(record.args).app_dir+'/icon.png'" />
            <a-tag color="#7d838c">{{ text }} </a-tag>
        </span>

        <span slot="status" slot-scope="text">
            <a-tag v-if="text==0" color="#469823">正常</a-tag>
            <a-tag v-if="text==1" color="#9e8c0a">警告</a-tag>
            <a-tag v-if="text==2" color="#9c5656">错误</a-tag>
            <a-tag v-if="text==3" color="#bf0c0c">危险</a-tag>
        </span>

        <di slot="create_time" slot-scope="text">
            {{Dayjs(text).subtract(8, 'hour').format('YYYY-MM-DD HH:mm:ss')}}
        </di>

        <div slot="action" slot-scope="text, record" style="text-align: center;">
            <a-space size="small">
                <a-tooltip placement="left">
                    <template slot="title">
                        <span>删除</span>
                    </template>
                    <a-popconfirm title="是否要删除该日志?" ok-text="是" cancel-text="否" @confirm="del(record.id)">
                        <a-icon class="pointer" type="delete" />
                    </a-popconfirm>
                </a-tooltip>
            </a-space>
        </div>

        <span slot="workflow_name" slot-scope="text">
            <b>{{ text }}</b>
        </span>

        <a-tag slot="report_no" slot-scope="text" color="#cf3f3d">
            {{ text }}
        </a-tag>

        <div slot="actionReport" slot-scope="text, record" style="text-align: center;">
            <a-space size="small">
                <a-tooltip placement="left">
                    <template slot="title">
                        <span>删除</span>
                    </template>
                    <a-popconfirm title="是否要删除该报告?" ok-text="是" cancel-text="否" @confirm="delReport(record.id)">
                        <a-icon class="pointer" type="delete" />
                    </a-popconfirm>
                </a-tooltip>

                <span>|</span>

                <a-tooltip placement="top">
                    <template slot="title">
                        <span>查看报告</span>
                    </template>
                    <a-icon class="pointer" type="eye" @click="show_report(record.report_no,record.workflow_name,record.remarks,record.create_time)" />
                </a-tooltip>
            </a-space>
        </div>
    </a-table>

    <a-modal title="PDF 报告" cancelText="关闭" okText="下载" :maskClosable="false" :width="800" :visible="visible_report" @ok="onSaveReport" @cancel="onCloseReport">
        <div id="report">
            <a-row :gutter="16" class="report" style="margin: auto;">
                <a-col :span="24">
                    <div class="header">
                        <img class="logo" :src="BaseURL+'/public/logo.png'" />
                        <p class="logo_title">W5 SOAR v{{W5Version}} 执行报告 </p>
                    </div>
                </a-col>
                <a-col :span="24">
                    <div class="div1">
                        <a-descriptions :column="1" bordered size="small">
                            <div slot="title">
                                <span class="title">
                                    <span class="jing">#</span>报告介绍
                                </span>
                            </div>
                            <a-descriptions-item label="编号">
                                <b>{{report_no}}</b>
                            </a-descriptions-item>
                            <a-descriptions-item label="剧本">
                                <b>{{workflow_name}}</b>
                            </a-descriptions-item>
                            <a-descriptions-item label="执行时间">
                                {{Dayjs(create_time).subtract(8, 'hour').format('YYYY-MM-DD HH:mm:ss')}}
                            </a-descriptions-item>
                            <a-descriptions-item label="备注">
                                {{remarks}}
                            </a-descriptions-item>
                        </a-descriptions>
                    </div>
                </a-col>

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
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'

export default {
    name: 'logsHome',
    data() {
        return {
            columns: [],
            loading: false,
            data: [],
            type_data: [],
            so_text: "",
            pagination: {
                total: 0,
                defaultPageSize: 10,
                showTotal: total => `共 ${total} 条数据`,
                showSizeChanger: true,
                pageSizeOptions: ['10', '15', '20', '50', '100'],
                onShowSizeChange: this.onPageShowSizeChange,
                onChange: this.onPageChange
            },
            visible_report: false,
            report_no: "",
            workflow_name: "",
            remarks: "",
            create_time: "",
            log_data: [],
            switchType: 1,
            type_show: true,
            curr_page: 1,
            curr_page_size: 10
        }
    },
    mounted() {
        this.onSwitch();
    },
    methods: {
        onSwitch(type = false) {
            this.curr_page = 1;
            this.curr_page_size = 10;

            if (type) {
                if (this.switchType === 1) {
                    this.switchType = 2;
                    this.type_show = false;
                } else if (this.switchType === 2) {
                    this.switchType = 1;
                    this.type_show = true;
                }
            }

            if (this.switchType === 1) {
                this.columns = [{
                        title: "剧本名称",
                        dataIndex: "name",
                        key: "name",
                        scopedSlots: {
                            customRender: "name",
                        },
                        width: 260
                    },
                    {
                        title: "APP 名称",
                        dataIndex: "app_name",
                        key: "app_name",
                        scopedSlots: {
                            customRender: "app_name",
                        },
                        width: 160
                    },
                    {
                        title: "执行结果",
                        dataIndex: "result",
                        key: "result",
                        scopedSlots: {
                            customRender: "result",
                        },
                    },
                    {
                        title: "状态",
                        dataIndex: "status",
                        key: "status",
                        scopedSlots: {
                            customRender: "status",
                        },
                        width: 60
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
                        title: "操作",
                        key: "action",
                        scopedSlots: {
                            customRender: "action",
                        },
                        width: 60
                    },
                ];

                this.onLoad(this.so_text, this.select_type);
            } else if (this.switchType === 2) {
                this.columns = [{
                        title: "编号",
                        dataIndex: "report_no",
                        key: "report_no",
                        scopedSlots: {
                            customRender: "report_no",
                        },
                        width: 270
                    }, {
                        title: "剧本名称",
                        dataIndex: "workflow_name",
                        key: "workflow_name",
                        scopedSlots: {
                            customRender: "workflow_name",
                        },
                        width: 260
                    },
                    {
                        title: "备注",
                        dataIndex: "remarks",
                        key: "remarks",
                        scopedSlots: {
                            customRender: "remarks",
                        }
                    },
                    {
                        title: "执行时间",
                        key: "create_time",
                        dataIndex: "create_time",
                        scopedSlots: {
                            customRender: "create_time",
                        },
                        width: 190
                    },
                    {
                        title: "操作",
                        key: "action",
                        scopedSlots: {
                            customRender: "actionReport",
                        },
                        width: 60
                    },
                ];
                this.onLoadReport(this.so_text);
            }
        },
        onPageShowSizeChange(current, pageSize) {
            this.curr_page = current;
            this.curr_page_size = pageSize;

            if (this.switchType === 1) {
                this.onLoad(this.so_text, this.select_type, current, pageSize);
            } else if (this.switchType === 2) {
                this.onLoadReport(this.so_text, current, pageSize);
            }
        },
        onPageChange(page, pageSize) {
            this.curr_page = page;
            this.curr_page_size = pageSize;

            if (this.switchType === 1) {
                this.onLoad(this.so_text, this.select_type, page, pageSize);
            } else if (this.switchType === 2) {
                this.onLoadReport(this.so_text, page, pageSize);
            }
        },
        onLoad(keywords = "", select_type = 0, page = 1, page_count = 10) {
            this.loading = true;
            this.$http
                .post("/api/v1/w5/get/logs/list", {
                    keywords: keywords,
                    type: select_type,
                    page: page,
                    page_count: page_count
                })
                .then((res) => {
                    if (res.code == 0) {
                        this.data = res.data.list;
                        this.pagination.total = res.data.total_count;
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
                .post("/api/v1/w5/get/workflow/simple_list", {
                    type: 0,
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
                .post("/api/v1/w5/post/logs/del", {
                    id: id,
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

            if (this.switchType === 1) {
                this.onLoad(this.so_text, this.select_type);
            } else if (this.switchType === 2) {
                this.onLoadReport(this.so_text);
            }
        },
        onSelect(value) {
            this.select_type = value;

            if (this.switchType === 1) {
                this.onLoad(this.so_text, this.select_type);
            } else if (this.switchType === 2) {
                this.onLoadReport(this.so_text);
            }
        },
        onFilterOption(input, option) {
            return (
                option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
        },
        onLoadReport(keywords = "", page = 1, page_count = 10) {
            this.loading = true;
            this.$http
                .post("/api/v1/w5/get/report/list", {
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
        onReportLog(only_id) {
            this.loading = true;
            this.$http
                .post("/api/v1/w5/get/report/log", {
                    only_id: only_id,
                })
                .then((res) => {
                    if (res.code == 0) {
                        this.log_data = res.data;
                        this.loading = false;
                    } else {
                        this.$message.error(res.msg);
                        this.loading = false;
                    }
                });
        },
        delReport(id) {
            this.$http
                .post("/api/v1/w5/post/report/del", {
                    id: id,
                })
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success("删除成功");
                        this.onLoadReport(this.so_text, this.select_type, this.curr_page, this.curr_page_size);
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        show_report(report_no, workflow_name, remarks, create_time) {
            this.onReportLog(report_no);
            this.report_no = report_no;
            this.workflow_name = workflow_name;
            this.remarks = remarks;
            this.create_time = create_time;
            this.visible_report = true;
        },
        onSaveReport() {
            var title = this.workflow_name + "-" + this.report_no
            html2Canvas(document.querySelector('#report'), {
                allowTaint: true,
                useCORS: true,
                dpi: 120,
            }).then(function (canvas) {
                let contentWidth = canvas.width
                let contentHeight = canvas.height
                let pageHeight = contentWidth / 592.28 * 841.89
                let leftHeight = contentHeight
                let position = 0
                let imgWidth = 595.28
                let imgHeight = 592.28 / contentWidth * contentHeight
                let pageData = canvas.toDataURL('image/jpeg', 1.0)
                let PDF = new JsPDF('', 'pt', 'a4')
                if (leftHeight < pageHeight) {
                    PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
                } else {
                    while (leftHeight > 0) {
                        PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                        leftHeight -= pageHeight
                        position -= 841.89
                        if (leftHeight > 0) {
                            PDF.addPage()
                        }
                    }
                }
                PDF.save(title + '.pdf')
            })
        },
        onCloseReport() {
            this.visible_report = false;
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
