<template>
    <div class="index" ref="index">
        <v-image class="avatar" :src="'https://picsum.photos/536/354'"></v-image>
    </div>
</template>

<script>
import {isScroll} from 'common/util';

export default {
    data() {
        return {
            onOff: true
        }
    },
    mounted() {
        
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
    overflow: auto;
}

.avatar {
    width: 300px;
    height: 200px;
}
</style>