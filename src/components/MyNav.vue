<template>
<a-layout-sider v-model="collapsed" :trigger="null" collapsible>
    <div class="logos" v-if="collapsed">
        <a-avatar class="logo_imgs" :src="baseURL + '/public/logo.png'" />
    </div>
    <div class="logo" v-else>
        <img class="limg" :src="baseURL + '/public/logo.png'" />
        <div class="ltxt">
            <span class="title">W5</span><span>SOAR</span>
        </div>
    </div>
    <a-menu :theme="theme" mode="inline" :default-selected-keys="defaultSelectedKeys" :selectedKeys="selectedKeys" @click="click">
        <a-menu-item v-for="item in user_nav" :key="item.key" v-show="item.is_menu===1">
            <a-icon :type="item.icon" />
            <span>{{item.name}}</span>
        </a-menu-item>
    </a-menu>

    <div class="nav_footer" v-if="collapsed" @click="collapsedClick">
        <!-- <div>W5 v{{W5Version}}</div> -->
        <a-tooltip placement="bottom">
            <template slot="title">
                <span>展开/缩放</span>
            </template>
            <a-icon class="triggerda" :type="collapsed ? 'menu-unfold' : 'menu-fold'" />
        </a-tooltip>
    </div>
    <div class="nav_footer" v-else @click="collapsedClick">
        <!-- <div>Copyright © W5 v{{W5Version}}</div> -->
        <a-tooltip placement="bottom">
            <template slot="title">
                <span>展开/缩放</span>
            </template>
            <a-icon class="triggerda" :type="collapsed ? 'menu-unfold' : 'menu-fold'" />
        </a-tooltip>
    </div>
</a-layout-sider>
</template>

<script>
export default {
    name: "MyNav",
    data() {
        return {
            baseURL: this.BaseURL,
            defaultSelectedKeys: ["Dashboard"],
            selectedKeys: [],
            theme: "dark",
            user_nav: [],
            nav_auth_list: ""
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
        this.setSelectedKeys();
        this.onGetUserNavList();
    },
    methods: {
        onGetUserNavList() {
            this.$http
                .post("/api/v1/w5/get/user_nav/list", {
                    user_id: this.$cookies.get("user_id"),
                })
                .then((res) => {
                    if (res.code == 0) {
                        this.user_nav = res.data;

                        this.user_nav.forEach(nav => {
                            this.nav_auth_list += "," + nav.key;
                        });

                        this.$cookies.set("user_nav", this.nav_auth_list);
                    }
                });
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
        setSelectedKeys() {
            setTimeout(() => {
                let router_key = this.$router.history.current.name;

                if (router_key == null) {
                    this.selectedKeys = ["Dashboard"];
                    return false;
                }

                if (router_key === "SystemHome") {
                    var theme = this.$cookies.get("theme");

                    if (theme === "dark") {
                        document.querySelectorAll(".ant-layout")[1].style = "background: #202020;";
                    } else {
                        document.querySelectorAll(".ant-layout")[1].style = "background: #ffffff;";
                    }
                } else {
                    document.querySelectorAll(".ant-layout")[1].style = "";
                }

                if (router_key === "WorkflowEdit") {
                    this.selectedKeys = ["WorkflowHome"];
                    return false;
                } else {
                    this.selectedKeys = [router_key];
                    return false;
                }
            }, 1000);
        },
        click(e) {
            if (e.key === "SystemHome") {
                var theme = this.$cookies.get("theme");

                if (theme === "dark") {
                    document.querySelectorAll(".ant-layout")[1].style = "background: #202020;";
                } else {
                    document.querySelectorAll(".ant-layout")[1].style = "background: #ffffff;";
                }
            } else {
                document.querySelectorAll(".ant-layout")[1].style = "";
            }

            this.$router.push({
                name: e.key,
            });

            this.selectedKeys = [e.key];
        },
        collapsedClick() {
            if (this.collapsed) {
                this.collapsed = false;
            } else {
                this.collapsed = true;
            }
        }
    },
    watch: {
        '$store.getters.getTheme': function (e) {
            if (e === "dark") {
                this.theme = e;
            } else {
                this.theme = "light";
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import url("../theme/style.less");

.ant-menu-dark {
    background: inherit;
}

.bright {
    .logo {
        text-align: center;
        padding-top: 10px;
        padding-bottom: 5px;
        border-bottom: 1px solid #dedede;
        margin-bottom: 10px;
        margin-left: 30px;
        margin-right: 30px;

        .limg {
            width: 100px;
        }

        .ltxt {
            font-size: 25px;
            font-weight: bold;
            margin-top: 5px;

            .title {
                color: #e32b26;
                margin-right: 5px;
            }
        }
    }

    .logos {
        margin: 16px;
        text-align: center;

        .logo_img {
            width: 30px;
            height: 30px;
            margin-right: 5px;
            vertical-align: bottom;
        }

        .logo_imgs {
            width: 30px;
            height: 30px;
        }
    }

    .ant-layout-sider {
        background: #fff;
        border-right: 1px solid #efefef;
    }

    .ant-menu-item-selected {
        background-color: #dfb1af0f;
        border-right: 2px solid @color1;
        color: @color1;
    }

    .ant-menu-item:hover {
        color: @color1;
    }

    .ant-menu-inline .ant-menu-item::after {
        border: 0px;
    }

    .ant-menu-inline,
    .ant-menu-vertical,
    .ant-menu-vertical-left {
        border: 0px;
    }
}

.dark {
    .logo {
        text-align: center;
        padding-top: 10px;
        padding-bottom: 5px;
        border-bottom: 1px solid #303030;
        margin-bottom: 10px;
        margin-left: 30px;
        margin-right: 30px;

        .limg {
            width: 100px;
        }

        .ltxt {
            font-size: 25px;
            font-weight: bold;
            color: #fff;
            margin-top: 5px;

            .title {
                color: #e32b26;
                margin-right: 5px;
            }
        }
    }

    .logos {
        margin: 16px;
        text-align: center;

        .logo_img {
            width: 30px;
            height: 30px;
            margin-right: 5px;
            vertical-align: bottom;
        }

        .logo_imgs {
            width: 30px;
            height: 30px;
        }
    }

    .ant-layout-sider {
        background: @dark-nav-bg-color;
        border-right: 1px solid #2a2a2a;
    }

    .ant-menu.ant-menu-dark .ant-menu-item-selected {
        background-color: #40393861;
        border-right: 2px solid @color1;
        color: @color1;
    }

    .ant-menu-dark .ant-menu-item-selected .anticon {
        color: @dark-nav-bg-color1;
    }

    .ant-menu-inline,
    .ant-menu-vertical,
    .ant-menu-vertical-left {
        border: 0px;
    }
}

.ant-menu {
    background-color: initial;
}

.nav_footer {
    color: #fff;
    position: absolute;
    bottom: 0px;
    text-align: center;
    width: 100%;
    font-size: 16px;
    background: #c63935;
    padding: 10px;
    cursor: pointer;
}
</style>
