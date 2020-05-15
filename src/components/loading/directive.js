import Vue from 'vue';
import loading from './loading';
import util from 'common/util';
const Mask = Vue.extend(loading);

export default {
    install: function(Vue){
        if (Vue.prototype.$isServer) return;
        const toggleLoading = (el, binding) => {
            if (binding.value) {
                Vue.nextTick(()=>{
                    if (binding.modifiers.fullscreen) {
                        el.orginalPosition = util.getStyle(el, 'position');
                        el.originalOverflow = util.getStyle(el, 'overflow');
                        insertDom(document.body, el, binding);
                    }
                });
            }
        }

        const insertDom = (parent, el, binding) => {
            if (!el.domVisible && util.getStyle(el, 'display') != 'none' && util.getStyle(el, 'visibility') != 'hidden' ) {
                console.log(1)
            }
        }

        Vue.directive('loading', {
            bind: function(el, binding, vnode) {
                const text = el.getAttribute('loading-text');
                const customClass = el.getAttribute('loading-customClass');
                const background = el.getAttribute('loading-background');
                const vm = vnode.context;
                const mask = new Mask({
                    el: document.createElement('div'),
                    data: {
                        text: vm && vm['loading-text'] || text,
                        customClass: vm && vm['loading-customClass'] || customClass,
                        background: vm && vm['loading-background'] || background,
                        fullscreen: Boolean(binding.modifiers.fullscreen)
                    }
                });
                el.instance = mask;
                el.mask = mask.$el;
                binding.value && toggleLoading(el, binding);
            }
        })

    }
}