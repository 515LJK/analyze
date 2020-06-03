import Vue from 'vue';
import loading from './loading';
import {getStyle, addClass, afterLeave, removeClass} from 'common/util';
const Mask = Vue.extend(loading);       // 创建loading子类

export default {
    install: function(Vue){
        if (Vue.prototype.$isServer) return;
        const toggleLoading = (el, binding) => {
            if (binding.value) {    // 指令值为true，分为三种情况,对应指令不同参数，insertDom函数负责loading组件的添加
                Vue.nextTick(()=>{
                    // 三种情况都要先读取父级元素的position样式属性
                    if (binding.modifiers.fullscreen) {     // 全屏显示loading，父级为body
                        el.orginalPosition = getStyle(document.body, 'position');
                        el.originalOverflow = getStyle(document.body, 'overflow');
                        insertDom(document.body, el, binding);
                    } else {
                        if (binding.modifiers.body) {       // 在body添加loading，父级为body
                            el.orginalPosition = getStyle(document.body, 'position');
                            // 因为在body添加，所以要读取调用函数的宽高和相对定位给loading组件赋值
                            ['left', 'top'].forEach(property=>{
                                // 滚动距离和边距都要加入计算中
                                const scroll = property === 'top' ? 'scrollTop' : 'scrollLeft';
                                el.maskStyle[property] = el.getBoundingClientRect()[property] + document.body[scroll] + document.documentElement[scroll] - parseInt(getStyle(document.body, `margin-${ property }`), 10) + 'px';
                            });
                            ['width', 'height'].forEach(property=>{
                                el.maskStyle[property] = el.getBoundingClientRect()[property] + 'px';
                            });
                            insertDom(document.body, el, binding);
                        } else {            // 正常在调用元素下添加loading，父级为调用函数
                            el.orginalPosition = getStyle(el, 'position');
                            insertDom(el, el, binding);
                        }
                    }
                });
            } else {        // 指令值为false
                // afterLeave函数内部内置一个定时器，以及绑定实例内的afterLeave函数，在动画结束时调用回调函数
                afterLeave(el.instance, ()=>{   // 这个回调函数主要是在动画结束后去除父级元素上的定位class
                    if (!el.instance.hiding) return;
                    const target = binding.modifiers.fullscreen || binding.modifiers.body ? document.body : el;
                    removeClass(target, 'loading-parent--relative');
                    removeClass(target, 'loading-parent--lock');
                    el.domVisible = false;
                    el.instance.hiding = false;
                }, 300, true);
                el.instance.visible = false;        // 隐藏loading
                el.instance.hiding = true;
            }
        }

        const insertDom = (parent, el, binding) => {
            // 先判断调用元素是否被隐藏，domVisible属性是代表loading组件是否显示
            if (!el.domVisible && getStyle(el, 'display') != 'none' && getStyle(el, 'visibility') != 'hidden' ) {
                Object.keys(el.maskStyle).forEach(key=>{        // 设置样式
                    el.mask.style[key] = el.maskStyle[key];
                });
                if (el.orginalPosition !== 'absolute' && el.orginalPosition !== 'fixed') {      // 添加定位class
                    addClass(parent, 'loading-parent--relative');
                }

                if (binding.modifiers.fullscreen && binding.modifiers.lock) {       // 固定body滑动
                    addClass(parent, 'loading-parent--lock');
                }
                el.domVisible = true;
                parent.appendChild(el.mask);    // 添加loading组件
                Vue.nextTick(()=>{
                    if (el.instance.hiding) {
                        el.instance.$emit('afterLeave');
                    } else {
                        el.instance.visible = true;
                    }
                });
                el.domInserted = true;
            } else if (el.domVisible && el.instance.hiding) {   // 调用元素是隐藏状态以及loading已添加，loading显示
                el.instance.visible = true;
                el.instance.hiding = false;
            }
        }

        Vue.directive('loading', {
            bind: function(el, binding, vnode) {
                // 获取loading参数，首先选择当前vue对象中data属性，如果为空，再取调用元素上的属性，
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
                // 在调用元素对象上挂载公共属性，方便在不同方法中读取。
                el.maskStyle = {};
                el.instance = mask;
                el.mask = mask.$el;
                binding.value && toggleLoading(el, binding);    // toggleLoading方法负责loading组件的切换显示
            },
            update: function(el, binding) {     // 指令更新
                el.instance.text = el.getAttribute('loading-text');
                if (binding.oldValue != binding.value ) {
                    toggleLoading(el, binding);
                }
            },
            unbind: function(el, binding) {     // 指令与元素解绑时组件销毁
                if (el.domInserted) {
                    el.mask && el.parent && el.parent.removeChild(el.mask);
                    toggleLoading(el, { value: false, modifiers: binding.modifiers })
                };
                el.instance && el.instance.$destroy();
            }
        })
    }
}