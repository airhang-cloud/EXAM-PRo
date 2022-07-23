<template>
    <div class="card-container">
        <a-tabs v-model:activeKey="activeKey" type="card" size="large">
            <a-tab-pane key="1" tab="历史记录">
                <ExamOther />
            </a-tab-pane>
            <a-tab-pane key="2" tab="抽签配置">
                <ExamMain />
            </a-tab-pane>
            <a-tab-pane key="3" tab="了解更多">
                <p><bug-outlined /> 在线抽签小工具</p>
                <p>支持一键导入Excel,配置字段抽签</p>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>
<script>
import { defineComponent, ref } from 'vue';
import { BugOutlined } from '@ant-design/icons-vue';
import ExamMain from './ExamMain/index.vue';
import ExamOther from './EXamOther/index.vue';

export default defineComponent({
    name: 'Tabbar',
    setup() {
        return {
            activeKey: ref('2')
        };
    },
    components: { ExamMain, BugOutlined, ExamOther }
});
</script>
<style>
.card-container p {
    margin: 0;
}
.card-container > .ant-tabs-card .ant-tabs-content {
    height: 100%;
    margin-top: -16px;
}
.card-container > .ant-tabs-card .ant-tabs-content > .ant-tabs-tabpane {
    padding: 16px;
    background: #fff;
}
.card-container > .ant-tabs-card > .ant-tabs-nav::before {
    display: none;
}
.card-container > .ant-tabs-card .ant-tabs-tab,
[data-theme='compact'] .card-container > .ant-tabs-card .ant-tabs-tab {
    background: transparent;
    border-color: transparent;
}
.card-container > .ant-tabs-card .ant-tabs-tab-active,
[data-theme='compact'] .card-container > .ant-tabs-card .ant-tabs-tab-active {
    background: #fff;
    border-color: #fff;
}
#components-tabs-demo-card-top .code-box-demo {
    padding: 24px;
    overflow: hidden;
    background: #f5f5f5;
}
[data-theme='compact'] .card-container > .ant-tabs-card .ant-tabs-content {
    height: 120px;
    margin-top: -8px;
}
[data-theme='dark'] .card-container > .ant-tabs-card .ant-tabs-tab {
    background: transparent;
    border-color: transparent;
}
[data-theme='dark'] #components-tabs-demo-card-top .code-box-demo {
    background: #000;
}
[data-theme='dark']
    .card-container
    > .ant-tabs-card
    .ant-tabs-content
    > .ant-tabs-tabpane {
    background: #141414;
}
[data-theme='dark'] .card-container > .ant-tabs-card .ant-tabs-tab-active {
    background: #141414;
    border-color: #141414;
}
</style>
