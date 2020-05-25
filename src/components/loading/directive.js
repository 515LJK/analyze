import Vue from 'vue';
import loading from './loading';
import {getStyle, addClass, afterLeave, removeClass} from 'common/util';
const Mask = Vue.extend(loading);

export default {
    install: function(Vue){
        if (Vue.prototype.$isServer) return;
        const toggleLoading = (el, binding) => {
            if (binding.value) {
                Vue.nextTick(()=>{
                    if (binding.modifiers.fullscreen) {
                        el.orginalPosition = getStyle(el, 'position');
                        el.originalOverflow = getStyle(el, 'overflow');
                        insertDom(document.body, el, binding);
                    } else {
                        if (binding.modifiers.body) {
                            el.orginalPosition = getStyle(el, 'position');
                            ['left', 'top'].forEach(property=>{
                                const scroll = property === 'top' ? 'scrollTop' : 'scrollLeft';
                                el.maskStyle[property] = el.getBoundingClientRect()[property] + document.body[scroll] + document.documentElement[scroll] - parseInt(getStyle(document.body, `margin-${ property }`), 10) + 'px';
                            });
                            ['width', 'height'].forEach(property=>{
                                el.maskStyle[property] = el.getBoundingClientRect()[property] + 'px';
                            });
                            insertDom(document.body, el, binding);
                        } else {
                            el.orginalPosition = getStyle(el, 'position');
                            insertDom(el, el, binding);
                        }
                    }
                });
            } else {
                afterLeave(el.instance, ()=>{
                    if (!el.instance.hiding) return;
                    const target = binding.modifiers.fullscreen || binding.modifiers.body ? document.body : el;
                    removeClass(target, 'loading-parent--relative');
                    removeClass(target, 'loading-parent--lock')
                    el.domVisible = false;
                    el.instance.hiding = false;
                }, 300, true);
                el.instance.visible = false;
                el.instance.hiding = true;
            }
        }

        const insertDom = (parent, el, binding) => {
            if (!el.domVisible && getStyle(el, 'display') != 'none' && getStyle(el, 'visibility') != 'hidden' ) {
                Object.keys(el.maskStyle).forEach(key=>{
                    el.mask.style[key] = el.maskStyle[key];
                });
                if (el.orginalPosition !== 'absolute' && el.orginalPosition !== 'fixed') {
                    addClass(parent, 'loading-parent--relative');
                }

                if (binding.modifiers.fullscreen && binding.modifiers.lock) {
                    addClass(parent, 'loading-parent--lock');
                }
                el.domVisible = true;
                parent.appendChild(el.mask);
                Vue.nextTick(()=>{
                    if (el.instance.hiding) {
                        el.instance.$emit('afterLeave');
                    } else {
                        el.instance.visible = true;
                    }
                });
                el.domInserted = true;
            } else if (el.domVisible && el.instance.hiding) {
                el.instance.visible = true;
                el.instance.hiding = false;
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
                el.maskStyle = {};
                el.instance = mask;
                el.mask = mask.$el;
                binding.value && toggleLoading(el, binding);
            },
            update: function(el, binding) {
                el.instance.text = el.getAttribute('loading-text');
                if (binding.oldValue != binding.value ) {
                    toggleLoading(el, binding);
                }
            },
            unbind: function(el, binding) {
                if (el.domInserted) {
                    el.mask && el.parent && el.parent.removeChild(el.mask);
                    toggleLoading(el, { value: false, modifiers: binding.modifiers })
                };
                el.instance && el.instance.$destory();
            }
        })
    }
}