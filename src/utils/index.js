export function createRandom(num, from, to) {
    var arr = [];
    var json = {};
    while (arr.length < num) {
        //产生单个随机数
        var ranNum = Math.ceil(Math.random() * (to - from)) + from;
        //通过判断json对象的索引值是否存在 来标记 是否重复
        if (!json[ranNum]) {
            json[ranNum] = 1;
            arr.push(ranNum);
        }
    }
    return arr;
}

export function resetExam(arr, key) {
    if (Array.isArray(arr)) {
        arr.forEach((el) => {
            el[key] = false;
        });
    } else throw new Error('Please use a Array!!');
}
