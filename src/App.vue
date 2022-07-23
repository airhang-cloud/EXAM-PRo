<template>
    <a-layout class="flu-box">
        <a-layout-sider
            breakpoint="lg"
            theme="light"
            width="299"
            collapsed-width="0"
            @collapse="onCollapse"
            @breakpoint="onBreakpoint"
        >
            <Tabbar />
        </a-layout-sider>
        <a-layout>
            <a-layout-content :style="{ margin: '24px 16px 0' }">
                <a-spin tip="抽签中..." :spinning="flag">
                    <div
                        :style="{
                            padding: '24px',
                            background: '#fff',
                            minHeight: '480px'
                        }"
                    >
                        <a-tag
                            :color="el.flag ? '#108ee9' : 'orange'"
                            style="margin: 6px;"
                            v-for="el in getConfig.x"
                            :key="el"
                            >{{ el.label }}</a-tag
                        >
                        <a-statistic-countdown
                            title="Million Seconds"
                            :value="deadline"
                            format="HH:mm:ss:SSS"
                            style="margin-right: 50px;"
                            @finish="onFinish"
                            @change="changeTime"
                        />
                    </div>
                </a-spin>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>
<script>
import {
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined
} from '@ant-design/icons-vue';
import Tabbar from './components/Tabbar.vue';
import { defineComponent, reactive, ref } from 'vue';
import { emmiter } from './EventBus';
import { createRandom, resetExam } from './utils/index.js';
export default defineComponent({
    components: {
        UserOutlined,
        VideoCameraOutlined,
        UploadOutlined,
        Tabbar
    },

    setup() {
        emmiter.on('propStart', (res) => {
            const { outNum, timDelay, joinNum } = res.jsonConfig;
            console.log('ddd', res);
            deadline.value = Date.now() + 1000 * timDelay;
            getConfig.outNum = outNum;
            getConfig.joinNum = joinNum;
        });
        emmiter.on('joinChange', (res) => {
            let RRE = [];
            for (let i = 0; i < res.joinNum; i++) {
                RRE[i] = {
                    label: i + 1,
                    flag: false
                };
            }
            getConfig.x = RRE;
        });
        const onCollapse = (collapsed, type) => {
            console.log(collapsed, type);
        };
        let flag = ref(false);
        // 抽签配置部分
        let getConfig = reactive({
            x: [
                { label: 1, flag: false },
                { label: 2, flag: false }
            ],
            outNum: 1,
            joinNum: 2
        });
        // 随机抽签得出的数组
        let outJoin = ref([]);
        // 抽签倒计时时间
        let deadline = ref(0);
        const onBreakpoint = (broken) => {
            console.log(broken);
        };
        const onFinish = () => {
            console.log('finished!', outJoin.value);
            resetExam(getConfig.x, 'flag');
            outJoin.value.forEach((el) => {
                getConfig.x[el - 1].flag = true;
            });
        };
        const changeTime = (val) => {
            let idx = Math.floor(Math.random(0, 1) * getConfig.x.length);
            let outArr = [];
            outArr = createRandom(getConfig.outNum, 0, getConfig.joinNum);
            resetExam(getConfig.x, 'flag');
            getConfig.x[idx].flag = true;
            outJoin.value = outArr;
            // console.log('xx', idx);
        };

        return {
            onCollapse,
            onBreakpoint,
            getConfig,
            flag,
            deadline,
            onFinish,
            changeTime
        };
    }
});
</script>
<style>
#components-layout-demo-responsive .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
}

.site-layout-sub-header-background {
    background: #fff;
}

.site-layout-background {
    background: #fff;
}

[data-theme='dark'] .site-layout-sub-header-background {
    background: #141414;
}
</style>
