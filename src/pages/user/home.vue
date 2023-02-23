<template>
<a-layout-content>
    <div class="header_div">
        <a-input-search placeholder="请输入账号/昵称/邮箱" style="width: 200px" @search="onSearch" class="align" />
        <a-button type="primary" icon="plus-circle" class="align btn_add" @click="showAdd">
            添加
        </a-button>
        <a-button icon="team" class="align btn_hei" @click="onShowRole">
            角色管理
        </a-button>
    </div>
    <a-table rowKey="id" :columns="columns" :data-source="data" :loading="loading" :pagination="pagination">
        <span slot="avatar" slot-scope="text">
            <div class="tableAvatar" v-html="text"></div>
        </span>

        <span slot="nick_name" slot-scope="text">
            <b>{{ text }}</b>
        </span>

        <a-tag slot="account" slot-scope="text" color="#cf3f3d">
            {{ text }}
        </a-tag>

        <span slot="update_time" slot-scope="text">
            {{Dayjs(text).subtract(8, 'hour').format('YYYY-MM-DD HH:mm:ss')}}
        </span>

        <span slot="create_time" slot-scope="text">
            {{Dayjs(text).subtract(8, 'hour').format('YYYY-MM-DD HH:mm:ss')}}
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
                    <a-popconfirm title="是否要删除该用户?" ok-text="是" cancel-text="否" @confirm="del(record.id)">
                        <a-icon class="pointer" type="delete" />
                    </a-popconfirm>
                </a-tooltip>

                <span>|</span>

                <a-tooltip placement="top">
                    <template slot="title">
                        <span>编辑</span>
                    </template>
                    <a-icon class="pointer" type="form" @click="showEdit(record.id, record.account, record.nick_name, record.email, record.avatar,record.role_id)" />
                </a-tooltip>
            </a-space>
        </span>
    </a-table>

    <a-drawer title="添加新用户" :width="400" :visible="visible_add" :body-style="{ paddingBottom: '80px' }" @close="onCloseAdd">

        <div class="avatardiv">
            <div id="avatar" class="avatar" v-html="avatar"></div>
            <a-space :size="14">
                <a-tooltip placement="bottom">
                    <template slot="title">
                        <span>刷新头像</span>
                    </template>
                    <a href="javascript:;" @click="onUpdateAvatar">
                        <a-icon type="sync" />
                    </a>
                </a-tooltip>
            </a-space>
        </div>

        <a-form :form="formAdd" layout="vertical" @submit="onAdd">
            <a-row :gutter="16">
                <a-col :span="24">
                    <a-form-item label="账号">
                        <a-input v-decorator="[
                  'account',
                  {
                    rules: [
                      { required: true, message: '请输入用户账号' },
                      { min: 2, message: '账号长度不能少于2位' },
                      { max: 20, message: '账号长度不能超过20位' },
                    ],
                  },
                ]" placeholder="请输入用户账号" />
                    </a-form-item>
                </a-col>

                <a-col :span="24">
                    <a-form-item label="昵称">
                        <a-input v-decorator="[
                  'nick_name',
                  {
                    rules: [
                      { required: true, message: '请输入用户昵称' },
                      { min: 2, message: '昵称长度不能少于2位' },
                      { max: 20, message: '昵称长度不能超过20位' },
                    ],
                  },
                ]" placeholder="请输入用户昵称" />
                    </a-form-item>
                </a-col>

                <a-col :span="24">
                    <a-form-item label="E-Mail">
                        <a-input v-decorator="[
                  'email',
                  {
                    rules: [
                      { required: true, message: '请输入用户 E-Mail' },
                      { min: 6, message: '邮箱长度不能少于6位' },
                      { max: 50, message: '邮箱长度不能超过50位' },
                    ],
                  },
                ]" placeholder="请输入用户 E-Mail" />
                    </a-form-item>
                </a-col>

                <a-col :span="24">
                    <a-form-item label="角色">
                        <a-select show-search :filter-option="onFilterOption" v-decorator="[
                  'role',
                  {
                    rules: [{ required: true, message: '请选择角色' }],
                  },
                ]" placeholder="请选择角色">
                            <a-select-option v-for="(item, index) in role_list" :key="index" :value="item.id">{{ item.name }}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>

                <a-col :span="24">
                    <a-form-item label="密码">
                        <a-input-password v-decorator="[
                  'passwd',
                  {
                    rules: [
                      { required: true, message: '请输入用户密码' },
                      { min: 8, message: '密码长度不能少于8位' },
                      { max: 16, message: '密码长度不能超过16位' },
                    ],
                  },
                ]" placeholder="请输入用户密码" type="password" />
                    </a-form-item>
                </a-col>

                <a-col :span="24">
                    <a-form-item label="确认密码">
                        <a-input-password v-decorator="[
                  'repasswd',
                  {
                    rules: [
                      { required: true, message: '请确认用户密码' },
                      { min: 8, message: '密码长度不能少于8位' },
                      { max: 16, message: '密码长度不能超过16位' },
                    ],
                  },
                ]" placeholder="请确认用户密码" type="password" />
                    </a-form-item>
                </a-col>
            </a-row>

            <div :style="{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
            zIndex: 1,
          }">
                <a-button :style="{ marginRight: '8px' }" @click="onCloseAdd">关闭</a-button>
                <a-button type="primary" html-type="submit" :loading="loadingAdd">
                    添加
                </a-button>
            </div>
        </a-form>
    </a-drawer>

    <a-drawer title="更新用户信息" :width="400" :visible="visible_edit" :body-style="{ paddingBottom: '80px' }" @close="onCloseEdit">

        <div class="avatardiv">
            <div id="avatar" class="avatar" v-html="avatar"></div>
            <a-space :size="14">
                <a-tooltip placement="bottom">
                    <template slot="title">
                        <span>刷新头像</span>
                    </template>
                    <a href="javascript:;" @click="onUpdateAvatar">
                        <a-icon type="sync" />
                    </a>
                </a-tooltip>
            </a-space>
        </div>

        <a-form :form="formUpdate" layout="vertical" @submit="onUpdate">
            <a-row :gutter="16">
                <a-col :span="24">
                    <a-form-item label="账号">
                        <a-input v-decorator="[
                  'account',
                  {
                    rules: [{ required: true, message: '请输入用户账号' }],
                  },
                ]" placeholder="请输入用户账号" :disabled="true" />
                    </a-form-item>
                </a-col>

                <a-col :span="24">
                    <a-form-item label="昵称">
                        <a-input v-decorator="[
                  'nick_name',
                  {
                    rules: [
                      { required: true, message: '请输入用户昵称' },
                      { min: 2, message: '昵称长度不能少于2位' },
                      { max: 20, message: '昵称长度不能超过20位' },
                    ],
                  },
                ]" placeholder="请输入用户昵称" />
                    </a-form-item>
                </a-col>

                <a-col :span="24">
                    <a-form-item label="E-Mail">
                        <a-input v-decorator="[
                  'email',
                  {
                    rules: [
                      { required: true, message: '请输入用户 E-Mail' },
                      { min: 6, message: '邮箱长度不能少于6位' },
                      { max: 50, message: '邮箱长度不能超过50位' },
                    ],
                  },
                ]" placeholder="请输入用户 E-Mail" />
                    </a-form-item>
                </a-col>

                <a-col :span="24">
                    <a-form-item label="角色">
                        <a-select show-search :filter-option="onFilterOption" v-decorator="[
                  'role',
                  {
                    rules: [{ required: true, message: '请选择角色' }],
                  },
                ]" placeholder="请选择角色">
                            <a-select-option v-for="(item, index) in role_list" :key="index" :value="item.id">{{ item.name }}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>

                <a-col :span="24">
                    <a-form-item label="密码">
                        <a-input-password v-decorator="[
                        'passwd',{
                        rules: [
                            { min: 8, message: '密码长度不能少于8位' },
                            { max: 16, message: '密码长度不能超过16位' },
                        ]}]" placeholder="请输入用户密码" type="password" />
                    </a-form-item>
                </a-col>

                <a-col :span="24">
                    <a-form-item label="确认密码">
                        <a-input-password v-decorator="[
                        'repasswd',{
                        rules: [
                            { min: 8, message: '密码长度不能少于8位' },
                            { max: 16, message: '密码长度不能超过16位' },
                        ]}]" placeholder="请确认用户密码" type="password" />
                    </a-form-item>
                </a-col>

                <a-col :span="24">
                    <p class="center">提示：密码不填写，默认不修改密码</p>
                </a-col>
            </a-row>

            <div :style="{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
            zIndex: 1,
          }">
                <a-button :style="{ marginRight: '8px' }" @click="onCloseEdit">关闭</a-button>
                <a-button type="primary" html-type="submit" :loading="loadingUpdate">
                    更新
                </a-button>
            </div>
        </a-form>
    </a-drawer>

    <a-drawer title="角色列表" :width="300" :visible="visible_role" :body-style="{ paddingBottom: '80px' }" @close="onCloseRole">
        <a-button icon="plus-circle" type="primary" style="width: 100%;" @click="onShowRoleEdit(0,'','')">
            创建新的角色
        </a-button>

        <div v-for="(item,index) in role_list" :key="index" style="
            height: 50px;
            border-bottom: 1px solid #e9e9e9;
            line-height: 50px;
        ">
            <div style="float: left;">{{item.name}}</div>
            <div style="float: right;">
                <a-popconfirm title="是否要删除该角色?" ok-text="是" cancel-text="否" @confirm="onDelRole(item.id)">
                    <a-icon type="delete" class="pointer" />
                </a-popconfirm>
                <a-icon @click="onShowRoleEdit(item.id,item.name,item.remarks)" type="edit" class="pointer" />
            </div>
        </div>

        <a-drawer title="管理角色" :width="600" :closable="false" :visible="visible_role_edit" @close="onCloseRoleEdit">
            <div>
                <span style="color: #e93636;margin-right: 5px;vertical-align: middle;">*</span>角色名称：
            </div>

            <a-input v-model="role_name" placeholder="请输入角色名称" style="margin-top: 10px;margin-bottom: 20px;">
                <a-icon slot="prefix" type="team" />
            </a-input>

            <a-transfer show-search :filterOption="filterOption" :listStyle="{
                    width: '248px',
                    height: '400px',
                }" :titles="['未拥有', '已拥有']" :data-source="nav_list" :targetKeys="nav_key" :render="item => `${item.name}`" @change="onChangeNav" />

            <div style="margin-top: 20px;">
                备注：
            </div>
            <a-textarea style="margin-top: 10px;" v-model="role_remarks" placeholder="请输入角色备注" :auto-size="{ minRows: 3, maxRows: 5 }" />

            <a-button v-if="role_id===0" type="primary" style="width: 100%;margin-top: 20px;" @click="onUpdateRole">
                添加角色
            </a-button>
            <a-button v-else type="primary" style="width: 100%;margin-top: 20px;" @click="onUpdateRole">
                更新角色
            </a-button>
        </a-drawer>
        <div :style="{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
            zIndex: 1,
          }">
            <a-button :style="{ marginRight: '8px' }" @click="onCloseRole">关闭</a-button>
        </div>
    </a-drawer>
