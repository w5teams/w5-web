<template>
    <a-layout-content>
        <a-row :gutter="[16,16]">
            <a-col :span="24" class="descx">
                <a-page-header class="descx_header" :title="workflow_info.name" :sub-title="workflow_info.remarks" @back="() => $router.go(-1)">
                    <div class="content">
                        <a-descriptions :column="4">
                            <a-descriptions-item label="正在执行">
                                <a-tag color="#1863d4">{{ workflow_exec_sum }} </a-tag>
                            </a-descriptions-item>
                            <a-descriptions-item label="状态">
                                <a-switch default-checked v-if="workflow_info.status===0" disabled>
                                    <a-icon slot="checkedChildren" type="check" />
                                    <a-icon slot="unCheckedChildren" type="close" />
                                </a-switch>
                                <a-switch v-else disabled>
                                    <a-icon slot="checkedChildren" type="check" />
                                    <a-icon slot="unCheckedChildren" type="close" />
                                </a-switch>
                            </a-descriptions-item>
                            <a-descriptions-item label="更新时间">
                                {{Dayjs(workflow_info.update_time).subtract(8, 'hour').format('YYYY-MM-DD HH:mm:ss')}}
                            </a-descriptions-item>
                            <a-descriptions-item label="创建时间">
                                {{Dayjs(workflow_info.create_time).subtract(8, 'hour').format('YYYY-MM-DD HH:mm:ss')}}
                            </a-descriptions-item>
                        </a-descriptions>
                    </div>
                </a-page-header>

            </a-col>
            <a-col :span="16">
                <a-card size="small">
                    <span slot="title" class="titlex">
                        <a-icon type="line-chart" /> 今日执行统计</span>
                    <div class="tb_div" id="main2">

                    </div>
                </a-card>
            </a-col>
            <a-col :span="8">
                <a-card size="small">
                    <span slot="title" class="titlex">
                        <a-icon type="pie-chart" /> 成功/失败</span>
                    <div class="tb_div" id="main1">
                    </div>
                </a-card>
            </a-col>
            <a-col :span="24">
                <a-card size="small">
                    <span slot="title" class="titlex">
                        <a-icon type="bug" /> 执行日志 [ Top 100 ]
                    </span>
                    <!-- <span class="more" @click="onMore">
                    <a-icon type="double-right" /> 更多
                </span> -->
                    <a-table rowKey="id" size="middle" :scroll="{ y: 260 }" :showHeader="false" :columns="columns" :data-source="logs_data" :loading="loading" :pagination="false">
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
                    </a-table>
                </a-card>
            </a-col>
        </a-row>
    </a-layout-content>
</template>

<script>
import {
    AlarmClock,
    Text as Textx,
    Ring,
    ConnectionPoint
} from '@icon-park/vue';
import {
    Area,
    Pie
} from '@antv/g2plot';

const columns = [{
        title: "剧本名称",
        dataIndex: "name",
        key: "name",
        scopedSlots: {
            customRender: "name",
        },
        width: 120
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
        title: "级别",
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
    }
];

