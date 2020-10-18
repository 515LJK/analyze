<template>
    <transition name="fade" @after-leave="afterLeave">
        <div class="mask" v-show="visible" :class="[customClass, {'is-fullscreen': fullscreen}]" :style="{ backgroundColor: background || '' }">
            <div class="wrap">
                <svg class="svg" width="50" height="50">
                    <circle class="circle" cx="25" cy="25" r="20" stroke-linecap="round" fill="transparent"></circle>
                </svg>
                <p class="text" v-show="text">{{text}}</p>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    data() {
        return {
            fullscreen: true,
            visible: false,
            text: '',
            customClass: '',
            background: ''
        }
    },
    methods: {
        afterLeave() {
            this.$emit('after-leave');
        }
    }
}
</script>

<style>
.loading-parent--relative {
    position: relative !important;
}

.loading-parent--lock {
    overflow: hidden !important;
}
</style>

<style lang="scss" scoped>
.mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: hsla(0, 0%, 100%, .9);
    z-index: 999;
    &.is-fullscreen {
        position: fixed;
    }
}

.svg {
   animation: rotate 2s linear infinite;
}

.circle {
    stroke-width: 2px;
    stroke: #409eff;
    stroke-dasharray: 0 125;
    stroke-dashoffset: 0;
    animation: rotate2 2s ease infinite;
}

.text {
    margin: 0;
    padding: 0;
    text-align: center;
    color: #409eff;
    margin: 3px 0;
    font-size: 20px;
}

@keyframes rotate {
    100% {
        transform: rotate(1turn);
    }
}


@keyframes rotate2 {
    0% {
        stroke-dasharray: 0 125;
        stroke-dashoffset: 0;
    }

    50% {
        stroke-dasharray: 157 125;
        stroke-dashoffset: -62;
    }

    100% {
        stroke-dasharray: 157 125;
        stroke-dashoffset: -125;
    }
}

.fade-enter-active, .fade-leave-active {
    transform: opacity .3s;
}

.fade-enter, .fade-leave-to {
    opacity: 0;
}

</style>