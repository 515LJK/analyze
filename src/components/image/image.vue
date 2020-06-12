<template>
    <div class="image">
        <!-- 三种情况，loading中、失败和成功 -->
        <slot name="placeholder" v-if="loading">
            <div class="placeholder"></div>
        </slot>
        <slot name="error" v-else-if="error">
            <div class="error">加载失败</div>
        </slot>
        <!-- 挂载事件$listeners和属性$attrs -->
        <img v-on="$listeners" :style="imageStyle" v-bind="$attrs" v-else :src="src" class="img" alt="">
    </div>
</template>

<script>
import {throttle, isInContainer, getScrollContainer, on, off} from 'common/util';
const isSupportObjectFit = () => document.documentElement.style.objectFit !== undefined;        // 判断是否支持object-fit
const ObjectFit = {     // 常量存储fit的五种属性
    NONE: 'none',
    CONTAIN: 'contain',
    COVER: 'cover',
    FILL: 'fill',
    SCALE_DOWN: 'scale-down'
}

export default {
    inheritAttrs: false,
    props: {
        src: String,
        fit: String,
        scrollContainer: {},
        lazy: {
            type: Boolean,
            default: false
        },
        previewList: {
            type: Array,
            default: () => []
        },
        zIndex: {
            type: Number,
            default: 2000
        }
    },
    data() {
        return {
            loading: true,
            error: false,
            show: !this.lazy,
            imgWidth: null,
            imgHeight: null
        }
    },
    computed: {
        imageStyle() {      // 如果不支出object-fit，通过调整style来模拟相同效果
            const {fit} = this;
            if (!this.$isServer && fit) {
                return isSupportObjectFit() ? {'object-fit': fit} : this.getImageStyle(fit);
            };
            return {};
        }
    },
    mounted() {
        if (this.lazy) {        // 懒加载
            this.$nextTick(()=>{
                this.addLazyLoad();
            });
        } else {            // 直接加载
            this.loadImg();
        }
    },
    methods: {
        getImageStyle() {
            const {imgWidth, imgHeight, fit} = this;
            const {clientWidth: containerWidth, clientHeight: containerHeight} = this.$el;
            if (!imgWidth || !imgHeight || !containerWidth || !containerHeight) return {};
            const vertical = imgWidth / imgHeight < 1;      // 图片的大小，width比height大，证明是横向图片，否则是竖向图片
            if (fit === ObjectFit.SCALE_DOWN) {     // scale_down属性是如果图片宽高大于容器宽高时是contain展示，否则是正常展示
                const smaller = imgWidth < innerWidth && imgHeight < innerHeight;
                fit = smaller ? ObjectFit.NONE : ObjectFit.CONTAIN;
            }

            switch (fit) {
                case ObjectFit.NONE:        // 正常显示
                    return {
                        width: 'auto',
                        height: 'auto'
                    };
                case ObjectFit.CONTAIN: // 横向图片，高度auto，宽度100%，竖向相反
                    return vertical ? {
                        width: 'auto'
                    } : {
                        height: 'auto'
                    };
                case ObjectFit.COVER:   // 横向图片，高度100%，宽度auto，竖向相反
                    return vertical ? {
                        height: 'auto'
                    } : {
                        width: 'auto'
                    };
                default:
                    return {};
            }
        },
        addLazyLoad() {     // 添加懒加载
            if (this.$isServer) return;
            const {scrollContainer} = this;
            let _scrollContainer;
            // 首先获取父级元素容器，如果没有指定则获取最近overflow为auto的父级元素直至body
            if (typeof scrollContainer === 'string') {
                _scrollContainer = document.querySelector(scrollContainer);
            } else if (scrollContainer && scrollContainer.nodeType === Node.ELEMENT_NODE) {
                _scrollContainer = scrollContainer;
            } else {
                _scrollContainer = getScrollContainer(this.$el);
            };
            
            if (_scrollContainer) { 
                this._scrollContainer = _scrollContainer;
                this._handleLazyLoad = throttle(this.handleLazyLoad, 200); // 添加节流函数
                on(_scrollContainer, 'scroll', this._handleLazyLoad);   // 加载函数绑定scroll事件
                this._handleLazyLoad();     // 初始化先执行一次加载函数
            }

        },
        removeLazyLoad() {          // 移除预加载
            const {_scrollContainer, _handleLazyLoad} = this;
            if (this.$isServer || !_scrollContainer || !_handleLazyLoad) return;
            off(_scrollContainer, 'scroll', _handleLazyLoad);       // 解绑scroll事件
            this._scrollContainer = null;
            this._handleLazyLoad = null;
        },
        handleLazyLoad() {      // 判断图片是否加载，isInContainer判断是否在容器可见区内
            if (isInContainer(this.$el, this._scrollContainer)) {
                this.show = true;
                this.removeLazyLoad();
            }
        },
        loadImg() {     // 图片缓存
            if (this.$isServer) return;
            const image = new Image();

            this.loading = true;
            this.error = false;

            image.onload = e => this.handleLoad(e, image);
            image.onerror = this.handleError.bind(this);
            Object.keys(this.$attrs).forEach(attr=>{        // image对象保持和img一样的属性
                const value = this.$attrs[attr];
                image.setAttribute(attr, value);
            });

            image.src = this.src;
        },
        handleLoad(e, img) {        // 缓存函数，图片加载成功后去除loading，记录图片宽高
            this.imgWidth = img.width;
            this.imgHeight = img.height;
            this.loading = false;
        },
        handleError() {     // 加载错误函数
            this.loading = false;
            this.error = true;
            this.$emit('error');
        }
    },
    watch: {
        show(val) {     // show为true开始加载图片
            if (val) {
                this.loadImg();
            }
        },
        src() {     // 图片路径变化后重新加载
            if (this.show && this.loadImg());
        }
    },
    beforeDestroy() {       // 组件销毁时解绑懒加载
        this.lazy && this.removeLazyLoad();
    }
}
</script>

<style lang="scss" scoped>
.image {
    position: relative;
    display: inline-block;
    overflow: hidden;
    text-align: center;
    .img, .error, .placeholder {
        width: 100%;
        height: 100%;
    }
    .img {
        vertical-align: top;
    }
    .placeholder, .error {
        background: #f5f7fa;
    }
    .error {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        color: #c0c4cc;
        vertical-align: middle;
    }
}
</style>