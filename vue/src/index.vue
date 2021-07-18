<template>
    <div class="index">
        <div class="wrapper">
            {{money}}
        </div>
        <i class="iconfont icon-time"></i>
    </div>
</template>

<script>
export default {
    computed: {
        money() {
            return 12345
        }
    }
}
</script>

<style lang="scss" scoped>
@import url('~element-ui/lib/theme-chalk/index.css');
// @import url('./style/font/iconfont');

* {
    box-sizing: border-box;
}
.wrapper {
    position: relative;
    width: 200px;
    height: 400px;
    color: red;
}
.scroller {
    height: 100%;
}
.item {
    width: 100%;
    height: 100px;
    padding: 20px;
    border-bottom: 1px solid red;
}
</style>