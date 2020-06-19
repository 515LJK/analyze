import Vue from 'vue/dist/vue.js';
import index from './index.vue';
// import ElementUI from 'element-ui';
import loading from 'v-component/loading/directive';
import image from 'v-component/image/image';

Vue.prototype.$loading = loading;
Vue.component('v-image', image);
Vue.use(loading);

const vm = new Vue({
    render(h) {
        return h(index);
    },
}).$mount();

document.getElementById('app').append(vm.$el);