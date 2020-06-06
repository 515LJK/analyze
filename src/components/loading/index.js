import Vue from 'vue';
import loading from './loading.vue';
import {getStyle, addClass, removeClass, afterLeave} from 'common/util';

const Mask = Vue.extend(loading);

const defaults = {
    text: '',
    customClass: '',
    background: '',
    fullscreen: true,
    body: false,
    lock: false
};

let fullscreenLoading;

Mask.prototype.originalPosition = '';
Mask.prototype.originalOverflow = '';


Mask.prototype.close = function() {
    if (this.fullscreen) {
        fullscreenLoading = undefined;
    };
    afterLeave(this, ()=>{
        const target = this.fullscreen || this.body ? document.body : this.target;
        removeClass(target, 'loading-parent--relative');
        if (this.$el && this.$el.parentNode) {
            this.$el.parentNode.removeChild(this.$el);
        }
        this.$destroy();
    }, 300 ,true);
    this.visible = false;
}

const addStyle = (option, parent, instance) => {
    const maskStyle = {};
    if (option.fullscreen) {
        instance.originalPosition = getStyle(document.body, 'position');
        instance.originalOverflow = getStyle(document.body, 'overflow');
    } else if (option.body) {
        instance.originalPosition = getStyle(document.body, 'position');
        ['left', 'top'].forEach(property=>{
            const scroll = property === 'left' ? 'scrollLeft' : 'scrollTop';
            maskStyle[property] = document.body[scroll] + document.documentElement[scroll]
            parent.getBoundingClientRect()[property] + 'px'
        });
        ['width', 'height'].forEach(property=>{
            maskStyle[property] = parent.getBoundingClientRect()[property] + 'px'
        });
    } else {
        instance.originalPosition = getStyle(parent, 'position');
    }
    Object.keys(maskStyle).forEach(style=>{
        instance.$el.style[style] = maskStyle[style];
    })
}

const service = (options) => {
    if (Vue.prototype.$isServer) return;
    const option = Object.assign({}, defaults, options);
    option.target = document.body;
    if (typeof option.target === 'text') {
        option.target = document.querySelector(option.target);
    }
    if (option.target === document.body) {
        option.body = true;
    } else {
        option.fullscreen = false;
    }
    
    if (option.fullscreen && fullscreenLoading) {
        return fullscreenLoading;
    }

    let parent = option.body ? document.body : option.target;
    let instance = new Mask({
        el: document.createElement('div'),
        data: option
    });

    addStyle(option, parent, instance);
    if (instance.originalPosition != 'absolute' && instance.originalPosition != 'fixed') {
        addClass(parent, 'loading-parent--relative');
    }

    if (option.fullscreen && option.lock) {
        addClass(parent, 'loading-parent--lock');
    }
    parent.appendChild(instance.$el);
    Vue.nextTick(()=>{
        instance.visible = true;
    });
    if (option.fullscreen) {
        fullscreenLoading = instance;
    }
    return instance;
}


export default service;