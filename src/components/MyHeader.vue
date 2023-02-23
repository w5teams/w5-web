<template>
    <a-layout-header class="headerx">
        <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="collapsedClick" />

        <div class="userinfo">
            <a-space :size="space_size">
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

                <a-dropdown>
                    <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
                        <a-icon type="skin" />
                        <a-icon class="icon" type="down" />
                    </a>
                    <a-menu slot="overlay">
                        <a-menu-item v-if="curr_theme == 'dark'">
                            <a href="javascript:;" @click="setTheme('dark')">暗色</a>
                        </a-menu-item>
                        <a-menu-item v-else>
                            <a href="javascript:;" @click="setTheme('dark')">暗色</a>
                        </a-menu-item>

                        <a-menu-item v-if="curr_theme == 'bright'">
                            <a href="javascript:;" @click="setTheme('bright')">亮色</a>
                        </a-menu-item>
                        <a-menu-item v-else>
                            <a href="javascript:;" @click="setTheme('bright')">亮色</a>
                        </a-menu-item>
                    </a-menu>
                </a-dropdown>

                <a-dropdown>
                    <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
                        <a-avatar class="avatar" size="small" :src="baseURL+'/public/logo.png'" />

                        <span class="name">{{ nick_name }}
                            <a-icon class="icon" type="down" /></span>
                    </a>
                    <a-menu slot="overlay">
                        <a-menu-item>
                            <a href="javascript:;" @click="update_version">
                                <a-icon type="sync" /> 检测更新</a>
                        </a-menu-item>
                        <a-menu-divider />
                        <a-menu-item>
                            <a href="javascript:;" @click="logout">
                                <a-icon type="logout" />
                                退出</a>
                        </a-menu-item>
                    </a-menu>
                </a-dropdown>
            </a-space>
        </div>
    </a-layout-header>
</template>

<script>
export default {
    name: "MyHeader",
    data() {
        return {
            space_size: 18,
            curr_theme: "dark",
            nick_name: "",
            baseURL: this.BaseURL,
        };
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
        this.getTheme();
        this.getUserName();
        this.update_version();
    },
    methods: {
        getUserName() {
            this.nick_name = this.$cookies.get("nick_name");
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
        collapsedClick() {
            if (this.collapsed) {
                this.collapsed = false;
            } else {
                this.collapsed = true;
            }
        },
        logout() {
            this.$cookies.remove("token");
            this.$cookies.remove("nick_name");
            this.$cookies.remove("account");
            this.$cookies.remove("user_id");

            window.location.href = "/";
        },
        update_version(type = "0") {
            this.$http
                .post("/api/v1/w5/get/system/version")
                .then((res) => {
                    if (res.code == 0) {
                        let data = res.data;
                        if (data.is_w5 == true) {
                            if (data.w5 == "fail") {
                                this.$notification["warning"]({
                                    message: `W5 SOAR 提醒你`,
                                    description: "检测更新超时",
                                    duration: 2
                                });

                                return false;
                            }

                            let key = `w5_${Date.now()}`;
                            this.$notification["info"]({
                                message: `W5 SOAR ${data.w5.version} 更新提醒`,
                                description: data.w5.text,
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
                        this.$message.error("检测更新超时");
                    }
                });
        },
    },
};
</script>

<style lang="less" scoped>
@import url("../theme/style.less");

.bright {
    .headerx {
        background: initial;
        padding: 0;
        border: 0px;
        height: 50px;
        line-height: 45px;

        .trigger {
            font-size: 18px;
            line-height: 60px;
            padding: 0 15px;
            cursor: pointer;
            transition: color 0.3s;
        }

        .trigger:hover {
            color: @a-color;
        }

        .userinfo {
            float: right;
            margin-right: 18px;

            a {
                color: @text-color;
            }

            .name {
                color: @text-color;
                vertical-align: middle;
                margin-left: 3px;
            }

            .icon {
                font-size: 10px;
            }
        }
    }
}

.dark {
    .headerx {
        background: @dark-background;
        padding: 0;
        border: 0px;
        box-shadow: 0px 0px 20px 3px rgba(0, 0, 0, 0.05);
        border-bottom: 1px solid #353535;
        height: 50px;
        line-height: 45px;

        .trigger {
            font-size: 18px;
            line-height: 60px;
            padding: 0 15px;
            cursor: pointer;
            transition: color 0.3s;
            color: @dark-text-color;
        }

        .trigger:hover {
            color: @dark-text-color1;
        }

        .userinfo {
            float: right;
            margin-right: 18px;

            a {
                color: @dark-text-color;
            }

            .name {
                color: @dark-text-color;
                vertical-align: middle;
                margin-left: 3px;
            }

            .icon {
                font-size: 10px;
            }
        }
    }
}
</style>
