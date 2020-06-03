<template>
    <div class="index" ref="index" @click="onOff = !onOff">
        这是测试啦啦啦啦
        <div v-loading="onOff"></div>
    </div>
</template>

<script>
import util from 'common/util';

export default {
    data() {
        return {
            onOff: true
        }
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