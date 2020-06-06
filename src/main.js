import Vue from 'vue/dist/vue.js';
import index from './index.vue';
// import ElementUI from 'element-ui';
import loading from 'v-component/loading/index';
import image from 'v-component/image/image';

Vue.prototype.$loading = loading;
Vue.component('v-image', image);

const vm = new Vue({
    render(h) {
        return h(index);
    },
}).$mount();

document.getElementById('app').append(vm.$el);