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
    },
    created() {
        const arr = [1,3,2,6,4,88,67,9,0];
        console.log(this.shuffle(arr));
    },
    methods: {
        shuffle(arr) {
            let i = arr.length;
            while(i > 0) {
                const random = Math.floor(Math.random() * i--);
                [arr[i], arr[random]] = [arr[random], arr[i]];
            }
            return arr;
        },
        obj() {
            const _Class = (function() {
                function constructor(name) {
                    this.name = name;
                }

                constructor.prototype.show = function() {
                    console.log(this.name)
                }
                return constructor;
            })();

            const _extends = (function(parent = null) {
                if (parent) {
                    constructor.prototype = Object.create(parent.prototype, {
                        constructor: {
                            value: constructor,
                            configurable: true,
                            emumerable: false,
                            writable: true
                        }
                    });
                    constructor.__proto__ = constructor;
                }
                function constructor(name) {
                    this.name = name;
                }

                constructor.prototype.show = function() {
                    console.log(this.name)
                }
                return constructor;
            })();
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