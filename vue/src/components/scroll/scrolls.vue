<template>
    <div class="scrolls">
        <div class="wrapper">
            <DynamicScroller
                class="scroller"
                :items="list"
                :min-item-size="100"
                key-field="id"
                v-slot="{ item }"
            >
                <div class="item">
                    {{ item.id }}
                </div>
            </DynamicScroller>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            list: new Array(100).fill(1).map((value, index) => {
                return {
                    id: index
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import url('~vue-virtual-scroller/dist/vue-virtual-scroller.css');

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