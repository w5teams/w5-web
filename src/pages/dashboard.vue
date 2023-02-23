<template>
<a-layout-content>
    <a-row :gutter="[16,16]">
        <a-col :span="20">
            <a-row :gutter="[16,16]">
                <a-col :span="24">
                    <div class="sound_div">
                        <a-icon type="sound" />
                        <span class="sound_text">{{w5_json.notice}}</span>
                    </div>
                </a-col>
                <a-col :span="6">
                    <a-card class="icondiv">
                        <div class="left">
                            <a-statistic title="剧本数量" :value="sums_data['workflow_count']" />
                        </div>
                        <div class="right">
                            <a-icon class="icons icons1" type="cloud-sync" />
                        </div>
                    </a-card>
                </a-col>
                <a-col :span="6">
                    <a-card class="icondiv">
                        <div class="left">
                            <a-statistic title="执行次数" :value="sums_data['logs_count']" />
                        </div>
                        <div class="right">
                            <a-icon class="icons icons2" type="car" />
                        </div>
                    </a-card>
                </a-col>
                <a-col :span="6">
                    <a-card class="icondiv">
                        <div class="left">
                            <a-statistic title="执行异常" :value="sums_data['logs_err_count']" />
                        </div>
                        <div class="right">
                            <a-icon class="icons icons3" type="warning" />
                        </div>
                    </a-card>
                </a-col>

                <a-col :span="6">
                    <a-card class="icondiv">
                        <div class="left">
                            <a-statistic title="正在执行" :value="sums_data['exec_sum']" />
                        </div>
                        <div class="right">
                            <a-icon class="icons icons4" type="rocket" />
                        </div>
                    </a-card>
                </a-col>

                <a-col :span="16">
                    <a-card size="small">
                        <span slot="title" class="titlex">
                            <a-icon type="line-chart" /> 今日执行统计
                            <div class="dateSelect">
                                <span :class="`cur `+execType1" @click="onLoadExec(1)">今日</span>
                                <a-divider type="vertical" />
                                <span :class="`cur `+execType2" @click="onLoadExec(2)">昨日</span>
                                <a-divider type="vertical" />
                                <span :class="`cur `+execType3" @click="onLoadExec(3)">本周</span>
                                <a-divider type="vertical" />
                                <span :class="`cur `+execType4" @click="onLoadExec(4)">本月</span>
                                <a-divider type="vertical" />
                                <span :class="`cur `+execType5" @click="onLoadExec(5)">上月</span>
                                <a-divider type="vertical" />
                                <span :class="`cur `+execType6" @click="onLoadExec(6)">本年</span>
                            </div>
                        </span>
                        <div class="tb_div" id="main2">

                        </div>
                    </a-card>
                </a-col>
                <a-col :span="8">
                    <a-card size="small">
                        <span slot="title" class="titlex">
                            <a-icon type="pie-chart" /> 剧本统计</span>
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
                        <a-table rowKey="id" size="middle" :scroll="sy" :showHeader="false" :columns="columns" :data-source="logs_data" :loading="loading" :pagination="false">
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

                            <div slot="create_time" slot-scope="text">
                                {{Dayjs(text).subtract(8, 'hour').format('YYYY-MM-DD HH:mm:ss')}}
                            </div>
                        </a-table>
                    </a-card>
                </a-col>
            </a-row>
        </a-col>

        <a-col :span="4">
            <a-row :gutter="[16,16]">
                <a-col :span="24">
                    <a-card>
                        <div class="user_avatar">
                            <div>
                                <div id="avatar" class="avatar" v-html="avatar"></div>
                            </div>
                            <div style="margin-top: 5px;">
                                <span class="name">Hi,{{ nick_name }}!</span>
                            </div>
                        </div>
                        <div class="user_tools">
                            <a-space :size="14">
                                <a-tooltip placement="bottom">
                                    <template slot="title">
                                        <span>帮助文档</span>
                                    </template>
                                    <a href="https://w5.io/help" target="_bank">
                                        <a-icon type="question-circle" />
                                    </a>
                                </a-tooltip>

                                <a-tooltip placement="bottom">
                                    <template slot="title">
                                        <span>Github</span>
                                    </template>
                                    <a href="https://github.com/w5hub/w5" target="_bank">
                                        <a-icon type="github" theme="filled" />
                                    </a>
                                </a-tooltip>

                                <a-tooltip placement="bottom">
                                    <template slot="title">
                                        <span>主题</span>
                                    </template>
                                    <a href="javascript:;" @click="setTheme('bright')" v-if="curr_theme == 'dark'">
                                        <a-icon type="skin" theme="filled" />
                                    </a>
                                    <a href="javascript:;" @click="setTheme('dark')" v-else-if="curr_theme == 'bright'">
                                        <a-icon type="skin" />
                                    </a>
                                </a-tooltip>

                                <a-tooltip placement="bottom">
                                    <template slot="title">
                                        <span>检测更新</span>
                                    </template>
                                    <a href="javascript:;" @click="onW5Json(1)">
                                        <a-icon type="sync" />
                                    </a>
                                </a-tooltip>

                                <a-tooltip placement="bottom">
                                    <template slot="title">
                                        <span>退出</span>
                                    </template>
                                    <a href="javascript:;" @click="logout">
                                        <a-icon type="logout" />
                                    </a>
                                </a-tooltip>
                            </a-space>
                        </div>
                    </a-card>
                </a-col>
                <a-col :span="24">
                    <a-card class="loginHistory" :style="loginstyle">
                        <div class="avdiv" v-for="(item,index) in login_history" :key="index">
                            <div class="avatar" v-html="item.avatar"></div>
                            <div class="info">
                                <div>{{item.nick_name}}</div>
                                <div>{{getFromTime(Dayjs(item.login_time).subtract(8, 'hour').format('YYYY-MM-DD HH:mm:ss'))}}</div>
                            </div>
                        </div>
                    </a-card>
                </a-col>
            </a-row>
        </a-col>
    </a-row>
