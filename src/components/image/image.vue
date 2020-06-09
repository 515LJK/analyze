<template>
    <div class="image">
        <slot name="placeholder" v-if="loading">
            <div class="placeholder"></div>
        </slot>
        <slot name="error" v-else-if="error">
            <div class="error">加载失败</div>
        </slot>
        <img :on="$listeners" :bind="$attrs" v-else :src="src" class="img" alt="">
    </div>
</template>

<script>
import {throttle, isInContainer, getScrollContainer, on, off} from 'common/util';
const isSupportObjectFit = () => document.documentElement.style.objectFit !== undefined;
const ObjectFit = {
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
        imageStyle() {
            const {fit} = this;
            if (!this.$isServer && fit) {
                return isSupportObjectFit() ? {'object-fit': fit} : this.getImageStyle(fit); 
            };
            return {};
        }
    },
    mounted() {
        if (this.lazy) {
            this.$nextTick(()=>{
                this.addLazyLoad();
            });
        } else {
            this.loadImg();
        }
    },
    methods: {
        getImageStyle() {
            const {imgWidth, imgHeight} = this;
            const {clientWidth: containerWidth, clientHeight: containerHeight} = this.$el;
            if (!imgWidth || !imgHeight || !containerWidth || !containerHeight) return {};
            const vertical = imageWidth / imgHeight < 1;
            if (fit === ObjectFit.SCALE_DOWN) {
                const smaller = imageWidth < innerWidth && imageHeight < innerHeight;
                fit = smaller ? ObjectFit.NONE : ObjectFit.CONTAIN;
            }

            switch (fit) {
                case ObjectFit.NONE:
                    return {
                        width: 'auto',
                        height: 'auto'
                    };
                case ObjectFit.CONTAIN:
                    return vertical ? {
                        width: 'auto'
                    } : {
                        height: 'auto'
                    };
                case ObjectFit.COVER:
                    return vertical ? {
                        height: 'auto'
                    } : {
                        width: 'auto'
                    };
                default:
                    return {};
            }
        },
        addLazyLoad() {
            if (this.$isServer) return;
            const {scrollContainer} = this;
            let _scrollContainer;
            if (typeof scrollContainer === 'string') {
                _scrollContainer = document.querySelector(scrollContainer);
            } else if (scrollContainer && scrollContainer.nodeType === Node.ELEMENT_NODE) {
                _scrollContainer = scrollContainer;
            } else {
                _scrollContainer = getScrollContainer(this.$el);
            };
            
            if (_scrollContainer) {
                this._scrollContainer = _scrollContainer;
                this._handleLazyLoad = throttle(this.handleLazyLoad, 200)
                on(_scrollContainer, 'scroll', this._handleLazyLoad);
                this._handleLazyLoad();
            }

        },
        removeLazyLoad() {
            const {_scrollContainer, _handleLazyLoad} = this;
            if (this.$isServer || !_scrollContainer || !_handleLazyLoad) return;
            off(_scrollContainer, 'scroll', _handleLazyLoad);
            this._scrollContainer = null;
            this._handleLazyLoad = null;
        },
        handleLazyLoad() {
            console.log(isInContainer(this.$el, this._scrollContainer))
            if (isInContainer(this.$el, this._scrollContainer)) {
                this.show = true;
                this.removeLazyLoad();
            }
        },
        loadImg() {
            if (this.$isServer) return;
            const image = new Image();

            this.loading = true;
            this.error = false;

            image.onload = e => this.handleLoad(e, image);
            image.onerror = this.handleError.bind(this);

            Object.keys(this.$attrs).forEach(attr=>{
                const value = this.$attrs[attr];
                image.setAttribute(attr, value);
            });

            image.src = this.src;
        },
        handleLoad(e, img) {
            this.imgWidth = img.width;
            this.imgHeight = img.height;
            this.loading = false;
        },
        handleError() {
            this.loading = false;
            this.error = true;
            this.$emit('error');
        }
    },
    watch: {
        show(val) {
            if (val) {
                this.loadImg();
            }
        },
        src() {
            if (this.show && this.loadImg());
        }
    },
    beforeDestroy() {
        this.lazy && this.removeLazyLoad();
    }
}
</script>

<style lang="scss" scoped>
.image {
    position: relative;
    display: inline-block;
    overflow: hidden;
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