export default {
    name: "statisticsHome",
    components: {
        AlarmClock,
        Textx,
        Ring,
        ConnectionPoint
    },
    data() {
        return {
            uuid: "",
            logs_data: [],
            columns,
            loading: false,
            theme: "dark",
            workflow_data: "",
            exec_data: "",
            workflow_info: "",
            workflow_exec_sum: 0
        };
    },
    mounted() {
        this.uuid = this.$route.params.uuid;
        this.onLoad();
    },
    methods: {
        onLoad() {
            this.theme = this.$cookies.get("theme");
            this.onLoadLogs();
            this.onLoadWorkflow();
            this.onLoadExec();
            this.onData();
        },
        onData() {
            this.$http
                .post("/api/v1/w5/post/workflow/detail", {
                    uuid: this.uuid
                })
                .then((res) => {
                    if (res.code == 0) {
                        this.workflow_info = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        onLoadLogs() {
            this.$http
                .post("/api/v1/w5/get/workflow/logs", {
                    uuid: this.uuid
                })
                .then((res) => {
                    if (res.code == 0) {
                        this.logs_data = res.data;

                        setTimeout(function () {
                            var t = document.querySelector(".ant-table-body");
                            t.scrollTop = t.scrollHeight;
                        }, 100);
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        onLoadWorkflow() {
            this.$http
                .post("/api/v1/w5/get/workflow/workflow", {
                    uuid: this.uuid
                })
                .then((res) => {
                    if (res.code == 0) {
                        this.workflow_data = res.data.result;
                        this.workflow_exec_sum = res.data.exec_sum;
                        this.onLoadMain1();
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        onLoadExec() {
            this.$http
                .post("/api/v1/w5/get/workflow/exec", {
                    uuid: this.uuid
                })
                .then((res) => {
                    if (res.code == 0) {
                        this.exec_data = res.data;
                        this.onLoadMain2();
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        onLoadMain1() {
            if (this.theme === "bright") {
                this.piePlot = new Pie('main1', {
                    appendPadding: 10,
                    data: this.workflow_data,
                    angleField: 'sum',
                    colorField: 'name',
                    radius: 0.8,
                    label: {
                        type: 'outer',
                        content: '{name}\n{percentage}',
                        style: {
                            fill: '#000',
                        },
                    },
                    legend: false,
                    interactions: [{
                        type: 'element-active'
                    }],
                });

                this.piePlot.render();
            } else if (this.theme === "dark") {
                this.piePlot = new Pie('main1', {
                    appendPadding: 10,
                    data: this.workflow_data,
                    angleField: 'sum',
                    colorField: 'name',
                    radius: 0.8,
                    label: {
                        type: 'outer',
                        content: '{name}\n{percentage}',
                        style: {
                            fill: '#fff',
                        },
                    },
                    legend: false,
                    interactions: [{
                        type: 'element-active'
                    }],
                });

                this.piePlot.render();
            }
        },
        onLoadMain2() {
            let areaPlot = new Area('main2', {
                data: this.exec_data,
                xField: 'time',
                yField: 'value',
                xAxis: {
                    range: [0, 1],
                    tickCount: 5,
                },
                areaStyle: () => {
                    return {
                        fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
                    };
                },
            });
            areaPlot.render();
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

.tb_div {
    height: 250px;
}

.log_div {
    background: #151719;
    color: #bbb;
    height: 180px;
    margin: -10px;
    border-radius: 5px;
    padding-left: 30px;
    line-height: 15px;
    font-size: 14px;
    overflow-y: auto;
    margin-top: 0px;
}

.more {
    position: absolute;
    top: 18px;
    right: 0;
    margin-right: 20px;
    cursor: pointer;
    font-size: 14px;
    color: #d45050;
}

.bright {
    .sound_div {
        background: #ffffff;
        line-height: 40px;
        padding-left: 10px;
        border-radius: 3px;
        border: 1px solid #e8e8e8;
        font-size: 13px;

        .sound_text {
            font-size: 14px;
            margin-left: 6px;
            font-size: 12px;
            letter-spacing: 1px;
        }
    }

    .heng {
        color: #636363;
        margin-left: 15px;
        margin-right: 15px;
    }

    .ant-card {
        border-radius: 5px;
        margin-bottom: 10px;
        padding: 10px;
    }

    .icondiv {
        .left {
            float: left;
        }

        .right {
            float: right;

            .icons {
                font-size: 30px;
                vertical-align: middle;
                background: #e8e8e8;
                padding: 15px;
                border-radius: 100%;
                color: #565656;
            }
        }
    }
}

.dark {
    .icondiv {
        .left {
            float: left;
        }

        .right {
            float: right;

            .icons {
                font-size: 30px;
                vertical-align: middle;
                vertical-align: middle;
                background: #38393c;
                padding: 15px;
                border-radius: 100%;
                color: #e0e0e0;
            }
        }
    }

    .sound_div {
        background: #202225;
        line-height: 40px;
        padding-left: 10px;
        border-radius: 5px;
        font-size: 13px;

        .sound_text {
            font-size: 14px;
            margin-left: 6px;
            font-size: 12px;
            letter-spacing: 1px;
        }
    }

    .heng {
        color: #636363;
        margin-left: 15px;
        margin-right: 15px;
    }

    .ant-card {
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-size: 14px;
        font-variant: tabular-nums;
        line-height: 1.5;
        list-style: none;
        -webkit-font-feature-settings: 'tnum';
        font-feature-settings: 'tnum';
        position: relative;
        border-radius: 2px;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
        border: 0px;
        border-radius: 5px;
        background: #202225;
        margin-bottom: 10px;
        padding: 10px;
        color: #cacaca;

        /deep/.ant-card-head {
            border-bottom: 1px solid #353535;
        }

    }

    .titlex {
        color: #cacaca;
    }
}
</style>
