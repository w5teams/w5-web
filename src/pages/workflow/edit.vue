<template>
<div style="height:100%;">
    <a-row type="flex">
        <div class="left_right" @click="onSwitchLeft">
            <a-icon v-if="switchLeft=='open'" type="double-left" />
            <a-icon v-else-if="switchLeft=='close'" type="double-right" />
        </div>
        <a-col flex="320px" class="left_div">
            <div class="leftx">
                <a-row class="kzq">
                    <a-col :span="6">
                        <div class="tools_div center" @mousedown="onDrag($event,baseURL+'/app/basic/start.png','开始','start')">
                            <img class="avatar_img" :src="baseURL+'/app/basic/start.png'" />
                            <div class="tools_name"><span>开始</span></div>
                        </div>
                    </a-col>

                    <a-col :span="6">
                        <div class="tools_div center" @mousedown="onDrag($event,baseURL+'/app/basic/end.png','结束','end')">
                            <img class="avatar_img" :src="baseURL+'/app/basic/end.png'" />
                            <div class="tools_name"><span>结束</span></div>
                        </div>
                    </a-col>

                    <a-col :span="6">
                        <div class="tools_div center" @mousedown="onDrag($event,baseURL+'/app/basic/input.png','用户输入','input')">
                            <img class="avatar_img" :src="baseURL+'/app/basic/input.png'" />
                            <div class="tools_name"><span>用户输入</span></div>
                        </div>
                    </a-col>

                    <a-col :span="6">
                        <div class="tools_div center" @mousedown="onDrag($event,baseURL+'/app/basic/webhook.png','WebHook','webhook')">
                            <img class="avatar_img" :src="baseURL+'/app/basic/webhook.png'" />
                            <div class="tools_name"><span>WebHook</span></div>
                        </div>
                    </a-col>

                    <a-col :span="6">
                        <div class="tools_div center" @mousedown="onDrag($event,baseURL+'/app/basic/timer.png','定时器','timer')">
                            <img class="avatar_img" :src="baseURL+'/app/basic/timer.png'" />
                            <div class="tools_name"><span>定时器</span></div>
                        </div>
                    </a-col>

                    <a-col :span="6">
                        <div class="tools_div center" @mousedown="onDrag($event,baseURL+'/app/basic/audit.png','人工审计','audit')">
                            <img class="avatar_img" :src="baseURL+'/app/basic/audit.png'" />
                            <div class="tools_name"><span>人工审计</span></div>
                        </div>
                    </a-col>

                    <a-col :span="6">
                        <div class="tools_div center" @mousedown="onDrag($event,baseURL+'/app/basic/if.png','IF','if')">
                            <img class="avatar_img" :src="baseURL+'/app/basic/if.png'" />
                            <div class="tools_name"><span>IF</span></div>
                        </div>
                    </a-col>

                    <a-col :span="6">
                        <div class="tools_div center" @mousedown="onDrag($event,baseURL+'/app/basic/for.png','For','for')">
                            <img class="avatar_img" :src="baseURL+'/app/basic/for.png'" />
                            <div class="tools_name"><span>For</span></div>
                        </div>
                    </a-col>
                </a-row>
                <!-- <div class="hr"></div> -->
                <a-button class="btnNote" type="primary" icon="profile" size="small" @mousedown="onDrag($event,'','Note','note')">
                    便 签
                </a-button>
                <!-- <div class="hr"></div> -->
                <!-- <a-input style="width: 90%;margin-top: 5px;margin-bottom:10px;text-align: center;font-size: 12px;" placeholder="请输入你要搜索的 APP" size="small" /> -->
                <a-row class="appList" :style="appListStyle">
                    <a-col :span="6" v-for="(item,index) in app_list" :key="index">
                        <div class="tools_div center" @mousedown="onDrag($event,baseURL+'/app/'+item.icon,item.name,item.app_dir)">
                            <a-avatar class="avatar_img" :size="55" :src="baseURL+'/app/'+item.icon+'?t='+ new Date().getTime()" />
                            <div class="tools_name"><span>{{item.name}}</span></div>
                        </div>
                    </a-col>
                </a-row>
            </div>
        </a-col>
        <a-col flex="auto" class="right_auto" id="right_auto">
            <a-page-header style="pointer-events: none;" class="subtitle">
                <a-tag style="pointer-events: auto;" color="#bf423d">
                    <div v-for="(item,index) in type_data" :key="index">
                        <span v-if="item.id==select_type">{{item.name}}</span>
                    </div>
                </a-tag>
                <span class="workflow_name">
                    {{workflow_name}}
                </span>
                <span class="work_remarksx">
                    {{work_remarks}}
                </span>
                <template slot="extra">
                    <a-tooltip placement="left">
                        <template slot="title">
                            <span>修改剧本信息</span>
                        </template>
                        <a-button style="pointer-events: auto;" size="small" icon="edit" @click="onShowUpdaeWorkFlow"></a-button>
                    </a-tooltip>

                    <a-tooltip placement="top">
                        <template slot="title">
                            <span>保存剧本</span>
                        </template>
                        <a-button style="pointer-events: auto;" size="small" type="primary" icon="cloud" :loading="saveLoading" @click="onSave()"></a-button>
                    </a-tooltip>

                    <a-tooltip placement="top">
                        <template slot="title">
                            <span>导出剧本</span>
                        </template>
                        <a-button style="background: #1d96b1;border-color: #1d96b1;pointer-events: auto;" size="small" type="primary" icon="cloud-download" @click="onDown()"></a-button>
                    </a-tooltip>
                </template>
            </a-page-header>
            <div class="edit">
                <div id="container" style="flex: 1"></div>
                <div id="minimapContainer" style="flex: 1"></div>
            </div>
        </a-col>
    </a-row>

    <div class="toolbar">
        <div class="tools">
            <a-tooltip placement="top">
                <template slot="title">
                    <span>执行剧本</span>
                </template>
                <div class="run">
                    <play theme="outline" class="iconx" @click="onRunCheck" :loading="execuLoading" />
                </div>
            </a-tooltip>

            <div class="btn">
                <a-divider type="vertical" class="w5divider" />
                <a-tooltip placement="top">
                    <template slot="title">
                        <span>撤销</span>
                    </template>
                    <back theme="outline" class="iconx" @click="onToolClick('back')" />
                </a-tooltip>

                <a-divider type="vertical" />

                <a-tooltip placement="top">
                    <template slot="title">
                        <span>重做</span>
                    </template>
                    <next theme="outline" class="iconx" @click="onToolClick('next')" />
                </a-tooltip>

                <a-divider type="vertical" class="w5divider" />

                <a-tooltip placement="top">
                    <template slot="title">
                        <span>放大</span>
                    </template>
                    <zoom-in theme="outline" class="iconx" @click="onToolClick('zoom-in')" />
                </a-tooltip>

                <a-divider type="vertical" />

                <a-tooltip placement="top">
                    <template slot="title">
                        <span>缩小</span>
                    </template>
                    <zoom-out theme="outline" class="iconx" @click="onToolClick('zoom-out')" />
                </a-tooltip>

                <a-divider type="vertical" />

                <a-tooltip placement="top">
                    <template slot="title">
                        <span>居中</span>
                    </template>
                    <margin theme="outline" class="iconx" @click="onToolClick('center')" />
                </a-tooltip>

                <a-divider type="vertical" class="w5divider" />

                <a-popover placement="top" :arrowPointAtCenter="true">
                    <div slot="content" class="edit_config">
                        <div class="title">边样式</div>
                        <div class="t1">
                            <span class="t2">箭头 :</span>
                            <a-radio-group default-value="block" button-style="solid" size="small" :value="edge_marker" @change="onChangEdgeMarker">
                                <a-radio-button value="block">
                                    箭头1
                                </a-radio-button>
                                <a-radio-button value="classic">
                                    箭头2
                                </a-radio-button>
                                <a-radio-button value="circle">
                                    圆圈
                                </a-radio-button>
                                <a-radio-button value="diamond">
                                    方块
                                </a-radio-button>
                            </a-radio-group>
                        </div>
                        <div class="t1">
                            <span class="t2">颜色 :</span>
                            <a-radio-group default-value="#c7342e" button-style="solid" size="small" :value="edge_color" @change="onChangEdgeColor">
                                <a-radio-button value="#bbbbbb">
                                    <span style="background: #bbbbbb;width: 15px;height: 15px;display: inline-block;margin-bottom: -2px;border-radius: 3px;"></span>
                                    灰色
                                </a-radio-button>
                                <a-radio-button value="#606060">
                                    <span style="background: #606060;width: 15px;height: 15px;display: inline-block;margin-bottom: -2px;border-radius: 3px;"></span>
                                    黑色
                                </a-radio-button>
                                <a-radio-button value="#c7342e">
                                    <span style="background: #c7342e;width: 15px;height: 15px;display: inline-block;margin-bottom: -2px;border-radius: 3px;"></span>
                                    红色
                                </a-radio-button>
                                <a-radio-button value="#5961dd">
                                    <span style="background: #5961dd;width: 15px;height: 15px;display: inline-block;margin-bottom: -2px;border-radius: 3px;"></span>
                                    蓝色
                                </a-radio-button>
                                <a-radio-button value="#2ca553">
                                    <span style="background: #2ca553;width: 15px;height: 15px;display: inline-block;margin-bottom: -2px;border-radius: 3px;"></span>
                                    绿色
                                </a-radio-button>
                                <a-radio-button value="#9c36bb">
                                    <span style="background: #9c36bb;width: 15px;height: 15px;display: inline-block;margin-bottom: -2px;border-radius: 3px;"></span>
                                    紫色
                                </a-radio-button>
                            </a-radio-group>
                        </div>
                        <div class="t1">
                            <span class="t2">连线 :</span>
                            <a-radio-group default-value="normal" button-style="solid" size="small" :value="edge_connector" @change="onChangEdgeConnector">
                                <a-radio-button value="normal">
                                    直角
                                </a-radio-button>
                                <a-radio-button value="rounded">
                                    圆角
                                </a-radio-button>
                                <a-radio-button value="smooth">
                                    平滑连线
                                </a-radio-button>
                            </a-radio-group>
                        </div>
                        <div class="t1">
                            <span class="t2">路由 :</span>
                            <a-radio-group default-value="normal" button-style="solid" size="small" :value="edge_router" @change="onChangEdgeRouter">
                                <a-radio-button value="normal">
                                    直线
                                </a-radio-button>
                                <a-radio-button value="orth">
                                    拐线
                                </a-radio-button>
                                <a-radio-button value="er">
                                    关系路由
                                </a-radio-button>
                                <a-radio-button value="metro">
                                    智能路由
                                </a-radio-button>
                            </a-radio-group>
                        </div>
                        <div class="title">背景</div>
                        <div class="t1">
                            <span class="t2">网格 :</span>
                            <a-radio-group default-value="dot" button-style="solid" size="small" :value="grid_type" @change="onChangGrid">
                                <a-radio-button value="none">
                                    无
                                </a-radio-button>
                                <a-radio-button value="dot">
                                    点
                                </a-radio-button>
                                <a-radio-button value="mesh">
                                    网格
                                </a-radio-button>
                            </a-radio-group>
                        </div>
                    </div>
                    <internal-data theme="outline" class="iconx" @click="onToolClick('config')" />
                </a-popover>

                <a-divider type="vertical" />

                <a-tooltip placement="top">
                    <template slot="title">
                        <span>剧本变量</span>
                    </template>
                    <a-icon type="gold" class="iconx" @click="onToolClick('var')" />
                </a-tooltip>

                <a-divider type="vertical" />

                <a-tooltip placement="top">
                    <template slot="title">
                        <span>切换主题</span>
                    </template>
                    <a href="javascript:;" @click="setTheme('bright')" v-if="curr_theme == 'dark'">
                        <theme theme="outline" class="iconx" />
                    </a>
                    <a href="javascript:;" @click="setTheme('dark')" v-else-if="curr_theme == 'bright'">
                        <theme theme="outline" class="iconx" />
                    </a>
                </a-tooltip>

                <a-divider type="vertical" class="w5divider" />

                <a-tooltip placement="top">
                    <template slot="title">
                        <span>帮助</span>
                    </template>
                    <help theme="outline" class="iconx" @click="onToolClick('help')" />
                </a-tooltip>
            </div>

        </div>
    </div>

    <a-drawer class="visible_log" :placement="logDivPlacement" :closable="false" :width="800" :height="500" :maskClosable="false" :visible="visible_log" @close="onCloseLog">
        <div>
            <a-tooltip placement="left">
                <template slot="title">
                    <span>关闭</span>
                </template>
                <a-icon class="pointer" type="close-circle" @click="onCloseLog" />
            </a-tooltip>

            <a-tooltip placement="top" v-if="is_btn_pdf">
                <template slot="title">
                    <span>查看报告</span>
                </template>
                <a-icon style="margin-left: 7px;" class="pointer" type="file-pdf" @click="onShowReport" />
            </a-tooltip>

            <a-progress :percent="run_progress " size="small" />
        </div>
        <pre class="log_div">
            <p v-for="(item,index) in execute_log" :key="index"><a-tag v-if="item.status==0" color="#469823">正常</a-tag><a-tag v-if="item.status==1" color="#9e8c0a">警告</a-tag><a-tag v-if="item.status==2" color="#9c5656">错误</a-tag><a-tag v-if="item.status==3" color="#bf0c0c">危险</a-tag><span class="appname">[{{item.app_name}}]</span><span class="heng"> - </span><span class="appresult">{{item.result}}</span><span class="heng"> - </span><span class="time">{{item.create_time.replace("T", " ")}}</span></p>
        </pre>
        <div class="center">
            <a-spin tip="执行中..." size="large" :spinning="run_spinning"></a-spin>
        </div>
    </a-drawer>

    <a-drawer title="节点编辑" :width="500" :visible="visible_edit" :body-style="{ paddingBottom: '80px' }" @close="onClose">
        <a-form :form="form" layout="vertical" @submit="onUpdate">
            <a-row :gutter="16">
                <a-col :span="24" style="margin-bottom: 20px;">
                    <span style="font-weight: bold;margin-right: 10px;">UUID : </span><span class="uuidcss">{{key}}</span>
                </a-col>

                <a-col :span="24">
                    <a-form-item label="节点名称">
                        <a-input v-decorator="[
                  'node_name',
                  {
                    rules: [
                      { required: true, message: '请输入节点名称' },
                      { max: 20, message: '节点名称长度不能超过20位' },
                    ],
                  },
                ]" placeholder="请输入节点名称" />
                    </a-form-item>
                </a-col>

                <a-col :span="24">
                    <a-form-item>
                        <span slot="label">
                            动作&nbsp;
                            <a-tooltip title="使用说明">
                                <a-icon class="pointer" @click="onShowMd" type="question-circle-o" />
                            </a-tooltip>
                        </span>
                        <a-select show-search :filter-option="onFilterOption" v-decorator="[
                  'action',
                  {
                    rules: [{ required: true, message: '请选择执行动作' }],
                  },
                ]" placeholder="请选择执行动作" @change="selectAppAction">
                            <a-select-option v-for="(item, index) in app_info.action" :key="index" :value="item.func">{{ item.name }}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>

                <a-col :span="24" v-for="(item, index) in app_info_args" :key="index">
                    <a-form-item v-if="item.type=='text'" :label="item.key">
                        <div v-if="String(item.default)!=''">
                            <a-input v-decorator="[
                            item.key,
                            {   
                                initialValue:item.default,
                                rules: 
                                [
                                    { required: item.required, message: '请输入 '+item.key+' 参数的内容' }
                                ]
                            },
                            ]" :placeholder="'请输入 '+item.key+' 参数的内容'" />
                        </div>
                        <div v-else>
                            <a-input v-decorator="[
                            item.key,
                            {
                                rules: 
                                [
                                    { required: item.required, message: '请输入 '+item.key+' 参数的内容' }
                                ]
                            },
                            ]" :placeholder="'请输入 '+item.key+' 参数的内容'" />
                        </div>
                    </a-form-item>

                    <a-form-item v-if="item.type=='password'" :label="item.key">
                        <div v-if="String(item.default)!=''">
                            <a-input v-decorator="[
                            item.key,
                            {   
                                initialValue:item.default,
                                rules: 
                                [
                                    { required: item.required, message: '请输入 '+item.key+' 参数的密码' }
                                ]
                            },
                            ]" type="password" :placeholder="'请输入 '+item.key+' 参数的内容'" />
                        </div>
                        <div v-else>
                            <a-input v-decorator="[
                            item.key,
                            {
                                rules: 
                                [
                                    { required: item.required, message: '请输入 '+item.key+' 参数的内容' }
                                ]
                            },
                            ]" type="password" :placeholder="'请输入 '+item.key+' 参数的内容'" />
                        </div>
                    </a-form-item>

                    <a-form-item v-else-if="item.type=='textarea'" :label="item.key">
                        <div v-if="String(item.default)!=''">
                            <a-textarea v-decorator="[
                            item.key,
                            {   
                                initialValue:item.default,
                                rules: 
                                [
                                    { required: item.required, message: '请输入 '+item.key+' 参数的内容' }
                                ]
                            },
                            ]" :rows="4" :placeholder="'请输入 '+item.key+' 参数的内容'" />
                        </div>
                        <div v-else>
                            <a-textarea v-decorator="[
                            item.key,
                            {
                                rules: 
                                [
                                    { required: item.required, message: '请输入 '+item.key+' 参数的内容' }
                                ]
                            },
                            ]" :rows="4" :placeholder="'请输入 '+item.key+' 参数的内容'" />
                        </div>
                    </a-form-item>

                    <a-form-item v-else-if="item.type=='number'" :label="item.key">
                        <div v-if="String(item.default)!=''">
                            <a-input style="width:100%;" v-decorator="[
                            item.key,
                            {
                                initialValue:item.default,
                                rules: 
                                [
                                    { required: item.required, message: '请输入 '+item.key+' 参数的内容' }
                                ]
                            },
                            ]" :placeholder="'请输入 '+item.key+' 参数的数字内容'" />
                        </div>
                        <div v-else>
                            <a-input style="width:100%;" v-decorator="[
                            item.key,
                            {
                                rules: 
                                [
                                    { required: item.required, message: '请输入 '+item.key+' 参数的内容' }
                                ]
                            },
                            ]" :placeholder="'请输入 '+item.key+' 参数的数字内容'" />
                        </div>

                    </a-form-item>

                    <a-form-item v-else-if="item.type=='select'" :label="item.key">
                        <div v-if="String(item.default)!=''">
                            <a-select show-search :filter-option="onFilterOption" v-decorator="[
                            item.key,
                            {
                                initialValue:item.default,
                                rules: 
                                [
                                    { required: item.required, message: '请选择 '+item.key+' 参数的类型' }
                                ]
                            },
                            ]" :placeholder="'请选择 '+item.key+' 参数的类型'">
                                <a-select-option v-for="(item, index) in item.data" :key="index" :value="item">{{ item }}</a-select-option>
                            </a-select>
                        </div>
                        <div v-else>

                            <a-select show-search :filter-option="onFilterOption" v-decorator="[
                            item.key,
                            {
                                rules: 
                                [
                                    { required: item.required, message: '请选择 '+item.key+' 参数的类型' }
                                ]
                            },
                            ]" :placeholder="'请选择 '+item.key+' 参数的类型'">
                                <a-select-option v-for="(item, index) in item.data" :key="index" :value="item">{{ item }}</a-select-option>
                            </a-select>
                        </div>

                    </a-form-item>

                </a-col>
            </a-row>

            <a-drawer :title=" app_title" :width="600" :visible="visible_md" :body-style="{ paddingBottom: '80px' }" @close="onCloseMd">
                <div class="markdown-body" v-html="html"></div>
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
                <a-button :style="{ marginRight: '8px' }" @click="onClose">关闭</a-button>
                <a-button type="primary" html-type="submit">
                    保存
                </a-button>
            </div>
        </a-form>
    </a-drawer>

    <a-drawer title="链路编辑" :width="300" :visible="visible_edit_edge" :body-style="{ paddingBottom: '80px' }" @close="onCloseEdge">
        <a-form :form="form_edge" layout="vertical" @submit="onUpdateEdge">
            <a-row :gutter="16">
                <a-col :span="24">
                    <a-form-item label="链路说明">
                        <a-input v-decorator="[
                  'edge_name',
                  {
                    rules: [
                      { max: 30, message: '链路说明长度不能超过30位' },
                    ],
                  },
                ]" placeholder="请输入链路说明" />
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
                <a-button :style="{ marginRight: '8px' }" @click="onCloseEdge">关闭</a-button>
                <a-button type="primary" html-type="submit">
                    保存
                </a-button>
            </div>
        </a-form>
    </a-drawer>

    <a-drawer title="定时器设定" :width="500" :visible="visible_timer_edit" :body-style="{ paddingBottom: '80px' }" @close="onCloseTimer">
        <a-form :form="form_timer" layout="vertical" @submit="onUpdateTimer">
            <a-row :gutter="16">
                <a-col :span="24" style="margin-bottom: 20px;">
                    <span style="font-weight: bold;margin-right: 10px;">UUID : </span><span class="uuidcss">{{key}}</span>
                </a-col>

                <a-col :span="24">
                    <a-form-item label="节点名称">
                        <a-input v-decorator="[
                  'node_name',
                  {
                    rules: [
                      { required: true, message: '请输入节点名称' },
                      { max: 20, message: '节点名称长度不能超过20位' },
                    ],
                  },
                ]" placeholder="请输入节点名称" disabled="" />
                    </a-form-item>
                </a-col>
                <div class="timer_css">
                    <a-col :span="24">
                        <a-radio-group v-model="time_type" @change="onChangTimeType" button-style="solid" style="margin-bottom: 20px;">
                            <a-radio-button value="date">
                                定时执行
                            </a-radio-button>
                            <a-radio-button value="interval">
                                间隔执行
                            </a-radio-button>
                            <a-radio-button value="cron">
                                执行计划
                            </a-radio-button>
                        </a-radio-group>
                    </a-col>

                    <div v-if="time_type=='date'">
                        <a-col :span="24">
                            <a-form-item label="执行时间">
                                <a-date-picker :locale="locale" style="width: 100%;" v-decorator="[
                            'time',
                            {
                                rules: [{ required: true, message: '请选择执行时间' },],
                            },
                            ]" show-time placeholder="请选择执行时间" />
                            </a-form-item>
                        </a-col>
                    </div>
                    <div v-else-if="time_type=='interval'">
                        <a-col :span="24">
                            <a-form-item label="间隔类型">
                                <a-radio-group v-decorator="[
                            'interval_type',
                            {
                                rules: [{ required: true, message: '请选择间隔类型' },],
                            },
                            ]">
                                    <a-radio value="seconds">
                                        秒钟
                                    </a-radio>
                                    <a-radio value="minutes">
                                        分钟
                                    </a-radio>
                                    <a-radio value="hours">
                                        小时
                                    </a-radio>
                                    <a-radio value="days">
                                        天
                                    </a-radio>
                                    <a-radio value="weeks">
                                        周
                                    </a-radio>
                                </a-radio-group>
                            </a-form-item>
                        </a-col>
                        <a-col :span="24">
                            <a-form-item label="间隔周期">
                                <a-input-number style="width: 100%;" v-decorator="[
                            'time',
                            {
                                rules: [{ required: true, message: '请输入间隔周期' },],
                            },
                            ]" :min="1" :max="99999999" placeholder="请输入间隔周期" />

                            </a-form-item>
                        </a-col>
                        <a-col :span="24">
                            <a-form-item label="开始时间">
                                <a-date-picker :locale="locale" style="width: 100%;" v-decorator="['start_date']" show-time placeholder="请选择开始时间" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="24">
                            <a-form-item label="结束时间">
                                <a-date-picker :locale="locale" style="width: 100%;" v-decorator="['end_date']" show-time placeholder="请选择结束时间" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="24">
                            <a-form-item label="随机浮动时间 (秒)">
                                <a-input-number style="width: 100%;" v-decorator="['jitter']" :min="0" :max="99999" placeholder="请输入浮动时间" />
                            </a-form-item>
                        </a-col>
                    </div>
                    <div v-else-if="time_type=='cron'">
                        <a-col :span="24">
                            <a-form-item>
                                <span slot="label">
                                    Cron 表达式&nbsp;
                                    <a-tooltip title="使用说明">
                                        <a-icon class="pointer" @click="onShowMdCron" type="question-circle-o" />
                                    </a-tooltip>
                                </span>
                                <a-input style="width: 100%;" v-decorator="[
                            'time',
                            {
                                rules: [{ required: true, message: '请输入 Cron 表达式' },],
                            },
                            ]" placeholder="请输入 Cron 表达式" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="24">
                            <a-form-item label="开始时间">
                                <a-date-picker :locale="locale" style="width: 100%;" v-decorator="['start_date']" show-time placeholder="请选择开始时间" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="24">
                            <a-form-item label="结束时间">
                                <a-date-picker :locale="locale" style="width: 100%;" v-decorator="['end_date']" show-time placeholder="请选择结束时间" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="24">
                            <a-form-item label="随机浮动时间 (秒)">
                                <a-input-number style="width: 100%;" v-decorator="['jitter']" :min="0" :max="99999" placeholder="请输入浮动时间" />
                            </a-form-item>
                        </a-col>
                    </div>
                </div>
            </a-row>

            <a-drawer :title="app_title" :width="600" :visible="visible_md" :body-style="{ paddingBottom: '80px' }" @close="onCloseMd">
                <div class="markdown-body" v-html="html"></div>
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
                <a-button :style="{ marginRight: '8px' }" @click="onCloseTimer">关闭</a-button>
                <a-button type="primary" html-type="submit">
                    保存
                </a-button>
            </div>
        </a-form>
    </a-drawer>

    <a-drawer title="FOR 控制器" :width="500" :visible="visible_for_edit" :body-style="{ paddingBottom: '80px' }" @close="onCloseFor">
        <a-form :form="form_for" layout="vertical" @submit="onUpdateFor">
            <a-row :gutter="16">
                <a-col :span="24" style="margin-bottom: 20px;">
                    <span style="font-weight: bold;margin-right: 10px;">UUID : </span><span class="uuidcss">{{key}}</span>
                </a-col>

                <a-col :span="24">
                    <a-form-item label="节点名称">
                        <a-input v-decorator="[
                  'node_name',
                  {
                    rules: [
                      { required: true, message: '请输入节点名称' },
                      { max: 20, message: '节点名称长度不能超过20位' },
                    ],
                  },
                ]" placeholder="请输入节点名称" />
                    </a-form-item>
                </a-col>

                <a-col :span="24">
                    <a-form-item label="循环类型">
                        <a-select show-search :filter-option="onFilterOption" v-decorator="[
                  'action',
                ]" placeholder="请选择循环类型">
                            <a-select-option value="1">数组循环</a-select-option>
                            <a-select-option value="2">字典循环</a-select-option>
                            <a-select-option value="3">次数循环</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>

                <a-col :span="24">
                    <a-form-item label="循环数据">
                        <a-textarea v-decorator="[
                  'text',
                  {
                    rules: [
                      { max: 500, message: '循环数据不能超过500位' },
                    ],
                  },
                ]" placeholder="请输入数据" />
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
                <a-button :style="{ marginRight: '8px' }" @click="onCloseFor">关闭</a-button>
                <a-button type="primary" html-type="submit">
                    保存
                </a-button>
            </div>
        </a-form>
    </a-drawer>

    <a-drawer title="IF 控制器" :width="500" :visible="visible_if_edit" :body-style="{ paddingBottom: '80px' }" @close="onCloseIf">
        <a-form :form="form_if" layout="vertical" @submit="onUpdateIf">
            <a-row :gutter="16">
                <a-col :span="24">
                    <a-form-item label="节点名称">
                        <a-input v-decorator="[
                  'node_name',
                  {
                    rules: [
                      { required: true, message: '请输入节点名称' },
                      { max: 20, message: '节点名称长度不能超过20位' },
                    ],
                  },
                ]" placeholder="请输入节点名称" />
                    </a-form-item>
                </a-col>

                <a-col :span="24">
                    <a-form-item label="判断动作">
                        <a-select show-search :filter-option="onFilterOption" v-decorator="[
                  'action',
                ]" placeholder="请选择判断动作">
                            <a-select-option value="1">==</a-select-option>
                            <a-select-option value="2">!=</a-select-option>
                            <a-select-option value="3">正则表达式</a-select-option>
                            <a-select-option value="4">JSON 解析器</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>

                <a-col :span="24">
                    <a-form-item label="判断条件">
                        <a-textarea v-decorator="[
                  'text',
                  {
                    rules: [
                      { max: 500, message: '条件长度不能超过500位' },
                    ],
                  },
                ]" placeholder="请输入条件" />
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
                <a-button :style="{ marginRight: '8px' }" @click="onCloseIf">关闭</a-button>
                <a-button type="primary" html-type="submit">
                    保存
                </a-button>
            </div>
        </a-form>
    </a-drawer>

    <a-drawer title="人工审计" :width="500" :visible="visible_audit_edit" :body-style="{ paddingBottom: '80px' }" @close="onCloseAudit">
        <a-form :form="form_audit" layout="vertical" @submit="onUpdateAudit">
            <a-row :gutter="16">
                <a-col :span="24">
                    <a-form-item label="节点名称">
                        <a-input v-decorator="[
                  'node_name',
                  {
                    rules: [
                      { required: true, message: '请输入节点名称' },
                      { max: 20, message: '节点名称长度不能超过20位' },
                    ],
                  },
                ]" placeholder="请输入节点名称" disabled />
                    </a-form-item>
                </a-col>

                <a-col :span="24">
                    <a-form-item label="审核人">
                        <a-select show-search :filter-option="onFilterOption" v-decorator="[
                  'text',
                ]" placeholder="请选择审核人">
                            <a-select-option v-for="item in user_list" :key="item.id" :value="item.id">{{item.nick_name}}</a-select-option>
                        </a-select>
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
                <a-button :style="{ marginRight: '8px' }" @click="onCloseAudit">关闭</a-button>
                <a-button type="primary" html-type="submit">
                    保存
                </a-button>
            </div>
        </a-form>
    </a-drawer>

    <a-modal class="tabsVarModel" :footer="null" :visible="visible_var_list" @cancel="onCloseVar">
        <a-tabs slot="title" default-active-key="2">
            <!-- <a-tab-pane key="1" tab="应用变量">
                Content of Tab Pane 1
            </a-tab-pane> -->
            <a-tab-pane key="2" tab="局部变量">
                <a-button style="position: absolute;z-index: 999;right: 40px;top: 5px;" type="primary" shape="circle" icon="plus-circle" @click="onOpenLoclVarAdd" />
                <a-list class="sscx" :data-source="local_var_data" :locale="{emptyText: '暂无数据'}">
                    <a-list-item slot="renderItem" slot-scope="item">
                        <a-tag style="width: 150px;margin-right: 0px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;" color="#2243a3">{{ item.key }}</a-tag>
                        <span style="vertical-align: super;margin: 0px 2px;">-</span>
                        <a-tag style="width: 280px;margin-right: 0px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;" color="#545454">{{ item.remarks }}</a-tag>
                        <div class="local-var-actipn">
                            <a-tooltip placement="top">
                                <template slot="title">
                                    <span>删除</span>
                                </template>
                                <a-popconfirm title="是否要删除该局部变量?" ok-text="是" cancel-text="否" @confirm="delLocalVar(item.key)">
                                    <a-icon class="del" type="delete" />
                                </a-popconfirm>
                            </a-tooltip>
                            <a-tooltip placement="top">
                                <template slot="title">
                                    <span>编辑</span>
                                </template>
                                <a-icon class="editx" type="form" @click="onOpenLoclVarEdit(item.key,item.value,item.remarks)" />
                            </a-tooltip>
                        </div>
                    </a-list-item>
                </a-list>
            </a-tab-pane>
            <a-tab-pane key="3" tab="全局变量">
                <a-list class="sscx" :data-source="variablenList" :locale="{emptyText: '暂无数据'}">
                    <a-list-item slot="renderItem" slot-scope="item">
                        <a-tag style="width: 75px;margin-right: 0px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;" color="#1e7f9d">{{ item.type_name }}</a-tag>
                        <span style="vertical-align: super;margin: 0px 2px;">-</span>
                        <a-tag style="width: 150px;margin-right: 0px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;" color="#2243a3">{{ item.key }}</a-tag>
                        <span style="vertical-align: super;margin: 0px 2px;">-</span>
                        <a-tag style="width: 238px;margin-right: 0px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;" color="#545454">{{ item.remarks }}</a-tag>
                    </a-list-item>
                </a-list>
            </a-tab-pane>
        </a-tabs>
    </a-modal>

    <a-modal title="添加局部变量" cancelText="关闭" okText="确定" :visible="visible_local_var_add" @ok="onSaveLocalVar" @cancel="onCloseLoclVarAdd">
        <a-row :gutter="16">
            <a-col :span="24">
                <a-form-item label="Key">
                    <a-input v-model="curr_local_key" placeholder="请输入 Key" />
                </a-form-item>
            </a-col>
            <a-col :span="24">
                <a-form-item label="Value">
                    <a-input v-model="curr_local_value" placeholder="请输入 Value" />
                </a-form-item>
            </a-col>
            <a-col :span="24">
                <a-form-item label="备注">
                    <a-textarea v-model="curr_local_remarks" placeholder="请输入备注" :rows="4" />
                </a-form-item>
            </a-col>
        </a-row>
    </a-modal>

    <a-modal title="修改局部变量" cancelText="关闭" okText="确定" :visible="visible_local_var_edit" @ok="onUpdateLocalVar" @cancel="onCloseLoclVarEdit">
        <a-row :gutter="16">
            <a-col :span="24">
                <a-form-item label="Key">
                    <a-input :disabled="true" v-model="curr_local_key" placeholder="请输入 Key" />
                </a-form-item>
            </a-col>
            <a-col :span="24">
                <a-form-item label="Value">
                    <a-input v-model="curr_local_value" placeholder="请输入 Value" />
                </a-form-item>
            </a-col>
            <a-col :span="24">
                <a-form-item label="备注">
                    <a-textarea v-model="curr_local_remarks" placeholder="请输入备注" :rows="4" />
                </a-form-item>
            </a-col>
        </a-row>
    </a-modal>

    <a-modal title="用户输入" cancelText="关闭" okText="确定" :visible="visible_input_app_edit" @ok="onSaveInputEdit" @cancel="onCloseInputEdit">
        <a-row :gutter="16">
            <a-col :span="24" style="margin-bottom: 20px;">
                <span style="font-weight: bold;margin-right: 10px;">UUID : </span><span>{{input_app}}</span>
            </a-col>
            <a-col :span="24">
                <a-form-item>
                    <a-textarea v-model="input_text" placeholder="请输入内容" :rows="4" />
                </a-form-item>
            </a-col>
        </a-row>
    </a-modal>

    <a-modal title="修改剧本信息" cancelText="关闭" okText="确定" :visible="visible_workflow_edit" @ok="onUpdatelWorkFlow" @cancel="onCloseLoclWorkFlow">
        <a-row :gutter="16">
            <a-col :span="24">
                <a-form-item label="剧本分类">
                    <a-select show-search :filter-option="onFilterOption" v-model="de_select_type" style="width: 100%" @change="onSelect" class="align">
                        <a-select-option v-for="(item, index) in type_data" :key="index" :value="String(item.id)">{{ item.name }}</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :span="24">
                <a-form-item label="剧本名称">
                    <a-input class="work_title" placeholder="请输入剧本名称" v-model="de_workflow_name" />
                </a-form-item>
            </a-col>
            <a-col :span="24">
                <a-form-item label="备注">
                    <a-textarea class="work_remarks" placeholder="请输入剧本备注" :rows="4" v-model="de_work_remarks" />
                </a-form-item>
            </a-col>
        </a-row>
    </a-modal>

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
                                {{Dayjs(report_create_time).subtract(8, 'hour').format('YYYY-MM-DD HH:mm:ss')}}
                            </a-descriptions-item>
                            <a-descriptions-item label="备注">
                                {{work_remarks}}
                            </a-descriptions-item>
                        </a-descriptions>
                    </div>
                </a-col>

                <a-col :span="24" v-for="(item,index) in report_log_data" :key="index" class="div2">
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
</div>
</template>

