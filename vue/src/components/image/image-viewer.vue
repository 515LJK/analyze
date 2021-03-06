<template>
    <div class="wrapper" ref="wrapper" :style="{'z-index': zIndex}">
        <div class="btn close" @click="close">
            <i class="el-icon-circle-close"></i>
        </div>
        <template v-if="!isSingle">
            <div class="btn prev" @click="prev">
                <i class="el-icon-arrow-left"/>
            </div>
            <div class="btn next" @click="next">
                <i class="el-icon-arrow-right"/>
            </div>
        </template>
        <div class="control">
            <i class="el-icon-zoom-out" @click="handelActions('zoomOut')"></i>
            <i class="el-icon-zoom-in" @click="handelActions('zoomIn')"></i>
            <i class="el-image-viewer__actions__divider"></i>
            <i :class="mode.icon" @click="toggleMode"></i>
            <i class="el-image-viewer__actions__divider"></i>
            <i class="el-icon-refresh-left" @click="handelActions('anticlockwise')"></i>
            <i class="el-icon-refresh-right" @click="handelActions('clockwise')"></i>
        </div>
        <div class="image" v-loading="loading" loading-background="rgba(0, 0, 0, 0)">
            <template v-for="(url, i) of urlList">
                <img @load="handleImgSucess" @mousedown="handleMouseDown" :style="imageStyle" ref="img" :key="url" v-if="index === i" :src="currentImg" alt="">
            </template>
        </div>
    </div>
</template>

<script>
// rethrottle，时间节流函数，在浏览器渲染频率(requestAnimationFrame)为间隔时间。
import {on, off, isFixfox, rethrottle} from 'common/util';

const Mode = {      // 显示模式
    CONTAIN: {
        name: 'contain',
        icon: 'el-icon-full-screen'
    },
    ORIGINAL: {
        name: 'original',
        icon: 'el-icon-c-scale-to-original'
    }
}
const mousewheelEventName = isFixfox() ? 'DOMMouseScroll' : 'mousewheel';   // 对fixfox浏览器鼠标滚轮事件做兼容

