// 公共方法
import Vue from 'vue';

const isServer = Vue.prototype.$isServer;
const ieVersion = isServer ? 0 : Number(document.documentMode);

export default {
    addClass: function(el, className) {
        if (!el || isServer || !className) return;
        if (!this.hasClass(el, className)) {
            const classList = el.className.split(" ");
            classList.push(className);
            el.className = classList.join(" ");
        };
    },
    hasClass: function(el, className) {
        if (!el || isServer || !className) return;
        const classList = el.className.split(" ");
        for(let cls of classList) {
            if (cls === className) {
                return true;
            }
        }
        return false;
    },
    removeClass: function(el, className) {
        if (!el || isServer || !className) return;
        if (this.hasClass(el, className)) {
            const classList = el.className.split(" ");
            const newClassList = [];
            for(let cls of classList) {
                if (cls !== className) {
                    newClassList.push(cls);
                }
            }
            el.className = newClassList.join(" ");
        }
    },
    getStyle: function(el, style) {
        if (!el || isServer || !style) return;
        const isIE8 = ieVersion < 9;
        if (style === 'float') {
            style = isIE8 ? 'styleFloat' : 'cssFloat';
        };
        if (style === 'opacity' && isIE8) {
            try {
                return el.filters.item('alpha').opacity / 100;
            } catch (e) {
                return 1.0;
            };
        };

        try {
            if (isIE8) {
                return (el.style[style] || el.currentStyle ? el.currentStyle[style] : null);
            } else {
                return (el.style[style] || getComputedStyle ? getComputedStyle(el, null)[style] : null);
            };
        } catch (e) {
            return el.style[style];
        };
    }
}