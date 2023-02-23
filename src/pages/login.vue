<template>
<a-layout-content>
    <a-row type="flex">
        <a-col style="width: 100%;">
            <div class="loginDiv">
                <div class="div">
                    <div class="logos">
                        <div>
                            <img class="zimg" :src="baseURL+'/public/logo.png'" />
                        </div>
                        <div>
                            <p class="ptitle"><span class="lo">W5</span>SOAR</p>
                        </div>
                        <p class="p2">「 无需编写代码的安全自动化平台 」</p>
                    </div>
                    <div class="formDiv">
                        <a-form :form="form" class="login-form" @submit="login">
                            <a-form-item>
                                <a-input v-decorator="[
                  'userName',
                  {
                    rules: [
                      { required: true, message: '账号(邮箱)不可为空' },
                      { min: 2, message: '账号(邮箱)长度不能少于2位' },
                      { max: 50, message: '账号(邮箱)长度不能超过50位' },
                    ],
                  },
                ]" placeholder="请输入账号名 or 邮箱">
                                    <a-icon slot="prefix" type="user" style="color: #a9a9a9" />
                                </a-input>
                            </a-form-item>
                            <a-form-item>
                                <a-input-password v-decorator="[
                  'password',
                  {
                    rules: [
                      { required: true, message: '密码不可为空' },
                      { min: 8, message: '请输入8-16位密码' },
                      { max: 16, message: '请输入8-16位密码' },
                    ],
                  },
                ]" type="password" placeholder="请输入密码">
                                    <a-icon slot="prefix" type="lock" style="color: #a9a9a9" />
                                </a-input-password>
                            </a-form-item>
                            <a-form-item>
                                <!-- <a class="login-form-forgot" @click="showUpdatePasswd">找回密码？</a> -->
                                <a-button type="primary" html-type="submit" class="login-form-button" :loading="loading">登 录</a-button>
                            </a-form-item>
                        </a-form>
                    </div>
                    <div class="footer">
                        <span>Copyright © 2020 <a href="https://w5.io" style="color: #cd302d;">W5.IO</a> All rights reserved.</span>
                    </div>
                </div>

            </div>
        </a-col>
    </a-row>
</a-layout-content>
</template>

<script>
export default {
    name: "login",
    data() {
        return {
            form: this.$form.createForm(this),
            loading: false,
            curr_theme: "dark",
            baseURL: this.BaseURL,
        };
    },
    mounted() {
        this.getTheme();
        document.querySelector(".ant-layout-content").style.padding = "0px";
    },
    methods: {
        getTheme() {
            var is_theme = this.$cookies.isKey("theme");
            if (is_theme) {
                var theme = this.$cookies.get("theme");
                document.getElementById("app").className = theme;
                this.curr_theme = theme;
            } else {
                document.getElementById("app").className = "dark";
                this.curr_theme = "dark";
            }
        },
        login(e) {
            e.preventDefault();

            this.form.validateFields((err, values) => {
                if (!err) {
                    this.loading = true;

                    this.$http
                        .post("/api/v1/w5/login", {
                            account: values.userName,
                            passwd: values.password,
                        })
                        .then((res) => {
                            if (res.code == 0) {
                                var token = res.data.token;
                                var nick_name = res.data.nick_name;
                                var account = res.data.account;
                                var user_id = res.data.user_id;

                                this.$cookies.set("token", token);
                                this.$cookies.set("nick_name", nick_name);
                                this.$cookies.set("account", account);
                                this.$cookies.set("user_id", user_id);
                                this.$cookies.set("theme", this.curr_theme);

                                this.loading = false;
                                window.location.href = "/";
                            } else {
                                this.$message.error(res.msg);
                                this.loading = false;
                            }
                        }).catch((e) => {
                            this.loading = false;
                        });
                }
            });
        },
    },
};
</script>

<style lang="less" scoped>
@import url("../theme/style.less");

.bright {
    .ptitle {
        font-size: 26px;
        margin-top: 10px;
        margin-bottom: 5px;
        font-weight: bold;
        letter-spacing: 1px;

        .lo {
            color: #ea4642;
            margin-right: 8px;
        }
    }

    .leftimg {
        width: 100%;
        height: 100%;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    }

    .loginDiv {
        width: 100%;
        min-height: 100%;
        background: #fff url(../assets/background.svg) no-repeat 50%;
        background-size: 100%;
        padding: 50px 0 0px;
        position: relative;

        .div {
            width: 368px;
            margin: 100px auto;

            .logos {
                text-align: center;

                .zimg {
                    width: 150px;
                    border-radius: 100%;
                }

                .limg {
                    width: 200px;
                    margin-top: 20px;
                    margin-bottom: 10px;
                }

                .p1 {
                    color: #333;
                    font-size: 20px;
                    margin: 0px;
                    margin-top: 10px;
                }

                .p2 {
                    color: #696969;
                    font-size: 14px;
                    margin: 0px;
                    margin-top: 2px;
                    letter-spacing: 5px;
                }
            }

            .formDiv {
                margin-top: 30px;

                .login-form-button {
                    width: 100%;
                }

                #components-form-demo-normal-login .login-form {
                    max-width: 300px;
                }

                #components-form-demo-normal-login .login-form-forgot {
                    float: right;
                }

                #components-form-demo-normal-login .login-form-button {
                    width: 100%;
                }

                .login-form-forgot {
                    float: right;
                }
            }

            .footer {
                text-align: center;
                color: #333;
            }
        }
    }
}

.dark {
    .ptitle {
        font-size: 26px;
        margin-top: 10px;
        margin-bottom: 5px;
        font-weight: bold;
        letter-spacing: 1px;

        .lo {
            color: #ea4642;
            margin-right: 8px;
        }
    }

    .leftimg {
        width: 100%;
        height: 100%;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    }

    .loginDiv {
        width: 100%;
        min-height: 100%;
        padding: 50px 0 0px;
        position: relative;

        .div {
            width: 368px;
            margin: 100px auto;

            .logos {
                text-align: center;

                .zimg {
                    width: 150px;
                    border-radius: 100%;
                }

                .limg {
                    width: 200px;
                    margin-top: 20px;
                    margin-bottom: 10px;
                }

                .p1 {
                    color: #fff;
                    font-size: 20px;
                    margin: 0px;
                    margin-top: 10px;
                }

                .p2 {
                    color: #9e9e9e;
                    font-size: 14px;
                    margin: 0px;
                    margin-top: 2px;
                    letter-spacing: 5px;
                }
            }

            .formDiv {
                margin-top: 30px;

                .login-form-button {
                    width: 100%;
                }

                #components-form-demo-normal-login .login-form {
                    max-width: 300px;
                }

                #components-form-demo-normal-login .login-form-forgot {
                    float: right;
                }

                #components-form-demo-normal-login .login-form-button {
                    width: 100%;
                }

                .login-form-forgot {
                    float: right;
                }
            }

            .footer {
                text-align: center;
                color: #747579;
            }
        }
    }

}

.ant-row-flex {
    height: 100%;
}

.layout {
    .ant-layout-content {
        overflow-y: hidden;
    }
}

/deep/ .ant-input-password-icon {
    color: #9a9a9a;
}
</style>