export default {
    props: {
        urlList: {
            type: Array,
            default: ()=>[]
        },
        zIndex: {
            type: Number,
            default: 2000
        },
        initalIndex: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            index: this.initalIndex,
            mode: Mode.CONTAIN,
            infinite: true,
            loading: true,
            transform: {
                scale: 1,
                deg: 0,
                offsetX: 0,
                offsetY: 0,
                enableTransition: false
            }
        }
    },
    computed: {
        isSingle() {        // 单个图片，没有左右切换
            return this.urlList.length <= 1;
        },
        isFirst() {     // 首张图片
            return this.index === 0;
        },
        isLast() {      // 最后一张图片
            return this.index === this.urlList.length - 1;
        },
        currentImg() {    // 当前图片
            return this.urlList[this.index];
        },
        imageStyle() {      // 设置图片样式
            const {scale, deg, offsetX, offsetY, enableTransition} = this.transform;
            const style = {
                transform: `scale(${scale}) rotate(${deg}deg)`,
                transition: enableTransition ? 'transform .3s' : '',
                'margin-left': `${offsetX}px`,
                'margin-top': `${offsetY}px`,
            }
            if (this.mode === Mode.CONTAIN) {
                style.maxWidth = style.maxHeight = '100%';
            }
            return style;
        }
    },
    mounted() {
        this.deviceSupportInstall();
        this.$refs['wrapper'].focus();
    },
    methods: {
        deviceSupportInstall() {        // 绑定键盘鼠标滑轮事件
            this._keydownHandle = rethrottle(ev=>{
                const keyCode = ev.keyCode;
                switch (keyCode) {
                    case 27:    // ESC键
                        this.close();
                        break;
                    case 32:    // space空格键
                        this.toggleMode();
                        break;
                    case 37:    // 方向←键
                        this.prev();
                        break;
                    case 38:    // 方向↑键
                        this.handelActions('zoomIn');
                        break;
                    case 39:    // 方向→键
                        this.next();
                        break;  
                    case 40:    // 方向↓键
                        this.handelActions('zoomOut');
                        break;
                };
            });
            this._mouseWheelHandle = rethrottle(e=>{
                const delta = e.wheelDelta ? e.wheelDelta : -e.detail;  // wheelDelta 正值为上，负值为下，detail正好相反，因此取反一下作为兼容。
                if (delta > 0) {
                    this.handelActions('zoomIn', {
                        zoomRate: 0.015,
                        enableTransition: false
                    })
                } else {
                    this.handelActions('zoomOut', {
                        zoomRate: 0.015,
                        enableTransition: false
                    })
                }
            });
            on(document, 'keydown', this._keydownHandle);
            on(document, mousewheelEventName, this._mouseWheelHandle);
        },
        deviceSupportUnInstall() {      // 移除鼠标滚轮和键盘事件
            off(document, 'keydown', this._keydownHandle);
            off(document, mousewheelEventName, this._mouseWheelHandle);
            this._keydownHandle = this._mouseWheelHandle = null;
        },
        prev() {    // 上一张图片，如果不是循环则停留在第一张图片。
            let {isFirst, index, urlList, infinite} = this;
            if (isFirst && !infinite) return;
            const len = urlList.length;
            this.index = isFirst ? len - 1 : --index;
        },
        next() {    // 下一张图片，如果不是循环则停留在最后一张图片。
            let {isLast, index, urlList, infinite} = this;
            if (isLast && !infinite) return;
            const len = urlList.length;
            this.index = isLast ? 0 : ++index;
        },
        handelActions(action, options = {}) {   // 操作图片各种行为
            if (this.loading) return;
            const {rotateDeg, zoomRate, enableTransition} = {
                rotateDeg: 90,
                zoomRate: 0.2,
                enableTransition: true,
                ...options
            };
            const {transform} = this;
            switch (action) {
                case 'zoomOut':    // 缩小
                    if (transform.scale > 0.2) {
                        transform.scale = parseFloat((transform.scale - zoomRate).toFixed(3));
                    }
                    break;
                case 'zoomIn':  // 放大
                    transform.scale = parseFloat((transform.scale + zoomRate).toFixed(3));
                    break;
                case 'clockwise':       // 顺时针旋转
                    transform.deg += rotateDeg;
                    break;
                case 'anticlockwise':   // 逆时针旋转
                    transform.deg -= rotateDeg;
                    break;
            }
            transform.enableTransition = enableTransition;      // 是否添加动画过渡效果
        },
        handleMouseDown(e) {        // 鼠标拖拽图片
            if (this.loading || e.button !== 0) return;
            const {offsetX, offsetY} = this.transform;
            const startX = e.pageX;
            const startY = e.pageY;
            this._dragHandle = rethrottle(ev=>{
                this.transform.offsetX = ev.pageX - startX + offsetX;
                this.transform.offsetY = ev.pageY - startY + offsetY;
            });
            on(document, 'mousemove', this._dragHandle);
            on(document, 'mouseup', ()=>{
                off(document, 'mousemove', this._dragHandle);
            });
            e.preventDefault();
        },
        handleImgSucess() {     // 图片加载完成
            this.loading = false;
        },
        close() {   // 关闭预览
            this.deviceSupportUnInstall();
            this.$emit('close');
        },
        reset() {       // 重置图片属性
            this.transform = {
                scale: 1,
                deg: 0,
                offsetX: 0,
                offsetY: 0,
                enableTransition: false
            }
        },
        toggleMode() {      // 切换图片显示模式
            const modeKeys = Object.keys(Mode);
            const modeValues = Object.values(Mode);
            const index = modeValues.indexOf(this.mode);
            const nextIndex = (index + 1) % modeValues.length;
            this.mode = Mode[modeKeys[nextIndex]];
            this.reset();
        }
    },
    watch: {
        index() {
            this.reset();
        },
        currentImg() {
            this.$nextTick(()=>{
                const {img} = this.$refs;
                if (!img[0].complete) {
                    this.loading = true;
                }
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.wrapper {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, .6);
}

.btn {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.image {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}

.control {
    margin-left: -150px;
    position: absolute;
    left: 50%;
    bottom: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 300px;
    height: 44px;
    border-radius: 22px;
    background-color: #606266;
    opacity: .8;
    padding: 0 24px;
    color: #fff;
    font-size: 23px;
}

.prev {
    margin-top: -22px;
    top: 50%;
    left: 40px;
    width: 44px;
    height: 44px;
    font-size: 24px;
    color: #fff;
    background-color: #606266;
    border-color: #fff;
    border-radius: 50%;
}

.next {
    @extend .prev;
    left: auto;
    right: 40px;
}

.close {
    top: 40px;
    right: 40px;
    width: 40px;
    height: 40px;
    font-size: 40px;
}
</style>