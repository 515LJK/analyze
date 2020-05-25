<template>
    <div class="index" v-loading.body="onOff" ref="index">
        这是测试啦啦啦啦
    </div>
</template>

<script>
import util from 'common/util';

export default {
    data() {
        return {
            onOff: true
        }
    },
    created() {
        setTimeout(()=>{
            this.onOff = false;
        },3000);
    }
}
</script>

<style lang="scss" scoped>
@import url('~element-ui/lib/theme-chalk/index.css');

.index {
    position: relative;
    width: 400px;
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 36px;
    color: #000;
}
</style>