<template>
<div id="app">
    <a-layout class="layout" v-if="is_login == false">
        <my-nav />
        <a-layout>
            <router-view />
        </a-layout>
    </a-layout>
    <a-layout class="layout" v-else>
        <router-view />
    </a-layout>
</div>
</template>

<script>
import MyNav from "@/components/MyNav";

export default {
    name: "App",
    components: {
        MyNav,
    },
    data() {
        return {
            is_login: true,
        };
    },
    created() {
        this.boolPage();
    },
    methods: {
        boolPage() {
            var key = this.$router.history.current.name;
            if (key == "Login") {
                if (this.isToken() == true) {
                    this.is_login = true;
                } else {
                    this.is_login = false;
                }
            } else {
                if (this.isToken() == true) {
                    this.is_login = true;
                } else {
                    this.is_login = false;
                }
            }
        },
        isToken() {
            var isToken = $cookies.isKey("token");

            if (isToken) {
                this.onReportLoginHistory();
                return false;
            } else {
                return true;
            }
        },
        onReportLoginHistory() {
            this.$http
                .post("/api/v1/w5/post/user/login_history", {
                    user_id: this.$cookies.get("user_id")
                })
                .then((res) => {
                    if (res.code == 0) {} else {
                        this.$message.error(res.msg);
                    }
                });
        },
    },
    watch: {
        $route(to, from) {
            if (to.path === "/system") {

            }
        }
    },

};
</script>

<style lang="less" scoped>
@import url("./theme/style.less");

body,
* {
    margin: 0px;
}

#app {
    height: 100%;
}

.bright {
    .ant-layout {
        background: #f1f1f1;
    }

    .layout {
        height: 100%;

        .ant-layout-content {
            margin: 5px 15px 0px 15px;
            padding: 10px;
            background: initial;
            border-radius: 5px;
            min-height: auto;
            overflow-y: overlay;
        }

        .ant-layout-system {
            margin: 0px;
            padding: 0px;

            /deep/ .ant-tabs {
                height: 100%;
            }

            /deep/ .ant-tabs-left-bar {
                height: 100%;
            }
        }

        /deep/ .ant-collapse-borderless {
            background-color: #fff;
            border: 0;
            height: 100%;
            overflow: auto;
        }

        /deep/ .ant-btn-primary {
            color: #fff;
            background-color: @color1;
            border-color: @color1;
            text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
            -webkit-box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
            box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
        }

        /deep/ .ant-switch-checked {
            background-color: #3ac529;
        }

        /deep/.ant-tabs-nav .ant-tabs-tab-active {
            color: @color1;
            font-weight: 500;
        }

        /deep/.ant-tabs-ink-bar {
            background-color: #060606;
            height: 0px;
        }

        /deep/ .ant-tabs-nav .ant-tabs-tab:hover {
            color: @color1;
        }

        /deep/ .ant-list {
            margin-top: -16px;
            padding-left: 5px;
            padding-right: 5px;
        }

        /deep/ .ant-page-header-ghost {
            position: absolute;
            top: 0px;
            left: 0px;
            z-index: 999;
            width: 100%;
        }

        /deep/ .ant-page-header-heading-extra {
            float: none;
            position: fixed;
            right: 0;
            margin-right: 20px;
            margin-top: 6px;
        }
    }

    /deep/ .descx {
        .ant-descriptions-item-label {
            color: #333;
            font-weight: bold;
        }

        .ant-descriptions-item-content {
            color: #333;
        }

        .ant-page-header-back-button {
            color: #333;
        }
    }

    /deep/ .ant-tabs .ant-tabs-left-content {
        padding-left: 0px;
        border-left: 0px;
    }

    /deep/.ant-tabs-nav-wrap {
        background: #fff;
        border-right: 1px solid #efefef;
        margin: 0px;
        padding-top: 24px;
    }

    /deep/.ant-pagination-total-text {
        display: inline-block;
        height: initial;
        margin-right: 8px;
        line-height: 30px;
        vertical-align: middle;
        font-size: 13px;
        color: #626262;
    }

    /deep/ .ant-menu-inline .ant-menu-item:not(:last-child) {
        margin-bottom: 0px;
    }
}

