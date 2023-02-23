<template>
<a-layout-content>
    <div class="header_div">
        <a-select show-search :filter-option="onFilterOption" default-value="all" style="width: 120px" @change="onSelect" class="align">
            <a-select-option value="all">全部</a-select-option>
            <a-select-option v-for="(item,index) in app_type_list" :key="index" :value="item">{{ item }}</a-select-option>
        </a-select>
        <a-input-search placeholder="请输入应用名称" style="width: 200px" @search="onSearch" class="align" />

        <a-button type="primary" icon="cloud-upload" class="align btn_add" @click="handleMenuClick(1)">
            APP市场
        </a-button>

        <a-button type="primary" icon="upload" class="align btn_add" style="margin-right: 15px;" @click="handleMenuClick(2)">
            本地上传
        </a-button>
    </div>

    <a-row :gutter="[20,20]">
        <a-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" v-for="(item,index) in app_list" :key="index">
            <div class="app_card">
                <div class="header">
                    <div class="div1">
                        <a-avatar class="app_avatar" :size="55" :src="baseURL+'/app/'+item.icon+'?t='+ new Date().getTime()" />
                    </div>
                    <div class="div2">
                        <div class="app_name"><span>{{ item.name }}</span><span class="app_version">v{{ item.version }}</span></div>
                        <div class="app_desc"><span>{{ item.description }}</span></div>
                    </div>
                    <div class="app_type">
                        {{ item.type }}
                    </div>
                    <div class="app_del">
                        <a-tooltip placement="left">
                            <template slot="title">
                                <span>删除</span>
                            </template>
                            <a-popconfirm title="是否要删除该 APP?" ok-text="是" cancel-text="否" @confirm="del(item.app_dir)">
                                <a-icon class="pointer" type="delete" />
                            </a-popconfirm>
                        </a-tooltip>
                    </div>
                    <div class="app_upload">
                        <a-tooltip placement="left">
                            <template slot="title">
                                <span>上传</span>
                            </template>
                            <a-icon class="pointer" type="upload" @click="onUploadShow(item.app_dir,item.name,item.type,item.version,item.description)" />
                        </a-tooltip>
                    </div>
                </div>
                <div class="clear"></div>
                <div class="look_app" @click="onShowMd(item.app_dir,item.name,item.version,item.action,item.args,item.description)">
                    <a-icon type="file-markdown" /> 查看文档
                </div>
            </div>
        </a-col>
    </a-row>

    <a-drawer :title="app_title" :width="600" :visible="visible_md" :body-style="{ paddingBottom: '80px' }" @close="onCloseMd">
        <div class="markdown-body" v-html="html"></div>
    </a-drawer>

    <a-modal title="导入 APP" cancelText="关闭" okText="确认" :footer="null" :maskClosable="false" :width="600" :visible="visible_add" @cancel="onCloseAdd">
        <a-upload-dragger name="file" :action="upload_url" :headers="headers" @change="onUpload">
            <p class="ant-upload-drag-icon">
                <a-icon type="inbox" />
            </p>
            <p class="ant-upload-text">
                点击或拖动文件到此区域
            </p>
            <p class="ant-upload-hint">
                只支持上传 “.zip” 格式的压缩包
            </p>
        </a-upload-dragger>
    </a-modal>

    <a-modal title="APP 市场" :footer="null" :maskClosable="false" :width="1200" :visible="visible_cloud" @cancel="onCloseCloud">
        <a-row :gutter="[20,20]" class="cloud_app">
            <a-col :span="8" v-for="(item,index) in cloud_app_list" :key="index">
                <div class="app_card">
                    <div class="header">
                        <div class="div1">
                            <a-avatar class="app_avatar" :size="55" :src="item.Icon" />
                        </div>
                        <div class="div2">
                            <div class="app_name"><span>{{ item.Name }}</span><span class="app_version">v{{ item.Version }}</span> <span class="app_author">开发者: {{ item.Author }}</span></div>
                            <div class="app_desc"><span>{{ item.Description }}</span></div>
                        </div>
                        <div class="app_type">
                            {{ item.Type }}
                        </div>
                        <div class="app_download">
                            <a-tooltip placement="left">
                                <template slot="title">
                                    <span>下载</span>
                                </template>
                                <a-popconfirm title="是否要下载该 APP?" ok-text="是" cancel-text="否" @confirm="appDownload(item.WID,item.AppDir,item.DownUrl)">
                                    <a-icon class="pointer" type="download" />
                                </a-popconfirm>
                            </a-tooltip>
                        </div>
                        <div class="app_github" v-if="item.Github!=''">
                            <a-tooltip placement="left">
                                <template slot="title">
                                    <span>开源地址</span>
                                </template>
                                <a-icon class="pointer" type="github" @click="onOpenGithub(item.Github)" />
                            </a-tooltip>
                        </div>
                    </div>
                    <div class="clear"></div>
                    <div class="look_app" @click="onShowCloudMD(item.WID,item.Name,item.Version,item.Description,item.Doc,item.Author,item.EMail)">
                        <a-icon type="file-markdown" /> 查看文档
                    </div>
                </div>
            </a-col>
        </a-row>
    </a-modal>

    <a-modal title="上传 APP" :footer="null" :maskClosable="false" :width="600" :visible="visible_upload" @cancel="onCloseUpload">
        <a-row :gutter="16">
            <a-col :span="24">
                <a-form-item>
                    <template slot="label">APP WID <span style="color: #4c4c4c;font-size: 10px;font-weight: 400;">(新 APP 无需填写，更新 APP 需填写 WID)</span></template>
                    <a-input placeholder="请输入 WID" v-model="up_wid" @blur="appGetInfo" />
                </a-form-item>
            </a-col>
            <a-col :span="24">
                <a-form-item>
                    <template slot="label"><span class="xing">*</span>APP 名称</template>
                    <a-input placeholder="请输入 APP 名称" v-model="up_name" disabled />
                </a-form-item>
            </a-col>
            <a-col :span="24">
                <a-form-item>
                    <template slot="label"><span class="xing">*</span>APP 类型</template>
                    <a-input placeholder="请输入 APP 类型" v-model="up_type" disabled />
                </a-form-item>
            </a-col>
            <a-col :span="24">
                <a-form-item>
                    <template slot="label"><span class="xing">*</span>APP 版本</template>
                    <a-input placeholder="请输入 APP 版本" v-model="up_version" disabled />
                </a-form-item>
            </a-col>
            <a-col :span="24">
                <a-form-item>
                    <template slot="label"><span class="xing">*</span>APP 介绍</template>
                    <a-input placeholder="请输入 APP 介绍" v-model="up_description" disabled />
                </a-form-item>
            </a-col>
            <a-col :span="24">
                <a-form-item>
                    <template slot="label"><span class="xing">*</span>作者</template>
                    <a-input placeholder="请输入作者名称" v-model="up_author" />
                </a-form-item>
            </a-col>
            <a-col :span="24">
                <a-form-item>
                    <template slot="label"><span class="xing">*</span>联系邮箱</template>
                    <a-input placeholder="请输入作者邮箱" v-model="up_email" />
                </a-form-item>
            </a-col>
            <a-col :span="24">
                <a-form-item label="Github 地址">
                    <a-input placeholder="请输入 Github 开源地址" v-model="up_github" />
                </a-form-item>
            </a-col>

            <a-button type="primary" icon="upload" style="width:100%" @click="onUploadApp">提交 APP 到市场</a-button>
        </a-row>
    </a-modal>
