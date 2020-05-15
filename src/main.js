import Vue from 'vue/dist/vue.js';
import index from './index.vue';
import ElementUI from 'element-ui';
import loading from './components/loading/directive.js';

Vue.use(loading);
// Vue.use(ElementUI);

const vm = new Vue({
    render(h) {
        return h(index);
    },
}).$mount();

document.getElementById('app').append(vm.$el);