import Vue from 'vue/dist/vue.js';
import index from './index.vue';
// import ElementUI from 'element-ui';
import loading from 'element-ui/packages/loading/index';

Vue.use(loading);
// Vue.use(ElementUI);

const vm = new Vue({
    render(h) {
        return h(index);
    },
}).$mount();

document.getElementById('app').append(vm.$el);