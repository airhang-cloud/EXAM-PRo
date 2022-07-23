<template>
    <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        name="basic"
        autocomplete="off"
        @finish="onFinish"
        @validate="handleValidate"
        @finishFailed="onFinishFailed"
    >
        <!-- 表单配置后续抽离 -->
        <a-row>
            <a-col
                :xs="24"
                :sm="24"
                :md="24"
                :lg="24"
                :xl="24"
                v-for="el in fromConfig"
                :key="el.key"
            >
                <a-form-item :label="el.label" :name="el.key">
                    <a-input-number
                        v-if="el.type === 'NUM_INPUT'"
                        v-model:value="formState[el.key]"
                        style="width: 100%;"
                        :min="el.min"
                        :max="el.max"
                        :precision="0"
                        :defaultValue="el.min"
                        :placeholder="el.placeholder"
                        @change="el.way"
                        :step="1"
                    />
                    <a-input
                        v-if="el.type === 'INPUT'"
                        v-model:value="formState[el.key]"
                        style="width: 100%;"
                        :defaultValue="el.min"
                        :placeholder="el.placeholder"
                    >
                        <template #addonAfter>
                            <a-button style="width: 80px;">生成数据</a-button>
                        </template>
                    </a-input>
                    <a-select
                        v-if="el.type === 'SELECT'"
                        v-model:value="formState[el.key]"
                        show-search
                        placeholder="Select a person"
                        style="width: 100%;"
                        :options="el.options"
                        :filter-option="filterOption"
                    />
                    <a-radio-group
                        v-if="el.type === 'RADIO_CHECK'"
                        size="small"
                        v-model:value="formState[el.key]"
                        button-style="outline"
                    >
                        <a-radio-button value="1">是</a-radio-button>
                        <a-radio-button value="0">否</a-radio-button>
                    </a-radio-group>
                    <UploadExcel
                        v-if="el.type === 'UPLOAD'"
                        @ImportExcel="handlerExcelJson"
                    />
                    <a-slider
                        v-if="el.type === 'SlIDER_PRO'"
                        v-model:value="formState[el.key]"
                        :min="el.min"
                        :max="el.max"
                    />
                </a-form-item>
            </a-col>
        </a-row>
        <a-button type="primary" html-type="submit" block>
            开始抽签
        </a-button>
    </a-form>
</template>
<script>
import { defineComponent, reactive, ref } from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import UploadExcel from '../UploadExcel/index.vue';
import { emmiter } from '../../EventBus';
export default defineComponent({
    name: 'ExamMain',
    components: { UploadOutlined, UploadExcel },
    setup(props, ctx) {
        const formRef = ref();
        const formState = reactive({
            joinNum: 2,
            type: 'normal',
            outNum: 1,
            isRemoval: '1',
            keyWord: 'id',
            timDelay: 5
        });
        const validatorOne = async (_rule, value) => {
            if (!value) return Promise.reject('请填写参与人数');
        };
        const validatorTwo = async (_rule, value) => {
            if (!value) return Promise.reject('请填写抽签人数');
            if (Number(value) > formState.joinNum)
                return Promise.reject('目标人数不应大于参与人数');
        };
        const handlerExcelJson = (value) => {
            console.log('解析的数据', value);
        };
        const onSearch = (val) => {};

        const rules = {
            joinNum: [
                {
                    required: true,
                    validator: validatorOne,
                    trigger: ['change', 'blur']
                }
            ],
            type: [
                {
                    required: true,
                    trigger: 'change'
                }
            ],
            outNum: [
                {
                    required: true,
                    validator: validatorTwo,
                    trigger: 'change'
                }
            ],
            keyWord: [
                {
                    trigger: 'change'
                }
            ]
        };
        const handleChange = (val) => {
            if (Number(val) < 2) {
                val = 2;
            } else if (Number(val) > 1000) {
                val = 1000;
            }
            emmiter.emit('joinChange', { joinNum: val });
        };
        const handleTargetChange = (val) => {
            if (formState.joinNum < Number(val)) {
                console.log('目标人数 应不超过 参与人数');
            }
        };
        const fileList = reactive([]);
        // 表单配置
        const fromConfig = reactive([
            {
                label: '抽签类型',
                key: 'type',
                rules: [{ required: true, message: '请先选择抽签类型' }],
                type: 'SELECT',
                options: [
                    {
                        value: 'normal',
                        label: '座号抽签'
                    },
                    {
                        value: 'name',
                        label: '名字抽签'
                    }
                ]
            },
            {
                label: '参与人数',
                key: 'joinNum',
                rules: [{ required: true, message: '请先填写参与人数' }],
                type: 'NUM_INPUT',
                options: [],
                min: 2,
                max: 1000,
                placeholder: '填写参与人数',
                way: handleChange
            },
            {
                label: '目标人数',
                key: 'outNum',
                rules: [{ required: true, message: '请先填写要选出多少人' }],
                type: 'NUM_INPUT',
                options: [],
                min: 1,
                max: 1000,
                placeholder: '填写要选出多少人',
                way: handleTargetChange
            },
            {
                label: '关闭记忆模式',
                key: 'isRemoval',
                rules: [],
                type: 'RADIO_CHECK',
                options: [],
                min: 1,
                max: 10000
            },
            {
                label: '导入花名册',
                key: '',
                rules: [],
                type: 'UPLOAD',
                options: []
            },
            {
                label: '关键词',
                key: 'keyWord',
                rules: [
                    { required: true, message: '请填写将依据哪个字段进行抽签' }
                ],
                type: 'INPUT',
                placeholder: '填写关键字段',
                options: [],
                component: [
                    {
                        type: 'BUTTON',
                        label: '生成数据',
                        desc: '关键字段+上传键都填入时候才可点击'
                    }
                ]
            },
            {
                label: '时长(单位:秒)',
                key: 'timDelay',
                rules: [{ required: true, message: '请选择抽签时长' }],
                type: 'SlIDER_PRO',
                options: [],
                min: 1,
                max: 25
            }
        ]);
        const onFinish = (values) => {
            emmiter.emit('propStart', { jsonConfig: formState });
        };
        const handleValidate = (...args) => {
            console.log(args);
        };
        // 子组件通知父组件/爷爷组件
        const onFinishFailed = (errorInfo) => {
            console.log('Failed:', errorInfo);
        };

        const filterOption = (input, option) => {
            return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        };
        return {
            formState,
            fromConfig,
            onFinish,
            onFinishFailed,
            handleValidate,
            filterOption,
            handleChange,
            handlerExcelJson,
            onSearch,
            fileList,
            headers: {
                authorization: 'authorization-text'
            },
            rules
        };
    }
});
</script>
