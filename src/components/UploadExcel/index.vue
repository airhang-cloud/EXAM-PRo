<template>
    <a-upload
        v-model:file-list="fileList"
        :multiple="false"
        :showUploadList="false"
        :customRequest="handleChange"
    >
        <a-button>
            <upload-outlined></upload-outlined>
            导入花名册
        </a-button>
    </a-upload>
</template>

<script setup>
import { UploadOutlined } from '@ant-design/icons-vue';
import { ref } from '@vue/reactivity';
import { reactive, defineEmits } from 'vue';
import { read, utils } from 'xlsx';
let msg = ref('xlsx');
let fileList = reactive([]);
const emit = defineEmits(['ImportExcel']);

const handleChange = (info) => {
    readXLSX(info.file).then((res) => {
        emit('ImportExcel', { parase: res });
    });
};

const readXLSX = (file) => {
    let nameSplit = file.name.split('.');
    let format = nameSplit[nameSplit.length - 1];
    if (!['xlsx', 'csv'].includes(format)) {
        return false;
    }
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function (evt) {
            let data = evt.target.result; // 读到的数据
            try {
                var workbook = read(data, { type: 'binary' });
                const wsname = workbook.SheetNames[0]; //取第一张表
                const ws = utils.sheet_to_json(workbook.Sheets[wsname]); //生成json表格内容
                resolve(ws);
            } catch (err) {
                reject('some wrong with import');
            }
        };
    });
};
</script>