</a-layout-content>
</template>

<script>
import multiavatar from '@multiavatar/multiavatar'

const columns = [{
        dataIndex: "avatar",
        key: "avatar",
        scopedSlots: {
            customRender: "avatar",
        },
        width: 60
    },
    {
        title: "昵称",
        dataIndex: "nick_name",
        key: "nick_name",
        scopedSlots: {
            customRender: "nick_name",
        },
    },
    {
        title: "账号",
        dataIndex: "account",
        key: "account",
        scopedSlots: {
            customRender: "account",
        },
    },
    {
        title: "E-Mail",
        dataIndex: "email",
        key: "email",
    },
    {
        title: "角色",
        dataIndex: "role_name",
        key: "role_name",
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
        title: "创建时间",
        key: "create_time",
        dataIndex: "create_time",
        scopedSlots: {
            customRender: "create_time",
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
        title: "操作",
        key: "action",
        scopedSlots: {
            customRender: "action",
        },
        width: 60,
    },
];

export default {
    name: "userHome",
    data() {
        return {
            disabled: false,
            columns,
            loading: false,
            so_text: "",
            data: [],
            formAdd: this.$form.createForm(this),
            visible_add: false,
            formUpdate: this.$form.createForm(this),
            visible_edit: false,
            key: 0,
            loadingUpdate: false,
            loadingAdd: false,
            avatar: "",
            pagination: {
                total: 0,
                defaultPageSize: 10,
                showTotal: total => `共 ${total} 条数据`,
                showSizeChanger: true,
                pageSizeOptions: ['10', '15', '20', '50', '100'],
                onShowSizeChange: this.onPageShowSizeChange,
                onChange: this.onPageChange
            },
            visible_role: false,
            visible_role_edit: false,
            role_list: [],
            nav_list: [],
            nav_key: [],
            role_name: "",
            role_remarks: "",
            role_id: 0,
            curr_page: 1,
            curr_page_size: 10
        };
    },
    mounted() {
        this.onLoad();
    },
    methods: {
        filterOption(inputValue, option) {
            return option.description.indexOf(inputValue) > -1;
        },
        onChangeNav(nextTargetKeys, direction, moveKeys) {
            this.nav_key = nextTargetKeys;
        },
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
                .post("/api/v1/w5/get/user/list", {
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
        del(id) {
            this.$http
                .post("/api/v1/w5/post/user/del", {
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
        onAdd(e) {
            e.preventDefault();

            this.formAdd.validateFields((err, values) => {
                if (!err) {
                    this.loadingAdd = true;

                    if (values.passwd !== values.repasswd) {
                        this.$message.warning("两次密码不相同");
                        this.loadingAdd = false;
                        return false;
                    }

                    this.$http
                        .post("/api/v1/w5/post/user/add", {
                            account: values.account,
                            passwd: values.passwd,
                            nick_name: values.nick_name,
                            email: values.email,
                            avatar: this.avatar,
                            role_id: values.role
                        })
                        .then((res) => {
                            if (res.code == 0) {
                                this.$message.success("添加成功");
                                this.loadingAdd = false;
                                this.onCloseAdd();
                                this.onLoad();
                            } else {
                                this.$message.error(res.msg);
                                this.loadingAdd = false;
                            }
                        });
                }
            });
        },
        onUpdate(e) {
            e.preventDefault();

            this.formUpdate.validateFields((err, values) => {
                if (!err) {
                    this.loadingUpdate = true;

                    var passwd = "";

                    if (typeof values.passwd == "undefined") {
                        values.passwd = ""
                    }

                    if (typeof values.repasswd == "undefined") {
                        values.repasswd = ""
                    }

                    if (values.passwd !== values.repasswd) {
                        this.$message.warning("两次密码不相同");
                        this.loadingUpdate = false;
                        return false;
                    } else {
                        passwd = values.passwd;
                    }

                    this.$http
                        .post("/api/v1/w5/post/user/update", {
                            id: this.key,
                            nick_name: values.nick_name,
                            email: values.email,
                            passwd: passwd,
                            avatar: this.avatar,
                            role_id: values.role
                        })
                        .then((res) => {
                            if (res.code == 0) {
                                this.$message.success("更新成功");
                                this.loadingUpdate = false;
                                this.onCloseEdit();
                                this.onLoad(this.so_text, this.select_type, this.curr_page, this.curr_page_size);
                            } else {
                                this.$message.error(res.msg);
                                this.loadingUpdate = false;
                            }
                        });
                }
            });
        },
        onUpdateAvatar() {
            var str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            var result = '';
            for (var i = 32; i > 0; --i) {
                result += str[Math.floor(Math.random() * str.length)];
            }
            this.avatar = multiavatar(result);
        },
        showEdit(key, account, nick_name, email, avatar, role_id) {
            this.onLoadRoleList();
            this.avatar = avatar;

            setTimeout(() => {
                this.formUpdate.setFieldsValue({
                    account: account,
                    nick_name: nick_name,
                    email: email,
                    role: role_id
                });
            }, 100);

            this.key = key;

            this.visible_edit = true;
        },
        onCloseEdit() {
            this.visible_edit = false;
        },
        showAdd() {
            this.onLoadRoleList();
            this.onUpdateAvatar();

            setTimeout(() => {
                this.formAdd.setFieldsValue({
                    account: "",
                    nick_name: "",
                    email: "",
                });
            }, 100);

            this.visible_add = true;
        },
        onCloseAdd() {
            this.visible_add = false;
        },
        onLoadRoleList() {
            this.$http
                .post("/api/v1/w5/get/role/list")
                .then((res) => {
                    if (res.code == 0) {
                        this.role_list = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        onShowRole() {
            this.onLoadRoleList();
            this.visible_role = true;
        },
        onCloseRole() {
            this.visible_role = false;
        },
        onCloseRoleEdit() {
            this.visible_role_edit = false;
        },
        onShowRoleEdit(id, name, remarks) {
            this.role_id = id;
            this.role_name = "";
            this.role_remarks = "";
            this.nav_key = []

            this.$http
                .post("/api/v1/w5/get/nav/list")
                .then((res) => {
                    if (res.code == 0) {
                        this.nav_list = res.data;
                        this.visible_role_edit = true;
                    } else {
                        this.$message.error(res.msg);
                    }
                });

            if (id != 0) {
                this.role_name = name;
                this.role_remarks = remarks;

                this.$http
                    .post("/api/v1/w5/get/role_nav/list", {
                        role_id: id,
                    })
                    .then((res) => {
                        if (res.code == 0) {
                            this.nav_key = res.data;
                            this.visible_role_edit = true;
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
            }
        },
        onUpdateRole() {
            this.$http
                .post("/api/v1/w5/post/role_nav/add", {
                    id: this.role_id,
                    name: this.role_name,
                    nav_key: this.nav_key,
                    remarks: this.role_remarks,
                })
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success("操作成功");
                        this.onCloseRoleEdit();
                        this.onShowRole();
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        onDelRole(id) {
            this.$http
                .post("/api/v1/w5/post/role_nav/del", {
                    id: id,
                })
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success("删除角色成功");
                        this.onShowRole();
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        onSearch(value) {
            this.so_text = value;
            this.onLoad(this.so_text);
        },
        onSwitch(bool, id) {
            var status = 1;
            if (bool) {
                status = 0
            }

            this.$http
                .post("/api/v1/w5/post/user/status", {
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

.avatardiv {
    margin-bottom: 30px;
    text-align: center;

    .avatar {
        margin: auto;
        width: 100px;
        border: 1px solid #fff;
        border-radius: 100%;
        height: 100px;
        padding: 2px;
    }
}

.tableAvatar {
    width: 30px;
    border: 1px solid #fff;
    border-radius: 100%;
    height: 30px;
    padding: 2px;
}
</style>