</a-layout-content>
</template>

<script>
import {
    Area,
    Pie
} from '@antv/g2plot';
import multiavatar from '@multiavatar/multiavatar'

const columns = [{
        title: "剧本名称",
        dataIndex: "name",
        key: "name",
        scopedSlots: {
            customRender: "name",
        },
        width: 220
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
    name: 'dashboard',
    data() {
        return {
            sums_data: {},
            logs_data: [],
            workflow_data: [],
            login_history: [],
            columns,
            loading: false,
            exec_data: [],
            theme: "dark",
            curr_theme: "dark",
            w5_json: {},
            piePlot: "",
            areaPlot: "",
            nick_name: "",
            baseURL: this.BaseURL,
            avatar: "",
            avatar1: "",
            avatar2: "",
            avatar3: "",
            avatar4: "",
            avatar5: "",
            avatar6: "",
            avatar7: "",
            avatar8: "",
            avatar9: "",
            execType1: "active",
            execType2: "",
            execType3: "",
            execType4: "",
            execType5: "",
            execType6: "",
            sy: {
                y: "0px"
            },
            loginstyle: ""
        }
    },
    computed: {
        collapsed: {
            get: function () {
                return this.$store.getters.getCollapsed;
            },
            set: function (val) {
                if (val) {
                    this.$store.commit("closeCollapsed");
                } else {
                    this.$store.commit("openCollapsed");
                }
            },
        },
    },
    mounted() {
        this.onLoad();
    },
    methods: {
        onLoad() {
            this.theme = this.$cookies.get("theme");
            this.onLoadSums();
            this.onLoadLogs();
            this.onLoadWorkflow();
            this.onLoadExec();
            this.onW5Json();
            this.getUserInfo();
            this.getTheme();
            this.getClientHeight();
            this.getFromTime();
            this.onLoginHistory();
        },
        getFromTime(time) {
            require('dayjs/locale/zh')
            var relativeTime = require('dayjs/plugin/relativeTime');
            this.Dayjs.extend(relativeTime)
            var dayjs = this.Dayjs();
            return dayjs.locale('zh').to(time);
        },
        getClientHeight() {
            let that = this;
            let clientHeight = document.documentElement.clientHeight;

            if (clientHeight >= 900) {
                that.sy = {
                    y: "calc(100vh - 610px)"
                }
                that.loginstyle = "height: calc(100vh - 265px);overflow-y: auto;"
            } else {
                that.sy = {
                    y: "300px"
                }
                that.loginstyle = "height: 645px;overflow-y: auto;"
            }

            window.onresize = function () {
                let clientHeight = document.documentElement.clientHeight;
                if (clientHeight >= 900) {
                    that.sy = {
                        y: "calc(100vh - 610px)"
                    }
                    that.loginstyle = "height: calc(100vh - 265px);overflow-y: auto;"
                } else {
                    that.sy = {
                        y: "300px"
                    }
                    that.loginstyle = "height: 645px;overflow-y: auto;"
                }
            }
        },
        getTheme() {
            var is_theme = this.$cookies.isKey("theme");
            if (is_theme) {
                var theme = this.$cookies.get("theme");
                document.getElementById("app").className = theme;
                this.curr_theme = theme;
                this.$store.commit("setTheme", this.curr_theme);
            } else {
                document.getElementById("app").className = "dark";
                this.curr_theme = "dark";
                this.$store.commit("setTheme", this.curr_theme);
            }
        },
        setTheme(name) {
            document.getElementById("app").className = name;
            this.$cookies.set("theme", name, -1);
            this.curr_theme = name;
            this.$store.commit("setTheme", this.curr_theme);
        },
        logout() {
            this.$cookies.remove("token");
            this.$cookies.remove("nick_name");
            this.$cookies.remove("account");
            this.$cookies.remove("user_id");

            window.location.href = "/";
        },
        getUserInfo() {
            this.$http
                .post("/api/v1/w5/get/user/info", {
                    id: this.$cookies.get("user_id")
                })
                .then((res) => {
                    if (res.code == 0) {
                        this.avatar = res.data.avatar;
                        this.nick_name = res.data.nick_name;
                    }
                });

            // setTimeout(() => {
            //     document.getElementById("avatar").getElementsByTagName("svg")[0].childNodes[0].style = "fill: #814444;";
            //     let newbg = document.getElementById("avatar").getElementsByTagName("svg")[0];
            //     let newAvatar = (new XMLSerializer()).serializeToString(newbg);
            //     this.avatar = newAvatar;
            // }, 2000);
        },
        gd() {
            this.$router.push({
                name: "LogsHome"
            });
        },
        onLoadSums() {
            this.$http
                .post("/api/v1/w5/get/dashboard/sums")
                .then((res) => {
                    if (res.code == 0) {
                        this.sums_data = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        onLoadLogs() {
            this.$http
                .post("/api/v1/w5/get/dashboard/logs")
                .then((res) => {
                    if (res.code == 0) {
                        this.logs_data = res.data;

                        // setTimeout(function () {
                        //     var t = document.querySelector(".ant-table-body");
                        //     t.scrollTop = t.scrollHeight;
                        // }, 100);
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        onLoadWorkflow() {
            this.$http
                .post("/api/v1/w5/get/dashboard/workflow")
                .then((res) => {
                    if (res.code == 0) {
                        this.workflow_data = res.data;
                        this.onLoadMain1();
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        onLoadExec(type = 1) {

            if (type === 1) {
                this.execType1 = "active";
                this.execType2 = "";
                this.execType3 = "";
                this.execType4 = "";
                this.execType5 = "";
                this.execType6 = "";
            } else if (type === 2) {
                this.execType1 = "";
                this.execType2 = "active";
                this.execType3 = "";
                this.execType4 = "";
                this.execType5 = "";
                this.execType6 = "";
            } else if (type === 3) {
                this.execType1 = "";
                this.execType2 = "";
                this.execType3 = "active";
                this.execType4 = "";
                this.execType5 = "";
                this.execType6 = "";
            } else if (type === 4) {
                this.execType1 = "";
                this.execType2 = "";
                this.execType3 = "";
                this.execType4 = "active";
                this.execType5 = "";
                this.execType6 = "";
            } else if (type === 5) {
                this.execType1 = "";
                this.execType2 = "";
                this.execType3 = "";
                this.execType4 = "";
                this.execType5 = "active";
                this.execType6 = "";
            } else if (type === 6) {
                this.execType1 = "";
                this.execType2 = "";
                this.execType3 = "";
                this.execType4 = "";
                this.execType5 = "";
                this.execType6 = "active";
            }

            this.$http
                .post("/api/v1/w5/get/dashboard/exec", {
                    type: type
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
            if (this.piePlot != "") {
                this.piePlot.destroy();
            }

            if (this.theme === "bright") {
                this.piePlot = new Pie('main1', {
                    appendPadding: 10,
                    data: this.workflow_data,
                    angleField: 'value',
                    colorField: 'type',
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
                    color: ['#c63935', '#43be34', '#3452be', '#3498be', '#59747e', '#914fd9', '#b3b543', '#8ccdd7'],
                });

                this.piePlot.render();
            } else if (this.theme === "dark") {
                this.piePlot = new Pie('main1', {
                    appendPadding: 10,
                    data: this.workflow_data,
                    angleField: 'value',
                    colorField: 'type',
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
                    color: ['#c63935', '#43be34', '#3452be', '#3498be', '#59747e', '#914fd9', '#b3b543', '#8ccdd7'],
                });

                this.piePlot.render();
            }
        },
        onLoadMain2() {
            if (this.areaPlot != "") {
                this.areaPlot.destroy();
            }

            this.areaPlot = new Area('main2', {
                data: this.exec_data,
                xField: 'time',
                yField: 'value',
                xAxis: {
                    range: [0, 1],
                    tickCount: 5,
                },
                color: '#c63935',
                smooth: true,
                areaStyle: () => {
                    return {
                        fill: 'l(270) 0:#ffffff 0.5:#c63935 1:#c63935',
                    };
                },
            });
            this.areaPlot.render();
        },
        onW5Json(type = 0) {
            this.$http
                .post("/api/v1/w5/get/system/w5json")
                .then((res) => {
                    if (res.code == 0) {
                        this.w5_json = res.data;

                        var old = String(this.W5Version).split('.');
                        var newx = String(this.w5_json.w5.version).split('.');

                        if (newx[0] > old[0]) {
                            let key = `w5_${Date.now()}`;
                            this.$notification["info"]({
                                message: `W5 SOAR ${this.w5_json.w5.version} 更新提醒`,
                                description: this.w5_json.w5.text,
                                duration: 5,
                                btn: h => {
                                    return h(
                                        'a-button', {
                                            props: {
                                                type: 'primary',
                                                size: 'small',
                                            },
                                            on: {
                                                click: () => {
                                                    this.$notification.close(key);
                                                    window.open("https://w5.io/help/unclassified/update.html", '_blank');
                                                }
                                            },
                                        },
                                        '前往更新'
                                    );
                                },
                                key,
                            });
                        } else if (newx[0] == old[0]) {
                            if (newx[1] > old[1]) {
                                let key = `w5_${Date.now()}`;
                                this.$notification["info"]({
                                    message: `W5 SOAR ${this.w5_json.w5.version} 更新提醒`,
                                    description: this.w5_json.w5.text,
                                    duration: 5,
                                    btn: h => {
                                        return h(
                                            'a-button', {
                                                props: {
                                                    type: 'primary',
                                                    size: 'small',
                                                },
                                                on: {
                                                    click: () => {
                                                        this.$notification.close(key);
                                                        window.open("https://w5.io/help/unclassified/update.html", '_blank');
                                                    }
                                                },
                                            },
                                            '前往更新'
                                        );
                                    },
                                    key,
                                });
                            } else if (newx[1] == old[1]) {
                                if (newx[2] > old[2]) {
                                    let key = `w5_${Date.now()}`;
                                    this.$notification["info"]({
                                        message: `W5 SOAR ${this.w5_json.w5.version} 更新提醒`,
                                        description: this.w5_json.w5.text,
                                        duration: 5,
                                        btn: h => {
                                            return h(
                                                'a-button', {
                                                    props: {
                                                        type: 'primary',
                                                        size: 'small',
                                                    },
                                                    on: {
                                                        click: () => {
                                                            this.$notification.close(key);
                                                            window.open("https://w5.io/help/unclassified/update.html", '_blank');
                                                        }
                                                    },
                                                },
                                                '前往更新'
                                            );
                                        },
                                        key,
                                    });
                                } else {
                                    if (type != "0") {
                                        this.$notification["info"]({
                                            message: `W5 SOAR 提醒你`,
                                            description: "当前已经是最新版本",
                                            duration: 2
                                        });
                                    }
                                }
                            } else {
                                if (type != "0") {
                                    this.$notification["info"]({
                                        message: `W5 SOAR 提醒你`,
                                        description: "当前已经是最新版本",
                                        duration: 2
                                    });
                                }
                            }
                        } else {
                            if (type != "0") {
                                this.$notification["info"]({
                                    message: `W5 SOAR 提醒你`,
                                    description: "当前已经是最新版本",
                                    duration: 2
                                });
                            }
                        }
                    }
                });
        },
        onLoginHistory() {
            this.$http
                .post("/api/v1/w5/get/dashboard/login_history")
                .then((res) => {
                    if (res.code == 0) {
                        this.login_history = res.data;
                    }
                });
        }
    },
    watch: {
        '$store.getters.getTheme': function (e) {
            this.theme = this.$store.getters.getTheme;
            if (this.theme === "bright") {
                this.piePlot.update({
                    label: {
                        style: {
                            fill: '#000',
                        }
                    }
                });
            } else if (this.theme === "dark") {
                this.piePlot.update({
                    label: {
                        style: {
                            fill: '#fff',
                        }
                    }
                });
            }
        }
    }
}
</script>

<style lang="less" scoped>
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
    .ant-card-bordered {
        border: 1px solid #ffffff;
    }

    .sound_div {
        background: #ffffff;
        line-height: 40px;
        font-size: 13px;
        border-radius: 8px;
        padding: 0px 10px;

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
        border-radius: 8px;
        padding: 0px 5px;
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
                padding: 15px;
                border-radius: 100%;
            }

            .icons1 {
                background: #b54441;
                color: #ffffff;
            }

            .icons2 {
                background: #4145b5;
                color: #ffffff;
            }

            .icons3 {
                background: #b5a141;
                color: #ffffff;
            }

            .icons4 {
                background: #41a0b5;
                color: #ffffff;
            }
        }
    }

    a {
        color: #444;
    }

    .user_avatar {
        text-align: center;
        margin-bottom: 10px;

        .avatar {
            margin: auto;
            width: 100px;
            border: 1px solid #a9a9a9;
            border-radius: 100%;
            height: 100px;
            padding: 2px;
        }

        .name {
            vertical-align: middle;
            letter-spacing: 1px;
            font-size: 16px;
            margin-top: 5px;
            font-weight: bold;
            color: #4e4e4e;
        }
    }

    .user_tools {
        text-align: center;
    }

    .loginHistory {

        .avdiv {
            width: 100%;
            border-bottom: 1px solid #e8e8e8;
            padding: 10px 0px;
            display: flex;
        }

        .avatar {
            width: 40px;
            border: 1px solid #a9a9a9;
            border-radius: 100%;
            height: 40px;
            padding: 1px;
            float: left;
            margin-top: 3px;
        }

        .info {
            float: left;
            font-size: 14px;
            padding-left: 10px;
        }
    }

    .dateSelect {
        position: absolute;
        right: 10px;
        top: 10px;
        font-size: 12px;
        color: #979797;

        .cur {
            cursor: pointer;
        }

        .active {
            color: #4a4a4a;
        }

        .ant-divider,
        .ant-divider-vertical {
            margin: 0 4 px;
            background: #e8e8e8;
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
                padding: 15px;
                border-radius: 100%;
            }

            .icons1 {
                background: #b54441;
                color: #ffffff;
            }

            .icons2 {
                background: #4145b5;
                color: #ffffff;
            }

            .icons3 {
                background: #b5a141;
                color: #ffffff;
            }

            .icons4 {
                background: #41a0b5;
                color: #ffffff;
            }
        }
    }

    .sound_div {
        background: #202020;
        line-height: 40px;
        font-size: 13px;
        border-radius: 8px;
        padding: 0px 10px;

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
        border: 0px;
        background: #202020;
        color: #cacaca;
        border-radius: 8px;
        padding: 0px 5px;

        /deep/.ant-card-head {
            border-bottom: 1px solid #303030;
        }

    }

    .titlex {
        color: #cacaca;
    }

    a {
        color: #fff;
    }

    .user_avatar {
        text-align: center;
        margin-bottom: 10px;

        .avatar {
            margin: auto;
            width: 100px;
            border: 1px solid #fff;
            border-radius: 100%;
            height: 100px;
            padding: 2px;
        }

        .name {
            vertical-align: middle;
            letter-spacing: 1px;
            font-size: 16px;
            margin-top: 5px;
            font-weight: bold;
            color: #dbdbdb;
        }
    }

    .user_tools {
        text-align: center;
    }

    .loginHistory {

        .avdiv {
            width: 100%;
            border-bottom: 1px solid #303030;
            padding: 10px 0px;
            display: flex;
        }

        .avatar {
            width: 40px;
            border: 1px solid #fff;
            border-radius: 100%;
            height: 40px;
            padding: 1px;
            float: left;
            margin-top: 3px;
        }

        .info {
            float: left;
            font-size: 14px;
            padding-left: 10px;
        }
    }

    .dateSelect {
        position: absolute;
        right: 10px;
        top: 10px;
        font-size: 12px;
        color: #858585;

        .cur {
            cursor: pointer;
        }

        .active {
            color: #dfdfdf;
        }

        .ant-divider,
        .ant-divider-vertical {
            margin: 0 4 px;
            background: #303030;
        }
    }
}

.loginHistory::-webkit-scrollbar {
    display: none
}

/deep/.ant-table-body::-webkit-scrollbar {
    display: none
}
</style>