<script>
import {
    DataUri,
    Graph,
    Shape,
    Addon
} from '@antv/x6';
import insertCss from 'insert-css';
import {
    uuid
} from 'vue-uuid';
import marked from 'marked';
import 'github-markdown-css/github-markdown.css'
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import {
    ZoomIn,
    ZoomOut,
    Margin,
    Back,
    Next,
    Delete,
    InternalData,
    Play,
    Theme,
    SettingConfig,
    Help
} from '@icon-park/vue';

export default {
    name: "workflowEdit",
    components: {
        ZoomIn,
        ZoomOut,
        Margin,
        Back,
        Next,
        Delete,
        InternalData,
        Play,
        Theme,
        SettingConfig,
        Help
    },
    data() {
        return {
            locale,
            app_title: "",
            visible_md: false,
            html: "",
            uuid: "",
            baseURL: this.BaseURL,
            app_list: [],
            graph: "",
            childNode: "",
            data: {
                nodes: [],
                edges: []
            },
            app_data: {},
            controller_data: {},
            for_list: "",
            audit_list: "",
            if_list: "",
            node_color: "",
            plug_minimap: null,
            plug_toolbar: null,
            plug_contextMenu: null,
            plug_grid: null,
            visible_edit: false,
            visible_log: false,
            visible_edit_edge: false,
            visible_timer_edit: false,
            visible_for_edit: false,
            visible_if_edit: false,
            visible_audit_edit: false,
            form: this.$form.createForm(this),
            form_edge: this.$form.createForm(this),
            form_timer: this.$form.createForm(this),
            form_for: this.$form.createForm(this),
            form_if: this.$form.createForm(this),
            form_audit: this.$form.createForm(this),
            key: null,
            app_info: {},
            app_info_args: [],
            workflow_name: "",
            work_remarks: "",
            is_mounted: 0,
            start_app: "",
            end_app: "",
            input_app: "",
            webhook_app: "",
            timer_app: "",
            websock: null,
            ping_timetimer: null,
            execute_log: [],
            select_type: "",
            type_data: [],
            switchLeft: "open",
            visible_local_var_add: false,
            visible_local_var_edit: false,
            visible_input_app_edit: false,
            visible_workflow_edit: false,
            curr_local_key: "",
            curr_local_value: "",
            curr_local_remarks: "",
            local_var_data: [],
            input_text: "",
            saveLoading: false,
            execuLoading: false,
            de_select_type: "",
            de_workflow_name: "",
            de_work_remarks: "",
            run_progress: 0,
            pro_count: 0,
            run_spinning: false,
            visible_report: false,
            report_create_time: "",
            report_no: "",
            report_log_data: [],
            is_btn_pdf: false,
            time_type: "date",
            interval_type: "seconds",
            workflow_status: "0",
            user_list: [],
            // x6
            data: null,
            graph: null,
            ports: null,
            ports_left: null,
            ports_right: null,
            edge: null,
            appListStyle: "",
            addonDnd: null,
            menuList: "",
            curr_theme: "dark",
            visible_var_list: false,
            variablenList: [],
            node_list: null,
            grid_type: "dot",
            edge_color: "#c7342e",
            edge_marker: "block",
            edge_connector: "normal",
            edge_router: "normal",
            grid_color: "#888888",
            grid_background: "#202020",
            groups_color: "#cccccc",
            logDivPlacement: "right"
        };
    },
    created() {
        document.body.ondrop = function (event) {
            event.preventDefault();
            event.stopPropagation();
        };
        window.onDeleteNode = this.onDeleteNode;
        window.onCopyNodeId = this.onCopyNodeId;
        window.onSaveNote = this.onSaveNote;
        window.onDelNote = this.onDelNote;
    },
    mounted() {
        this.is_mounted++;
        this.uuid = this.$route.params.uuid;
        this.$store.commit("closeCollapsed");
        this.onLoad();

        insertCss(`
            .x6-widget-snapline-horizontal {
                border-bottom: 2px solid #bfbfbf;
            }

            .x6-widget-snapline-vertical {
                border-right: 2px solid #bfbfbf;
            }
        `);

        this.appListStyle = "height: calc(100vh - 236px);"
    },
    methods: {
        onLoad() {
            this.onInitColor();
            this.onRegister();
            this.onAppList();
            this.onSelectType();
            this.onData();
            this.onVariablenList();
            this.initWebSocket();
            this.getTheme();
            this.onGetPlacement();
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
        onToolClick(type) {
            switch (type) {
                case "back":
                    this.graph.history.undo();
                    break;
                case "next":
                    this.graph.history.redo();
                    break;
                case "zoom-in":
                    this.graph.zoom(0.2);
                    break;
                case "zoom-out":
                    this.graph.zoom(-0.2);
                    break;
                case "center":
                    this.graph.centerContent()
                    break;
                case "var":
                    this.visible_var_list = true;
                    break;
                case "help":
                    window.open("https://w5.io/help", '_blank');
                    break;
                default:
                    break;
            }
        },
        convertImgToBase64(url, callback, outputFormat) {
            var canvas = document.createElement('CANVAS'),
                ctx = canvas.getContext('2d'),
                img = new Image;
            img.crossOrigin = 'Anonymous';
            img.onload = function () {
                canvas.height = img.height;
                canvas.width = img.width;
                ctx.drawImage(img, 0, 0);
                var dataURL = canvas.toDataURL(outputFormat || 'image/png');
                callback.call(this, dataURL);
                canvas = null;
            };
            img.src = url;
        },
        onRegister() {
            try {
                Graph.registerHTMLComponent('w5NodeDark', (node) => {
                    const wrap = document.createElement('div');

                    this.convertImgToBase64(node.data.icon + "?t=" + new Date().getTime(), function (base64Img) {
                        if (node.data.action == "" || typeof node.data.action == "undefined" || node.data.action == "undefined") {
                            wrap.innerHTML = `
                        <div class="w5Node" style="color: #ccc;text-align: center;">
                            <div class="` + node.id + `&tools" style="letter-spacing: 10px;visibility:hidden;">
                                <?xml version="1.0" encoding="UTF-8"?><svg onclick="onDeleteNode('` + node.id + `')" style="cursor: pointer;" width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="httdiv://www.w3.org/2000/svg"><rect width="48" height="48" fill="white" fill-opacity="0.01"/><path d="M9 10V44H39V10H9Z" fill="#858585" stroke="#858585" stroke-width="4" stroke-linejoin="round"/><path d="M20 20V33" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 20V33" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 10H44" stroke="#858585" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 10L19.289 4H28.7771L32 10H16Z" fill="#858585" stroke="#858585" stroke-width="4" stroke-linejoin="round"/></svg>
                                <?xml version="1.0" encoding="UTF-8"?><svg onclick="onCopyNodeId('` + node.id + `','` + node.data.name + `')" style="cursor: pointer;" width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 12.4316V7.8125C13 6.2592 14.2592 5 15.8125 5H40.1875C41.7408 5 43 6.2592 43 7.8125V32.1875C43 33.7408 41.7408 35 40.1875 35H35.5163" stroke="#858585" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M32.1875 13H7.8125C6.2592 13 5 14.2592 5 15.8125V40.1875C5 41.7408 6.2592 43 7.8125 43H32.1875C33.7408 43 35 41.7408 35 40.1875V15.8125C35 14.2592 33.7408 13 32.1875 13Z" fill="#858585" stroke="#858585" stroke-width="4" stroke-linejoin="round"/></svg>
                            </div>
                            <div class="w5Icon" style="width: 70px;height: 70px;border-radius: 20px;background: #fff;line-height: 65px;text-align: center;border: 1px solid #dbdbdb;">
                                <img crossorigin="anonymous" style="height: 75%;width: 75%;border-radius: 100%;" class="nodeImg" src="` + base64Img + `" alt="` + node.data.name + `">
                            </div>
                            <div class="` + node.id + `&name" style="font-size: 13px;margin-top: 7px;font-weight: bold;">` + node.data.name + `</div>
                            <div class="` + node.id + `&action" style="font-size: 12px;color: #787878;"></div>
                        </div>
                        `
                        } else {
                            wrap.innerHTML = `
                        <div class="w5Node" style="color: #ccc;text-align: center;">
                            <div class="` + node.id + `&tools" style="letter-spacing: 10px;visibility:hidden;">
                                <?xml version="1.0" encoding="UTF-8"?><svg onclick="onDeleteNode('` + node.id + `')" style="cursor: pointer;" width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="httdiv://www.w3.org/2000/svg"><rect width="48" height="48" fill="white" fill-opacity="0.01"/><path d="M9 10V44H39V10H9Z" fill="#858585" stroke="#858585" stroke-width="4" stroke-linejoin="round"/><path d="M20 20V33" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 20V33" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 10H44" stroke="#858585" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 10L19.289 4H28.7771L32 10H16Z" fill="#858585" stroke="#858585" stroke-width="4" stroke-linejoin="round"/></svg>
                                <?xml version="1.0" encoding="UTF-8"?><svg onclick="onCopyNodeId('` + node.id + `','` + node.data.name + `')" style="cursor: pointer;" width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 12.4316V7.8125C13 6.2592 14.2592 5 15.8125 5H40.1875C41.7408 5 43 6.2592 43 7.8125V32.1875C43 33.7408 41.7408 35 40.1875 35H35.5163" stroke="#858585" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M32.1875 13H7.8125C6.2592 13 5 14.2592 5 15.8125V40.1875C5 41.7408 6.2592 43 7.8125 43H32.1875C33.7408 43 35 41.7408 35 40.1875V15.8125C35 14.2592 33.7408 13 32.1875 13Z" fill="#858585" stroke="#858585" stroke-width="4" stroke-linejoin="round"/></svg>
                            </div>
                            <div class="w5Icon" style="width: 70px;height: 70px;border-radius: 20px;background: #fff;line-height: 65px;text-align: center;border: 1px solid #dbdbdb;">
                                <img crossorigin="anonymous" style="height: 75%;width: 75%;border-radius: 100%;" class="nodeImg" src="` + base64Img + `" alt="` + node.data.name + `">
                            </div>
                            <div class="` + node.id + `&name" style="font-size: 13px;margin-top: 7px;font-weight: bold;">` + node.data.name + `</div>
                            <div class="` + node.id + `&action" style="font-size: 12px;color: #787878;">` + node.data.action + `</div>
                        </div>
                        `
                        }

                    });

                    return wrap;
                })
            } catch (error) {

            }

            try {
                Graph.registerHTMLComponent('w5NodeBright', (node) => {
                    const wrap = document.createElement('div');

                    this.convertImgToBase64(node.data.icon + "?t=" + new Date().getTime(), function (base64Img) {
                        if (node.data.action == "" || typeof node.data.action == "undefined" || node.data.action == "undefined") {
                            wrap.innerHTML = `
                        <div class="w5Node" style="color: #242424;text-align: center;">
                            <div class="` + node.id + `&tools" style="letter-spacing: 10px;visibility:hidden;">
                                <?xml version="1.0" encoding="UTF-8"?><svg onclick="onDeleteNode('` + node.id + `')" style="cursor: pointer;" width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="httdiv://www.w3.org/2000/svg"><rect width="48" height="48" fill="white" fill-opacity="0.01"/><path d="M9 10V44H39V10H9Z" fill="#858585" stroke="#858585" stroke-width="4" stroke-linejoin="round"/><path d="M20 20V33" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 20V33" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 10H44" stroke="#858585" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 10L19.289 4H28.7771L32 10H16Z" fill="#858585" stroke="#858585" stroke-width="4" stroke-linejoin="round"/></svg>
                                <?xml version="1.0" encoding="UTF-8"?><svg onclick="onCopyNodeId('` + node.id + `','` + node.data.name + `')" style="cursor: pointer;" width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 12.4316V7.8125C13 6.2592 14.2592 5 15.8125 5H40.1875C41.7408 5 43 6.2592 43 7.8125V32.1875C43 33.7408 41.7408 35 40.1875 35H35.5163" stroke="#858585" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M32.1875 13H7.8125C6.2592 13 5 14.2592 5 15.8125V40.1875C5 41.7408 6.2592 43 7.8125 43H32.1875C33.7408 43 35 41.7408 35 40.1875V15.8125C35 14.2592 33.7408 13 32.1875 13Z" fill="#858585" stroke="#858585" stroke-width="4" stroke-linejoin="round"/></svg>
                            </div>
                            <div class="w5Icon" style="width: 70px;height: 70px;border-radius: 20px;background: #fff;line-height: 65px;text-align: center;border: 1px solid #c7c7c7;">
                                <img crossorigin="anonymous" style="height: 75%;width: 75%;border-radius: 100%;" class="nodeImg" src="` + base64Img + `" alt="` + node.data.name + `">
                            </div>
                            <div class="` + node.id + `&name" style="font-size: 13px;margin-top: 7px;font-weight: bold;">` + node.data.name + `</div>
                            <div class="` + node.id + `&action" style="font-size: 12px;color: #858585;"></div>
                        </div>
                        `
                        } else {
                            wrap.innerHTML = `
                        <div class="w5Node" style="color: #242424;text-align: center;">
                            <div class="` + node.id + `&tools" style="letter-spacing: 10px;visibility:hidden;">
                                <?xml version="1.0" encoding="UTF-8"?><svg onclick="onDeleteNode('` + node.id + `')" style="cursor: pointer;" width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="httdiv://www.w3.org/2000/svg"><rect width="48" height="48" fill="white" fill-opacity="0.01"/><path d="M9 10V44H39V10H9Z" fill="#858585" stroke="#858585" stroke-width="4" stroke-linejoin="round"/><path d="M20 20V33" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 20V33" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 10H44" stroke="#858585" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 10L19.289 4H28.7771L32 10H16Z" fill="#858585" stroke="#858585" stroke-width="4" stroke-linejoin="round"/></svg>
                                <?xml version="1.0" encoding="UTF-8"?><svg onclick="onCopyNodeId('` + node.id + `','` + node.data.name + `')" style="cursor: pointer;" width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 12.4316V7.8125C13 6.2592 14.2592 5 15.8125 5H40.1875C41.7408 5 43 6.2592 43 7.8125V32.1875C43 33.7408 41.7408 35 40.1875 35H35.5163" stroke="#858585" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M32.1875 13H7.8125C6.2592 13 5 14.2592 5 15.8125V40.1875C5 41.7408 6.2592 43 7.8125 43H32.1875C33.7408 43 35 41.7408 35 40.1875V15.8125C35 14.2592 33.7408 13 32.1875 13Z" fill="#858585" stroke="#858585" stroke-width="4" stroke-linejoin="round"/></svg>
                            </div>
                            <div class="w5Icon" style="width: 70px;height: 70px;border-radius: 20px;background: #fff;line-height: 65px;text-align: center;border: 1px solid #c7c7c7;">
                                <img crossorigin="anonymous" style="height: 75%;width: 75%;border-radius: 100%;" class="nodeImg" src="` + base64Img + `" alt="` + node.data.name + `">
                            </div>
                            <div class="` + node.id + `&name" style="font-size: 13px;margin-top: 7px;font-weight: bold;">` + node.data.name + `</div>
                            <div class="` + node.id + `&action" style="font-size: 12px;color: #858585;">` + node.data.action + `</div>
                        </div>
                        `
                        }
                    });

                    return wrap;
                })
            } catch (error) {

            }

            try {
                Graph.registerHTMLComponent('w5NodeNote', (node) => {
                    const wrap = document.createElement('div');
                    wrap.innerHTML = `
                    <div style="position: absolute;right: 0px;margin-right: 5px;font-size: 20px;color: #505050;margin-top: -5px;cursor: pointer;" onclick="onDelNote('` + node.id + `')">x</div>
                    <div class="w5NodeNote" style="color: #4e4e4e;text-align: center;height: 200px;width: 200px;border-radius: 3px;background: linear-gradient(216deg,#fffc9f, #ffed33);font-size: 14px;overflow-x: hidden;overflow-y: auto;-webkit-user-modify: read-write-plaintext-only;outline: none;word-break: break-all;display: grid;align-items: center;justify-content: center;" spellcheck="false" onmouseout="onSaveNote('` + node.id + `')">` + node.data.text + `</div>
                    `
                    return wrap;
                })
            } catch (error) {

            }

            try {
                Graph.registerEdge(
                    'w5Edge', {
                        inherit: 'edge',
                        defaultLabel: {
                            markup: [{
                                    tagName: 'rect',
                                    selector: 'body',
                                },
                                {
                                    tagName: 'text',
                                    selector: 'label',
                                },
                            ],
                            attrs: {
                                label: {
                                    fill: '#efefef',
                                    fontSize: 14,
                                    textAnchor: 'middle',
                                    textVerticalAnchor: 'middle',
                                    pointerEvents: 'none',
                                },
                                body: {
                                    ref: 'label',
                                    fill: '#323232',
                                    rx: 4,
                                    ry: 4,
                                    refWidth: '140%',
                                    refHeight: '140%',
                                    refX: '-20%',
                                    refY: '-20%',
                                },
                            },
                            position: {
                                distance: 200,
                                options: {
                                    absoluteDistance: true,
                                    reverseDistance: true,
                                },
                            },
                        },
                    },
                    true,
                )
            } catch (error) {

            }
        },
        onInitColor() {
            var theme = this.$cookies.get("theme");

            if (theme === "dark") {
                this.grid_type = "dot";
                this.edge_color = "#c7342e";
                this.edge_marker = "block";
                this.edge_connector = "normal";
                this.edge_router = "metro";
                this.grid_color = "#4c4c4c";
                this.grid_background = "#202020";
                this.groups_color = "#787878";
            } else {
                this.grid_type = "dot";
                this.edge_color = "#c7342e";
                this.edge_marker = "block";
                this.edge_connector = "normal";
                this.edge_router = "metro";
                this.grid_color = "#cdcdcd";
                this.grid_background = "#ffffff";
                this.groups_color = "#555555";
            }
        },
        onInitCanvas() {
            let that = this;

            let width = document.body.offsetWidth - 50;
            let height = document.body.offsetHeight;

            window.onresize = function () {
                let width = document.body.offsetWidth - 50;
                let height = document.body.offsetHeight;
                that.graph.resize(width, height)
            }

            that.graph = new Graph({
                container: document.getElementById('container'),
                width: width,
                height: height,
                autoResize: true,
                snapline: {
                    enabled: true,
                    sharp: true,
                    clean: false,
                },
                panning: {
                    enabled: true,
                },
                history: {
                    enabled: true,
                },
                background: {
                    color: that.grid_background,
                },
                grid: {
                    size: 30, // 网格大小 10px
                    visible: true, // 渲染网格背景
                    type: 'dot',
                    args: {
                        color: that.grid_color,
                        thickness: 0.5, // 网格线宽度/网格点大小
                    },
                },
                highlighting: {
                    magnetAdsorbed: {
                        name: 'stroke',
                        args: {
                            padding: 4,
                            attrs: {
                                'stroke-width': 2,
                                stroke: 'red',
                            }
                        },
                    },
                },
                minimap: {
                    enabled: true,
                    container: document.getElementById('minimapContainer'),
                    width: 250,
                    height: 180
                },
                connecting: {
                    router: 'metro',
                    connector: {
                        name: 'rounded',
                        args: {
                            radius: 50,
                        },
                    },
                    allowBlank: false,
                    allowMulti: false,
                    allowLoop: false,
                    highlight: true,
                    snap: {
                        radius: 50,
                    },
                    createEdge() {
                        return new Shape.Edge({
                            attrs: {
                                line: {
                                    strokeDasharray: '5 5',
                                    stroke: that.edge_color,
                                    strokeWidth: 2
                                },
                            },
                            shape: 'w5Edge'
                        })
                    },
                    validateMagnet({
                        e,
                        magnet,
                        view,
                        cell
                    }) {
                        return true
                    },
                    validateConnection({
                        sourceView,
                        targetView,
                        sourceMagnet,
                        targetMagnet
                    }) {
                        if (!sourceMagnet || sourceMagnet.getAttribute('port-group') === 'left') {
                            return false
                        }

                        if (!targetMagnet || targetMagnet.getAttribute('port-group') !== 'left') {
                            return false
                        }

                        // 判断目标链接桩是否可连接
                        // const portId = targetMagnet.getAttribute('port') !
                        //     const node = targetView.cell as Node
                        // const port = node.getPort(portId)
                        // if (port && port.connected) {
                        //     return false
                        // }

                        return true
                    },
                }
            });

            that.onMakePorts();
            that.graph.fromJSON(that.data);
            that.graph.centerContent();
            that.onCanvasEvents();

            that.addonDnd = new Addon.Dnd({
                target: that.graph,
                scaled: false,
                animation: true,
                getDragNode: (node) => node.clone({
                    keepId: true
                }),
                getDropNode: (node) => node.clone({
                    keepId: true
                }),
            });

            that.onLoadConfig();
        },
        onLoadConfig() {
            this.onDrawGrid();
            this.onDrawNode();
            this.onDrawEdge();
            this.onSave();
        },
        // 重绘画网格
        onChangGrid(e) {
            this.grid_type = e.target.value;
            this.onDrawGrid();
            this.onSave();
        },
        onDrawGrid() {
            if (this.curr_theme === "bright") {
                this.grid_color = "#cdcdcd";
                this.grid_background = "#ffffff";
            } else if (this.curr_theme === "dark") {
                this.grid_color = "#4c4c4c";
                this.grid_background = "#202020";
            }

            if (this.grid_type === "none") {
                this.graph.hideGrid();
            } else if (this.grid_type === "dot") {
                this.graph.showGrid();
                this.graph.drawGrid({
                    size: 20,
                    visible: true,
                    type: 'dot',
                    args: {
                        color: this.grid_color,
                        thickness: 2
                    },
                })
            } else if (this.grid_type === "mesh") {
                this.graph.showGrid();
                this.graph.drawGrid({
                    size: 30,
                    visible: true,
                    type: 'mesh',
                    args: {
                        color: this.grid_color,
                        thickness: 0.5
                    },
                })
            }

            this.graph.drawBackground({
                color: this.grid_background,
            });

            this.graph.updateBackground();
        },
        // 重绘链路
        onChangEdgeMarker(e) {
            this.edge_marker = e.target.value;
            this.onDrawEdge();
            this.onSave();
        },
        onChangEdgeColor(e) {
            this.edge_color = e.target.value;
            this.onDrawEdge();
            this.onSave();
        },
        onChangEdgeConnector(e) {
            this.edge_connector = e.target.value;
            this.onDrawEdge();
            this.onSave();
        },
        onChangEdgeRouter(e) {
            this.edge_router = e.target.value;
            this.onDrawEdge();
            this.onSave();
        },
        onDrawEdge() {
            this.graph.getEdges().forEach(e => {
                e.attr({
                    line: {
                        strokeDasharray: 0,
                        stroke: this.edge_color,
                        strokeWidth: 2,
                        targetMarker: {
                            name: this.edge_marker,
                            args: {
                                size: '8',
                            },
                        },
                    },
                })

                e.setConnector(this.edge_connector);
                e.setRouter(this.edge_router);
            });
        },
        // 重绘节点
        onDrawNode() {
            this.graph.getNodes().forEach(e => {

                if (e.html === "w5NodeNote") {
                    return false;
                }

                if (this.curr_theme === "bright") {
                    e.setProp('html', "w5NodeBright");
                    this.groups_color = "#555555";
                } else if (this.curr_theme === "dark") {
                    e.setProp('html', "w5NodeDark");
                    this.groups_color = "#787878";
                }

                try {
                    e.setPortProp('left', {
                        attrs: {
                            line: {
                                stroke: this.groups_color
                            },
                        },
                    })
                } catch (error) {

                }

                try {
                    e.setPortProp('right', {
                        attrs: {
                            circle: {
                                fill: this.groups_color,
                                stroke: this.groups_color
                            },
                        },
                    })
                } catch (error) {

                }
            });
        },
        onMakePorts() {
            let groups = {
                left: {
                    position: {
                        name: 'left',
                    },
                    markup: [{
                        tagName: 'line',
                        selector: 'line',
                    }],
                    attrs: {
                        line: {
                            y1: -9,
                            y2: 9,
                            magnet: true,
                            strokeWidth: 5,
                            stroke: this.groups_color
                        }
                    },
                    position: {
                        name: 'absolute',
                    },
                },
                right: {
                    position: {
                        name: 'right',
                    },
                    attrs: {
                        circle: {
                            r: 7,
                            magnet: true,
                            strokeWidth: 0,
                            fill: this.groups_color,
                            stroke: this.groups_color
                        },
                    },
                    position: {
                        name: 'absolute',
                    },
                },
            };

            this.ports = {
                items: [{
                        id: "left",
                        group: 'left',
                        args: {
                            x: 0,
                            y: 55,
                        },
                    },
                    {
                        id: "right",
                        group: 'right',
                        args: {
                            x: 70,
                            y: 55,
                        },
                    },
                ],
                groups: groups
            }

            this.ports_left = {
                items: [{
                    id: "left",
                    group: 'left',
                    args: {
                        x: 0,
                        y: 55,
                    },
                }],
                groups: groups
            }

            this.ports_right = {
                items: [{
                    id: "right",
                    group: 'right',
                    args: {
                        x: 70,
                        y: 55,
                    },
                }],
                groups: groups
            }
        },
        onDrag(event, icon, name, app_dir) {
            var ports = this.ports;
            let node_id = uuid.v1();

            if (name == "开始") {
                if (this.start_app != "") {
                    this.$message.warning("只能存在一个 [ 开始 ] 节点");
                    return false;
                }
                this.start_app = node_id;
                ports = this.ports_right;
            } else if (name == "结束") {
                if (this.end_app != "") {
                    this.$message.warning("只能存在一个 [ 结束 ] 节点");
                    return false;
                }
                this.end_app = node_id;
                ports = this.ports_left;
            } else if (name == "用户输入") {
                if (this.input_app != "") {
                    this.$message.warning("只能存在一个 [ 用户输入 ] 节点");
                    return false;
                }
                this.input_app = node_id;
            } else if (name == "WebHook") {
                if (this.webhook_app != "") {
                    this.$message.warning("只能存在一个 [ WebHook ] 节点");
                    return false;
                }
                this.webhook_app = node_id;
            } else if (name == "定时器") {
                if (this.timer_app != "") {
                    this.$message.warning("只能存在一个 [ 定时器 ] 节点");
                    return false;
                }
                this.timer_app = node_id;
            } else if (name == "For") {
                if (this.for_list == "") {
                    this.for_list = node_id;
                } else {
                    this.for_list += "," + node_id;
                }
            } else if (name == "人工审计") {
                if (this.audit_list == "") {
                    this.audit_list = node_id;
                } else {
                    this.audit_list += "," + node_id;
                }
            } else if (name == "IF") {
                if (this.if_list == "") {
                    this.if_list = node_id;
                } else {
                    this.if_list += "," + node_id;
                }
            }

            var theme = this.$cookies.get("theme");
            var w5Node = "";
            var node = null;

            if (name == "Note") {
                w5Node = "w5NodeNote";

                node = this.graph.createNode({
                    id: node_id,
                    width: 200,
                    height: 200,
                    shape: 'html',
                    html: w5Node,
                    data: {
                        text: "这是一个便签"
                    }
                });
            } else {
                if (theme === "dark") {
                    w5Node = "w5NodeDark";
                } else {
                    w5Node = "w5NodeBright";
                }

                node = this.graph.createNode({
                    id: node_id,
                    width: 70,
                    height: 140,
                    ports: ports,
                    shape: 'html',
                    html: w5Node,
                    data: {
                        icon: icon,
                        name: name,
                        app_dir: app_dir,
                        action: ""
                    }
                });
            }

            this.addonDnd.start(node, event);
            this.deepClone(node_id, app_dir);
        },
        onDeleteNode(id) {
            if (id == this.start_app) {
                this.start_app = "";
            } else if (id == this.end_app) {
                this.end_app = "";
            } else if (id == this.input_app) {
                this.input_app = "";
            } else if (id == this.webhook_app) {
                this.webhook_app = "";
            } else if (id == this.timer_app) {
                this.timer_app = "";
            }

            this.graph.removeNode(id);

            this.onSave();
        },
        onCopyNodeId(id, name) {
            let that = this;
            that.$copyText(id).then(function (e) {
                that.$message.info("复制 APP [ " + name + " ] UUID 成功");
            }, function (e) {
                that.$message.warning("复制 APP [ " + name + " ] UUID 失败");
            });
        },
        onCanvasEvents() {
            let that = this;

            that.graph.on('edge:connected', (args) => {
                const edge = args.edge
                const node = args.currentCell
                const elem = args.currentMagnet
                const portId = elem.getAttribute('port');

                node.setPortProp(portId, 'connected', true)

                edge.attr({
                    line: {
                        strokeDasharray: 0,
                        stroke: that.edge_color,
                        strokeWidth: 2,
                        targetMarker: {
                            name: 'block',
                            args: {
                                size: '8',
                            },
                        },
                    },
                })

                that.onSave();
            })

            that.graph.on('edge:removed', (args) => {
                that.onSave();
            })

            that.graph.on('node:added', (args) => {
                that.onSave();
            })

            that.graph.on('edge:mouseenter', (e) => {
                e.edge.addTools([{
                        name: 'vertices',
                        args: {
                            attrs: {
                                fill: '#666'
                            },
                        },
                    },
                    {
                        name: 'segments',
                        args: {
                            snapRadius: 20,
                            attrs: {
                                fill: '#444',
                            },
                        },
                    },
                    {
                        name: 'button-remove',
                        args: {
                            distance: -40
                        },
                    },
                    // {
                    //     name: 'source-arrowhead',
                    //     args: {
                    //         attrs: {
                    //             fill: 'red',
                    //         },
                    //     },
                    // },
                    // {
                    //     name: 'target-arrowhead',
                    //     args: {
                    //         attrs: {
                    //             fill: 'red',
                    //         },
                    //     },
                    // },
                ], 'onhover')
            })

            that.graph.on('edge:mouseleave', (e) => {
                e.cell.removeTools()
            })

            that.graph.on('node:mouseenter', (e) => {
                if (e.node.html === "w5NodeNote") {
                    return false;
                }

                let select_tools = String(e.node.id) + "&tools";
                document.getElementById("container").getElementsByClassName(select_tools)[0].style.visibility = "inherit";
                document.getElementById("minimapContainer").getElementsByClassName(select_tools)[0].style.visibility = "inherit";
            })

            that.graph.on('node:mouseleave', (e) => {
                if (e.node.html === "w5NodeNote") {
                    return false;
                }

                let select_tools = String(e.node.id) + "&tools";
                document.getElementById("container").getElementsByClassName(select_tools)[0].style.visibility = "hidden";
                document.getElementById("minimapContainer").getElementsByClassName(select_tools)[0].style.visibility = "hidden";
            })

            that.graph.on('node:contextmenu', (e) => {
                let id = e.node.id;
                let name = e.node.data.name;

                if (id == that.start_app) {
                    that.$message.warning("[ 开始 ] 节点不可使用编辑功能");
                    return false;
                } else if (id == that.end_app) {
                    that.$message.warning("[ 结束 ] 节点不可使用编辑功能");
                    return false;
                } else if (id == that.input_app) {
                    that.$message.warning("[ 用户输入 ] 节点不可使用编辑功能");
                    return false;
                } else if (id == that.webhook_app) {
                    that.$message.warning("[ WebHook ] 节点不可使用编辑功能");
                    return false;
                }

                that.onShow(id, name, "node");
            })

            that.graph.on('edge:contextmenu', (e) => {
                let id = e.edge.id;

                try {
                    that.onShow(id, e.edge.store.data.labels[0], "edge");
                } catch (error) {
                    that.onShow(id, "", "edge");
                }
            })

            // that.graph.on('cell:change:data', (e) => {
            // let select_name = String(e.cell.id) + "&name";
            // let select_action = String(e.cell.id) + "&action";

            // document.getElementById("container").getElementsByClassName(select_name)[0].innerText = e.current.name;
            // document.getElementById("minimapContainer").getElementsByClassName(select_name)[0].innerText = e.current.name;

            // document.getElementById("container").getElementsByClassName(select_action)[0].innerText = e.current.action;
            // document.getElementById("minimapContainer").getElementsByClassName(select_action)[0].innerText = e.current.action;
            // })
        },
        onToJson() {
            this.data = this.graph.toJSON();
        },
        // 保存剧本 or 执行剧本
        onSave(type = "save") {
            let that = this;
            that.saveLoading = true;
            that.onToJson();

            setTimeout(() => {
                that.onToPng(function (dataImgBase64) {
                    // 更新剧本信息
                    that.$http
                        .post("/api/v1/w5/post/workflow/update", {
                            uuid: that.uuid,
                            name: that.workflow_name,
                            remarks: that.work_remarks,
                            start_app: that.start_app,
                            end_app: that.end_app,
                            input_app: that.input_app,
                            webhook_app: that.webhook_app,
                            timer_app: that.timer_app,
                            for_list: that.for_list,
                            if_list: that.if_list,
                            audit_list: that.audit_list,
                            flow_json: JSON.stringify(that.data),
                            flow_data: JSON.stringify(that.app_data),
                            local_var_data: JSON.stringify(that.local_var_data),
                            controller_data: JSON.stringify(that.controller_data),
                            type_id: that.select_type,
                            grid_type: that.grid_type,
                            edge_marker: that.edge_marker,
                            edge_color: that.edge_color,
                            edge_connector: that.edge_connector,
                            edge_router: that.edge_router,
                            thumbnail: dataImgBase64
                        })
                        .then((res) => {
                            if (res.code == 0) {

                                if (type === "run") {
                                    that.input_text = "";

                                    let msg = JSON.stringify({
                                        "method": "run",
                                        "data": {
                                            "uuid": that.uuid
                                        }
                                    })

                                    that.sendMSG(msg)
                                }

                                that.saveLoading = false;
                            } else {
                                that.$message.error(res.msg);
                            }
                        });
                });
            }, 200);
        },
        onRunCheck() {
            if (this.workflow_status == "1") {
                this.$message.warning("该剧本已经禁止执行");
                return false;
            }

            this.execuLoading = true;
            this.onToJson();

            this.node_list = new Set();

            for (let i in this.data.cells) {
                if (this.data.cells[i].shape === "w5Edge") {
                    this.node_list.add(this.data.cells[i].source.cell)
                    this.node_list.add(this.data.cells[i].target.cell)
                }
            }

            for (let i of this.node_list) {
                if (typeof this.app_data[i] != "undefined") {
                    if (this.app_data[i].hasOwnProperty("data") == false) {
                        this.$message.warning("请选择 [ " + this.app_data[i].name + " ] APP 动作");
                        this.execuLoading = false;
                        return false;
                    }
                }
            }

            if (this.input_app != "") {
                this.visible_input_app_edit = true;
                return false;
            }

            this.onRun();
        },
        onRun() {
            this.run_spinning = true;
            this.run_progress = 0;
            this.pro_count = parseInt(100 / this.node_list.length);
            this.is_btn_pdf = false;
            this.onShowLog();
            this.onSave("run");
        },
        onData() {
            // 加载剧本信息
            this.$http
                .post("/api/v1/w5/post/workflow/detail", {
                    uuid: this.uuid
                })
                .then((res) => {
                    if (res.code == 0) {
                        this.select_type = String(res.data.type_id);
                        this.workflow_name = res.data.name;
                        this.work_remarks = res.data.remarks;
                        this.workflow_status = String(res.data.status);

                        if (res.data.flow_json.trim() === "") {
                            this.data = {
                                nodes: [],
                                edges: []
                            }
                        } else {
                            this.data = JSON.parse(res.data.flow_json);
                        }

                        if (res.data.flow_data === "none" || res.data.flow_data.trim() === "" || res.data.flow_data.trim() === "{}") {
                            this.app_data = {}
                        } else {
                            this.app_data = JSON.parse(res.data.flow_data);
                        }

                        this.start_app = res.data.start_app;
                        this.end_app = res.data.end_app;
                        this.input_app = res.data.input_app;
                        this.webhook_app = res.data.webhook_app;
                        this.timer_app = res.data.timer_app;
                        this.for_list = res.data.for_list;
                        this.if_list = res.data.if_list;
                        this.audit_list = res.data.audit_list;

                        if (res.data.local_var_data === "none" || res.data.local_var_data.trim() === "" || res.data.local_var_data.trim() === "[]") {
                            this.local_var_data = []
                        } else {
                            this.local_var_data = JSON.parse(res.data.local_var_data);
                        }

                        if (res.data.controller_data === "none" || res.data.controller_data.trim() === "" || res.data.controller_data.trim() === "{}") {
                            this.controller_data = {}
                        } else {
                            this.controller_data = JSON.parse(res.data.controller_data);
                        }

                        this.grid_type = res.data.grid_type;
                        this.edge_marker = res.data.edge_marker;
                        this.edge_color = res.data.edge_color;
                        this.edge_connector = res.data.edge_connector;
                        this.edge_router = res.data.edge_router;

                        this.onInitCanvas();
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        onVariablenList() {
            this.$http
                .post("/api/v1/w5/get/variablen/list", {
                    type: 0
                })
                .then((res) => {
                    if (res.code == 0) {
                        this.variablenList = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        deepClone(node_id, app_dir) {
            let appList = JSON.parse(JSON.stringify(this.app_list));
            this.app_data[node_id] = appList[app_dir]
        },
        onShow(key, name, type) {
            this.key = key;

            var for_list = this.for_list.split(",");
            var if_list = this.if_list.split(",");
            var audit_list = this.audit_list.split(",");

            if (type === "node") {
                if (this.key == this.timer_app) {
                    var edit_data = this.controller_data[key];

                    if (typeof edit_data != "undefined") {
                        edit_data["node_name"] = name;
                        this.time_type = edit_data['type']

                        // delete edit_data["type"];

                        this.$nextTick(() => {
                            setTimeout(() => {
                                this.form_timer.setFieldsValue(edit_data);
                            }, 100)
                        })
                    } else {
                        if (this.time_type == "interval") {
                            this.$nextTick(() => {
                                setTimeout(() => {
                                    this.form_timer.setFieldsValue({
                                        "node_name": name,
                                        "interval_type": "seconds",
                                        "jitter": 0
                                    });
                                }, 100)
                            })

                        } else if (this.time_type == "cron") {
                            this.$nextTick(() => {
                                setTimeout(() => {
                                    this.form_timer.setFieldsValue({
                                        "node_name": name,
                                        "jitter": 0
                                    });
                                }, 100)
                            })

                        } else {
                            this.$nextTick(() => {
                                setTimeout(() => {
                                    this.form_timer.setFieldsValue({
                                        "node_name": name,
                                    });
                                }, 100)
                            })
                        }
                    }

                    this.visible_timer_edit = true;
                } else if (for_list.indexOf(this.key) > -1) {
                    var edit_data = this.controller_data[key];

                    if (typeof edit_data == "undefined") {
                        this.$nextTick(() => {
                            setTimeout(() => {
                                this.form_for.setFieldsValue({
                                    "node_name": name,
                                    "action": null,
                                    "text": ""
                                });
                            }, 100)
                        })
                    } else {
                        this.$nextTick(() => {
                            setTimeout(() => {
                                this.form_for.setFieldsValue(edit_data);
                            }, 100)
                        })
                    }

                    this.visible_for_edit = true;
                } else if (if_list.indexOf(this.key) > -1) {
                    var edit_data = this.controller_data[key];

                    if (typeof edit_data == "undefined") {
                        this.$nextTick(() => {
                            setTimeout(() => {
                                this.form_if.setFieldsValue({
                                    "node_name": name,
                                    "action": null,
                                    "text": ""
                                });
                            }, 100)
                        })
                    } else {
                        this.$nextTick(() => {
                            setTimeout(() => {
                                this.form_if.setFieldsValue(edit_data);
                            }, 100)
                        })
                    }

                    this.visible_if_edit = true;
                } else if (audit_list.indexOf(this.key) > -1) {
                    this.onUserList();

                    var edit_data = this.controller_data[key];

                    if (typeof edit_data == "undefined") {
                        this.$nextTick(() => {
                            setTimeout(() => {
                                this.form_audit.setFieldsValue({
                                    "node_name": name,
                                    "text": ""
                                });
                            }, 100)
                        })
                    } else {
                        this.$nextTick(() => {
                            setTimeout(() => {
                                this.form_audit.setFieldsValue(edit_data);
                            }, 100)
                        })
                    }

                    this.visible_audit_edit = true;
                } else {
                    this.app_info = this.app_data[key];

                    var app_dir = this.app_info["app_dir"];

                    for (let index in this.app_list[app_dir]) {
                        this.app_info[index]=this.app_list[app_dir][index];
                    }

                    var edit_data = this.app_data[key]["data"];

                    if (typeof edit_data != "undefined") {
                        edit_data["node_name"] = name;
                        this.selectAppAction(edit_data.action)
                        setTimeout(() => {
                            this.form.setFieldsValue(edit_data);
                        }, 100);
                    } else {
                        this.app_info_args = [];

                        setTimeout(() => {
                            this.form.setFieldsValue({
                                "node_name": name,
                                "action": ""
                            });
                        }, 100);
                    }
                    this.visible_edit = true;
                }
            } else if (type === "edge") {
                if (typeof this.app_data[key] != "undefined") {
                    let edge_data_info = this.app_data[key];
                    setTimeout(() => {
                        this.form_edge.setFieldsValue({
                            "edge_name": name,
                            "switch": edge_data_info.switch,
                            "action": String(edge_data_info.action),
                            "ifelse": edge_data_info.ifelse,
                        });
                    }, 100);
                } else {
                    setTimeout(() => {
                        this.form_edge.setFieldsValue({
                            "edge_name": name,
                            "switch": false,
                            "action": "1",
                            "ifelse": ""
                        });
                    }, 100);
                }

                this.visible_edit_edge = true;
            }
        },
        onAppList() {
            // 加载 APP 列表
            this.$http
                .get("/api/v1/w5/get/app/list")
                .then((res) => {
                    if (res.code == 0) {
                        this.app_list = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        onClose() {
            this.visible_edit = false;
        },
        onCloseEdge() {
            this.visible_edit_edge = false;
        },
        onShowLog() {
            this.visible_log = true;
        },
        onCloseLog() {
            this.execute_log = [];
            this.execuLoading = false;
            this.visible_log = false;
        },
        onCloseTimer() {
            this.visible_timer_edit = false;
        },
        onCloseFor() {
            this.visible_for_edit = false;
        },
        onCloseIf() {
            this.visible_if_edit = false;
        },
        onCloseAudit() {
            this.visible_audit_edit = false;
        },
        selectAppAction(action) {
            this.app_info_args = this.app_info["args"][action];
        },
        onUpdate(e) {
            e.preventDefault();

            this.form.validateFields((err, values) => {
                if (!err) {
                    for (var item in values) {
                        if (typeof values[item] == "undefined") {
                            values[item] = ""
                        }
                    }

                    for (var a in this.app_info.action) {
                        if (this.app_info.action[a].func === values.action) {
                            values["action_name"] = this.app_info.action[a].name
                        }
                    }

                    values["description"] = this.app_data[this.key]["description"]

                    this.app_data[this.key]["data"] = values;

                    this.onClose();
                    this.onSave();

                    this.graph.findViewByCell(this.key).cell.updateData({
                        name: values.node_name,
                        action: values.action_name
                    });

                    if (this.curr_theme === "bright") {
                        this.graph.findViewByCell(this.key).cell.setProp('html', "w5NodeDark");
                        this.graph.findViewByCell(this.key).cell.setProp('html', "w5NodeBright");
                    } else if (this.curr_theme === "dark") {
                        this.graph.findViewByCell(this.key).cell.setProp('html', "w5NodeBright");
                        this.graph.findViewByCell(this.key).cell.setProp('html', "w5NodeDark");
                    }
                }
            });
        },
        onUpdateEdge(e) {
            e.preventDefault();

            this.form_edge.validateFields((err, values) => {
                if (!err) {
                    this.graph.findViewByCell(this.key).cell.setLabels([values.edge_name]);
                    this.onSave();
                    this.onCloseEdge();
                }
            });
        },
        onUpdateTimer(e) {
            e.preventDefault();

            this.form_timer.validateFields((err, values) => {
                if (!err) {
                    var action_name = "";

                    if (this.time_type == "date") {
                        values.time = this.Dayjs(values.time).format('YYYY-MM-DD HH:mm:ss')

                        action_name = "定时执行";
                    } else if (this.time_type == "interval") {
                        if (typeof values.start_date != "undefined" && values.start_date != null) {
                            values.start_date = this.Dayjs(values.start_date).format('YYYY-MM-DD HH:mm:ss')
                        }

                        if (typeof values.end_date != "undefined" && values.end_date != null) {
                            values.end_date = this.Dayjs(values.end_date).format('YYYY-MM-DD HH:mm:ss')
                        }

                        action_name = "间隔执行";
                    } else if (this.time_type == "cron") {
                        if (typeof values.start_date != "undefined" && values.start_date != null) {
                            values.start_date = this.Dayjs(values.start_date).format('YYYY-MM-DD HH:mm:ss')
                        }
                        if (typeof values.end_date != "undefined" && values.end_date != null) {
                            values.end_date = this.Dayjs(values.end_date).format('YYYY-MM-DD HH:mm:ss')
                        }

                        let val_arr = values.time.trim().split(" ")

                        if (val_arr.length != 5) {
                            this.$message.error("Cron 表达式不正确");
                            return false;
                        }

                        action_name = "执行计划";
                    }

                    this.controller_data[this.key] = values;
                    this.controller_data[this.key]["type"] = this.time_type;

                    this.onSave();
                    this.onCloseTimer();

                    this.graph.findViewByCell(this.key).cell.updateData({
                        name: values.node_name,
                        action: action_name
                    });

                    if (this.curr_theme === "bright") {
                        this.graph.findViewByCell(this.key).cell.setProp('html', "w5NodeDark");
                        this.graph.findViewByCell(this.key).cell.setProp('html', "w5NodeBright");
                    } else if (this.curr_theme === "dark") {
                        this.graph.findViewByCell(this.key).cell.setProp('html', "w5NodeBright");
                        this.graph.findViewByCell(this.key).cell.setProp('html', "w5NodeDark");
                    }
                }
            });
        },
        onUpdateFor(e) {
            e.preventDefault();

            this.form_for.validateFields((err, values) => {
                if (!err) {
                    var action_name = "";

                    this.controller_data[this.key] = values;

                    this.onSave();
                    this.onCloseFor();

                    if (values.action == "1") {
                        action_name = "数组循环";
                    } else if (values.action == "2") {
                        action_name = "字典循环";
                    } else if (values.action == "3") {
                        action_name = "次数循环";
                    }

                    this.graph.findViewByCell(this.key).cell.updateData({
                        name: values.node_name,
                        action: action_name
                    });

                    if (this.curr_theme === "bright") {
                        this.graph.findViewByCell(this.key).cell.setProp('html', "w5NodeDark");
                        this.graph.findViewByCell(this.key).cell.setProp('html', "w5NodeBright");
                    } else if (this.curr_theme === "dark") {
                        this.graph.findViewByCell(this.key).cell.setProp('html', "w5NodeBright");
                        this.graph.findViewByCell(this.key).cell.setProp('html', "w5NodeDark");
                    }
                }
            });
        },
        onUpdateIf(e) {
            e.preventDefault();

            this.form_if.validateFields((err, values) => {
                if (!err) {
                    var action_name = "";

                    this.controller_data[this.key] = values;

                    this.onSave();
                    this.onCloseIf();

                    if (values.action == "1") {
                        action_name = "==";
                    } else if (values.action == "2") {
                        action_name = "!=";
                    } else if (values.action == "3") {
                        action_name = "正则表达式";
                    } else if (values.action == "4") {
                        action_name = "JSON 解析器";
                    }

                    this.graph.findViewByCell(this.key).cell.updateData({
                        name: values.node_name,
                        action: action_name
                    });

                    if (this.curr_theme === "bright") {
                        this.graph.findViewByCell(this.key).cell.setProp('html', "w5NodeDark");
                        this.graph.findViewByCell(this.key).cell.setProp('html', "w5NodeBright");
                    } else if (this.curr_theme === "dark") {
                        this.graph.findViewByCell(this.key).cell.setProp('html', "w5NodeBright");
                        this.graph.findViewByCell(this.key).cell.setProp('html', "w5NodeDark");
                    }
                }
            });
        },
        onUpdateAudit(e) {
            e.preventDefault();

            this.form_audit.validateFields((err, values) => {
                if (!err) {
                    var action_name = "";

                    this.controller_data[this.key] = values;

                    this.onSave();
                    this.onCloseAudit();

                    this.user_list.forEach(user => {
                        if (String(values.text) === String(user.id)) action_name = user.nick_name;
                    });

                    this.graph.findViewByCell(this.key).cell.updateData({
                        name: values.node_name,
                        action: action_name
                    });

                    if (this.curr_theme === "bright") {
                        this.graph.findViewByCell(this.key).cell.setProp('html', "w5NodeDark");
                        this.graph.findViewByCell(this.key).cell.setProp('html', "w5NodeBright");
                    } else if (this.curr_theme === "dark") {
                        this.graph.findViewByCell(this.key).cell.setProp('html', "w5NodeBright");
                        this.graph.findViewByCell(this.key).cell.setProp('html', "w5NodeDark");
                    }
                }
            });
        },
        onSaveNote(id) {
            var evt = window.event;
            var text = evt.fromElement.innerHTML;

            this.graph.findViewByCell(id).cell.updateData({
                text: text
            });

            this.onSave();
        },
        onDelNote(id) {
            this.graph.removeNode(id);

            this.onSave();
        },
        // 长链接
        initWebSocket() {
            var wsuri = this.BaseURL.replace("http", "ws").replace("https", "wss") + "/echo";
            this.websock = new WebSocket(wsuri);
            this.websock.onopen = this.websocketOpen;
            this.websock.onerror = this.websocketError;
            this.websock.onmessage = this.websocketMSG;
            this.websock.onclose = this.websocketClose;
        },
        websocketPing() {
            this.ping_timetimer = setInterval(() => {

                let msg = JSON.stringify({
                    "method": "ping"
                })

                this.sendMSG(msg);
            }, 30000);
        },
        websocketOpen() {
            this.websocketPing();

            let msg = JSON.stringify({
                "method": "ping"
            })

            this.sendMSG(msg);
        },
        websocketError() {
            this.initWebSocket();
        },
        websocketMSG(e) {
            var result = JSON.parse(e.data);

            if (result.method == "execute_log") {
                var data = result.data;
                if (data.app_name == "结束" || data.app_name == "") {
                    this.run_spinning = false;
                    this.run_progress = 100;
                    this.report_no = data.only_id
                    this.report_create_time = data.create_time
                    this.is_btn_pdf = true;
                } else {
                    this.run_progress += this.pro_count;
                }
                this.execute_log.push(data);
            } else {
                this.$message.destroy();
                this.$message.error("长连接未知错误");
            }
        },
        websocketClose(e) {
            console.log("已经关闭了长连接");
        },
        sendMSG(data) {
            this.websock.send(data);
        },
        onFilterOption(input, option) {
            return (
                option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
        },
        // 局部变量
        onCloseLoclVarAdd() {
            this.visible_local_var_add = false;
        },
        onCloseLoclVarEdit() {
            this.visible_local_var_edit = false;
        },
        onCloseLoclWorkFlow() {
            this.visible_workflow_edit = false;
        },
        onCloseVar() {
            this.visible_var_list = false;
        },
        delLocalVar(key) {
            for (let index in this.local_var_data) {
                if (this.local_var_data[index].key === key) {
                    this.local_var_data.splice(index, 1);
                }
            }

            this.onSave();
        },
        onOpenLoclVarAdd() {
            this.curr_local_value = "";
            this.curr_local_key = "";
            this.curr_local_remarks = "";
            this.visible_local_var_add = true;
        },
        onOpenLoclVarEdit(key, value, remarks) {
            this.curr_local_value = value;
            this.curr_local_key = key;
            this.curr_local_remarks = remarks;
            this.visible_local_var_edit = true;
        },
        // 局部变量
        onSaveLocalVar() {
            for (let index in this.local_var_data) {
                if (this.local_var_data[index].key == this.curr_local_key) {
                    this.$error({
                        title: '错误',
                        content: 'KEY 已经存在 ！',
                    });
                    return false;
                }
            }

            if (this.curr_local_key.trim() == "") {
                this.$warning({
                    title: '错误',
                    content: 'KEY 不能为空 ！',
                });
                return false;
            }

            if (this.curr_local_value.trim() == "") {
                this.$warning({
                    title: '错误',
                    content: 'Value 不能为空 ！',
                });
                return false;
            }

            this.local_var_data.push({
                "key": this.curr_local_key,
                "value": this.curr_local_value,
                "remarks": this.curr_local_remarks
            })

            this.onSave();
            this.visible_local_var_add = false;
        },
        onUpdateLocalVar() {
            if (this.curr_local_value.trim() == "") {
                this.$warning({
                    title: '错误',
                    content: 'Value 不能为空 ！',
                });
                return false;
            }

            for (let index in this.local_var_data) {
                if (this.local_var_data[index].key == this.curr_local_key) {
                    this.local_var_data[index]["value"] = this.curr_local_value;
                    this.local_var_data[index]["remarks"] = this.curr_local_remarks;
                }
            }

            this.onSave();
            this.visible_local_var_edit = false;
        },
        // 用户输入控制器
        onSaveInputEdit() {
            if (this.input_text.trim() == "") {
                this.$warning({
                    title: '错误',
                    content: '内容不能为空 ！',
                });
                return false;
            }

            this.controller_data[this.input_app] = {
                "text": this.input_text
            };

            this.visible_input_app_edit = false;
            this.onRun();
        },
        onCloseInputEdit() {
            this.execuLoading = false;
            this.visible_input_app_edit = false;
        },
        // 修改剧本信息
        onUpdatelWorkFlow() {
            if (this.de_workflow_name.trim() == "") {
                this.$warning({
                    title: '错误',
                    content: '剧本名称不能为空 ！',
                });
                return false;
            }

            this.select_type = this.de_select_type;
            this.workflow_name = this.de_workflow_name;
            this.work_remarks = this.de_work_remarks;

            this.onSave();
            this.visible_workflow_edit = false;
        },
        onShowUpdaeWorkFlow() {
            this.de_select_type = this.select_type;
            this.de_workflow_name = this.workflow_name;
            this.de_work_remarks = this.work_remarks;
            this.visible_workflow_edit = true;
        },
        // 切换定时器类型
        onChangTimeType(e) {
            if (e.target.value == "interval") {
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.form_timer.setFieldsValue({
                            "interval_type": "seconds",
                            "jitter": 0
                        });
                    }, 100)
                })

            } else if (e.target.value == "cron") {
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.form_timer.setFieldsValue({
                            "jitter": 0
                        });
                    }, 100)
                })

            }
        },
        // 导出 PDF 报告
        onReportLog(only_id) {
            this.$http
                .post("/api/v1/w5/get/report/log", {
                    only_id: only_id,
                })
                .then((res) => {
                    if (res.code == 0) {
                        this.report_log_data = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        onShowReport() {
            this.onReportLog(this.report_no);
            this.visible_report = true;
        },
        onSaveReport() {
            var title = this.workflow_name + "-" + this.report_no
            html2Canvas(document.querySelector('#report'), {
                allowTaint: true,
                useCORS: true
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
        // 导出剧本JSON
        onDown() {
            let that = this;
            that.onToPng(function (dataImgBase64) {
                var file_name;

                if (that.work_remarks.trim() == "") {
                    file_name = that.workflow_name;
                } else {
                    file_name = that.workflow_name + "-" + that.work_remarks;
                }

                let content = {
                    name: that.workflow_name,
                    remarks: that.work_remarks,
                    start_app: that.start_app,
                    end_app: that.end_app,
                    input_app: that.input_app,
                    webhook_app: that.webhook_app,
                    timer_app: that.timer_app,
                    for_list: that.for_list,
                    if_list: that.if_list,
                    audit_list: that.audit_list,
                    flow_json: that.data,
                    flow_data: that.app_data,
                    local_var_data: that.local_var_data,
                    controller_data: that.controller_data,
                    grid_type: that.grid_type,
                    edge_marker: that.edge_marker,
                    edge_color: that.edge_color,
                    edge_connector: that.edge_connector,
                    edge_router: that.edge_router,
                    thumbnail: dataImgBase64
                }

                let ele = document.createElement('a');
                ele.download = file_name + ".json";
                ele.style.display = 'none';
                let blob = new Blob([JSON.stringify(content)], {
                    type: 'application/json'
                })
                ele.href = URL.createObjectURL(blob);
                document.body.appendChild(ele);
                ele.click();
                document.body.removeChild(ele);
            });
        },
        onToPng(callback) {
            this.graph.toPNG((dataUri) => {
                // console.log(dataUri);
                // DataUri.downloadDataUri(dataUri, 'chart.png')
                callback(dataUri);
            }, {
                copyStyles: false,
                stylesheet: `
                    .x6-graph-svg-viewport{
                        font-size: 13px;
                    }
                    .nodeImg {
                        margin-top: 9px;
                    }
                    body{
                        margin: 0px;
                    }
                    .w5Icon{
                        max-width: 68px;
                        max-height: 68px;
                    }
                `,
                padding: {
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                },
                quality: 1,
                backgroundColor: this.grid_background
            })
        },
        // 左侧 APP 列表，开关事件
        onSwitchLeft() {
            if (this.switchLeft == "open") {
                document.querySelector(".left_div").style.display = "none";
                document.querySelector(".left_right").style.marginLeft = "0px";
                document.querySelector(".subtitle").style.marginLeft = "0px";

                this.switchLeft = "close";
            } else if (this.switchLeft == "close") {
                document.querySelector(".left_div").style.display = "block";
                document.querySelector(".left_right").style.marginLeft = "320px";
                document.querySelector(".subtitle").style.marginLeft = "320px";

                this.switchLeft = "open";
            }

            let width = document.body.offsetWidth - 50;
            let height = document.body.offsetHeight;
            this.graph.resize(width, height)
        },
        // APP MD 文档
        onShowMd() {
            let app_info = this.app_data[this.key];

            let md_url = "/app/" + app_info["app_dir"] + "/readme.md?t=" + new Date().getTime();

            this.$http
                .get(md_url)
                .then((res) => {
                    this.app_title = app_info["name"] + " v" + app_info["version"] + " - " + app_info["description"];

                    marked.setOptions({
                        gfm: true,
                        tables: true,
                        breaks: true,
                        smartLists: true
                    });

                    this.html = marked(res);
                    this.visible_md = true;
                });
        },
        // Cron 表达式说明
        onShowMdCron() {
            this.app_title = "Cron 表达式说明"

            marked.setOptions({
                gfm: true,
                tables: true,
                breaks: true,
                smartLists: true
            });

            let res = `
> W5 S0AR Cron 表达式重新设计，和 Linux 系统的 Crontab 规则不一致

## Cron 表达式

> 长度为 5 位

- (第1位) 分 (范围0-59) 
- (第2位) 时 (范围0-23) 
- (第3位) 日 (范围1-31) 
- (第4位) 月 (范围1-12)
- (第5位) 星期几 (范围0-6)

## 列如

- **每分钟执行：** \`\* \* \* \* \*\` or \`1 \* \* \* \*\`
- **每天早上10点执行：** \`00 10 \* \* \*\`
- **每月1号早上10点执行：** \`00 10 1 \* \*\`
- **每年5月早上10点执行：** \`00 10 \* 5 \*\`
- **每周星期六下午13点30分执行：** \`30 13 * * 5\`
- **每周工作日晚上23点59分执行：** \`59 23 * * 0-5\`
- **每天10点开始1小时执行一次：** \`* 10/1 * * 0-5\`
            `

            this.html = marked(res);
            this.visible_md = true;
        },
        onCloseMd() {
            this.visible_md = false;
        },
        // 保存剧本信息
        onSelect(value) {
            this.select_type = value;
            this.onSave();
        },
        onSelectType() {
            this.$http
                .post("/api/v1/w5/get/type/list", {
                    type: 1,
                })
                .then((res) => {
                    if (res.code == 0) {
                        this.type_data = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        onGetPlacement() {
            this.$http
                .post("/api/v1/w5/get/system/placement")
                .then((res) => {
                    if (res.code == 0) {
                        this.logDivPlacement = res.data.placement;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        },
        onUserList() {
            this.$http
                .post("/api/v1/w5/get/user/simple_list")
                .then((res) => {
                    if (res.code == 0) {
                        this.user_list = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
        }
    },
    watch: {
        '$store.getters.getTheme': function (e) {
            this.curr_theme = this.$store.getters.getTheme;
            this.onLoadConfig();
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

.leftx {
    height: 100%;
    text-align: center;

    .kzq {
        padding: 10px 0px 0px 0px;

        .ant-col {
            margin-bottom: 18px;
        }
    }

    .appList {
        padding: 10px 0px 0px 0px;
        overflow-y: auto;

        .ant-col {
            margin-bottom: 18px;
        }
    }

    .appList::-webkit-scrollbar {
        display: none
    }
}

.edit {
    width: 100%;

    #container {
        height: 100%;
        width: 100vw;
    }

    .btn_run {
        position: absolute;
        bottom: 9px;
        cursor: pointer;
        margin-left: 20px;
    }
}

/deep/ .ant-row-flex {
    -ms-flex-flow: initial;
    flex-flow: initial;
    height: 100%;
}

.visible_log {
    /deep/.ant-drawer-body {
        background: #202020;
        color: #dfdfdf;
        height: 100%;
    }

    /deep/.ant-drawer-content {
        background-color: #373842;
    }

    .appname {
        font-weight: bold;
    }

    .appresult {
        color: #e95656;
    }

    .time {
        color: #c9c9c9;
    }

    .heng {
        color: #878787;
    }

    /deep/.ant-progress-text {
        color: #ababab;
    }
}

.visible_log.ant-drawer-top {
    /deep/ .ant-progress-line {
        width: 95%;
        font-size: 14px;
        color: #fff;
        margin-left: 20px;
    }
}

.visible_log.ant-drawer-bottom {
    /deep/ .ant-progress-line {
        width: 95%;
        font-size: 14px;
        color: #fff;
        margin-left: 20px;
    }
}

.visible_log.ant-drawer-right {
    /deep/ .ant-progress-line {
        width: 90%;
        font-size: 14px;
        color: #fff;
        margin-left: 20px;
    }
}

.visible_log.ant-drawer-left {
    /deep/ .ant-progress-line {
        width: 90%;
        font-size: 14px;
        color: #fff;
        margin-left: 20px;
    }
}

.timer_css {
    /deep/.ant-radio-group {
        width: 100%;

        /deep/.ant-radio-button-wrapper {
            width: 33.33333333333333333%;
            text-align: center;
        }
    }
}

.uuidcss {
    font-weight: bold;
    // background: #3e5d79;
    // color: #fff;
    // padding-left: 7px;
    // padding-right: 7px;
    // border-radius: 5px;
    // padding-bottom: 1px;
}

.pointer {
    cursor: pointer;
}

.center {
    text-align: center;
}

.bright {

    .leftx {
        background: #f9f9f9;
        color: #000;

        /deep/ .ant-list-empty-text {
            margin-top: 50px;
        }

        .tools_div {
            width: 100%;
            font-size: 12px;

            .avatar_img {
                border-radius: 18px;
                width: 55px;
                height: 55px;
                border: 1px solid #d5d5d5;
                padding: 10px;
                background: #fff;

                img {
                    border-radius: 100%;
                }
            }

            .tools_name {
                margin-top: 5px;
            }
        }

        .hr {
            border-bottom: 1px solid #d5d5d5;
            width: 90%;
            margin: auto;
            margin-bottom: 5px;
        }

        .btnNote {
            width: 90%;
            color: #363636;
            background-color: #fff;
            border-color: #979797;
            margin-bottom: 10px;
            font-size: 13px;
            font-weight: 300;
        }
    }

    .work_title {
        width: 200px;
        background: #0000;
        border-top: 0;
        border-left: 0;
        border-right: 0;
        color: #27292e;
        text-align: center;
        border-radius: 0px;
        margin-left: 133px;
        position: absolute;
    }

    .work_remarks {
        width: 300px;
        background: #0000;
        border-top: 0;
        border-left: 0;
        border-right: 0;
        color: #27292e;
        text-align: center;
        border-radius: 0px;
        margin-left: 337px;
        position: absolute;
    }

    .align {
        vertical-align: middle;
        position: absolute;
        margin-left: 10px;

        /deep/.ant-select-selection {
            display: block;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            background-color: initial;
            border-top: 0;
            border-left: 0;
            border-right: 0;
            border-top-width: 1.02px;
            border-radius: 4px;
            outline: none;
            -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
            transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            color: #27292e;
            border-radius: 0px;

            .ant-select-arrow {
                color: #b5b0b0;
            }
        }

        /deep/.ant-select-selection:focus {
            border-right-width: 1px !important;
            outline: 0;
            -webkit-box-shadow: 0 0 black;
            box-shadow: 0 0 black;
        }

        /deep/.ant-select-selection:active {
            border-right-width: 1px !important;
            outline: 0;
            -webkit-box-shadow: 0 0 black;
            box-shadow: 0 0 black;
        }
    }

    .work_title:focus {
        border-right-width: 1px !important;
        outline: 0;
        -webkit-box-shadow: 0 0 black;
        box-shadow: 0 0 black;
    }

    .work_remarks:focus {
        border-right-width: 1px !important;
        outline: 0;
        -webkit-box-shadow: 0 0 black;
        box-shadow: 0 0 black;
    }

    .left_right {
        width: 24px;
        position: absolute;
        top: 50%;
        background: #bf423e;
        text-align: center;
        z-index: 999;
        margin-left: 320px;
        color: #fff;
        line-height: 50px;
        cursor: pointer;
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
        margin-top: -20px;
    }

    .local-var-actipn {
        font-size: 12px;
        position: absolute;
        right: 0;
        margin-top: -19px;
        margin-right: 15px;

        .del {
            cursor: pointer;
            color: #fb4040;
        }

        .editx {
            cursor: pointer;
        }
    }

    .btnLcoalVar {
        width: 100%;
    }

    #container {
        /deep/.x6-widget-snapline {
            /deep/ .x6-widget-snapline-horizontal {
                border-bottom: 1px solid #cca4a4;
            }

            /deep/ .x6-widget-snapline-vertical {
                border-right: 1px solid #cca4a4;
            }
        }
    }

    .toolbar {
        position: absolute;
        bottom: 0px;
        z-index: 999;
        margin-bottom: 10px;
        left: 50%;
        margin-left: -240px;

        .tools {
            background: #fff;
            width: 455px;
            height: 44px;
            line-height: 44px;
            margin: auto;
            border-radius: 10px;
            border: 1px solid #d1d1d1;
            -moz-user-select: none;
            -webkit-user-select: none;
            -ms-user-select: none;
            -khtml-user-select: none;
            user-select: none;

            .iconx {
                color: #666;
                font-weight: bold;
                font-size: 20px;
                vertical-align: sub;
                cursor: pointer;
            }

            .w5divider {
                background: #6a6a6a;
            }

            .btn {
                float: left;
            }

            .run {
                margin-top: -1px;
                background: #bf423d;
                text-align: center;
                line-height: 52px;
                width: 48px;
                height: 44px;
                float: left;
                margin-left: -2px;
                border-top-left-radius: 10px;
                border-bottom-left-radius: 10px;

                .iconx {
                    color: #fff;
                    font-size: 30px;
                }
            }
        }
    }

    #minimapContainer {
        position: fixed;
        bottom: 10px;
        right: 10px;
        z-index: 999;

        /deep/ .x6-widget-minimap {
            background-color: #00000024;
            border-radius: 10px;
        }

        /deep/ .x6-widget-minimap-viewport {
            border: 2px solid #c63835;
        }

        /deep/ .x6-widget-minimap-viewport-zoom {
            background-color: #fff;
            border: 2px solid #c63835;
        }

        /deep/.x6-widget-minimap .x6-graph {
            box-shadow: inherit;
        }
    }

    .left_div {
        position: absolute;
        width: 320px;
        z-index: 999;
    }

    .subtitle {
        margin-left: 320px;
    }

    .workflow_name {
        pointer-events: auto;
        pointer-events: auto;
        font-size: 24px;
        font-weight: bold;
        color: #202020;
        vertical-align: sub;
    }

    .work_remarksx {
        pointer-events: auto;
        color: #4e4e4e;
        vertical-align: sub;
        font-size: 13px;
        margin-left: 10px;
    }
}

.dark {

    .leftx {
        background: #242424;
        color: #fff;

        /deep/ .ant-list-empty-text {
            margin-top: 50px;
        }

        .tools_div {
            width: 100%;
            font-size: 12px;
            color: #fff;

            .avatar_img {
                border-radius: 18px;
                width: 55px;
                height: 55px;
                border: 1px solid #dddddd;
                padding: 10px;
                background: #fff;

                /deep/ img {
                    border-radius: 100%;
                }
            }

            .tools_name {
                margin-top: 5px;
            }
        }

        .hr {
            border-bottom: 1px solid #3a3a3a;
            width: 90%;
            margin: auto;
            margin-bottom: 5px;
        }

        .btnNote {
            width: 90%;
            color: #fff;
            background-color: #242424;
            border-color: #999;
            margin-bottom: 10px;
            font-size: 13px;
            font-weight: 300;
        }

    }

    .work_title {
        width: 200px;
        background: #0000;
        border-top: 0;
        border-left: 0;
        border-right: 0;
        color: #b4b4b6;
        text-align: center;
        border-radius: 0px;
        margin-left: 133px;
        position: absolute;
    }

    .work_remarks {
        width: 300px;
        background: #0000;
        border-top: 0;
        border-left: 0;
        border-right: 0;
        color: #b4b4b6;
        text-align: center;
        border-radius: 0px;
        margin-left: 337px;
        position: absolute;
    }

    .align {
        vertical-align: middle;
        position: absolute;
        margin-left: 10px;

        /deep/.ant-select-selection {
            display: block;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            background-color: initial;
            border-top: 0;
            border-left: 0;
            border-right: 0;
            border-top-width: 1.02px;
            border-radius: 4px;
            outline: none;
            -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
            transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            color: #b4b4b6;
            border-radius: 0px;

            .ant-select-arrow {
                color: #b5b0b0;
            }
        }

        /deep/.ant-select-selection:focus {
            border-right-width: 1px !important;
            outline: 0;
            -webkit-box-shadow: 0 0 black;
            box-shadow: 0 0 black;
        }

        /deep/.ant-select-selection:active {
            border-right-width: 1px !important;
            outline: 0;
            -webkit-box-shadow: 0 0 black;
            box-shadow: 0 0 black;
        }

    }

    .work_title:focus {
        // border-color: #c99562;
        border-right-width: 1px !important;
        outline: 0;
        -webkit-box-shadow: 0 0 black;
        box-shadow: 0 0 black;
    }

    .work_remarks:focus {
        border-right-width: 1px !important;
        outline: 0;
        -webkit-box-shadow: 0 0 black;
        box-shadow: 0 0 black;
    }

    .left_right {
        width: 24px;
        position: absolute;
        top: 50%;
        background: #bf423e;
        text-align: center;
        z-index: 999;
        margin-left: 320px;
        color: #fff;
        line-height: 50px;
        cursor: pointer;
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
        margin-top: -20px;
    }

    .local-var-actipn {
        font-size: 12px;
        position: absolute;
        right: 0;
        margin-top: -19px;
        margin-right: 15px;

        .del {
            cursor: pointer;
            color: #fb4040;
        }

        .editx {
            cursor: pointer;
        }
    }

    .btnLcoalVar {
        width: 100%;
    }

    #container {
        /deep/.x6-widget-snapline {
            /deep/ .x6-widget-snapline-horizontal {
                border-bottom: 1px solid #cca4a4;
            }

            /deep/ .x6-widget-snapline-vertical {
                border-right: 1px solid #cca4a4;
            }
        }
    }

    .toolbar {
        position: absolute;
        bottom: 0px;
        z-index: 999;
        margin-bottom: 10px;
        left: 50%;
        margin-left: -240px;

        .tools {
            background: #fff;
            width: 455px;
            height: 44px;
            line-height: 44px;
            margin: auto;
            border-radius: 10px;
            border: 1px solid #d1d1d1;
            -moz-user-select: none;
            -webkit-user-select: none;
            -ms-user-select: none;
            -khtml-user-select: none;
            user-select: none;

            .iconx {
                color: #666;
                font-weight: bold;
                font-size: 20px;
                vertical-align: sub;
                cursor: pointer;
            }

            .w5divider {
                background: #6a6a6a;
            }

            .btn {
                float: left;
            }

            .run {
                margin-top: -1px;
                background: #bf423d;
                text-align: center;
                line-height: 52px;
                width: 48px;
                height: 44px;
                float: left;
                margin-left: -2px;
                border-top-left-radius: 10px;
                border-bottom-left-radius: 10px;

                .iconx {
                    color: #fff;
                    font-size: 30px;
                }
            }
        }
    }

    #minimapContainer {
        position: fixed;
        bottom: 10px;
        right: 10px;
        z-index: 999;

        /deep/ .x6-widget-minimap {
            background-color: #00000054;
            border-radius: 10px;
        }

        /deep/ .x6-widget-minimap-viewport {
            border: 2px solid #c63835;
        }

        /deep/ .x6-widget-minimap-viewport-zoom {
            background-color: #fff;
            border: 2px solid #c63835;
        }

        /deep/.x6-widget-minimap .x6-graph {
            box-shadow: inherit;
        }
    }

    .left_div {
        position: absolute;
        width: 320px;
        z-index: 999;
    }

    .subtitle {
        margin-left: 320px;
    }

    .workflow_name {
        pointer-events: auto;
        pointer-events: auto;
        font-size: 24px;
        font-weight: bold;
        color: #fff;
        vertical-align: sub;
    }

    .work_remarksx {
        pointer-events: auto;
        color: #b9b9b9;
        vertical-align: sub;
        font-size: 13px;
        margin-left: 10px;
    }
}

/deep/ .ant-tabs-nav .ant-tabs-tab {
    margin-right: 0px;
    margin-left: 2px;
    margin-right: 2px;
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

.tabsVarModel {
    /deep/ .ant-modal-header {
        padding: 6px 10px;
        border: 0px;

        .ant-list-item {
            display: block;
        }

        .btnLcoalVar {
            width: 100%;
        }

        .ant-tabs-bar {
            margin: 0 0 5px 0;
        }

        .local-var-actipn {
            font-size: 12px;
            position: absolute;
            right: 0;
            margin-top: -26px;
            margin-right: 15px;

            .del {
                cursor: pointer;
                color: #ff0a0a;
            }

            .editx {
                cursor: pointer;
            }
        }

    }

    /deep/ .ant-modal-body {
        display: none;
    }
}

.edit_config {
    .title {
        font-weight: bold;
        font-size: 14px;
        border-bottom: 1px solid #efefef;
        margin-bottom: 5px;
        line-height: 30px;
    }

    .t1 {
        line-height: 45px;
    }
}

/deep/ .ant-page-header-content {
    padding-top: 0px;
}

/deep/ .ant-page-header {
    padding: 5px 24px;
}

.ant-radio-group-solid .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    color: #fff;
    background: #403d3d;
    border-color: #403d3d;
    -webkit-box-shadow: -1px 0 0 0 #403d3d;
    box-shadow: -1px 0 0 0 #403d3d;
}

.ant-radio-button-wrapper:hover {
    position: relative;
    color: #bf423d;
}

/deep/ .ant-progress-status-success .ant-progress-bg {
    background-color: #bf423d;
}

/deep/ .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    z-index: 1;
    color: #bf423d;
    background: #fff;
    border-color: #bf423d;
    -webkit-box-shadow: -1px 0 0 0 #bf423d;
    box-shadow: -1px 0 0 0 #bf423d;
}

/deep/.w5NodeNote::-webkit-scrollbar {
    display: none
}

.log_div {
    width: 100%;
    height: 100%;
}
</style>
