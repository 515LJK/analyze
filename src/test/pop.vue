<template>
    <div class="pop" :style="maskColor" v-show="popShow">
        <transition name="resize" v-on:before-enter="beforeEnter" v-on:after-leave="afterLeave">
            <div class="content" @click.stop v-show="isShow">
                <slot>
                    <div class="message" v-if="type === 0">{{message}}</div>
                    <div class="message" v-else v-html="message"></div>
                </slot>
            </div>
        </transition>
    </div>
</template>

<script>
import util from 'common/util';
import router from 'common/router';

export default {
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        type: {
            type: Number,
            default: 0
        },
        message: {
            type: String,
            default: '',
        },
        opacity: {
            type: Number,
            default: .6
        },
        btnText: {
            type: String,
            default: '好的'
        },
        btnFn: {
            type: Function
        },
        noMask: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            popShow: false
        }
    },
    computed: {
        maskColor() {
            let {opacity, noMask} = this;
            if ( noMask ) {
                opacity = 0;
            };
            return { 'backgroundColor': `rgba(0, 0, 0, ${opacity})` };
        }
    },
    methods: {
        beforeEnter() {
            this.popShow = true;
        },
        afterLeave() {
            this.popShow = false;
        },
        link(href = '/') {
            router.push(href);
            this.popClose();
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~scss/vue";

.pop {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.resize-enter-active, .resize-leave-active{
    transition: .3s;
}

.resize-enter, .resize-leave-to {
    transform: scale(0);
}

.message {
    min-width: 180px;
    height: 80px;
    padding: 0 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 28px;
    color: #fff;
    border-radius: 16px;
    background: rgba(0, 0, 0, .6);
}
</style>