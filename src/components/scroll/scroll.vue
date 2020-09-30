<template>
    <div class="index">
        <div class="wrapper" @scroll="handleScroll" ref="list">
            <div class="list" :style="{'paddingTop': paddingTop, 'paddingBottom': paddingBottom}">
                <div class="item" v-for="(item, index) of previewList" :key="index">
                    <img :src="item" alt="">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: 0,
            to: 0,
            paddingBottom: 0,
            paddingTop: 0,
            distance: 100,
            onOff: true,
            lastScrollTop: null,
            list: new Array(100).fill('https://picsum.photos/seed/picsum/140/60')
        }
    },
    computed: {
        previewList() {
            const {list, from, to} = this;
            const arr = [];
            for(let i = from; i < to; i++) {
                arr.push(list[i]);
            };
            return arr;
        }
    },
    mounted() {
        this.$nextTick(()=>{
            this.initScroll();
        })
    },
    methods: {
        initScroll() {
            const {distance} = this;
            const {list} = this.$refs;
            this._contentItem = Math.floor(list.offsetHeight / distance);
            this._belowItem = this._contentItem;
            this._topItem = this._contentItem * 2;
            this._max = this._contentItem * distance;
            this.handleScroll();
        },
        handleScroll() {
            const {_contentItem, _belowItem, _topItem, _max, list, distance, lastScrollTop} = this;
            const {scrollTop} = this.$refs.list;
            const len = list.length;
            if (lastScrollTop === null || Math.abs(scrollTop - lastScrollTop) > _max ) {
                this.lastScrollTop = scrollTop;
            } else {
                if (this.to === len) {
                    this.loadMore()
                }
                return;
            }

            const currentItem = Math.floor(scrollTop / distance);
            let from = currentItem - _topItem;
            if (from < 0) {
                from = 0;
            }
            let to = from + _contentItem + _belowItem + _topItem;
            if (to > len) {
                to = len;
            }
            this.paddingTop = from * distance + 'px';
            this.paddingBottom = (len - to) * distance + 'px';
            this.to = to;
            this.from = from;
            if (to === len) {
                this.loadMore()
            }
        },
        loadMore() {
            if (!this.onOff) return;
            this.onOff = false;
            const {distance, list} = this;
            setTimeout(()=>{
                this.list = list.concat(list);
                this.onOff = true;
                this.to += this._belowItem;
                this.paddingBottom = (this.list.length - this.to) * distance + 'px';
                this.handleScroll();
            }, 1000)
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
    overflow: auto;
    padding: 0 20px;
}
.list {
    width: 100%;
    overflow: hidden;
}
.item {
    width: 100%;
    height: 100px;
    padding: 20px;
    border-bottom: 1px solid red;
    img {
        width: 100%;
        height: 100%;
    }
}
</style>