<template>
    <div class="index">
        <div class="wrapper">
            123
        </div>
    </div>
</template>

<script>
export default {
    props: {
        name: {
            type: String,
            default: ''
        }
    },
    inject: {
        'test': {
            default: '123'
        }
    },
    data() {
        return {
        }
    }
}
</script>

<style lang="scss" scoped>
@import url('~element-ui/lib/theme-chalk/index.css');

* {
    box-sizing: border-box;
}
.wrapper {
    position: relative;
    width: 200px;
    height: 400px;
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