.dark {
    .ant-layout {
        background: @dark-background1;
    }

    .layout {
        height: 100%;

        .ant-layout-content {
            margin: 5px 15px 0px 15px;
            padding: 10px;
            background: initial;
            border-radius: 5px;
            min-height: auto;
            overflow-y: overlay;
            color: @dark-text-color;
        }

        .ant-layout-system {
            margin: 0px;
            padding: 0px;

            /deep/ .ant-tabs {
                height: 100%;
            }

            /deep/ .ant-tabs-left-bar {
                height: 100%;
            }
        }
    }

    /deep/ .ant-table {
        color: #e2e0e0;
    }

    /deep/ .ant-table-thead>tr>th {
        color: #e2e0e0;
        background: #202225;
        border-bottom: 1px solid #303030;
    }

    /deep/ .ant-table-tbody>tr>td {
        border-bottom: 1px solid #303030;
    }

    /deep/ .ant-table-tbody>tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)>td {
        background: #3f444e;
    }

    /deep/ .ant-table-tbody>tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)>td {
        background: #292d38;
    }

    /deep/ .ant-pagination-prev .ant-pagination-item-link,
    .ant-pagination-next .ant-pagination-item-link {
        display: block;
        height: 100%;
        font-size: 12px;
        text-align: center;
        background-color: #202225;
        border: 1px solid #353535;
        border-radius: 4px;
        outline: none;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
    }

    /deep/ .ant-pagination-disabled a,
    .ant-pagination-disabled:hover a,
    .ant-pagination-disabled:focus a,
    .ant-pagination-disabled .ant-pagination-item-link,
    .ant-pagination-disabled:hover .ant-pagination-item-link,
    .ant-pagination-disabled:focus .ant-pagination-item-link {
        color: #ffffff61;
    }

    /deep/ .ant-pagination-next a {
        color: #ffffff61;
    }

    /deep/ .ant-pagination-prev a,
    .ant-pagination-next a {
        color: #ffffff61;
    }

    /deep/ .ant-pagination-item-link {
        display: block;
        height: 100%;
        font-size: 12px;
        text-align: center;
        background-color: #202225;
        border: 1px solid #353535;
        border-radius: 4px;
        outline: none;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
    }

    /deep/ .ant-pagination-item-active {
        font-weight: 500;
        background: #202225;
        border-color: #353535;
    }

    /deep/ .ant-pagination-item {
        background: #202225;
        border-color: #353535;
    }

    /deep/ .ant-pagination-item a {
        display: block;
        padding: 0 6px;
        color: #ffffffa6;
        -webkit-transition: none;
        transition: none;
    }

    /deep/ .ant-pagination-item-active a {
        color: #fff;
    }

    /deep/ .ant-btn-primary {
        color: #fff;
        background-color: @color1;
        border-color: @color1;
        text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
        -webkit-box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
        box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
    }

    /deep/ .ant-switch-checked {
        background-color: #3ac529;
    }

    /deep/ .ant-table-placeholder {
        position: relative;
        z-index: 1;
        margin-top: -1px;
        padding: 16px 16px;
        color: rgba(0, 0, 0, 0.25);
        font-size: 14px;
        text-align: center;
        background: #202020;
        border-top: 1px solid #353535;
        border-bottom: 1px solid #353535;
        border-radius: 0 0 4px 4px;
    }

    /deep/ .ant-empty-normal {
        margin: 32px 0;
        color: #ccc;
    }

    /deep/ .ant-collapse>.ant-collapse-item>.ant-collapse-header {
        color: #e4e4e4;
    }

    /deep/ .ant-collapse-borderless {
        background-color: #27292e;
        border: 0;
        height: 100%;
        overflow: auto;
    }

    /deep/ .ant-collapse-borderless>.ant-collapse-item {
        border-bottom: 1px solid #353535;
    }

    /deep/ .ant-collapse-borderless>.ant-collapse-item>.ant-collapse-content>.ant-collapse-content-box {
        padding-top: 16px;
    }

    /deep/ .ant-menu-item-selected .anticon {
        color: @color1;
    }

    /deep/ .ant-table-fixed-header>.ant-table-content>.ant-table-scroll>.ant-table-body {
        background: none;
    }

    /deep/.ant-tabs .ant-tabs-left-bar .ant-tabs-tab {
        text-align: right;
        color: #c7c7c7;
    }

    /deep/.ant-tabs .ant-tabs-nav .ant-tabs-tab-active {
        color: #e24540;
        font-weight: 500;
    }

    /deep/.ant-tabs-ink-bar {
        background-color: #cdcdcd;
        height: 0px;
    }

    /deep/ .ant-tabs-nav .ant-tabs-tab:hover {
        color: #e24540;
    }

    /deep/ .ant-tabs .ant-tabs-left-bar {
        float: left;
        margin-right: -1px;
        margin-bottom: 0;
        border-right: 1px solid #5d5d5d;
    }

    /deep/ .ant-tabs .ant-tabs-left-content {
        padding-left: 0px;
        border-left: 0px;
    }

    /deep/ .ant-list-item-meta-title {
        margin-bottom: 4px;
        color: #dedede;
        font-size: 14px;
        line-height: 22px;
    }

    /deep/ .ant-list-item-meta-description {
        color: #909090;
        font-size: 13px;
        line-height: 22px;
        letter-spacing: 1px;
        font-weight: 400;
    }

    /deep/ .ant-list-split .ant-list-item {
        border-bottom: 1px solid #5d5d5d;
    }

    /deep/ .ant-list-split .ant-list-item:last-child {
        border-bottom: none;
    }

    /deep/ .ant-tabs-nav .ant-tabs-tab {
        color: #ccc;
    }

    /deep/ .ant-list {
        color: #c7c7c7;
        margin-top: -16px;
        padding-left: 5px;
        padding-right: 5px;
    }

    /deep/ .ant-statistic-title {
        color: #fff;
    }

    /deep/ .ant-statistic-content {
        color: #fff;
    }

    /deep/ .ant-page-header-ghost {
        background-color: inherit;
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 999;
        width: 100%;
    }

    /deep/ .ant-page-header-heading-title {
        color: #fff;
    }

    /deep/ .ant-page-header-heading-sub-title {
        color: #a0a0a0;
    }

    /deep/ .ant-page-header-heading-extra {
        float: none;
        position: fixed;
        right: 0;
        margin-right: 20px;
        margin-top: 6px;
    }

    /deep/ .descx {
        .ant-descriptions-item-label {
            color: #fff;
            font-weight: bold;
        }

        .ant-descriptions-item-content {
            color: #ffffffdb;
        }

        .ant-page-header-back-button {
            color: #fff;
        }
    }

    /deep/.ant-tabs-nav-wrap {
        background: #202020;
        border-right: 1px solid #2c2c2c;
        margin: 0px;
        padding-top: 24px;
    }

    /deep/.ant-pagination-total-text {
        display: inline-block;
        height: initial;
        margin-right: 8px;
        line-height: 30px;
        vertical-align: middle;
        font-size: 13px;
        color: #959595;
    }

    /deep/.ant-input {
        color: #dbdbdb;
        background-color: #303030;
        border: 1px solid #303030;
    }

    /deep/.ant-input-search-icon {
        color: #dbdbdb;
    }

    /deep/ .ant-input-affix-wrapper:hover .ant-input:not(.ant-input-disabled) {
        border-color: #b31915;
    }

    /deep/ .ant-input:focus {
        border-color: #b31915;
        -webkit-box-shadow: initial;
        box-shadow: initial;
    }

    /deep/ .ant-input:hover {
        border-color: #b31915;
    }

    /deep/ .ant-select-selection {
        background-color: #303030;
        border: 1px solid #303030;
    }

    /deep/ .ant-select {
        color: #bfbfbf;
    }

    /deep/.ant-select-arrow {
        color: #bfbfbf;
    }

    /deep/.ant-select-selection:active {
        border-color: #b31915;
        -webkit-box-shadow: initial;
        box-shadow: initial;
    }

    /deep/.ant-select-selection:hover {
        border-color: #b31915;
        border-right-width: 1px !important;
    }

    /deep/.ant-pagination-jump-prev .ant-pagination-item-container .ant-pagination-item-ellipsis,
    /deep/.ant-pagination-jump-next .ant-pagination-item-container .ant-pagination-item-ellipsis {
        color: #969798;
    }

    /deep/.ant-pagination-jump-prev .ant-pagination-item-container .ant-pagination-item-link-icon,
    /deep/.ant-pagination-jump-next .ant-pagination-item-container .ant-pagination-item-link-icon {
        color: #e32b26;
    }

    /deep/.ant-divider-with-text-left {
        color: #cdcdcd;
    }

    /deep/ .ant-menu-inline .ant-menu-item:not(:last-child) {
        margin-bottom: 0px;
    }

    /deep/ .ant-divider-horizontal.ant-divider-with-text-left::before {
        border-top: 1px solid #5d5d5d;
    }

    /deep/.ant-divider-horizontal.ant-divider-with-text-left::after {
        border-top: 1px solid #5d5d5d;
    }
}

/deep/.ant-layout-content::-webkit-scrollbar {
    display: none
}

/deep/ .btn_hei {
    color: #fff;
    background-color: #424242;
    border-color: #5c5c5c;
    margin-right: 15px;
    float: right;
}
</style>
