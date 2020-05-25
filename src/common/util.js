// 公共方法
import Vue from 'vue';

const isServer = Vue.prototype.$isServer;
const ieVersion = isServer ? 0 : Number(document.documentMode);
const camelCase_regexp = /([\:\-\_])+(.)/g;

const camelCase = function(string) {
    return string.replace(camelCase_regexp, function(name, $1, $2, index) {
        return index ? $2.toUpperCase() : $2
    });
}

export function addClass(el, className) {
    if (!el || isServer || !className) return;
    if (!hasClass(el, className)) {
        if (!el.className) {
            el.className = className;
        } else {
            const classList = el.className.split(" ");
            classList.push(className);
            el.className = classList.join(" ");
        }
    };
};

export function hasClass(el, className) {
    if (!el || isServer || !className) return;
    const classList = el.className.split(" ");
    for(let cls of classList) {
        if (cls === className) {
            return true;
        }
    }
    return false;
}

export function removeClass(el, className) {
    if (!el || isServer || !className) return;
    if (hasClass(el, className)) {
        const classList = el.className.split(" ");
        const newClassList = [];
        for(let cls of classList) {
            if (cls !== className) {
                newClassList.push(cls);
            }
        }
        el.className = newClassList.join(" ");
    }
}
export function getStyle(el, style) {
    if (!el || isServer || !style) return;
    const isIE8 = ieVersion < 9;
    style = camelCase(style);
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

export function afterLeave(instance, callback, speed = 300, once = false) {
    if (!instance || !callback) return;
    let onOff = false;
    function after() {
        if (onOff) return;
        onOff = true;
        callback && callback.apply(null, arguments);
    };

    if (once) {
        instance.$once('after-leave', after);
    } else {
        instance.$once('after-leave', after);
    };

    setTimeout(()=>{
        after();
    }, speed + 100);
}