</a-layout-content>
</template>

<script>
import marked from 'marked';
import 'github-markdown-css/github-markdown.css'
import reqid from "../../utils/reqid";
import {
    W
} from 'core-js/library/modules/_export';

export default {
    name: "appHome",
    data() {
        return {
            baseURL: this.BaseURL,
            app_list: [],
            cloud_app_list: [],
            visible_md: false,
            html: "",
            app_title: "",
            app_type_list: null,
            select_type: "all",
            so_text: "",
            visible_add: false,
            visible_cloud: false,
            visible_upload: false,
            up_wid: "",
            up_name: "",
            up_type: "",
            up_version: "",
            up_description: "",
            up_author: "",
            up_email: "",
            up_app_dir: "",
            up_github: "",
            upload_url: this.BaseURL + "/api/v1/w5/post/app/import",
            headers: {
                token: this.$cookies.get("token"),
                requestId: reqid.GetRequestId(),
                timestamp: new Date().getTime()
            },
        };
    },
    mounted() {
        this.onLoad();
    },
    methods: {
        onLoad() {
            this.onAppList();
        },
        onUpload(info) {
            if (info.file.status === 'done') {
                if (info.file.response.code != 0) {
                    this.$message.error(info.file.response.msg);
                } else {
                    this.$message.success(`${info.file.name} 上传成功`);
                    this.onLoad();
                }
            } else if (info.file.status === 'error') {
                this.$message.error(`${info.file.name} 上传失败`);
            }
        },
        onRegExp(text, str) {
            let strx = ['', ...text, ''].join('.*');
            let reg = new RegExp(strx);
            return reg.test(str)
        },
        onAppList(type = "all", so_text = "") {
            this.app_list = [];
            this.app_type_list = new Set();

            this.$http
                .get("/api/v1/w5/get/app/list")
                .then((res) => {
                    if (res.code == 0) {
                        let xdata = res.data;

                        for (var item in xdata) {
                            this.app_type_list.add(xdata[item].type)
                        }

                        if (type === "all") {
                            if (so_text === "") {
                                this.app_list = xdata;
                            } else {
                                for (var item in xdata) {
                                    if (this.onRegExp(so_text, xdata[item].name)) {
                                        this.app_list.push(xdata[item]);
                                    }
                                }
                            }
                        } else {
                            for (var item in xdata) {
                                if (type === xdata[item].type) {
                                    if (so_text === "") {
                                        this.app_list.push(xdata[item]);
                                    } else {
                                        if (this.onRegExp(so_text, xdata[item].name)) {
                                            this.app_list.push(xdata[item]);
                                        }
                                    }
                                }
                            }
                        }

                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        onShowMd(app_dir, name, version, action, args, description) {
            let md_url = "/app/" + app_dir + "/readme.md?t=" + new Date().getTime();

            this.$http
                .get(md_url)
                .then((res) => {
                    this.app_title = name + " v" + version + " - " + description;

                    marked.setOptions({
                        renderer: new marked.Renderer(),
                        gfm: true,
                        tables: true,
                        smartLists: true
                    });

                    this.html = marked(res);
                    this.visible_md = true;
                });
        },
        onShowCloudMD(wid, name, version, description, doc, author, email) {
            this.app_title = name + " v" + version + " - " + description;

            marked.setOptions({
                renderer: new marked.Renderer(),
                gfm: true,
                tables: true,
                smartLists: true
            });

            doc = "**作者** : " + author + "<br>" + "**邮箱** : " + email + "<br>" + "**WID** : " + wid + "\n" + doc;

            this.html = marked(doc);
            this.visible_md = true;
        },
        del(app_dir) {
            this.$http
                .post("/api/v1/w5/post/app/del", {
                    app_dir: app_dir,
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
        onSearch(value) {
            this.so_text = value;
            this.onAppList(this.select_type, this.so_text);
        },
        onSelect(value) {
            this.select_type = value;
            this.onAppList(this.select_type, this.so_text);
        },
        onCloseMd() {
            this.visible_md = false;
        },
        onFilterOption(input, option) {
            return (
                option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
        },
        showAdd() {
            this.visible_add = true;
        },
        onCloseAdd() {
            this.visible_add = false;
        },
        onCloseCloud() {
            this.visible_cloud = false;
        },
        onCloseUpload() {
            this.visible_upload = false;
        },
        onLoadCloudApp() {
            this.$http
                .post("/api/v1/w5/get/app/cloud_list")
                .then((res) => {
                    if (res.code == 0) {
                        this.cloud_app_list = res.data;
                        this.visible_cloud = true;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        handleMenuClick(type) {
            if (type == "1") {
                this.onLoadCloudApp();
            } else if (type == "2") {
                this.showAdd();
            }
        },
        onUploadShow(app_dir, name, type, version, description) {
            this.up_app_dir = app_dir;
            this.up_name = name;
            this.up_type = type;
            this.up_version = version;
            this.up_description = description;

            this.visible_upload = true;
        },
        onUploadApp() {
            if (this.up_author.trim() === "") {
                this.$message.warning("请填写作者名称");
                return false

            }

            if (this.up_email.trim() === "") {
                this.$message.warning("请填写作者邮箱");
                return false
            }

            this.$http
                .post("/api/v1/w5/post/app/upload", {
                    wid: this.up_wid.trim(),
                    name: this.up_name,
                    type: this.up_type,
                    author: this.up_author.trim(),
                    email: this.up_email.trim(),
                    description: this.up_description,
                    version: this.up_version,
                    github: this.up_github.trim(),
                    app_dir: this.up_app_dir
                })
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success("上传成功，请等待审核，及时查看邮箱邮件！");
                        this.visible_upload = false;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        onOpenGithub(url) {
            window.open(url, '_blank');
        },
        appDownload(wid, appDir, zipUrl) {
            this.$http
                .post("/api/v1/w5/post/app/download", {
                    wid: wid,
                    zip_url: zipUrl,
                    app_dir: appDir,
                })
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success("下载成功");
                        this.onAppList();
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        appGetInfo() {
            if (this.up_wid.trim() != "") {
                this.$http
                    .post("/api/v1/w5/get/app/cloud_info", {
                        wid: this.up_wid.trim(),
                    })
                    .then((res) => {
                        if (res.code == 0) {
                            if (res.data.WID == "") {
                                this.up_wid = "";
                                this.up_author = "";
                                this.up_email = "";
                                this.up_github = "";
                                this.$message.warning("未找到该 WID 信息");
                            } else {
                                this.up_author = res.data.Author;
                                this.up_email = res.data.EMail;
                                this.up_github = res.data.Github;
                            }
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import url("../../theme/style.less");

.markdown-body {
    box-sizing: border-box;
    min-width: 200px;
    max-width: 980px;
    margin: 0 auto;
    font-size: 13px;
}

.pointer {
    cursor: pointer;
}

.center {
    text-align: center;
}

.clear {
    clear: both;
}

.div1 {
    float: left;
}

.div2 {
    margin-top: 23px;
    margin-left: 70px;
    text-align: left;
}

.cloud_app {

    .app_card {
        background: #fafafa;
        width: 100%;
        border-radius: 3px;
        border: 1px solid #efefef;

        .header {
            text-align: center;
            padding: 20px;
            height: 115px;

            .app_avatar {
                margin-top: 20px;
            }

            .app_name {
                text-align: left;
            }

            .app_desc {
                margin-top: 5px;
                font-size: 12px;
                color: #989898;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
            }

            .app_version {
                padding-left: 5px;
                font-size: 12px;
                color: #b1b1b1;
            }

            .app_author {
                padding-left: 9px;
                font-size: 12px;
                color: #545454;
            }

            .app_type {
                position: absolute;
                background: #eaeaea;
                top: 0;
                left: 0;
                margin-left: 10px;
                margin-top: 10px;
                border-top-left-radius: 3px;
                padding: 2px 10px;
            }

            .app_download {
                position: absolute;
                background: #eaeaea;
                top: 0;
                right: 0;
                margin-right: 10px;
                margin-top: 10px;
                border-top-right-radius: 3px;
                padding: 2px 10px;
            }

            .app_github {
                position: absolute;
                background: #eaeaea;
                top: 0;
                right: 0;
                margin-right: 50px;
                margin-top: 10px;
                padding: 2px 10px;
            }
        }

        .look_app {
            width: 100%;
            background: #eaeaea;
            text-align: center;
            line-height: 29px;
            cursor: pointer;
            border-bottom-left-radius: 3px;
            border-bottom-right-radius: 3px;
        }
    }
}

.bright {
    .header_div {
        width: 100%;
        background: #fafafa;
        margin-bottom: 20px;
        padding: 10px;
        border: 1px solid #f5f5f5;
        border-radius: 5px;

        .align {
            vertical-align: middle;
        }

        .btn_add {
            float: right;
        }
    }

    .app_card {
        background: #fafafa;
        width: 100%;
        border-radius: 3px;
        border: 1px solid #efefef;

        .header {
            text-align: center;
            padding: 20px;
            height: 115px;

            .app_avatar {
                margin-top: 20px;
            }

            .app_name {
                text-align: left;
            }

            .app_desc {
                margin-top: 5px;
                font-size: 12px;
                color: #989898;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
            }

            .app_version {
                padding-left: 5px;
                font-size: 12px;
                color: #b1b1b1;
            }

            .app_type {
                position: absolute;
                background: #eaeaea;
                top: 0;
                left: 0;
                margin-left: 10px;
                margin-top: 10px;
                border-top-left-radius: 3px;
                padding: 2px 10px;
            }

            .app_del {
                position: absolute;
                background: #eaeaea;
                top: 0;
                right: 0;
                margin-right: 10px;
                margin-top: 10px;
                border-top-right-radius: 3px;
                padding: 2px 10px;
            }

            .app_upload {
                position: absolute;
                background: #3f7abe;
                top: 0;
                right: 0;
                margin-right: 50px;
                margin-top: 10px;
                padding: 2px 10px;
                color: #ececec;
            }
        }

        .look_app {
            width: 100%;
            background: #eaeaea;
            text-align: center;
            line-height: 29px;
            cursor: pointer;
            border-bottom-left-radius: 3px;
            border-bottom-right-radius: 3px;
        }
    }
}

.dark {
    .header_div {
        width: 100%;
        background: #202020;
        margin-bottom: 20px;
        padding: 10px;
        border: 1px solid #303030;
        border-radius: 5px;

        .align {
            vertical-align: middle;
        }

        .btn_add {
            float: right;
        }
    }

    .app_card {
        background: #202020;
        width: 100%;
        border-radius: 3px;

        .header {
            text-align: center;
            padding: 20px;
            height: 115px;

            .app_avatar {
                margin-top: 20px;
            }

            .app_name {
                text-align: left;
            }

            .app_desc {
                margin-top: 5px;
                font-size: 12px;
                color: #989898;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
            }

            .app_version {
                padding-left: 5px;
                font-size: 12px;
                color: #cccccc;
            }

            .app_type {
                position: absolute;
                background: #3b3d42;
                top: 0;
                left: 0;
                margin-left: 10px;
                margin-top: 10px;
                border-top-left-radius: 3px;
                padding: 2px 10px;
            }

            .app_del {
                position: absolute;
                background: #3b3d42;
                top: 0;
                right: 0;
                margin-right: 10px;
                margin-top: 10px;
                border-top-right-radius: 3px;
                padding: 2px 10px;
            }

            .app_upload {
                position: absolute;
                background: #3f7abe;
                top: 0;
                right: 0;
                margin-right: 50px;
                margin-top: 10px;
                padding: 2px 10px;
            }
        }

        .look_app {
            width: 100%;
            background: #3b3d42;
            text-align: center;
            line-height: 29px;
            cursor: pointer;
            border-bottom-left-radius: 3px;
            border-bottom-right-radius: 3px;
        }
    }
}

.xing {
    color: #e03636;
    margin-right: 5px;
}
</style>
